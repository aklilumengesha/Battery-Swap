import React, { useEffect, useRef, useState } from "react";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import { routes } from "../../routes";
import { AvailabilityBadge } from "../ui/AvailabilityBadge";
import styles from "./StationCard.module.css";

interface StationCardProps {
  station: any;
  time?: any;
}

/**
 * StationCard Component
 * Displays station information with distance and map link
 */
const StationCard: React.FC<StationCardProps> = ({ station, time }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevAvailableRef = useRef<number | undefined>(undefined);
  const availableCount = station?.available_batteries ?? station?.batteries?.length ?? 0;

  useEffect(() => {
    // Trigger highlight flash when availability changes
    if (prevAvailableRef.current !== undefined && prevAvailableRef.current !== availableCount) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 600);
      return () => clearTimeout(timer);
    }
    prevAvailableRef.current = availableCount;
  }, [availableCount]);

  return (
    <div className={`${styles.card} ${isHighlighted ? styles.highlighted : ''}`}>
      <div className={styles.badgeContainer}>
        <AvailabilityBadge availableCount={availableCount} />
      </div>
      
      <Link href={routes.STATION(station?.pk)}>
        <h3 className="font-semibold">{station?.name}</h3>
      </Link>
      <div className="flex justify-between font-light text-sm">
        <time className="text-gray-500">
          <span className="text-themeColor">{station?.distance_msg}</span> away
          &nbsp; • &nbsp;
          <span className="text-gray-400">{station?.time_msg}</span>
        </time>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://maps.google.com/?q=${station?.latitude},${station?.longitude}`}
          className="flex items-center justify-center"
        >
          <FeatherIcon size={18} icon="map-pin" className="mr-2" />
          View in map
        </a>
      </div>
    </div>
  );
};

export default StationCard;
