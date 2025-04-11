from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for matplotlib
import matplotlib.pyplot as plt
import ee
import geemap
from io import BytesIO
import base64
import requests
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Earth Engine
try:
    ee.Initialize(project='smooth-kiln-449317-f7')
except Exception as e:
    logging.error(f"Earth Engine initialization failed: {str(e)}")
    ee.Authenticate()
    ee.Initialize(project='smooth-kiln-449317-f7')

# Existing functions (unchanged)
def get_sentinel_imagery(start_date, end_date, aoi):
    logging.debug(f"Fetching Sentinel-2 data for {start_date} to {end_date}")
    s2_collection = ee.ImageCollection("COPERNICUS/S2_SR") \
        .filterDate(start_date, end_date) \
        .filterBounds(aoi) \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

    def add_indices(image):
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        evi = image.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
            {'NIR': image.select('B8'), 'RED': image.select('B4'), 'BLUE': image.select('B2')}
        ).rename('EVI')
        savi = image.expression(
            '((NIR - RED) / (NIR + RED + 0.5)) * (1.5)',
            {'NIR': image.select('B8'), 'RED': image.select('B4')}
        ).rename('SAVI')
        return image.addBands([ndvi, evi, savi])

    return s2_collection.map(add_indices)

def analyze_time_series(site, start_date, end_date):
    imagery = get_sentinel_imagery(start_date, end_date, site)

    def extract_index_value(image):
        ndvi_mean = image.select('NDVI').reduceRegion(reducer=ee.Reducer.mean(), geometry=site, scale=10).get('NDVI')
        evi_mean = image.select('EVI').reduceRegion(reducer=ee.Reducer.mean(), geometry=site, scale=10).get('EVI')
        savi_mean = image.select('SAVI').reduceRegion(reducer=ee.Reducer.mean(), geometry=site, scale=10).get('SAVI')
        return ee.Feature(None, {
            'date': image.date().format('YYYY-MM-dd'),
            'NDVI': ndvi_mean,
            'EVI': evi_mean,
            'SAVI': savi_mean
        })

    time_series = imagery.map(extract_index_value)
    time_series_list = time_series.reduceColumns(ee.Reducer.toList(4), ['date', 'NDVI', 'EVI', 'SAVI']).get('list').getInfo()
    df = pd.DataFrame(time_series_list, columns=['date', 'NDVI', 'EVI', 'SAVI'])
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    return df

def verify_carbon_credits(project_site, start_date, end_date):
    try:
        time_series_df = analyze_time_series(project_site, start_date, end_date)
        ndvi_start = time_series_df.iloc[0]['NDVI']
        ndvi_end = time_series_df.iloc[-1]['NDVI']
        ndvi_change = ndvi_end - ndvi_start

        area_m2 = project_site.area().getInfo()
        area_ha = area_m2 / 10000

        start_date_dt = datetime.datetime.strptime(start_date, '%Y-%m-%d')
        end_date_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d')
        years_diff = (end_date_dt - start_date_dt).days / 365.25

        if ndvi_change > 0.2 and ndvi_start < 0.3:
            verified = True
            carbon_rate = 8
        elif ndvi_change > 0.1:
            verified = True
            carbon_rate = 5
        else:
            verified = False
            carbon_rate = 0

        carbon_credits = area_ha * carbon_rate * years_diff

        return {
            'verified': verified,
            'ndvi_start': float(ndvi_start),
            'ndvi_end': float(ndvi_end),
            'ndvi_change': float(ndvi_change),
            'carbon_credits': round(carbon_credits),
            'area_ha': area_ha,
            'time_series_data': time_series_df.to_dict('records'),
            'reason': None if verified else "Insufficient vegetation growth or area was already forested."
        }
    except Exception as e:
        logging.error(f"Error in verify_carbon_credits: {str(e)}")
        raise

def get_time_series_plot(results):
    try:
        time_series_df = pd.DataFrame(results['time_series_data'])
        if isinstance(time_series_df['date'][0], str):
            time_series_df['date'] = pd.to_datetime(time_series_df['date'])

        plt.figure(figsize=(14, 8))
        plt.subplot(2, 1, 1)
        plt.plot(time_series_df['date'], time_series_df['NDVI'], 'g-', marker='o', linewidth=2)
        plt.title('NDVI Time Series')
        plt.ylabel('NDVI')
        plt.grid(True, linestyle='--', alpha=0.7)

        plt.subplot(2, 1, 2)
        plt.plot(time_series_df['date'], time_series_df['EVI'], 'b-', marker='o', linewidth=2)
        plt.title('EVI Time Series')
        plt.xlabel('Date')
        plt.ylabel('EVI')
        plt.grid(True, linestyle='--', alpha=0.7)

        plt.tight_layout()
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()
        plt.close()
        return img_str
    except Exception as e:
        logging.error(f"Error in get_time_series_plot: {str(e)}")
        raise

def get_map_images(project_site, start_date, end_date):
    try:
        s2_collection = ee.ImageCollection("COPERNICUS/S2_SR") \
            .filterDate(start_date, end_date) \
            .filterBounds(project_site) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

        # RGB Composite
        rgb_image = s2_collection.median().clip(project_site).select(['B4', 'B3', 'B2'])
        rgb_params = {
            'min': 0,
            'max': 3000,
            'dimensions': 512,
            'region': project_site
        }
        rgb_url = rgb_image.getThumbURL(rgb_params)
        rgb_response = requests.get(rgb_url)
        rgb_response.raise_for_status()
        rgb_img = BytesIO(rgb_response.content)
        rgb_str = base64.b64encode(rgb_img.getvalue()).decode('utf-8')

        # NDVI Image
        recent_image = s2_collection.sort('system:time_start', False).first()
        ndvi = recent_image.normalizedDifference(['B8', 'B4']).clip(project_site)
        ndvi_palette = [
            'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
            '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
            '012E01', '011D01', '011301'
        ]
        ndvi_params = {
            'min': 0,
            'max': 1,
            'palette': ndvi_palette,
            'dimensions': 512,
            'region': project_site
        }
        ndvi_url = ndvi.getThumbURL(ndvi_params)
        ndvi_response = requests.get(ndvi_url)
        ndvi_response.raise_for_status()
        ndvi_img = BytesIO(ndvi_response.content)
        ndvi_str = base64.b64encode(ndvi_img.getvalue()).decode('utf-8')

        return rgb_str, ndvi_str
    except Exception as e:
        logging.error(f"Error in get_map_images: {str(e)}")
        raise

# Flask route for POST request
@app.route('/verify_and_visualize', methods=['POST'])
def verify_and_visualize():
    try:
        logging.debug("Received POST request to /verify_and_visualize")
        # Extract JSON data from POST request
        data = request.get_json()
        logging.debug(f"Request data: {data}")
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        coordinates = data.get('coordinates')  # List of [lon, lat] pairs

        if not all([start_date, end_date, coordinates]):
            return jsonify({'error': 'Missing required parameters: start_date, end_date, coordinates'}), 400

        # Validate and create project site geometry
        if not isinstance(coordinates, list) or len(coordinates) < 4:
            return jsonify({'error': 'Coordinates must be a list of at least 4 [lon, lat] pairs'}), 400

        # Ensure polygon is closed
        if coordinates[0] != coordinates[-1]:
            coordinates.append(coordinates[0])

        project_site = ee.Geometry.Polygon(coordinates)

        # Verify carbon credits
        results = verify_carbon_credits(project_site, start_date, end_date)

        # Generate visualizations
        plot_image = get_time_series_plot(results)
        rgb_image, ndvi_image = get_map_images(project_site, start_date, end_date)

        # Prepare response
        response = {
            'verification_results': results,
            'time_series_plot': f'data:image/png;base64,{plot_image}',
            'rgb_map': f'data:image/png;base64,{rgb_image}',
            'ndvi_map': f'data:image/png;base64,{ndvi_image}'
        }

        return jsonify(response), 200

    except ee.EEException as e:
        logging.error(f"Earth Engine error: {str(e)}")
        return jsonify({'error': f"Earth Engine error: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"Server error: {str(e)}")
        return jsonify({'error': f"Server error: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6969)