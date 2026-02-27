"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BarLayout from "../../../components/layout/BarLayout";
import { useStations } from "../../../features/stations";
import { Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { getLocation } from "../../../utils/location";

const TableCell = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between py-2 border-b">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

const CompanyCell = ({ battery, isSelected, onClick = () => {} }: any) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-themeColor text-white"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      <p className="font-semibold">{battery?.company?.name}</p>
      <p className="text-sm">Rs {battery?.price}</p>
    </div>
  );
};

const Station = () => {
  const params = useParams();
  const { station, loadingStation, bookingStation, getStation, bookBattery } = useStations();
  const [selectedBattery, setSelectedBattery] = useState<any>(null);
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
    if (params?.id && location?.latitude && location?.longitude) {
      getStation(params.id as string, location.latitude, location.longitude);
    }
  }, [params?.id, location?.latitude, location?.longitude]);

  const handleBookBattery = () => {
    if (selectedBattery && params?.id) {
      bookBattery({
        station: params.id as string,
        battery: selectedBattery.pk,
      });
    }
  };

  return (
    <BarLayout location={location}>
      {loadingStation ? (
        <div className="text-center py-8">
          <Spin tip="Loading station..." />
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{station?.name}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <TableCell label="Distance" value={station?.distance_msg || "N/A"} />
            <TableCell label="Time" value={station?.time_msg || "N/A"} />
            <TableCell
              label="Available Batteries"
              value={station?.batteries?.length?.toString() || "0"}
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Select Battery</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {station?.batteries?.map((battery: any, i: number) => (
              <CompanyCell
                key={i}
                battery={battery}
                isSelected={selectedBattery?.pk === battery.pk}
                onClick={() => setSelectedBattery(battery)}
              />
            ))}
          </div>

          <button
            onClick={handleBookBattery}
            disabled={!selectedBattery || bookingStation}
            className="w-full bg-themeColor text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingStation ? "Booking..." : "Book Battery"}
          </button>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://maps.google.com/?q=${station?.latitude},${station?.longitude}`}
            className="flex items-center justify-center mt-4 text-themeColor"
          >
            <FeatherIcon size={18} icon="map-pin" className="mr-2" />
            View in Google Maps
          </a>
        </div>
      )}
    </BarLayout>
  );
};

export default Station;
