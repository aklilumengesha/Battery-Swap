'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import { useAdminBookings } from '@/features/admin/hooks/useAdminQuery';
import {
  ThunderboltFilled,
  SearchOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useAdminBookings();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = bookings.filter((b: any) => {
    const matchSearch =
      !search ||
      b.station_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.producer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'All' ||
      (filter === 'Paid' && b.is_paid) ||
      (filter === 'Unpaid' && !b.is_paid) ||
      (filter === 'Collected' && b.is_collected) ||
      (filter === 'Pending' && !b.is_collected);

    return matchSearch && matchFilter;
  });

  const totalRevenue = bookings
    .filter((b: any) => b.is_paid)
    .reduce((sum: number, b: any) => sum + (b.price || 0), 0);

  return (
    <AdminRoute>
      <AdminLayout title="Bookings">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
              <p className="text-sm text-gray-400 mt-1">
                {bookings.length} total platform-wide
              </p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-100">
                <p className="text-xs text-gray-400">Paid Revenue</p>
                <p className="text-lg font-bold text-green-600">Rs {totalRevenue}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-100">
                <p className="text-xs text-gray-400">Unpaid</p>
                <p className="text-lg font-bold text-yellow-600">
                  {bookings.filter((b: any) => !b.is_paid).length}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by station, producer or vehicle..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['All', 'Paid', 'Unpaid', 'Collected', 'Pending'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filter === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {(search || filter !== 'All') && (
              <p className="text-xs text-gray-400">
                Showing {filtered.length} of {bookings.length} bookings
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                    <div className="h-5 w-16 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <ThunderboltFilled className="text-gray-200 text-4xl mb-3" />
                <p className="text-sm text-gray-400">No bookings found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((b: any) => (
                  <div
                    key={b.pk}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <ThunderboltFilled className="text-white text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {b.station_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {b.producer_name} · {b.vehicle} ·{' '}
                        {new Date(b.booked_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {b.is_collected ? (
                        <CheckCircleFilled className="text-blue-500 text-sm" />
                      ) : (
                        <ClockCircleOutlined className="text-gray-400 text-sm" />
                      )}
                      <span className="text-xs text-gray-400">
                        {b.is_collected ? 'Collected' : 'Pending'}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        b.is_paid
                          ? 'bg-green-50 text-green-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {b.is_paid ? '✓ Paid' : '⏳ Unpaid'}
                    </span>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0 min-w-[60px] text-right">
                      Rs {b.price}
                    </p>
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
