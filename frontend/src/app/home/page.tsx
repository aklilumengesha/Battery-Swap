"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BatteryCard, StationSkeletonList } from "../../components";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNearbyStations, useBookings } from "../../features/stations";
import { useAuthQuery } from "../../features/auth";
import ScanButton from "../../components/shared/ScanButton";
import { getLocation } from "../../utils/location";
import { routes } from "../../routes";
import { 
  ThunderboltFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  CreditCardOutlined
} from "@ant-design/icons";

const Home = () => {
  const router = useRouter();
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
    <DashboardLayout title="Home" location={location}>
      <div className="space-y-6 pb-24">
        {/* Hero Section - Redesigned */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
          {/* Radial glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Top section with greeting and icon */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-2">{getGreeting()}</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                  {user?.name || "Welcome"}
                </h1>
                <p className="text-gray-300 text-base">Ready to power your journey?</p>
              </div>
              
              {/* Icon with radial glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20">
                  <ThunderboltFilled className="text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-300 mb-8">
              <EnvironmentOutlined className="text-lg" />
              <span className="text-sm font-medium">
                {location?.name || "Detecting location..."}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  // Scroll to stations section
                  const stationsSection = document.getElementById('stations-section');
                  if (stationsSection) {
                    stationsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex-1 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <SearchOutlined className="text-lg group-hover:scale-110 transition-transform" />
                Find Station
              </button>
              
              <button
                onClick={() => router.push(routes.PRICING)}
                className="flex-1 bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center justify-center gap-2 group"
              >
                <CreditCardOutlined className="text-lg group-hover:scale-110 transition-transform" />
                View Plan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row - Redesigned */}
        <div className="grid grid-cols-3 gap-4">
          {/* Nearby Stations */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <EnvironmentOutlined className="text-white text-xl" />
              </div>
              
              {/* Value */}
              <span className="text-3xl font-bold text-gray-900 mb-1">
                {nearbyStationsCount}
              </span>
              
              {/* Label */}
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Nearby
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                Stations
              </span>
            </div>
          </div>

          {/* Active Booking */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ClockCircleOutlined className="text-white text-xl" />
              </div>
              
              {/* Value */}
              <span className="text-3xl font-bold text-gray-900 mb-1">
                {activeBooking ? "1" : "0"}
              </span>
              
              {/* Label */}
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Active
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                Booking
              </span>
            </div>
          </div>

          {/* Total Swaps */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ThunderboltFilled className="text-white text-xl" />
              </div>
              
              {/* Value */}
              <span className="text-3xl font-bold text-gray-900 mb-1">
                {totalSwaps}
              </span>
              
              {/* Label */}
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                Swaps
              </span>
            </div>
          </div>
        </div>

        {/* Stations Section */}
        <div id="stations-section">
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
    </DashboardLayout>
  );
};

export default Home;
