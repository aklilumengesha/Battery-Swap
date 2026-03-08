import { base } from './api/base';

export const AdminService = {
  getStats: () =>
    base<{
      success: boolean;
      stats: {
        total_users: number;
        total_producers: number;
        total_consumers: number;
        total_stations: number;
        total_batteries: number;
        total_orders: number;
        paid_orders: number;
        total_revenue: number;
      };
    }>('user/admin/stats/', { method: 'GET' }),

  getUsers: () =>
    base<{
      success: boolean;
      users: Array<{
        pk: number;
        name: string;
        email: string;
        user_type: string;
        date_joined: string;
        is_active: boolean;
      }>;
      total: number;
    }>('user/admin/users/', { method: 'GET' }),

  toggleUser: (pk: number) =>
    base<{
      success: boolean;
      is_active: boolean;
      message: string;
    }>(`user/admin/users/${pk}/toggle/`, {
      method: 'PATCH',
    }),

  getProducers: () =>
    base<{
      success: boolean;
      producers: Array<{
        pk: number;
        name: string;
        email: string;
        company: string;
        total_stations: number;
        total_bookings: number;
        total_revenue: number;
        is_active: boolean;
        date_joined: string;
      }>;
      total: number;
    }>('user/admin/producers/', { method: 'GET' }),

  getStations: () =>
    base<{
      success: boolean;
      stations: Array<{
        pk: number;
        name: string;
        latitude: number;
        longitude: number;
        total_batteries: number;
        owner_name: string;
        owner_company: string;
      }>;
      total: number;
    }>('user/admin/stations/', { method: 'GET' }),

  getBookings: () =>
    base<{
      success: boolean;
      bookings: Array<{
        pk: number;
        station_name: string;
        producer_name: string;
        vehicle: string;
        price: number;
        is_paid: boolean;
        is_collected: boolean;
        booked_time: string;
      }>;
      total: number;
    }>('user/admin/bookings/', { method: 'GET' }),
};
