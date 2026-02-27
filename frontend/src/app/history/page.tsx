"use client";

import React, { useEffect, useState } from "react";
import BarLayout from "../../components/layout/BarLayout";
import { useBookings } from "../../features/stations";
import { Spin } from "antd";
import Link from "next/link";
import { routes } from "../../routes";
import { getLocation } from "../../utils/location";

const History = () => {
  const { data: bookings, isLoading: loadingBookings } = useBookings();
  const [location, setLocation] = useState<any>({ name: "loading..." });

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if ("geolocation" in navigator) {
      getLocation((data: any) => setLocation(data));
    }
  }, []);

  // React Query automatically fetches bookings, no manual call needed

  return (
    <BarLayout location={location}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Booking History</h1>
        {loadingBookings ? (
          <div className="text-center py-8">
            <Spin tip="Loading bookings..." />
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any, i: number) => (
              <Link href={routes.ORDER_DETAILS(booking.pk)} key={i}>
                <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold">{booking.station?.name}</h3>
                  <p className="text-sm text-gray-600">{booking.battery?.company?.name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(booking.booked_time).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No bookings yet
          </div>
        )}
      </div>
    </BarLayout>
  );
};

export default History;
