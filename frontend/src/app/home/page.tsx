"use client";

import React, { useEffect, useState } from "react";
import { BatteryCard } from "../../components";
import { BarLayout } from "../../layouts";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { stationsActions } from "../../redux/stations";
import ScanButton from "../../components/ScanButton";
import { getLocation } from "../../utils/location";

const Home = () => {
  const { stationList, loadingList } = useSelector((state: any) => state.stations);
  const dispatch = useDispatch();
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
      dispatch(
        stationsActions.handleListStations(location.latitude, location.longitude) as any
      );
    }
  }, [location?.latitude, location?.longitude, dispatch]);

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
