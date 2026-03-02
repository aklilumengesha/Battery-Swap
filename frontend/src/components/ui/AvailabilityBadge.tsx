import React from 'react';
import styles from './AvailabilityBadge.module.css';

interface AvailabilityBadgeProps {
  availableCount: number;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ availableCount }) => {
  const isAvailable = availableCount > 0;

  return (
    <span
      className={`${styles.badge} ${isAvailable ? styles.available : styles.unavailable}`}
      aria-label={`${availableCount} batteries available`}
    >
      {availableCount}
    </span>
  );
};
