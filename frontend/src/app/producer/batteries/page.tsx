'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import { useAllBatteries } from '@/features/producer/hooks/useProducerQuery';
import {
  ThunderboltFilled,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';

export default function ProducerBatteriesPage() {
  const { data: batteries = [], isLoading } = useAllBatteries();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = batteries.filter(
    (b: any) =>
      !search ||
      b.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProducerRoute>
      <DashboardLayout title="Batteries">
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Battery Inventory
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {batteries.length} batteries total
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <PlusOutlined />
              Add Battery
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by brand or vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Batteries Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                {search ? 'No batteries match search' : 'No batteries yet'}
              </p>
              {!search && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold"
                >
                  + Add First Battery
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((battery: any) => (
                <div
                  key={battery.pk}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <ThunderboltFilled className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {battery.company?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {battery.vehicle?.name}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-gray-900">
                        Rs {battery.price}
                      </p>
                      <p className="text-xs text-gray-400">Price</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-green-600">
                        Available
                      </p>
                      <p className="text-xs text-gray-400">Status</p>
                    </div>
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
