"use client";

import React from "react";
import dynamic from "next/dynamic";

/**
 * MapWrapper Component
 * 
 * Wrapper component that handles dynamic import of Leaflet map
 * to avoid SSR issues in Next.js. Leaflet requires window object
 * which is not available during server-side rendering.
 * 
 * Usage:
 * ```tsx
 * import MapWrapper from "@/components/map/MapWrapper";
 * 
 * <MapWrapper>
 *   <YourMapComponent />
 * </MapWrapper>
 * ```
 */

interface MapWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ children, fallback }) => {
  return (
    <div className="map-wrapper">
      {children}
    </div>
  );
};

// Export with dynamic import to prevent SSR
export default dynamic(() => Promise.resolve(MapWrapper), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});
