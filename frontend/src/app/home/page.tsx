"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { BatteryCard, StationSkeletonList, SubscriptionBanner } from "../../components";
import { useNearbyStations, useBookings, useStationWebSocket } from "../../features/stations";
import { useAuthQuery } from "../../features/auth";
import { useMySubscription } from "../../features/subscription";
import ScanButton from "../../components/shared/ScanButton";
import { getLocation } from "../../utils/location";
import { routes } from "../../routes";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  ThunderboltFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  CreditCardOutlined
} from "@ant-design/icons";

const MapPreview = dynamic(() => import('../../components/map/MapPreview'), {
  ssr: false,
  loading: () => <div style={{height:'300px',background:'#f5f5f5'}}>Loading map...</div>
});

const Home = () => {
  const router = useRouter();
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number; name: string }>({ 
    name: "loading..." 
  });

  const { user } = useAuthQuery();
  
  // Fetch user's subscription
  const { data: subscription, isLoading: subscriptionLoading } = useMySubscription();
  
  // Fetch stations using React Query
  const { data: stationList, isLoading: loadingList, error } = useNearbyStations(
    location?.latitude,
    location?.longitude
  );

  // Fetch bookings for stats
  const { data: bookings = [] } = useBookings();

  // Connect to WebSocket for real-time availability updates
  useStationWebSocket({
    enabled: !!stationList && stationList.length > 0,
  });

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
      <div className="space-y-6 pb-6">
        {/* Hero Section - Redesigned with fade-in animation */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden animate-fade-in">
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
                onClick={() => router.push(subscription ? routes.MY_PLAN : routes.PRICING)}
                className="flex-1 bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center justify-center gap-2 group"
              >
                <CreditCardOutlined className="text-lg group-hover:scale-110 transition-transform" />
                View Plan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row - Redesigned with stagger animation */}
        <div className="grid grid-cols-3 gap-4">
          {/* Nearby Stations */}
          <div 
            className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: "100ms" }}
          >
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
          <div 
            className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: "200ms" }}
          >
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
          <div 
            className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: "300ms" }}
          >
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

        {/* Subscription Status Banner with scale-in animation */}
        <div className="animate-scale-in" style={{ animationDelay: "400ms" }}>
          <SubscriptionBanner
            planName={subscription?.plan_details?.name ? `${subscription.plan_details.name} Plan` : 'No Active Plan'}
            swapsRemaining={
              subscription 
                ? (subscription.plan_details?.swap_limit_per_month || 0) - (subscription.swaps_used || 0)
                : 0
            }
            swapLimit={subscription?.plan_details?.swap_limit_per_month || 0}
            isLoading={subscriptionLoading}
            onUpgradeClick={() => router.push(subscription ? routes.MY_PLAN : routes.PRICING)}
          />
        </div>

        {/* Map Preview - Show stations on map */}
        {location?.latitude && location?.longitude && (
          <div className="animate-scale-in" style={{ animationDelay: "500ms" }}>
            {loadingList ? (
              <div className="h-[220px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 font-medium">Loading map preview...</p>
                </div>
              </div>
            ) : stationList && stationList.length > 0 ? (
              <MapPreview
                stations={stationList.map((station: any) => ({
                  id: station.pk,
                  name: station.name,
                  latitude: station.latitude,
                  longitude: station.longitude,
                  address: station.address,
                }))}
                userLocation={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                onViewFullMap={() => {
                  // Scroll to stations section
                  const stationsSection = document.getElementById('stations-section');
                  if (stationsSection) {
                    stationsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            ) : null}
          </div>
        )}

        {/* Stations Section - Redesigned */}
        <div id="stations-section" className="pt-6 border-t border-gray-200">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available Stations</h2>
              <p className="text-sm text-gray-500 mt-1">Find and book nearby charging stations</p>
            </div>
            {nearbyStationsCount > 0 && (
              <div className="bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="text-sm font-semibold text-gray-700">{nearbyStationsCount} found</span>
              </div>
            )}
          </div>

          {!location?.latitude || !location?.longitude ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <EnvironmentOutlined className="text-5xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting your location</h3>
              <p className="text-gray-600 mb-1">We&apos;re detecting your current position</p>
              <p className="text-sm text-gray-500">Please enable location services to continue</p>
            </div>
          ) : loadingList ? (
            <StationSkeletonList count={5} />
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-12 text-center shadow-sm border border-red-100">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <ClockCircleOutlined className="text-5xl text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load stations</h3>
              <p className="text-gray-600 mb-6">{(error as Error).message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                Try Again
                <ArrowRightOutlined />
              </button>
            </div>
          ) : stationList && stationList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stationList.map((station: any, i: number) => (
                <div
                  key={station.pk || i}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <BatteryCard station={station} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <ThunderboltFilled className="text-5xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No stations nearby</h3>
              <p className="text-gray-600 mb-1">We couldn&apos;t find any battery swap stations in your area</p>
              <p className="text-sm text-gray-500 mb-6">Try refreshing your location or check back later</p>
              <button 
                onClick={() => {
                  if ("geolocation" in navigator) {
                    getLocation((data: any) => setLocation(data));
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
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
