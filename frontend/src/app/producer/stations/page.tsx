'use client';

import ProducerRoute from '@/components/layout/ProducerRoute';

export default function ProducerStations() {
  return (
    <ProducerRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900">My Stations</h1>
        <p className="text-gray-600 mt-2">Manage your battery swap stations</p>
      </div>
    </ProducerRoute>
  );
}
