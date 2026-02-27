import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../redux";

/**
 * Base selector for stations state
 */
export const selectStationsState = (state: RootState) => state.stations;

/**
 * Select station list
 */
export const selectStationList = createSelector(
  [selectStationsState],
  (stations) => stations.stationList
);

/**
 * Select loading list state
 */
export const selectLoadingList = createSelector(
  [selectStationsState],
  (stations) => stations.loadingList
);

/**
 * Select current station
 */
export const selectStation = createSelector(
  [selectStationsState],
  (stations) => stations.station
);

/**
 * Select loading station state
 */
export const selectLoadingStation = createSelector(
  [selectStationsState],
  (stations) => stations.loadingStation
);

/**
 * Select booking station state
 */
export const selectBookingStation = createSelector(
  [selectStationsState],
  (stations) => stations.bookingStation
);

/**
 * Select bookings list
 */
export const selectBookings = createSelector(
  [selectStationsState],
  (stations) => stations.bookings
);

/**
 * Select loading bookings state
 */
export const selectLoadingBookings = createSelector(
  [selectStationsState],
  (stations) => stations.loadingBookings
);

/**
 * Select current booking
 */
export const selectBooking = createSelector(
  [selectStationsState],
  (stations) => stations.booking
);

/**
 * Select loading booking state
 */
export const selectLoadingBooking = createSelector(
  [selectStationsState],
  (stations) => stations.loadingBooking
);

/**
 * Select stations with available batteries
 */
export const selectAvailableStations = createSelector(
  [selectStationList],
  (stations) => stations.filter((station) => (station.available_batteries || 0) > 0)
);

/**
 * Select nearest station
 */
export const selectNearestStation = createSelector(
  [selectStationList],
  (stations) => {
    if (stations.length === 0) return null;
    return stations.reduce((nearest, current) => {
      const nearestDistance = nearest.distance || Infinity;
      const currentDistance = current.distance || Infinity;
      return currentDistance < nearestDistance ? current : nearest;
    });
  }
);

/**
 * Select completed bookings
 */
export const selectCompletedBookings = createSelector(
  [selectBookings],
  (bookings) => bookings.filter((booking) => booking.status === "completed")
);

/**
 * Select pending bookings
 */
export const selectPendingBookings = createSelector(
  [selectBookings],
  (bookings) => bookings.filter((booking) => booking.status === "pending")
);
