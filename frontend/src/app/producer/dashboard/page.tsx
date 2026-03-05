'use client';

import ProducerRoute from '@/components/layout/ProducerRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProducerDashboard() {
  return (
    <ProducerRoute>
      <DashboardLayout title="Producer Dashboard">
        <div className="w-full">
          <p>Coming soon</p>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
