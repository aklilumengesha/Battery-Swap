'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import { useAdminStations } from '@/features/admin/hooks/useAdminQuery';
import {
  ShopOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';

export default function AdminStationsPage() {
  const { data: stations = [], isLoading } = useAdminStations();
  const [search, setSearch] = useState('');

  const filtered = stations.filter(
    (s: any) =>
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.owner_company?.toLowerCase().includes(search.toLowerCase())
  );

  const totalBatteries = stations.reduce(
    (sum: number, s: any) => sum + (s.total_batteries || 0),
    0
  );

  return (
    <AdminRoute>
      <AdminLayout title="Stations">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Stations</h1>
              <p className="text-sm text-gray-400 mt-1">
                {stations.length} stations platform-wide
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-400">Total Batteries</p>
              <p className="text-lg font-bold text-blue-600">{totalBatteries}</p>
            </div>
          </div>

          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search stations or owners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-50 grid grid-cols-4 gap-4">
              {['Station', 'Owner', 'Location', 'Batteries'].map(h => (
                <p
                  key={h}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </p>
              ))}
            </div>

            {isLoading ? (
              <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="px-6 py-4 grid grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="h-4 bg-gray-100 rounded" />
                    ))}
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <ShopOutlined className="text-gray-200 text-4xl mb-3" />
                <p className="text-sm text-gray-400">No stations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((s: any) => (
                  <div
                    key={s.pk}
                    className="px-6 py-4 grid grid-cols-4 gap-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <ShopOutlined className="text-white text-xs" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate">{s.owner_name}</p>
                      <p className="text-xs text-gray-400 truncate">{s.owner_company}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
                      <EnvironmentOutlined className="flex-shrink-0" />
                      <span className="truncate">
                        {s.latitude?.toFixed(3)}, {s.longitude?.toFixed(3)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50">
                        <ThunderboltFilled className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold text-blue-600">
                          {s.total_batteries}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
