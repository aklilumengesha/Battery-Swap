/**
 * Stations Feature Module
 * React Query implementation for stations and bookings
 */

// React Query Hooks (Active)
export {
  useStationsQuery,
  useNearbyStations,
  useStation,
  useBookings,
  useBooking,
} from "./hooks/useStationsQuery";

// Redux code preserved for reference but not exported
// See ../REDUX_LEGACY_NOTE.md for details
// Uncomment below to rollback to Redux:
// export * from "./store";
// export { useStations } from "./hooks/useStations";
