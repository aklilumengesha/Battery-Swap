import { get } from "../common/base";

export const findNearbyStations = (userId, data) => get(`power/stations/find/${userId}/`, data);
export const getStation = (id, data) => get(`power/station/get/${id}/`, data);
