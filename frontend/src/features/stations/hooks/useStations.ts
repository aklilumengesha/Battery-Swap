"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux";
import { stationsActions } from "../store/stationsActions";
import {
  selectStationList,
  selectLoadingList,
  selectStation,
  selectLoadingStation,
  selectBookingStation,
  selectBookings,
  selectLoadingBookings,
  selectBooking,
  selectLoadingBooking,
  selectAvailableStations,
  selectNearestStation,
  selectCompletedBookings,
  selectPendingBookings,
} from "../store/stationsSelectors";

/**
 * useStations Hook
 * Custom hook for accessing stations state and actions
 * 
 * @example
 * const { stationList, listStations, bookBattery, loadingList } = useStations();
 */
export const useStations = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors - Basic State
  const stationList = useSelector(selectStationList);
  const loadingList = useSelector(selectLoadingList);
  const station = useSelector(selectStation);
  const loadingStation = useSelector(selectLoadingStation);
  const bookingStation = useSelector(selectBookingStation);
  const bookings = useSelector(selectBookings);
  const loadingBookings = useSelector(selectLoadingBookings);
  const booking = useSelector(selectBooking);
  const loadingBooking = useSelector(selectLoadingBooking);

  // Selectors - Computed State
  const availableStations = useSelector(selectAvailableStations);
  const nearestStation = useSelector(selectNearestStation);
  const completedBookings = useSelector(selectCompletedBookings);
  const pendingBookings = useSelector(selectPendingBookings);

  // Actions
  const listStations = (latitude: number, longitude: number) =>
    dispatch(stationsActions.handleListStations(latitude, longitude) as any);

  const getStation = (id: string | number, latitude: number, longitude: number) =>
    dispatch(stationsActions.handleGetStation(id, latitude, longitude) as any);

  const bookBattery = (data: { station?: string | number; battery?: string | number }) =>
    dispatch(stationsActions.handleBookBattery(data) as any);

  const listBookings = () =>
    dispatch(stationsActions.handleListBookings() as any);

  const getBooking = (id: string | number, latitude: number, longitude: number) =>
    dispatch(stationsActions.handleGetBooking(id, latitude, longitude) as any);

  return {
    // Basic State
    stationList,
    loadingList,
    station,
    loadingStation,
    bookingStation,
    bookings,
    loadingBookings,
    booking,
    loadingBooking,
    
    // Computed State
    availableStations,
    nearestStation,
    completedBookings,
    pendingBookings,
    
    // Actions
    listStations,
    getStation,
    bookBattery,
    listBookings,
    getBooking,
  };
};
