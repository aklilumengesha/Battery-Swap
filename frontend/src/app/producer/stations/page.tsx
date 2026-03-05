'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import { useMyStations } from '@/features/producer/hooks/useProducerQuery';
import { routes } from '@/routes';
import {
  ThunderboltFilled,
  EnvironmentOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';

export default function ProducerStationsPage() {
  const router = useRouter();
  const { data: stations = [], isLoading } = useMyStations();
  const [search, setSearch] = useState('');

  const filtered = stations.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProducerRoute>
      <DashboardLayout title="My Stations">
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Stations</h1>
              <p className="text-sm text-gray-400 mt-1">
                {stations.length} stations total
              </p>
            </div>
            <button
              onClick={() => router.push(routes.PRODUCER_STATION_CREATE)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <PlusOutlined />
              Add Station
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search stations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Stations Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                >
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <ThunderboltFilled className="text-gray-400 text-xl" />
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {search ? 'No stations match search' : 'No stations yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-4">
                {search
                  ? 'Try a different search term'
                  : 'Add your first battery swap station'}
              </p>
              {!search && (
                <button
                  onClick={() => router.push(routes.PRODUCER_STATION_CREATE)}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold"
                >
                  + Add First Station
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((station: any) => (
                <div
                  key={station.pk}
                  onClick={() =>
                    router.push(routes.PRODUCER_STATION_DETAIL(station.pk))
                  }
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-[0.98]"
                >
                  {/* Station icon + name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                        <ThunderboltFilled className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
                          {station.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-xs text-green-600">Active</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-300 text-lg">›</span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {station.total_batteries}
                      </p>
                      <p className="text-xs text-gray-400">Batteries</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-green-600">
                        {station.available_batteries}
                      </p>
                      <p className="text-xs text-gray-400">Available</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                    <EnvironmentOutlined className="text-gray-400 text-xs" />
                    <p className="text-xs text-gray-400 truncate">
                      {station.latitude?.toFixed(4)},{' '}
                      {station.longitude?.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
