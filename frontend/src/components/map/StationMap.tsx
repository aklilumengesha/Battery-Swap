"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

/**
 * StationMap Component
 * 
 * Example map component showing how to use Leaflet with react-leaflet.
 * This component should be wrapped with MapWrapper to avoid SSR issues.
 * 
 * Props:
 * - center: [latitude, longitude] - Map center coordinates
 * - zoom: number - Initial zoom level (default: 13)
 * - stations: Array of station objects with lat, lng, and name
 * 
 * Usage:
 * ```tsx
 * import MapWrapper from "@/components/map/MapWrapper";
 * import StationMap from "@/components/map/StationMap";
 * 
 * <MapWrapper>
 *   <StationMap 
 *     center={[latitude, longitude]} 
 *     stations={stationList}
 *   />
 * </MapWrapper>
 * ```
 */

interface Station {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface StationMapProps {
  center: [number, number];
  zoom?: number;
  stations?: Station[];
  className?: string;
}

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const StationMap: React.FC<StationMapProps> = ({
  center,
  zoom = 13,
  stations = [],
  className = "h-64 w-full rounded-xl overflow-hidden shadow-lg",
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={icon}
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
      ))}
    </MapContainer>
  );
};

export default StationMap;
