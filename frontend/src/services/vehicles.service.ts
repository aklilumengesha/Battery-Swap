import { get } from "./api";

/**
 * Vehicle Service
 * Handles all vehicle-related API calls
 */

/**
 * List all available vehicles
 */
export const listVehicles = () => 
  get(`power/vehicles/list/`);
