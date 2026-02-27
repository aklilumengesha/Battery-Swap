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
 * Find nearby stations for a user
 * @param userId - User ID
 * @param params - Location parameters (latitude, longitude)
 */
export const findNearbyStations = (userId: string | number, params: StationParams) => 
  get(`power/stations/find/${userId}/`, params);

/**
 * Get station details by ID
 * @param id - Station ID
 * @param params - Location parameters (latitude, longitude)
 */
export const getStation = (id: string | number, params: StationParams) => 
  get(`power/station/get/${id}/`, params);
