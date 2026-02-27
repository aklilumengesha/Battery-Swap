import React from "react";

/**
 * StationSkeleton Component
 * Loading skeleton for station cards with shimmer effect
 */
const StationSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between p-4 mx-5 my-4 rounded-lg shadow-md min-h-[100px] animate-pulse">
      {/* Station name skeleton */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      
      {/* Distance and map link skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

/**
 * StationSkeletonList Component
 * Renders multiple station skeletons
 * 
 * @param count - Number of skeleton cards to display (default: 3)
 */
export const StationSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <StationSkeleton key={index} />
      ))}
    </>
  );
};

export default StationSkeleton;
