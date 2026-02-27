"use client";

import React, { useEffect, useState } from "react";
import { BatteryCard, StationSkeletonList } from "../../components";
import BarLayout from "../../components/layout/BarLayout";
import { useNearbyStations } from "../../features/stations";
import ScanButton from "../../components/shared/ScanButton";
import { getLocation } from "../../utils/location";

const Home = () => {
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number; name: string }>({ 
    name: "loading..." 
  });

  // Fetch stations using React Query
  const { data: stationList, isLoading: loadingList } = useNearbyStations(
    location?.latitude,
    location?.longitude
  );

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if ("geolocation" in navigator) {
      getLocation((data: any) => setLocation(data));
    }
  }, []);

  return (
    <BarLayout location={location}>
      {!location?.latitude || !location?.longitude ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Getting your location...</p>
        </div>
      ) : loadingList ? (
        <StationSkeletonList count={5} />
      ) : stationList && stationList.length > 0 ? (
        stationList.map((station: any, i: number) => (
          <BatteryCard station={station} key={station.pk || i} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-600">
          No stations found nearby
        </div>
      )}
      <ScanButton />
    </BarLayout>
  );
};

export default Home;
