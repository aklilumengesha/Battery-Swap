import { useQuery } from '@tanstack/react-query';
import { ProducerService } from '@/services/producer.service';

export const useMyStations = () =>
  useQuery({
    queryKey: ['producer', 'stations'],
    queryFn: async () => {
      const res = await ProducerService.getMyStations();
      if (res.data?.success) {
        return res.data.stations || [];
      }
      // If producer profile missing return empty instead of throwing error
      if (res.data?.message?.includes('Producer matching query')) {
        console.warn('Producer profile not found');
        return [];
      }
      return [];
    },
  });

export const useMyBookings = () =>
  useQuery({
    queryKey: ['producer', 'bookings'],
    queryFn: async () => {
      const res = await ProducerService.getMyBookings();
      if (res.data?.success) {
        return res.data.bookings || [];
      }
      return [];
    },
  });

export const useMyStats = () =>
  useQuery({
    queryKey: ['producer', 'stats'],
    queryFn: async () => {
      const res = await ProducerService.getStats();
      if (res.data?.success) {
        return res.data.stats;
      }
      return null;
    },
  });

export const useStationDetail = (id: string | number) =>
  useQuery({
    queryKey: ['producer', 'station', id],
    queryFn: async () => {
      const res = await ProducerService.getStation(id);
      if (res.data?.success) {
        return res.data.station;
      }
      return null;
    },
    enabled: !!id,
  });

export const useAllBatteries = () =>
  useQuery({
    queryKey: ['producer', 'batteries'],
    queryFn: async () => {
      const res = await ProducerService.getAllBatteries();
      // Now returns { success, batteries, total }
      return res.data?.batteries || [];
    },
  });

export const useVehicles = () =>
  useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await ProducerService.getVehicles();
      // Backend returns array directly, not wrapped in object
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return res.data?.vehicles || res.data?.results || [];
    },
  });

