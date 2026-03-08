'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import {
  useAdminStats,
  useAdminBookings,
} from '@/features/admin/hooks/useAdminQuery';
import {
  UserOutlined,
  CrownFilled,
  ShopOutlined,
  ThunderboltFilled,
  RiseOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: bookings = [], isLoading: loadingBookings } = useAdminBookings();

  const recentBookings = bookings.slice(0, 8);

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.total_users ?? '—',
      sub: `${stats?.total_consumers ?? 0} consumers`,
      icon: <UserOutlined />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      border: 'border-blue-100',
    },
    {
      label: 'Producers',
      value: stats?.total_producers ?? '—',
      sub: 'registered producers',
      icon: <CrownFilled />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      border: 'border-purple-100',
    },
    {
      label: 'Stations',
      value: stats?.total_stations ?? '—',
      sub: `${stats?.total_batteries ?? 0} batteries`,
      icon: <ShopOutlined />,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      border: 'border-green-100',
    },
    {
      label: 'Total Revenue',
      value: `Rs ${stats?.total_revenue ?? 0}`,
      sub: `${stats?.paid_orders ?? 0} paid orders`,
      icon: <RiseOutlined />,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
      border: 'border-orange-100',
    },
  ];

  return (
    <AdminRoute>
      <AdminLayout title="Dashboard">
        <div className="w-full space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Live platform overview</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">Live</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all duration-200 ${card.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                    <span className={`text-sm ${card.iconColor}`}>{card.icon}</span>
                  </div>
                </div>
                {loadingStats ? (
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Total Bookings',
                value: stats?.total_orders ?? '—',
                icon: <ThunderboltFilled />,
                bg: 'bg-gray-900',
                text: 'text-white',
              },
              {
                label: 'Paid Bookings',
                value: stats?.paid_orders ?? '—',
                icon: <CheckCircleFilled />,
                bg: 'bg-green-500',
                text: 'text-white',
              },
              {
                label: 'Pending Payment',
                value: (stats?.total_orders ?? 0) - (stats?.paid_orders ?? 0),
                icon: <ClockCircleOutlined />,
                bg: 'bg-orange-500',
                text: 'text-white',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bg}`}
                >
                  <span className={`text-lg ${item.text}`}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  {loadingStats ? (
                    <div className="h-7 w-20 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3>
                <p className="text-xs text-gray-400 mt-0.5">Latest 8 across all stations</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                {bookings.length} total
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {loadingBookings ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  </div>
                ))
              ) : recentBookings.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <ThunderboltFilled className="text-gray-200 text-4xl mb-3" />
                  <p className="text-sm text-gray-400">No bookings yet</p>
                </div>
              ) : (
                recentBookings.map((b: any) => (
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
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.is_paid
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {b.is_paid ? '✓ Paid' : '⏳ Unpaid'}
                      </span>
                      <p className="text-sm font-bold text-gray-900 min-w-[60px] text-right">
                        Rs {b.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
