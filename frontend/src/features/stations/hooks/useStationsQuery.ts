"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, notification } from "antd";
import { queryKeys } from "../../../lib/react-query";
import { StationsService, UsersService } from "../../../services";
import { routes } from "../../../routes";
import { Cache } from "../../../services/api/cache";

/**
 * Booking Data Interface
 */
interface BookBatteryData {
  station?: string | number;
  battery?: string | number;
}

/**
 * useStationsQuery Hook
 * React Query version of stations and bookings management
 * 
 * @example
 * const { stationList, listStations, bookBattery } = useStationsQuery();
 */
export const useStationsQuery = () => {
  const queryClient = useQueryClient();

  // Helper to get user ID
  const getUserId = () => {
    const user = Cache.getItem("user");
    return user?.pk;
  };

  // Query: List nearby stations
  const useNearbyStations = (latitude?: number, longitude?: number) => {
    return useQuery({
      queryKey: queryKeys.stations.list(latitude || 0, longitude || 0),
      queryFn: async () => {
        const userId = getUserId();
        if (!userId) {
          throw new Error("Please login to view stations");
        }
        if (!latitude || !longitude) {
          throw new Error("Location required");
        }

        const res = await StationsService.findNearbyStations(userId, {
          latitude,
          longitude,
        });
        
        if (res.status === 200) {
          return res.data.stations || [];
        }
        throw new Error(res.data.message || "Failed to fetch stations");
      },
      enabled: !!latitude && !!longitude && !!getUserId(),
      staleTime: 2 * 60 * 1000, // 2 minutes (location-based data)
    });
  };

  // Query: Get single station
  const useStation = (
    id?: string | number,
    latitude?: number,
    longitude?: number
  ) => {
    return useQuery({
      queryKey: queryKeys.stations.detail(id || "", latitude, longitude),
      queryFn: async () => {
        if (!id) throw new Error("Station ID required");
        if (!latitude || !longitude) throw new Error("Location required");

        const res = await StationsService.getStation(id, {
          latitude,
          longitude,
        });
        
        if (res.status === 200) {
          return res.data.station || null;
        }
        throw new Error(res.data.message || "Failed to fetch station");
      },
      enabled: !!id && !!latitude && !!longitude,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Query: List bookings
  const useBookings = () => {
    return useQuery({
      queryKey: queryKeys.bookings.list(),
      queryFn: async () => {
        const res = await UsersService.listOrders();
        if (res.data.success) {
          return res.data.orders || [];
        }
        return [];
      },
      staleTime: 1 * 60 * 1000, // 1 minute (bookings change frequently)
    });
  };

  // Query: Get single booking
  const useBooking = (
    id?: string | number,
    latitude?: number,
    longitude?: number
  ) => {
    return useQuery({
      queryKey: queryKeys.bookings.detail(id || "", latitude, longitude),
      queryFn: async () => {
        if (!id) throw new Error("Booking ID required");

        const orderRes = await UsersService.getOrder(id, {
          latitude: latitude || 0,
          longitude: longitude || 0,
        });
        
        if (orderRes.data.success) {
          const booking = orderRes.data.order;
          
          // Fetch station details if available
          if (booking?.station?.pk && latitude && longitude) {
            const stationRes = await StationsService.getStation(
              booking.station.pk,
              { latitude, longitude }
            );
            
            if (stationRes.status === 200) {
              return {
                booking,
                station: stationRes.data.station,
              };
            }
          }
          
          return { booking, station: null };
        }
        throw new Error(orderRes.data.message || "Failed to fetch booking");
      },
      enabled: !!id,
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Mutation: Book battery
  const bookBatteryMutation = useMutation({
    mutationFn: async (data: BookBatteryData) => {
      const res = await UsersService.bookBattery({
        station: data?.station ?? "",
        battery: data?.battery ?? "",
      });
      
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Booking failed");
    },
    onSuccess: (data) => {
      notification.success({
        message: "Booking Confirmed!",
        description: "You can now visit the station and collect your battery.",
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });
      
      // Redirect to order details
      window.location.href = routes.ORDER_DETAILS(data.order_pk);
    },
    onError: (error: Error) => {
      notification.error({
        message: "Booking Failed!",
        description: error.message || "Please try again later.",
      });
    },
  });

  return {
    // Hooks for queries
    useNearbyStations,
    useStation,
    useBookings,
    useBooking,
    
    // Mutations
    bookBattery: bookBatteryMutation.mutate,
    isBooking: bookBatteryMutation.isPending,
  };
};

/**
 * Convenience hooks for direct use in components
 */

export const useNearbyStations = (latitude?: number, longitude?: number) => {
  const { useNearbyStations: hook } = useStationsQuery();
  return hook(latitude, longitude);
};

export const useStation = (
  id?: string | number,
  latitude?: number,
  longitude?: number
) => {
  const { useStation: hook } = useStationsQuery();
  return hook(id, latitude, longitude);
};

export const useBookings = () => {
  const { useBookings: hook } = useStationsQuery();
  return hook();
};

export const useBooking = (
  id?: string | number,
  latitude?: number,
  longitude?: number
) => {
  const { useBooking: hook } = useStationsQuery();
  return hook(id, latitude, longitude);
};
