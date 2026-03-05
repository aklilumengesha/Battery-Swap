'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import { useAuthQuery } from '@/features/auth';
import {
  useMyStations,
  useMyBookings,
  useMyStats,
} from '@/features/producer/hooks/useProducerQuery';
import {
  ThunderboltFilled,
  ShopOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { routes } from '@/routes';

export default function ProducerDashboard() {
  const { user } = useAuthQuery();
  const { data: stations = [], isLoading: loadingStations } = useMyStations();
  const { data: bookings = [], isLoading: loadingBookings } = useMyBookings();
  const { data: stats, isLoading: loadingStats } = useMyStats();
  const router = useRouter();

  const recentBookings = bookings.slice(0, 5);

  return (
    <ProducerRoute>
      <DashboardLayout title="Dashboard">
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.name}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {user?.company?.name || 'Producer'} · Dashboard Overview
              </p>
            </div>
            <button
              onClick={() => router.push(routes.PRODUCER_STATION_CREATE)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              + Add Station
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ShopOutlined className="text-blue-500 text-sm" />
                </div>
                <p className="text-xs text-gray-400">My Stations</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loadingStats ? '—' : stats?.total_stations || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <ThunderboltFilled className="text-purple-500 text-sm" />
                </div>
                <p className="text-xs text-gray-400">Total Bookings</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loadingStats ? '—' : stats?.total_bookings || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <RiseOutlined className="text-green-500 text-sm" />
                </div>
                <p className="text-xs text-gray-400">Total Revenue</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                Rs {loadingStats ? '—' : stats?.total_revenue || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <ClockCircleOutlined className="text-orange-500 text-sm" />
                </div>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loadingStats ? '—' : stats?.pending_bookings || 0}
              </p>
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Recent Bookings */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => router.push(routes.PRODUCER_BOOKINGS)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {loadingBookings ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="px-6 py-4 flex items-center gap-3 animate-pulse"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gray-100" />
                        <div className="flex-1">
                          <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : recentBookings.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <p className="text-sm text-gray-400">No bookings yet</p>
                    </div>
                  ) : (
                    recentBookings.map((booking: any) => (
                      <div
                        key={booking.pk}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0">
                          <ThunderboltFilled className="text-white text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {booking.station_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(booking.booked_time).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              booking.is_paid
                                ? 'bg-green-50 text-green-600'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}
                          >
                            {booking.is_paid ? 'Paid' : 'Unpaid'}
                          </span>
                          <p className="text-sm font-bold text-gray-900">
                            Rs {booking.battery_price}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: My Stations */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    My Stations
                  </h3>
                  <button
                    onClick={() => router.push(routes.PRODUCER_STATIONS)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Manage →
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {loadingStations ? (
                    [1, 2].map((i) => (
                      <div key={i} className="px-5 py-4 animate-pulse">
                        <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                    ))
                  ) : stations.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-xs text-gray-400 mb-3">
                        No stations yet
                      </p>
                      <button
                        onClick={() =>
                          router.push(routes.PRODUCER_STATION_CREATE)
                        }
                        className="text-xs bg-gray-900 text-white px-3 py-2 rounded-lg"
                      >
                        + Add First Station
                      </button>
                    </div>
                  ) : (
                    stations.map((station: any) => (
                      <div
                        key={station.pk}
                        className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(routes.PRODUCER_STATION_DETAIL(station.pk))
                        }
                      >
                        <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {station.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            {station.available_batteries} batteries
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
