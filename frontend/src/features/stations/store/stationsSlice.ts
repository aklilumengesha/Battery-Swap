import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Station Interface
 */
export interface Station {
  pk?: string | number;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  available_batteries?: number;
  [key: string]: any;
}

/**
 * Booking/Order Interface
 */
export interface Booking {
  pk?: string | number;
  station?: Station;
  battery?: any;
  status?: string;
  created_at?: string;
  [key: string]: any;
}

/**
 * Stations State Interface
 */
export interface StationsState {
  stationList: Station[];
  loadingList: boolean;
  station: Station | null;
  loadingStation: boolean;
  bookingStation: boolean;
  bookings: Booking[];
  loadingBookings: boolean;
  booking: Booking | null;
  loadingBooking: boolean;
}

/**
 * Initial Stations State
 */
const initialState: StationsState = {
  stationList: [],
  loadingList: true,
  station: null,
  loadingStation: true,
  bookingStation: false,
  bookings: [],
  loadingBookings: true,
  booking: null,
  loadingBooking: true,
};

/**
 * Stations Slice
 * Manages stations, bookings, and orders state using Redux Toolkit
 */
const stationsSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    setStationList: (state, action: PayloadAction<Station[]>) => {
      state.stationList = action.payload;
    },
    setLoadingList: (state, action: PayloadAction<boolean>) => {
      state.loadingList = action.payload;
    },
    setStation: (state, action: PayloadAction<Station | null>) => {
      state.station = action.payload;
    },
    setLoadingStation: (state, action: PayloadAction<boolean>) => {
      state.loadingStation = action.payload;
    },
    setBookingStation: (state, action: PayloadAction<boolean>) => {
      state.bookingStation = action.payload;
    },
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setLoadingBookings: (state, action: PayloadAction<boolean>) => {
      state.loadingBookings = action.payload;
    },
    setBooking: (state, action: PayloadAction<Booking | null>) => {
      state.booking = action.payload;
    },
    setLoadingBooking: (state, action: PayloadAction<boolean>) => {
      state.loadingBooking = action.payload;
    },
    resetStations: () => initialState,
  },
});

export const {
  setStationList,
  setLoadingList,
  setStation,
  setLoadingStation,
  setBookingStation,
  setBookings,
  setLoadingBookings,
  setBooking,
  setLoadingBooking,
  resetStations,
} = stationsSlice.actions;

export default stationsSlice.reducer;
