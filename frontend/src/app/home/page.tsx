"use client";

import React, { useEffect, useState } from "react";
import { BatteryCard } from "../../components";
import BarLayout from "../../components/layout/BarLayout";
import { Spin } from "antd";
import { useStations } from "../../features/stations";
import ScanButton from "../../components/shared/ScanButton";
import { getLocation } from "../../utils/location";

const Home = () => {
  const { stationList, loadingList, listStations } = useStations();
  const [location, setLocation] = useState<any>({ name: "loading..." });

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if ("geolocation" in navigator) {
      getLocation((data: any) => setLocation(data));
    }
  }, []);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      listStations(location.latitude, location.longitude);
    }
  }, [location?.latitude, location?.longitude]);

  return (
    <BarLayout location={location}>
      {!location?.latitude || !location?.longitude ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="Getting your location..." />
        </div>
      ) : loadingList ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="Loading stations..." />
        </div>
      ) : stationList && stationList.length > 0 ? (
        stationList.map((station: any, i: number) => (
          <BatteryCard station={station} key={i} />
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No stations found nearby
        </div>
      )}
      <ScanButton />
    </BarLayout>
  );
};

export default Home;
