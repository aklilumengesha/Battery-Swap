'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import {
  useMyBookings,
  useMyStats,
} from '@/features/producer/hooks/useProducerQuery';
import {
  ThunderboltFilled,
  SearchOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';

export default function ProducerBookingsPage() {
  const { data: bookings = [], isLoading } = useMyBookings();
  const { data: stats } = useMyStats();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = bookings.filter((b: any) => {
    const matchSearch =
      !search ||
      b.station_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'All' ||
      (filter === 'Paid' && b.is_paid) ||
      (filter === 'Unpaid' && !b.is_paid) ||
      (filter === 'Collected' && b.is_collected) ||
      (filter === 'Pending' && !b.is_collected);

    return matchSearch && matchFilter;
  });

  return (
    <ProducerRoute>
      <DashboardLayout title="Bookings">
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
              <p className="text-sm text-gray-400 mt-1">
                All bookings at your stations
              </p>
            </div>
          </div>

          {/* Summary Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total',
                value: stats?.total_bookings || 0,
                color: 'bg-blue-50',
                text: 'text-blue-600',
              },
              {
                label: 'Paid',
                value: stats?.paid_bookings || 0,
                color: 'bg-green-50',
                text: 'text-green-600',
              },
              {
                label: 'Pending',
                value: stats?.pending_bookings || 0,
                color: 'bg-orange-50',
                text: 'text-orange-600',
              },
              {
                label: 'Revenue',
                value: `Rs ${stats?.total_revenue || 0}`,
                color: 'bg-purple-50',
                text: 'text-purple-600',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.text}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Bookings list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search + Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search by station or vehicle..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {['All', 'Paid', 'Unpaid', 'Collected', 'Pending'].map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                          filter === f
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>

                {(search || filter !== 'All') && (
                  <p className="text-xs text-gray-400">
                    Showing {filtered.length} of {bookings.length} bookings
                  </p>
                )}
              </div>

              {/* Bookings List */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100" />
                        <div className="flex-1">
                          <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-400">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((booking: any) => (
                    <div
                      key={booking.pk}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0">
                          <ThunderboltFilled className="text-white text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {booking.station_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {booking.vehicle} ·{' '}
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
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              booking.is_paid
                                ? 'bg-green-50 text-green-600'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}
                          >
                            {booking.is_paid ? '✓ Paid' : '⏳ Unpaid'}
                          </span>
                          <p className="text-sm font-bold text-gray-900">
                            Rs {booking.battery_price}
                          </p>
                        </div>
                      </div>

                      {/* Collection status */}
                      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1 text-xs font-medium ${
                            booking.is_collected
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {booking.is_collected ? (
                            <CheckCircleFilled />
                          ) : (
                            <ClockCircleOutlined />
                          )}
                          {booking.is_collected
                            ? 'Battery Collected'
                            : 'Pending Collection'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Revenue breakdown */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Revenue Breakdown
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="bg-gray-900 rounded-2xl p-5 text-center">
                    <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">
                      Rs {stats?.total_revenue || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      from {stats?.paid_bookings || 0} paid bookings
                    </p>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Collection Rate</span>
                      <span>
                        {stats?.total_bookings
                          ? Math.round(
                              (stats.collected_bookings / stats.total_bookings) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats?.total_bookings
                              ? Math.round(
                                  (stats.collected_bookings /
                                    stats.total_bookings) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Payment Rate</span>
                      <span>
                        {stats?.total_bookings
                          ? Math.round(
                              (stats.paid_bookings / stats.total_bookings) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats?.total_bookings
                              ? Math.round(
                                  (stats.paid_bookings / stats.total_bookings) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
