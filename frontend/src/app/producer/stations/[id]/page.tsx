'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import { useStationDetail } from '@/features/producer/hooks/useProducerQuery';
import { routes } from '@/routes';
import {
  ThunderboltFilled,
  EnvironmentOutlined,
  EditOutlined,
} from '@ant-design/icons';

export default function StationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: station, isLoading } = useStationDetail(id as string);

  if (isLoading) {
    return (
      <ProducerRoute>
        <DashboardLayout title="Station">
          <div className="w-full space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100"
              >
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        </DashboardLayout>
      </ProducerRoute>
    );
  }

  return (
    <ProducerRoute>
      <DashboardLayout title="Station Detail">
        <div className="w-full space-y-5">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Stations
          </button>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Hero Card */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <ThunderboltFilled className="text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Station</p>
                        <p className="text-white font-bold text-lg">
                          {station?.name}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Active
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                      <p className="text-2xl font-bold text-white">
                        {station?.batteries?.length || 0}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Total Batteries
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                      <p className="text-2xl font-bold text-green-400">
                        {station?.batteries?.length || 0}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Location
                  </h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Latitude</p>
                      <p className="text-sm font-bold text-gray-900">
                        {station?.latitude?.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Longitude</p>
                      <p className="text-sm font-bold text-gray-900">
                        {station?.longitude?.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${station?.latitude},${station?.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <EnvironmentOutlined />
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* Batteries Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Batteries at this Station
                  </h3>
                  <span className="text-xs text-gray-400">
                    {station?.batteries?.length || 0} total
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {!station?.batteries?.length ? (
                    <div className="px-5 py-10 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <ThunderboltFilled className="text-gray-400 text-lg" />
                      </div>
                      <p className="text-sm text-gray-400">
                        No batteries assigned
                      </p>
                    </div>
                  ) : (
                    station.batteries.map((battery: any) => (
                      <div
                        key={battery.pk}
                        className="px-5 py-4 flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <ThunderboltFilled className="text-blue-500 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {battery.company?.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {battery.vehicle?.name} · Rs {battery.price}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                          Available
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Actions
                </h3>
                <button
                  onClick={() => router.push(routes.PRODUCER_BATTERIES)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <ThunderboltFilled />
                  Manage Batteries
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                  <EditOutlined />
                  Edit Station Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
