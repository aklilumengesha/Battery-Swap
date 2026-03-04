"use client";

import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useBookings } from "../../features/stations";
import Link from "next/link";
import { routes } from "../../routes";
import { ClockCircleOutlined, ThunderboltFilled, SearchOutlined } from '@ant-design/icons';

const History = () => {
  const { data: bookings, isLoading: loadingBookings } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = !searchQuery ||
      booking.station?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.battery?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.battery?.vehicle?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Paid' && booking.is_paid) ||
      (activeFilter === 'Unpaid' && !booking.is_paid) ||
      (activeFilter === 'Collected' && booking.is_collected) ||
      (activeFilter === 'Pending' && !booking.is_collected);

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout title="History">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Booking History</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {bookings?.length || 0} total bookings
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-3 mb-6">
          {/* Search Input */}
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by station, vehicle, battery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl
                border border-gray-200 bg-white text-sm
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:border-gray-400
                transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Paid', 'Unpaid', 'Collected', 'Pending'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs
                  font-medium transition-all duration-200
                  ${activeFilter === filter
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Result count */}
          {(searchQuery || activeFilter !== 'All') && (
            <p className="text-xs text-gray-400">
              Showing {filteredBookings?.length || 0} of{' '}
              {bookings?.length || 0} bookings
              {(searchQuery || activeFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('All');
                  }}
                  className="ml-2 text-gray-900 underline underline-offset-2"
                >
                  Clear
                </button>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loadingBookings && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingBookings && (!bookings || bookings.length === 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ClockCircleOutlined className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-500">Your booking history will appear here</p>
          </div>
        )}

        {/* No Results State */}
        {filteredBookings?.length === 0 && (bookings?.length ?? 0) > 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center
              mx-auto mb-3">
              <SearchOutlined className="text-gray-400 text-lg" />
            </div>
            <p className="text-sm font-medium text-gray-900">No results found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search or filter</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="mt-3 text-xs text-gray-900
                underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Booking Cards */}
        {!loadingBookings && filteredBookings && filteredBookings.length > 0 && (
          <div className="space-y-3">
            {filteredBookings.map((booking: any, i: number) => (
              <div
                key={booking.pk}
                onClick={() => setExpandedId(expandedId === booking.pk ? null : booking.pk)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5
                  cursor-pointer select-none
                  hover:shadow-md hover:border-gray-200
                  transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ThunderboltFilled className="text-white text-lg" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 transition-colors truncate">
                          {booking.station?.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {booking.battery?.vehicle?.name} · {booking.battery?.company?.name}
                        </p>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ${booking.battery?.price}
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <ClockCircleOutlined />
                        <span>
                          {new Date(booking.booked_time).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.is_paid
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {booking.is_paid ? 'Paid' : 'Unpaid'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.is_collected
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-gray-50 text-gray-500'
                        }`}>
                          {booking.is_collected ? 'Collected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expand toggle at bottom of card */}
                <div className="flex items-center justify-center mt-4 pt-3 border-t border-gray-50 gap-1">
                  <span className="text-xs text-gray-400">
                    {expandedId === booking.pk ? 'Less details' : 'More details'}
                  </span>
                  <span className={`text-gray-400 text-xs
                    transition-transform duration-300 inline-block
                    ${expandedId === booking.pk ? 'rotate-180' : 'rotate-0'}`}
                  >
                    ▾
                  </span>
                </div>

                {/* Expanded detail section */}
                {expandedId === booking.pk && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Booking ID</p>
                      <p className="text-sm font-bold text-gray-900">#{booking.pk}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Expires</p>
                      <p className="text-sm font-bold text-gray-900">
                        {booking.expiry_time
                          ? new Date(booking.expiry_time).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Battery Brand</p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {booking.battery?.company?.name || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Vehicle Type</p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {booking.battery?.vehicle?.name || 'N/A'}
                      </p>
                    </div>

                    {/* View full details button */}
                    <div className="col-span-2">
                      <Link
                        href={`/order/${booking.pk}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center gap-2
                          py-2.5 rounded-xl
                          bg-gray-900 text-white text-xs font-medium
                          hover:bg-gray-800
                          transition-colors"
                      >
                        View Full Details →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
