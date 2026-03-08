import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';

export const useAdminStats = () =>
  useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await AdminService.getStats();
      if (res.data?.success) return res.data.stats;
      return null;
    },
  });

export const useAdminUsers = () =>
  useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await AdminService.getUsers();
      if (res.data?.success) {
        return res.data.users || [];
      }
      return [];
    },
  });

export const useToggleUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pk: number) =>
      AdminService.toggleUser(pk),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'producers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'stats'],
      });
    },
  });
};

export const useAdminProducers = () =>
  useQuery({
    queryKey: ['admin', 'producers'],
    queryFn: async () => {
      const res = await AdminService.getProducers();
      if (res.data?.success) {
        return res.data.producers || [];
      }
      return [];
    },
  });

export const useAdminStations = () =>
  useQuery({
    queryKey: ['admin', 'stations'],
    queryFn: async () => {
      const res = await AdminService.getStations();
      if (res.data?.success) {
        return res.data.stations || [];
      }
      return [];
    },
  });

export const useAdminBookings = () =>
  useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const res = await AdminService.getBookings();
      if (res.data?.success) {
        return res.data.bookings || [];
      }
      return [];
    },
  });
