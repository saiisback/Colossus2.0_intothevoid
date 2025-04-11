// src/types.ts
export interface VerificationResults {
    verified: boolean;
    ndvi_start: number;
    ndvi_end: number;
    ndvi_change: number;
    carbon_credits: number;
    area_ha: number;
    time_series_data: Array<{
      date: string;
      NDVI: number;
      EVI: number;
      SAVI: number;
    }>;
    reason: string | null;
  }
  
  export interface ApiResponse {
    verification_results: VerificationResults;
    time_series_plot: string; // Base64-encoded image
    rgb_map: string; // Base64-encoded image
    ndvi_map: string; // Base64-encoded image;
  }
  
  export interface FormData {
    start_date: string;
    end_date: string;
    coordinates: number[][]; // Array of [lon, lat] pairs
  }