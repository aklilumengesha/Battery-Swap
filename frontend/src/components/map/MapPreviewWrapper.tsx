"use client";

import dynamic from "next/dynamic";
import React from "react";

/**
 * MapPreviewWrapper
 * 
 * Dynamic import wrapper for MapPreview to avoid SSR issues.
 * Use this component instead of importing MapPreview directly.
 * 
 * Usage:
 * ```tsx
 * <MapPreviewWrapper
 *   stations={stationList}
 *   userLocation={{ latitude: 28.6139, longitude: 77.2090 }}
 *   onViewFullMap={() => console.log('View full map')}
 * />
 * ```
 */

const MapPreview = dynamic(() => import("./MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-[220px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg border border-gray-200 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 font-medium">Loading map preview...</p>
      </div>
    </div>
  ),
});

export default MapPreview;
