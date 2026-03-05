'use client';

import ProducerRoute from '@/components/layout/ProducerRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProducerStations() {
  return (
    <ProducerRoute>
      <DashboardLayout title="My Stations">
        <div className="w-full">
          <p>Coming soon</p>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
