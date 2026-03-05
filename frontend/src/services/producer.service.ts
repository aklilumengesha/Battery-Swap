import { base } from './api/base';

export const ProducerService = {
  // Get producer's own stations
  getMyStations: () =>
    base<{
      success: boolean;
      stations: Array<{
        pk: number;
        name: string;
        latitude: number;
        longitude: number;
        total_batteries: number;
        available_batteries: number;
      }>;
      total: number;
    }>('power/stations/mine/', { method: 'GET' }),

  // Get bookings at producer's stations
  getMyBookings: () =>
    base<{
      success: boolean;
      bookings: Array<{
        pk: number;
        station_name: string;
        battery_price: number;
        vehicle: string;
        is_paid: boolean;
        is_collected: boolean;
        booked_time: string;
      }>;
      total: number;
    }>('power/stations/mine/bookings/', { method: 'GET' }),

  // Get producer analytics
  getStats: () =>
    base<{
      success: boolean;
      stats: {
        total_stations: number;
        total_bookings: number;
        total_revenue: number;
        paid_bookings: number;
        collected_bookings: number;
        pending_bookings: number;
      };
    }>('power/stations/mine/stats/', { method: 'GET' }),

  // Create a new station
  createStation: (data: {
    name: string;
    latitude: number;
    longitude: number;
  }) =>
    base('power/stations/', { method: 'POST', data }),

  // Get companies list
  getCompanies: () =>
    base('producer/companies/', { method: 'GET' }),
};
