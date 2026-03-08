'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminRoute from '@/components/layout/AdminRoute';
import {
  useAdminUsers,
  useToggleUser,
} from '@/features/admin/hooks/useAdminQuery';
import {
  UserOutlined,
  SearchOutlined,
  CheckCircleFilled,
  StopOutlined,
  CrownFilled,
} from '@ant-design/icons';

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAdminUsers();
  const toggleUser = useToggleUser();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [togglingPk, setTogglingPk] = useState<number | null>(null);

  const filtered = users.filter((u: any) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'All' ||
      (filter === 'Producers' && u.user_type === 'producer') ||
      (filter === 'Consumers' && u.user_type === 'consumer') ||
      (filter === 'Active' && u.is_active) ||
      (filter === 'Inactive' && !u.is_active);

    return matchSearch && matchFilter;
  });

  const handleToggle = async (pk: number) => {
    setTogglingPk(pk);
    await toggleUser.mutateAsync(pk);
    setTogglingPk(null);
  };

  return (
    <AdminRoute>
      <AdminLayout title="Users">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
              <p className="text-sm text-gray-400 mt-1">{users.length} registered users</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-gray-400">Consumers</p>
                <p className="text-lg font-bold text-blue-600">
                  {users.filter((u: any) => u.user_type === 'consumer').length}
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-100">
                <p className="text-xs text-gray-400">Producers</p>
                <p className="text-lg font-bold text-purple-600">
                  {users.filter((u: any) => u.user_type === 'producer').length}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['All', 'Producers', 'Consumers', 'Active', 'Inactive'].map(f => (
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
                Showing {filtered.length} of {users.length} users
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
                      <div className="h-3.5 bg-gray-100 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                    <div className="h-8 w-24 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <UserOutlined className="text-gray-400 text-xl" />
                </div>
                <p className="text-sm font-semibold text-gray-900">No users found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((u: any) => (
                  <div
                    key={u.pk}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        u.user_type === 'producer' ? 'bg-purple-50' : 'bg-blue-50'
                      }`}
                    >
                      {u.user_type === 'producer' ? (
                        <CrownFilled className="text-purple-500 text-sm" />
                      ) : (
                        <UserOutlined className="text-blue-500 text-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {u.email} · Joined{' '}
                        {new Date(u.date_joined).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        u.user_type === 'producer'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {u.user_type}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        u.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleToggle(u.pk)}
                      disabled={togglingPk === u.pk}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex-shrink-0 disabled:opacity-50 ${
                        u.is_active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {togglingPk === u.pk ? (
                        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : u.is_active ? (
                        <>
                          <StopOutlined />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircleFilled />
                          Activate
                        </>
                      )}
                    </button>
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
