'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import { useAdminSubscriptions } from '@/features/admin/hooks/useAdminQuery';
import {
  CrownFilled,
  SearchOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  UserOutlined,
} from '@ant-design/icons';

export default function AdminSubscriptionsPage() {
  const { data: subscriptions = [], isLoading } = useAdminSubscriptions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = subscriptions.filter((s: any) => {
    const matchSearch =
      !search ||
      s.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      s.plan_name?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'All' ||
      (filter === 'Active' && s.is_active) ||
      (filter === 'Inactive' && !s.is_active) ||
      filter === s.plan_name;

    return matchSearch && matchFilter;
  });

  // Get unique plan names for filter buttons
  const planNames = Array.from(
    new Set(subscriptions.map((s: any) => s.plan_name))
  ).filter(Boolean);

  const activeCount = subscriptions.filter((s: any) => s.is_active).length;
  const totalRevenue = subscriptions
    .filter((s: any) => s.is_active)
    .reduce((sum: number, s: any) => sum + (s.plan_price || 0), 0);

  const planColors: Record<string, string> = {
    Basic: 'bg-gray-50 text-gray-600 border-gray-200',
    Standard: 'bg-blue-50 text-blue-600 border-blue-200',
    Premium: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const planIconColors: Record<string, string> = {
    Basic: 'bg-gray-100',
    Standard: 'bg-blue-50',
    Premium: 'bg-gradient-to-br from-purple-500 to-indigo-600',
  };

  return (
    <AdminRoute>
      <AdminLayout title="Subscriptions">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-sm text-gray-400 mt-1">
                {subscriptions.length} total subscriptions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <p className="text-xs text-gray-400">Active Subs</p>
                <p className="text-xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-100">
                <p className="text-xs text-gray-400">Monthly Revenue</p>
                <p className="text-xl font-bold text-purple-600">Rs {totalRevenue}</p>
              </div>
            </div>
          </div>

          {/* Plan Breakdown Cards */}
          {!isLoading && planNames.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planNames.map((plan: any) => {
                const planSubs = subscriptions.filter(
                  (s: any) => s.plan_name === plan
                );
                const activePlan = planSubs.filter((s: any) => s.is_active).length;
                const planRevenue = planSubs
                  .filter((s: any) => s.is_active)
                  .reduce((sum: number, s: any) => sum + (s.plan_price || 0), 0);

                const colorClass =
                  planColors[plan] || 'bg-gray-50 text-gray-600 border-gray-200';
                const iconClass = planIconColors[plan] || 'bg-gray-100';

                return (
                  <div
                    key={plan}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
                      >
                        <CrownFilled
                          className={`text-sm ${
                            plan === 'Premium'
                              ? 'text-white'
                              : plan === 'Standard'
                              ? 'text-blue-500'
                              : 'text-gray-500'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{plan}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
                        >
                          {planSubs.length} users
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-gray-900">{activePlan}</p>
                        <p className="text-xs text-gray-400">Active</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-green-600">
                          Rs {planRevenue}
                        </p>
                        <p className="text-xs text-gray-400">Revenue</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Search + Filter */}
          <div className="space-y-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by user or plan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['All', 'Active', 'Inactive', ...planNames].map((f: any) => (
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
                Showing {filtered.length} of {subscriptions.length} subscriptions
              </p>
            )}
          </div>

          {/* Subscriptions Table */}
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
                      <div className="h-3.5 bg-gray-100 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <CrownFilled className="text-gray-400 text-xl" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  No subscriptions found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((s: any) => (
                  <div
                    key={s.pk}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <UserOutlined className="text-blue-500 text-sm" />
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {s.user_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {s.user_email} · Subscribed{' '}
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Plan badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${
                        planColors[s.plan_name] ||
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {s.plan_name}
                    </span>

                    {/* Price */}
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0 min-w-[70px] text-right">
                      Rs {s.plan_price}
                      <span className="text-xs font-normal text-gray-400">/mo</span>
                    </p>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${
                        s.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {s.is_active ? <CheckCircleFilled /> : <CloseCircleFilled />}
                      {s.is_active ? 'Active' : 'Inactive'}
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
