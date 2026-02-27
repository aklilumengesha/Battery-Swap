"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarLayout } from "../../../layouts";
import { useDispatch, useSelector } from "react-redux";
import { stationsActions } from "../../../redux/stations";
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

const Order = () => {
  const params = useParams();
  const { booking, station, loadingBooking, loadingStation } = useSelector(
    (state: any) => state.stations
  );
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
    if (params.id && location?.latitude && location?.longitude) {
      dispatch(
        stationsActions.handleGetBooking(
          params.id,
          location.latitude,
          location.longitude
        ) as any
      );
    }
  }, [params.id, location?.latitude, location?.longitude, dispatch]);

  return (
    <BarLayout location={location}>
      {loadingBooking || loadingStation ? (
        <div className="text-center py-8">
          <Spin tip="Loading order details..." />
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <TableCell label="Station" value={station?.name || "N/A"} />
            <TableCell label="Battery Company" value={booking?.battery?.company?.name || "N/A"} />
            <TableCell label="Vehicle" value={booking?.battery?.vehicle?.name || "N/A"} />
            <TableCell label="Price" value={`Rs ${booking?.battery?.price || 0}`} />
            <TableCell
              label="Booked Time"
              value={
                booking?.booked_time
                  ? new Date(booking.booked_time).toLocaleString()
                  : "N/A"
              }
            />
            <TableCell
              label="Expiry Time"
              value={
                booking?.expiry_time
                  ? new Date(booking.expiry_time).toLocaleString()
                  : "N/A"
              }
            />
            <TableCell
              label="Payment Status"
              value={booking?.is_paid ? "Paid" : "Pending"}
            />
            <TableCell
              label="Collection Status"
              value={booking?.is_collected ? "Collected" : "Not Collected"}
            />
          </div>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://maps.google.com/?q=${station?.latitude},${station?.longitude}`}
            className="flex items-center justify-center mt-4 text-themeColor"
          >
            <FeatherIcon size={18} icon="map-pin" className="mr-2" />
            Navigate to Station
          </a>
        </div>
      )}
    </BarLayout>
  );
};

export default Order;
