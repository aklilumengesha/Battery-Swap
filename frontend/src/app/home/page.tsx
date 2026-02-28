"use client";

import React, { useEffect, useState } from "react";
import { BatteryCard, StationSkeletonList } from "../../components";
import BarLayout from "../../components/layout/BarLayout";
import { useNearbyStations, useBookings } from "../../features/stations";
import { useAuthQuery } from "../../features/auth";
import ScanButton from "../../components/shared/ScanButton";
import { getLocation } from "../../utils/location";
import { 
  ThunderboltFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

const Home = () => {
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number; name: string }>({ 
    name: "loading..." 
  });

  const { user } = useAuthQuery();
  
  // Fetch stations using React Query
  const { data: stationList, isLoading: loadingList, error } = useNearbyStations(
    location?.latitude,
    location?.longitude
  );

  // Fetch bookings for stats
  const { data: bookings = [] } = useBookings();

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if ("geolocation" in navigator) {
      getLocation((data: any) => setLocation(data));
    }
  }, []);

  // Calculate stats
  const nearbyStationsCount = stationList?.length || 0;
  const activeBooking = bookings.find((b: any) => !b.is_collected);
  const totalSwaps = bookings.filter((b: any) => b.is_collected).length;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <BarLayout location={location}>
      <div className="space-y-6 pb-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-300 text-sm mb-1">{getGreeting()}</p>
              <h1 className="text-2xl font-bold">{user?.name || "Welcome"}</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
              <ThunderboltFilled className="text-xl" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <EnvironmentOutlined className="text-base" />
            <span className="text-sm">
              {location?.name || "Detecting location..."}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Nearby Stations */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs mb-1">Nearby</span>
              <span className="text-2xl font-bold text-gray-900">{nearbyStationsCount}</span>
              <span className="text-gray-600 text-xs mt-1">Stations</span>
            </div>
          </div>

          {/* Active Booking */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs mb-1">Active</span>
              <span className="text-2xl font-bold text-gray-900">
                {activeBooking ? "1" : "0"}
              </span>
              <span className="text-gray-600 text-xs mt-1">Booking</span>
            </div>
          </div>

          {/* Total Swaps */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs mb-1">Total</span>
              <span className="text-2xl font-bold text-gray-900">{totalSwaps}</span>
              <span className="text-gray-600 text-xs mt-1">Swaps</span>
            </div>
          </div>
        </div>

        {/* Stations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Stations</h2>
            {nearbyStationsCount > 0 && (
              <span className="text-sm text-gray-500">{nearbyStationsCount} found</span>
            )}
          </div>

          {!location?.latitude || !location?.longitude ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvironmentOutlined className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Getting your location...</p>
              <p className="text-sm text-gray-400">Please enable location services</p>
            </div>
          ) : loadingList ? (
            <StationSkeletonList count={5} />
          ) : error ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-red-100">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockCircleOutlined className="text-3xl text-red-400" />
              </div>
              <p className="text-red-600 font-medium mb-2">Unable to load stations</p>
              <p className="text-gray-600 text-sm mb-4">{(error as Error).message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Try Again
                <ArrowRightOutlined />
              </button>
            </div>
          ) : stationList && stationList.length > 0 ? (
            <div className="space-y-3">
              {stationList.map((station: any, i: number) => (
                <BatteryCard station={station} key={station.pk || i} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThunderboltFilled className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-2">No stations nearby</p>
              <p className="text-gray-600 text-sm mb-4">
                We couldn't find any battery swap stations in your area
              </p>
              <button 
                onClick={() => {
                  if ("geolocation" in navigator) {
                    getLocation((data: any) => setLocation(data));
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <ReloadOutlined />
                Refresh Location
              </button>
            </div>
          )}
        </div>
      </div>
      
      <ScanButton />
    </BarLayout>
  );
};

export default Home;
