'use client';

import { useParams } from 'next/navigation';
import ProducerRoute from '@/components/layout/ProducerRoute';

export default function StationDetail() {
  const params = useParams();
  const stationId = params?.id;

  return (
    <ProducerRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Station Details</h1>
        <p className="text-gray-600 mt-2">Station ID: {stationId}</p>
      </div>
    </ProducerRoute>
  );
}
