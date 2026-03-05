'use client';

import ProducerRoute from '@/components/layout/ProducerRoute';

export default function ProducerBookings() {
  return (
    <ProducerRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">View bookings at your stations</p>
      </div>
    </ProducerRoute>
  );
}
