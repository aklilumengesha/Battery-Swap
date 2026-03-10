'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import { useAdminBookingsPaginated } from '@/features/admin/hooks/useAdminQuery';
import {
  ThunderboltFilled,
  SearchOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const { data, isLoading, isFetching } = useAdminBookingsPaginated(page, 20);

  const bookings = data?.bookings || [];
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

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

  const paidOnPage = bookings.filter((b: any) => b.is_paid).length;
  const revenueOnPage = bookings
    .filter((b: any) => b.is_paid)
    .reduce((sum: number, b: any) => sum + (b.price || 0), 0);

  return (
    <AdminRoute>
      <AdminLayout title="Bookings">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
              <p className="text-sm text-gray-400 mt-1">
                {total} total bookings platform-wide
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <p className="text-xs text-gray-400">Page Revenue</p>
                <p className="text-xl font-bold text-green-600">Rs {revenueOnPage}</p>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-gray-400">Paid on Page</p>
                <p className="text-xl font-bold text-blue-600">{paidOnPage}</p>
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="space-y-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by station, producer or vehicle..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                {['All', 'Paid', 'Unpaid', 'Collected', 'Pending'].map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setPage(1);
                    }}
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

              {isFetching && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="px-6 py-4 flex items-center gap-4 animate-pulse"
                  >
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
                <p className="text-sm font-semibold text-gray-900">
                  No bookings found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
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
                      <span className="text-xs text-gray-400 hidden sm:block">
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
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0 min-w-[65px] text-right">
                      Rs {b.price}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            {!isLoading && total > 0 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Page {page} of {totalPages} · {total} total bookings
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isFetching}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <LeftOutlined />
                    Prev
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          disabled={isFetching}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all disabled:cursor-not-allowed ${
                            page === pageNum
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isFetching}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <RightOutlined />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
