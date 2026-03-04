"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useBooking } from "../../../features/stations";
import { ThunderboltFilled, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getLocation } from "../../../utils/location";

const Order = () => {
  const params = useParams();
  const [location, setLocation] = useState<any>({ name: "loading..." });
  
  const { data, isLoading } = useBooking(
    params?.id as string,
    location?.latitude,
    location?.longitude
  );
  
  const booking = data?.booking;
  const station = data?.station;

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if ("geolocation" in navigator) {
      getLocation((data: any) => setLocation(data));
    }
  }, []);

  return (
    <DashboardLayout title="Order Details">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to History
            </button>

            {/* Hero Card */}
            <div className="relative bg-gradient-to-br
              from-gray-900 via-gray-800 to-gray-900
              rounded-3xl p-6 text-white overflow-hidden">
              {/* Glows */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Top row: Order ID + Payment badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl
                      bg-white/10 border border-white/20
                      flex items-center justify-center">
                      <ThunderboltFilled className="text-white text-base" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Order</p>
                      <p className="text-white font-bold">#{booking?.pk}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                    ${booking?.is_paid
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {booking?.is_paid ? '✓ Paid' : '⏳ Unpaid'}
                  </span>
                </div>

                {/* Station name */}
                <h2 className="text-xl font-bold text-white mb-1">
                  {station?.name || 'N/A'}
                </h2>
                <div className="flex items-center gap-1.5
                  text-gray-400 text-sm">
                  <EnvironmentOutlined />
                  <span>Battery Swap Station</span>
                </div>

                {/* Price */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-xs mb-1">Total Price</p>
                  <p className="text-3xl font-bold text-white">
                    Rs {booking?.battery?.price || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Battery Info Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Battery Information</h3>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="px-5 py-4 flex items-center
                  justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50
                      flex items-center justify-center">
                      <ThunderboltFilled className="text-blue-500 text-xs" />
                    </div>
                    <p className="text-sm text-gray-500">Battery Brand</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking?.battery?.company?.name || 'N/A'}
                  </p>
                </div>

                <div className="px-5 py-4 flex items-center
                  justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50
                      flex items-center justify-center">
                      <span className="text-sm">🚗</span>
                    </div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking?.battery?.vehicle?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Booking Timeline</h3>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="px-5 py-4 flex items-center
                  justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50
                      flex items-center justify-center">
                      <ClockCircleOutlined className="text-green-500 text-xs" />
                    </div>
                    <p className="text-sm text-gray-500">Booked At</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking?.booked_time
                      ? new Date(booking.booked_time).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          year: 'numeric', hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>

                <div className="px-5 py-4 flex items-center
                  justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50
                      flex items-center justify-center">
                      <ClockCircleOutlined className="text-red-400 text-xs" />
                    </div>
                    <p className="text-sm text-gray-500">Expires At</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking?.expiry_time
                      ? new Date(booking.expiry_time).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          year: 'numeric', hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Grid Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Status</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className={`rounded-xl p-4 text-center
                  border ${booking?.is_paid
                    ? 'bg-green-50 border-green-100'
                    : 'bg-yellow-50 border-yellow-100'
                  }`}>
                  <p className="text-xs text-gray-400 mb-1">Payment</p>
                  <p className={`text-sm font-bold
                    ${booking?.is_paid
                      ? 'text-green-600'
                      : 'text-yellow-600'
                    }`}>
                    {booking?.is_paid ? '✓ Paid' : '⏳ Pending'}
                  </p>
                </div>

                <div className={`rounded-xl p-4 text-center
                  border ${booking?.is_collected
                    ? 'bg-blue-50 border-blue-100'
                    : 'bg-gray-50 border-gray-100'
                  }`}>
                  <p className="text-xs text-gray-400 mb-1">Collection</p>
                  <p className={`text-sm font-bold
                    ${booking?.is_collected
                      ? 'text-blue-600'
                      : 'text-gray-500'
                    }`}>
                    {booking?.is_collected ? '✓ Collected' : '⏳ Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigate to Station Button */}
            {station?.latitude && station?.longitude && (
              <a
                href={`https://maps.google.com/?q=${station.latitude},${station.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2
                  w-full py-4 rounded-2xl
                  bg-gray-900 text-white text-sm font-semibold
                  hover:bg-gray-800 active:scale-[0.98]
                  transition-all duration-200 shadow-sm"
              >
                <EnvironmentOutlined />
                Navigate to Station
              </a>
            )}

            {/* Bottom padding */}
            <div className="h-4" />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Order;
