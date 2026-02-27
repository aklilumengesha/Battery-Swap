import { message, notification } from "antd";
import { AppDispatch, RootState } from "../../../redux";
import { logger } from "../../../utils/logger";
import { routes } from "../../../routes";
import { StationsService, UsersService } from "../../../services";
import {
  setStationList,
  setLoadingList,
  setStation,
  setLoadingStation,
  setBookingStation,
  setBookings,
  setLoadingBookings,
  setBooking,
  setLoadingBooking,
} from "./stationsSlice";

/**
 * Coordinates Interface
 */
interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Book Battery Data Interface
 */
interface BookBatteryData {
  station?: string | number;
  battery?: string | number;
}

/**
 * Stations Actions
 * Thunk actions for stations feature
 */
export const stationsActions = {
  /**
   * Fetch nearby stations based on user location
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   */
  handleListStations:
    (latitude: number, longitude: number) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
      dispatch(setLoadingList(true));
      try {
        const { auth } = getState();
        const userId = auth?.user?.pk;

        if (!userId) {
          message.error("Please login to view stations");
          dispatch(setLoadingList(false));
          return;
        }

        const res = await StationsService.findNearbyStations(userId, {
          latitude,
          longitude,
        });
        if (res.status === 200) {
          dispatch(setStationList(res.data.stations || []));
        } else {
          message.error(res.data.message || "Failed to fetch stations");
        }
      } catch (error) {
        logger.error(error, "handleListStations()");
        message.error("Some error occurred");
      } finally {
        dispatch(setLoadingList(false));
      }
    },

  /**
   * Fetch single station details
   * @param id - Station ID
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   */
  handleGetStation:
    (id: string | number, latitude: number, longitude: number) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoadingStation(true));
      try {
        const res = await StationsService.getStation(id, {
          latitude,
          longitude,
        });
        if (res.status === 200) {
          dispatch(setStation(res.data.station || null));
        } else {
          message.error(res.data.message || "Failed to fetch station");
        }
      } catch (error) {
        logger.error(error, "handleGetStation()");
        message.error("Some error occurred");
      } finally {
        dispatch(setLoadingStation(false));
      }
    },

  /**
   * Book a battery at a station
   * @param data - Booking data (station ID, battery ID)
   */
  handleBookBattery:
    (data: BookBatteryData) => async (dispatch: AppDispatch) => {
      dispatch(setBookingStation(true));
      try {
        const res = await UsersService.bookBattery({
          station: data?.station ?? "",
          battery: data?.battery ?? "",
        });
        if (res.data.success) {
          notification.success({
            message: "Booking Confirmed!",
            description:
              "You can now visit the station and collect your battery.",
          });
          window.location.href = routes.ORDER_DETAILS(res.data.order_pk);
        } else {
          notification.error({
            message: "Booking Failed!",
            description: res.data.message || "Please try again later.",
          });
        }
      } catch (error) {
        logger.error(error, "handleBookBattery()");
        notification.error({
          message: "Booking Failed!",
          description: "Please try again later.",
        });
      } finally {
        dispatch(setBookingStation(false));
      }
    },

  /**
   * Fetch list of user's bookings/orders
   */
  handleListBookings: () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingBookings(true));
    try {
      const res = await UsersService.listOrders();
      if (res.data.success) {
        dispatch(setBookings(res.data.orders || []));
      } else {
        dispatch(setBookings([]));
      }
    } catch (error) {
      logger.error(error, "handleListBookings()");
      dispatch(setBookings([]));
    } finally {
      dispatch(setLoadingBookings(false));
    }
  },

  /**
   * Fetch single booking/order details
   * @param id - Order ID
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   */
  handleGetBooking:
    (id: string | number, latitude: number, longitude: number) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoadingBooking(true));
      dispatch(setLoadingStation(true));
      try {
        const orderRes = await UsersService.getOrder(id, {
          latitude,
          longitude,
        });
        if (orderRes.data.success) {
          dispatch(setBooking(orderRes.data.order || null));

          // Fetch station details if available
          const stationId = orderRes.data?.order?.station?.pk;
          if (stationId) {
            const stationRes = await StationsService.getStation(stationId, {
              latitude,
              longitude,
            });
            if (stationRes.status === 200) {
              dispatch(setStation(stationRes.data.station || null));
            }
          }
        } else {
          dispatch(setBooking(null));
        }
      } catch (error) {
        logger.error(error, "handleGetBooking()");
        dispatch(setBooking(null));
      } finally {
        dispatch(setLoadingBooking(false));
        dispatch(setLoadingStation(false));
      }
    },
};
