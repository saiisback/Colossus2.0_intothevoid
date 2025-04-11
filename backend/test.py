from flask import Flask, request, jsonify
from flask_cors import CORS
import ee
import pandas as pd
import matplotlib.pyplot as plt
import datetime
import base64
import io

# Initialize Earth Engine
try:
    ee.Initialize(project='smooth-kiln-449317-f7')
except Exception as e:
    ee.Authenticate()
    ee.Initialize(project='smooth-kiln-449317-f7')

app = Flask(__name__)
CORS(app)  # Allow CORS for frontend

# Vegetation processing functions
def get_sentinel_imagery(start_date, end_date, aoi):
    s2 = ee.ImageCollection("COPERNICUS/S2_SR") \
        .filterDate(start_date, end_date) \
        .filterBounds(aoi) \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

    def add_indices(image):
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        evi = image.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
            {
                'NIR': image.select('B8'),
                'RED': image.select('B4'),
                'BLUE': image.select('B2')
            }).rename('EVI')
        savi = image.expression(
            '((NIR - RED) / (NIR + RED + 0.5)) * (1.5)',
            {
                'NIR': image.select('B8'),
                'RED': image.select('B4')
            }).rename('SAVI')
        return image.addBands([ndvi, evi, savi])

    return s2.map(add_indices)

def analyze_time_series(site, start_date, end_date):
    imagery = get_sentinel_imagery(start_date, end_date, site)

    def extract_index_value(image):
        ndvi = image.select('NDVI').reduceRegion(ee.Reducer.mean(), site, 10).get('NDVI')
        evi = image.select('EVI').reduceRegion(ee.Reducer.mean(), site, 10).get('EVI')
        savi = image.select('SAVI').reduceRegion(ee.Reducer.mean(), site, 10).get('SAVI')
        return ee.Feature(None, {
            'date': image.date().format('YYYY-MM-dd'),
            'NDVI': ndvi,
            'EVI': evi,
            'SAVI': savi
        })

    series = imagery.map(extract_index_value)
    result = series.reduceColumns(ee.Reducer.toList(4), ['date', 'NDVI', 'EVI', 'SAVI']).get('list').getInfo()
    df = pd.DataFrame(result, columns=['date', 'NDVI', 'EVI', 'SAVI'])
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    return df

def verify_carbon_credits(site, start_date, end_date):
    df = analyze_time_series(site, start_date, end_date)
    ndvi_start = df.iloc[0]['NDVI']
    ndvi_end = df.iloc[-1]['NDVI']
    ndvi_change = ndvi_end - ndvi_start

    area_m2 = site.area().getInfo()
    area_ha = area_m2 / 10000

    years_diff = (datetime.datetime.strptime(end_date, '%Y-%m-%d') - 
                  datetime.datetime.strptime(start_date, '%Y-%m-%d')).days / 365.25

    if ndvi_change > 0.2 and ndvi_start < 0.3:
        verified = True
        carbon_rate = 8
    elif ndvi_change > 0.1:
        verified = True
        carbon_rate = 5
    else:
        verified = False
        carbon_rate = 0

    credits = area_ha * carbon_rate * years_diff

    return {
        'verified': verified,
        'ndvi_start': float(ndvi_start),
        'ndvi_end': float(ndvi_end),
        'ndvi_change': float(ndvi_change),
        'carbon_credits': round(credits),
        'area_ha': area_ha,
        'data': df.to_dict('records'),
        'reason': None if verified else "Insufficient vegetation growth or already forested"
    }

def generate_plots(df):
    fig, axs = plt.subplots(2, 1, figsize=(12, 8))
    df['date'] = pd.to_datetime(df['date'])

    axs[0].plot(df['date'], df['NDVI'], 'g-', marker='o', linewidth=2)
    axs[0].set_title('NDVI Over Time')
    axs[0].set_ylabel('NDVI')
    axs[0].grid(True)

    axs[1].plot(df['date'], df['EVI'], 'b-', marker='o', linewidth=2)
    axs[1].set_title('EVI Over Time')
    axs[1].set_ylabel('EVI')
    axs[1].set_xlabel('Date')
    axs[1].grid(True)

    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    return encoded

@app.route('/verify_and_visualize', methods=['POST'])
def verify_and_visualize():
    data = request.json
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    coordinates = data.get('coordinates')

    if not all([start_date, end_date, coordinates]):
        return jsonify({'error': 'Missing input parameters'}), 400

    try:
        site = ee.Geometry.Polygon(coordinates)
        results = verify_carbon_credits(site, start_date, end_date)
        plot_image = generate_plots(pd.DataFrame(results['data']))
        results['plot_image_base64'] = plot_image
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# For Jupyter: avoid blocking kernel
# If running outside Jupyter, you can use: app.run()
from werkzeug.serving import run_simple
run_simple('0.0.0.0', 6969, app)