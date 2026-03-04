import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { routes } from "../../routes";
import {
  EnvironmentOutlined,
  ThunderboltFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';

interface StationCardProps {
  station: any;
  time?: any;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevAvailableRef = useRef<number | undefined>(undefined);
  const availableCount = station?.available_batteries ?? station?.batteries?.length ?? 0;

  useEffect(() => {
    if (prevAvailableRef.current !== undefined && prevAvailableRef.current !== availableCount) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 600);
      return () => clearTimeout(timer);
    }
    prevAvailableRef.current = availableCount;
  }, [availableCount]);

  const isAvailable = availableCount > 0;

  return (
    <div 
      className={`bg-white rounded-2xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98] ${
        isHighlighted 
          ? 'border-green-300 bg-green-50/30 shadow-green-100' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Station icon with availability indicator */}
        <div className="relative flex-shrink-0">
          <div 
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              isHighlighted
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-gray-900 to-gray-700'
            }`}
          >
            <ThunderboltFilled className="text-white text-base" />
          </div>
          {/* Live availability dot */}
          <span 
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              isAvailable ? 'bg-green-400' : 'bg-gray-300'
            }`}
          >
            {isAvailable && (
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
            )}
          </span>
        </div>

        {/* Station info */}
        <div className="flex-1 min-w-0">
          <Link href={routes.STATION(station?.pk)}>
            <p className="text-sm font-bold text-gray-900 truncate hover:text-gray-600 transition-colors">
              {station?.name}
            </p>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <EnvironmentOutlined className="text-xs" />
              {station?.distance_msg} away
            </span>
            <span className="text-gray-200">•</span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <ClockCircleOutlined className="text-xs" />
              {station?.time_msg}
            </span>
          </div>
        </div>

        {/* Right side: battery count + map */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Battery count badge */}
          <div 
            className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
              isAvailable
                ? 'bg-green-50 text-green-600 border border-green-100'
                : 'bg-gray-50 text-gray-400 border border-gray-100'
            }`}
          >
            {availableCount} 🔋
          </div>

          {/* Map link */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://maps.google.com/?q=${station?.latitude},${station?.longitude}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <EnvironmentOutlined className="text-xs" />
            Map
          </a>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
