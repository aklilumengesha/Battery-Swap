"use client";

import React from 'react';
import styles from './AvailabilityBadge.module.css';

interface AvailabilityBadgeProps {
  availableCount: number;
}

const AvailabilityBadge = ({ availableCount }: AvailabilityBadgeProps) => {
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

export default AvailabilityBadge;
