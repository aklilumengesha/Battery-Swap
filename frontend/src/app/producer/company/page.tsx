'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import { useAuthQuery } from '@/features/auth';
import { ProducerService } from '@/services/producer.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CrownFilled, ShopOutlined } from '@ant-design/icons';

export default function ProducerCompanyPage() {
  const { user } = useAuthQuery();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState(user?.meta_data?.company?.name || user?.company?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    const name = user?.meta_data?.company?.name || user?.company?.name;
    if (name) {
      setCompanyName(name);
      initializedRef.current = true;
    }
  }, [user]);

  const handleSave = async () => {
    if (!companyName.trim()) {
      setErrorMsg('Company name cannot be empty');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await ProducerService.updateCompany({
        company_name: companyName.trim(),
      });

      if (res.data?.success) {
        setSuccessMsg('Company name updated successfully');
        setIsEditing(false);
        
        // Directly patch the cached user in
        // sessionStorage so it persists across
        // navigation without a backend refetch
        try {
          const raw = sessionStorage.getItem('user');
          if (raw) {
            const cachedUser = JSON.parse(raw);
            // Update wherever company name lives
            if (cachedUser?.meta_data?.company) {
              cachedUser.meta_data.company.name = companyName.trim();
            }
            if (cachedUser?.company) {
              cachedUser.company.name = companyName.trim();
            }
            sessionStorage.setItem('user', JSON.stringify(cachedUser));
          }
        } catch (err) {
          // Cache patch failed silently
          // name will reset on next navigation
          // but save was still successful
        }
      } else {
        setErrorMsg(res.data?.message || 'Failed to update company');
      }
    } catch (e: any) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.response?.data?.detail ||
          e?.message ||
          'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { data: companies = [] } = useQuery({
    queryKey: ['producer', 'companies'],
    queryFn: async () => {
      const res = await ProducerService.getCompanies();
      return res.data || [];
    },
  });

  return (
    <ProducerRoute>
      <DashboardLayout title="My Company">
        <div className="w-full space-y-5">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900">My Company</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Company Hero */}
            <div className="space-y-5">
              {/* Company Card */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg">
                    <CrownFilled className="text-white text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {companyName || user?.meta_data?.company?.name || user?.company?.name || 'My Company'}
                  </h2>
                  <p className="text-gray-400 text-sm">{user?.name}</p>
                  <span className="mt-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white">
                    Producer Account
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Company Details */}
            <div className="lg:col-span-2 space-y-5">
              {/* Company Info Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Company Information
                  </h3>
                  <button
                    onClick={() => {
                      if (!isEditing) {
                        // Opening edit — clear input so
                        // placeholder shows and user types fresh
                        setCompanyName('');
                      } else {
                        // Cancelling — restore saved name
                        const saved = user?.meta_data?.company?.name || user?.company?.name || '';
                        setCompanyName(saved);
                      }
                      setIsEditing(!isEditing);
                      setSuccessMsg('');
                      setErrorMsg('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isEditing
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-900 text-white'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={user?.meta_data?.company?.name || user?.company?.name || 'Enter company name'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {companyName || user?.meta_data?.company?.name || user?.company?.name || '—'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Account Email
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email}
                      </p>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      {successMsg && (
                        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600">
                          ✓ {successMsg}
                        </div>
                      )}
                      {errorMsg && (
                        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                          ✗ {errorMsg}
                        </div>
                      )}
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
