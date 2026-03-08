'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import { useAdminProducers } from '@/features/admin/hooks/useAdminQuery';
import {
  CrownFilled,
  SearchOutlined,
  ShopOutlined,
  ThunderboltFilled,
  RiseOutlined,
} from '@ant-design/icons';

export default function AdminProducersPage() {
  const { data: producers = [], isLoading } = useAdminProducers();
  const [search, setSearch] = useState('');

  const filtered = producers.filter(
    (p: any) =>
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.company?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = producers.reduce(
    (sum: number, p: any) => sum + (p.total_revenue || 0),
    0
  );

  return (
    <AdminRoute>
      <AdminLayout title="Producers">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Producers</h1>
              <p className="text-sm text-gray-400 mt-1">
                {producers.length} registered producers
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-100">
              <p className="text-xs text-gray-400">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">Rs {totalRevenue}</p>
            </div>
          </div>

          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search producers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                >
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-16 bg-gray-100 rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <CrownFilled className="text-gray-200 text-4xl mb-3" />
              <p className="text-sm text-gray-400">No producers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p: any) => (
                <div
                  key={p.pk}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <CrownFilled className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.company}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                        p.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: 'Stations',
                        value: p.total_stations,
                        icon: <ShopOutlined />,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50',
                      },
                      {
                        label: 'Bookings',
                        value: p.total_bookings,
                        icon: <ThunderboltFilled />,
                        color: 'text-purple-500',
                        bg: 'bg-purple-50',
                      },
                      {
                        label: 'Revenue',
                        value: `Rs ${p.total_revenue}`,
                        icon: <RiseOutlined />,
                        color: 'text-green-500',
                        bg: 'bg-green-50',
                      },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} rounded-xl p-3 text-center`}>
                        <span className={`text-xs ${stat.color}`}>{stat.icon}</span>
                        <p className="text-sm font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 truncate">
                      {p.email} · Joined{' '}
                      {new Date(p.date_joined).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
