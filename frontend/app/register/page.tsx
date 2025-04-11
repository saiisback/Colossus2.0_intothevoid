// app/page.tsx (or wherever your App component lives)
"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse, FormData } from '@/lib/types';
import Navbar from '@/components/navbar';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    start_date: '2020-01-01',
    end_date: '2023-12-31',
    coordinates: [
      [-54.95, -2.45],
      [-54.90, -2.45],
      [-54.90, -2.40],
      [-54.95, -2.40],
      [-54.95, -2.45]
    ],
  });
  const [coordinatesInput, setCoordinatesInput] = useState<string>(
    JSON.stringify(formData.coordinates, null, 2)
  );
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setLoading(true);

    try {
      const parsedCoordinates = JSON.parse(coordinatesInput);
      if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length < 4) {
        throw new Error('Coordinates must be an array of at least 4 [lon, lat] pairs');
      }
      const coords = [...parsedCoordinates];
      if (
        coords[0][0] !== coords[coords.length - 1][0] ||
        coords[0][1] !== coords[coords.length - 1][1]
      ) {
        coords.push(coords[0]);
      }

      const payload: FormData = {
        ...formData,
        coordinates: coords,
      };

      const response = await axios.post<ApiResponse>(
        'http://192.168.166.174:6969/verify_and_visualize',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setResults(response.data);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoordinatesInput(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setFormData({ ...formData, coordinates: parsed });
      setError(null);
    } catch {
      setError('Invalid JSON format for coordinates');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Carbon Credit Verification
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <div className="mb-4">
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date (YYYY-MM-DD)
            </label>
            <input
              type="text"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2020-01-01"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date (YYYY-MM-DD)
            </label>
            <input
              type="text"
              id="end_date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2023-12-31"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="coordinates"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Coordinates (JSON array of [lon, lat] pairs)
            </label>
            <textarea
              id="coordinates"
              rows={6}
              value={coordinatesInput}
              onChange={handleCoordinatesChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder='e.g., [[-54.95, -2.45], [-54.90, -2.45], ...]'
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Processing...' : 'Verify and Visualize'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <h2 className="text-lg font-semibold text-red-700">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Verification Results
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <p>
                <strong className="text-gray-700">Verified:</strong>{' '}
                <span
                  className={
                    results.verification_results.verified
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {results.verification_results.verified ? 'Yes' : 'No'}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">Carbon Credits:</strong>{' '}
                {results.verification_results.carbon_credits} tCO2e
              </p>
              <p>
                <strong className="text-gray-700">NDVI Change:</strong>{' '}
                {results.verification_results.ndvi_change.toFixed(4)}
              </p>
              <p>
                <strong className="text-gray-700">Project Area:</strong>{' '}
                {results.verification_results.area_ha.toFixed(2)} hectares
              </p>
            </div>
            {results.verification_results.reason && (
              <p className="text-gray-600 mb-6">
                <strong className="text-gray-700">Reason:</strong>{' '}
                {results.verification_results.reason}
              </p>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Visualizations
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Time Series Plot
                </h3>
                <img
                  src={results.time_series_plot}
                  alt="Time Series Plot"
                  className="w-full rounded-md shadow-sm"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  RGB Composite Map
                </h3>
                <img
                  src={results.rgb_map}
                  alt="RGB Composite Map"
                  className="w-full rounded-md shadow-sm"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  NDVI Map
                </h3>
                <img
                  src={results.ndvi_map}
                  alt="NDVI Map"
                  className="w-full rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;