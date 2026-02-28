import { get } from "./api";

/**
 * Station Service
 * Handles all station-related API calls
 */

interface StationParams {
  latitude: number;
  longitude: number;
}

/**
 * Find nearby stations for authenticated user
 * @param params - Location parameters (latitude, longitude)
 */
export const findNearbyStations = (params: StationParams) => 
  get(`power/stations/find/`, params);

/**
 * Get station details by ID
 * @param id - Station ID
 * @param params - Location parameters (latitude, longitude)
 */
export const getStation = (id: string | number, params: StationParams) => 
  get(`power/station/get/${id}/`, params);
