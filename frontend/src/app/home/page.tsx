"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { BatteryCard } from "../../components";
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
  CreditCardOutlined,
  CrownFilled
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
        {/* Hero Card */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-7 text-white overflow-hidden shadow-2xl mb-4">
          {/* Animated background glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32
            bg-purple-500/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Greeting + bolt icon row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium
                    text-gray-400 uppercase tracking-wider">
                    {getGreeting()}
                  </span>
                  {/* Active indicator */}
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Online</span>
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {user?.name || 'Welcome'}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Ready to power your journey?
                </p>
              </div>

              {/* Bolt icon */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
                  <ThunderboltFilled className="text-2xl text-white" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <EnvironmentOutlined className="text-xs" />
              </div>
              <span className="text-sm truncate max-w-[200px]">
                {location?.name || 'Detecting location...'}
              </span>
            </div>

            {/* Quick stats row inside hero */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p className="text-lg font-bold text-white">{nearbyStationsCount}</p>
                <p className="text-xs text-gray-500">Nearby</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p className="text-lg font-bold text-white">{activeBooking ? '1' : '0'}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p className="text-lg font-bold text-white">{totalSwaps}</p>
                <p className="text-xs text-gray-500">Swaps</p>
              </div>
            </div>

            {/* Action Buttons - keep exact onClick handlers */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const stationsSection = document.getElementById('stations-section');
                  if (stationsSection) {
                    stationsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl
                  bg-white text-gray-900 text-sm font-semibold
                  hover:bg-gray-100 transition-all duration-200
                  shadow-lg hover:shadow-xl group">
                <SearchOutlined className="group-hover:scale-110 transition-transform" />
                Find Station
              </button>

              <button
                onClick={() => router.push(subscription ? routes.MY_PLAN : routes.PRICING)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl
                  bg-white/10 backdrop-blur-sm text-white text-sm font-semibold
                  hover:bg-white/20 transition-all duration-200 border border-white/20 group">
                <CreditCardOutlined className="group-hover:scale-110 transition-transform" />
                View Plan
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Banner */}
        {!subscriptionLoading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div className="p-5 flex items-center gap-4">
              {/* Plan icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <CrownFilled className="text-white text-lg" />
              </div>

              {/* Plan info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Current Plan</p>
                <p className="text-sm font-bold text-gray-900">
                  {subscription?.plan_details?.name 
                    ? `${subscription.plan_details.name} Plan`
                    : 'No Active Plan'}
                </p>
                {subscription && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((subscription.swaps_used || 0) / (subscription.plan_details?.swap_limit_per_month || 1)) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {(subscription.plan_details?.swap_limit_per_month || 0) - (subscription.swaps_used || 0)} left
                    </span>
                  </div>
                )}
              </div>

              {/* Action button */}
              <button
                onClick={() => router.push(subscription ? routes.MY_PLAN : routes.PRICING)}
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
              >
                {subscription ? 'Manage →' : 'Get Plan →'}
              </button>
            </div>
          </div>
        )}

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
              <MapPreview />
            ) : null}
          </div>
        )}

        {/* Stations Section - Redesigned */}
        <div id="stations-section" className="pt-6 border-t border-gray-200">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nearby Stations</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {nearbyStationsCount > 0
                  ? `${nearbyStationsCount} stations found near you`
                  : 'No stations found nearby'}
              </p>
            </div>
            {nearbyStationsCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Live</span>
              </span>
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
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="w-16 h-8 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
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
          ) : null}

          {!loadingList && nearbyStationsCount === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <EnvironmentOutlined className="text-gray-400 text-2xl" />
              </div>
              <p className="text-sm font-semibold text-gray-900">No stations nearby</p>
              <p className="text-xs text-gray-400 mt-1">Try moving to a different location</p>
            </div>
          )}
        </div>
      </div>
      
      <ScanButton />
    </DashboardLayout>
  );
};

export default Home;
