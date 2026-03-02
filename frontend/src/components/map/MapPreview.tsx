"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { EyeOutlined } from "@ant-design/icons";

/**
 * MapPreview Component
 * 
 * Small preview map showing user location and nearby stations.
 * Designed for preview mode with minimal interactions.
 * 
 * Props:
 * - stations: Array of station objects with latitude/longitude
 * - userLocation: { latitude: number, longitude: number }
 * - onViewFullMap: Optional callback for "View Full Map" button
 * - className: Optional custom classes
 */

interface Station {
  pk?: string | number;
  id?: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface MapPreviewProps {
  stations: Station[];
  userLocation: UserLocation;
  onViewFullMap?: () => void;
  className?: string;
}

// Station marker icon (blue)
const stationIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// User location marker icon (red)
const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPreview: React.FC<MapPreviewProps> = ({
  stations,
  userLocation,
  onViewFullMap,
  className = "",
}) => {
  // Calculate center point (user location)
  const center: [number, number] = [userLocation.latitude, userLocation.longitude];

  return (
    <div className={`relative ${className}`}>
      {/* Map Container with modern card styling */}
      <div className="relative h-[220px] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          doubleClickZoom={false}
          touchZoom={false}
          className="h-full w-full"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          <Marker position={center} icon={userIcon}>
            <Popup>
              <div className="p-1">
                <p className="text-xs font-semibold">Your Location</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Station Markers */}
          {stations.map((station) => {
            const stationId = station.pk || station.id || Math.random();
            return (
              <Marker
                key={stationId}
                position={[station.latitude, station.longitude]}
                icon={stationIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">{station.name}</h3>
                    {station.address && (
                      <p className="text-xs text-gray-600">{station.address}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Overlay Badge - "View Full Map" */}
        {onViewFullMap && (
          <div className="absolute top-3 right-3 z-[1000]">
            <button
              onClick={onViewFullMap}
              className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
            >
              <EyeOutlined className="text-sm group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">View Full Map</span>
            </button>
          </div>
        )}

        {/* Station Count Badge */}
        <div className="absolute bottom-3 left-3 z-[1000]">
          <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
            <span className="text-xs font-semibold text-white">
              {stations.length} {stations.length === 1 ? "Station" : "Stations"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
