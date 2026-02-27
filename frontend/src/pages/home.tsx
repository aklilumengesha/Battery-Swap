import React, { useEffect } from "react";
import { BatteryCard } from "../components";
import { BarLayout } from "../layouts";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { stationsActions } from "../redux/stations";
import ScanButton from "../components/ScanButton";

const Home = ({ location }) => {
  const { stationList, loadingList } = useSelector((state) => state.stations);
  const dispatch = useDispatch();
  useEffect(() => {
    // Only fetch stations if location has coordinates
    if (location?.latitude && location?.longitude) {
      dispatch(
        stationsActions.handleListStations(location.latitude, location.longitude)
      );
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
        stationList.map((station, i) => (
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
