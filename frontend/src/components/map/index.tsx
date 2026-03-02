'use client';

import dynamic from 'next/dynamic';
import React from 'react';

export const MapPreview = dynamic(() => import('./MapPreview'), {
  ssr: false,
  loading: () => (
    <div style={{height: '300px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px'}}>
      Loading map...
    </div>
  )
});

export const StationMap = dynamic(() => import('./StationMap'), {
  ssr: false
});
