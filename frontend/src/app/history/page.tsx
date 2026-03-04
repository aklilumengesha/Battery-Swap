"use client";

import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useBookings } from "../../features/stations";
import Link from "next/link";
import { routes } from "../../routes";
import { ClockCircleOutlined, ThunderboltFilled } from '@ant-design/icons';

const History = () => {
  const { data: bookings, isLoading: loadingBookings } = useBookings();

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

        {/* Booking Cards */}
        {!loadingBookings && bookings && bookings.length > 0 && (
          <div className="space-y-3">
            {bookings.map((booking: any, i: number) => (
              <Link href={routes.ORDER_DETAILS(booking.pk)} key={i}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <ThunderboltFilled className="text-white text-lg" />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors truncate">
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
