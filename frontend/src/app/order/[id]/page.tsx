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

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Battery Company */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Battery Brand</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking?.battery?.company?.name || 'N/A'}
                </p>
              </div>

              {/* Vehicle */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Vehicle Type</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking?.battery?.vehicle?.name || 'N/A'}
                </p>
              </div>

              {/* Booked Time */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Booked Time</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking?.booked_time
                    ? new Date(booking.booked_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </p>
              </div>

              {/* Expiry Time */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Expires</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking?.expiry_time
                    ? new Date(booking.expiry_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </p>
              </div>

              {/* Collection Status */}
              <div className="col-span-2 bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Collection Status</p>
                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold
                  ${booking?.is_collected
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {booking?.is_collected ? '✓ Collected' : '⏳ Not Collected'}
                </span>
              </div>
            </div>

            {/* Navigate to Station Button */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://maps.google.com/?q=${station?.latitude},${station?.longitude}`}
              className="flex items-center justify-center gap-2
                w-full py-3 rounded-xl
                bg-gray-900 text-white text-sm font-medium
                hover:bg-gray-800
                transition-colors"
            >
              <EnvironmentOutlined />
              Navigate to Station
            </a>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Order;
