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

  getSubscriptions: () =>
    base<{
      success: boolean;
      subscriptions: Array<{
        pk: number;
        user_name: string;
        user_email: string;
        plan_name: string;
        plan_price: number;
        is_active: boolean;
        created_at: string;
        expires_at: string | null;
      }>;
      total: number;
    }>('user/admin/subscriptions/', { method: 'GET' }),

  getBookingsPaginated: (page: number = 1, pageSize: number = 20) =>
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
      page: number;
      page_size: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    }>(`user/admin/bookings/paginated/?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
    }),

  getRevenueChart: () =>
    base<{
      success: boolean;
      chart: Array<{
        date: string;
        revenue: number;
        bookings: number;
      }>;
      summary: {
        total_revenue: number;
        total_bookings: number;
        peak_day: {
          date: string;
          revenue: number;
          bookings: number;
        } | null;
        avg_daily_revenue: number;
      };
    }>('user/admin/revenue/chart/', { method: 'GET' }),
};
