"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuthQuery } from "../../features/auth";
import { useBookings } from "../../features/stations";
import { routes } from "../../routes";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  LogoutOutlined,
  ShopOutlined,
  CrownFilled,
  ClockCircleOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";

const Profile = () => {
  const router = useRouter();
  const { user, signout, updateProfile } = useAuthQuery();
  const { data: bookings = [] } = useBookings();
  
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate stats
  const totalSwaps = bookings.filter((b: any) => b.is_collected).length;
  const activeBooking = bookings.find((b: any) => !b.is_collected);

  useEffect(() => {
    if (user?.name && !isEditing) {
      setNameValue(user.name);
    }
    if (user?.phone && !isEditing) {
      setPhoneValue(user.phone || '');
    }
  }, [user?.name, user?.phone, isEditing]);

  const handleSave = async () => {
    setIsUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateProfile({
        name: nameValue,
        phone: phoneValue,
      });
      setSuccessMsg('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message ||
                          err?.message ||
                          'Update failed. Please try again.';
      setErrorMsg(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="w-full">
        {/* TWO COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN — Profile card 1/3 width */}
          <div className="space-y-5">
            {/* Profile Hero Card */}
            <div className="relative bg-gradient-to-br
              from-gray-900 via-gray-800 to-gray-900
              rounded-3xl p-6 text-white overflow-hidden">
              {/* Glow effects */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl
                    bg-white/10 border border-white/20
                    flex items-center justify-center
                    text-3xl font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {/* Online dot */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-gray-900">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-white mb-1">
                  {user?.name || 'User'}
                </h2>

                {/* Email */}
                <p className="text-gray-400 text-sm mb-3 truncate max-w-full px-2">
                  {user?.email}
                </p>

                {/* Account type badge */}
                <span className="px-3 py-1.5 rounded-full
                  text-xs font-semibold
                  bg-white/10 border border-white/20 text-white capitalize">
                  {user?.user_type || 'Consumer'}
                </span>

                {/* Stats row */}
                <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {totalSwaps || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Total Swaps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {activeBooking ? '1' : '0'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Active Booking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm p-5">
              <button
                onClick={signout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  border border-red-200 text-red-500 text-sm font-medium
                  hover:bg-red-50 transition-colors"
              >
                <LogoutOutlined />
                Sign Out
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN — Account info 2/3 width */}
          <div className="lg:col-span-2 space-y-5">
            {/* Account Information Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Account Information</h3>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setErrorMsg('');
                    setSuccessMsg('');
                    if (isEditing) {
                      setNameValue(user?.name || '');
                      setPhoneValue(user?.phone || '');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isEditing
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-900 text-white'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Form fields - 2 column grid inside */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold
                    text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      value={nameValue}
                      onChange={e => setNameValue(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl
                        border border-gray-200 text-sm
                        text-gray-900 bg-gray-50
                        focus:outline-none focus:border-gray-400
                        transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || '—'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold
                    text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 flex-1 truncate">
                      {user?.email || '—'}
                    </p>
                    <span className="text-xs text-green-600
                      bg-green-50 px-2 py-0.5 rounded-full
                      font-medium flex-shrink-0">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold
                    text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      value={phoneValue}
                      onChange={e => setPhoneValue(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 rounded-xl
                        border border-gray-200 text-sm
                        text-gray-900 bg-gray-50
                        focus:outline-none focus:border-gray-400
                        transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.phone || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Account Type field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold
                    text-gray-500 uppercase tracking-wider">
                    Account Type
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {user?.user_type || 'Consumer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save button - only when editing */}
              {isEditing && (
                <div className="px-6 pb-6">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="w-full py-3.5 rounded-xl
                      bg-gray-900 text-white text-sm font-semibold
                      hover:bg-gray-800
                      disabled:opacity-50
                      transition-colors"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Success/Error messages */}
            {successMsg && (
              <div className="px-4 py-3 rounded-xl
                bg-green-50 border border-green-100
                text-sm text-green-600">
                ✓ {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="px-4 py-3 rounded-xl
                bg-red-50 border border-red-100
                text-sm text-red-600">
                ✗ {errorMsg}
              </div>
            )}

            {/* Producer Quick Links - only for producers */}
            {user?.user_type === 'producer' && (
              <div className="bg-white rounded-2xl border
                border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">Producer Tools</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(routes.PRODUCER_DASHBOARD)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl
                      bg-gray-50 border border-gray-100
                      hover:bg-gray-100 transition-colors
                      cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
                      <ShopOutlined className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Dashboard</p>
                  </button>

                  <button
                    onClick={() => router.push(routes.PRODUCER_STATIONS)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl
                      bg-gray-50 border border-gray-100
                      hover:bg-gray-100 transition-colors
                      cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                      <ThunderboltFilled className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Stations</p>
                  </button>

                  <button
                    onClick={() => router.push(routes.PRODUCER_BOOKINGS)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl
                      bg-gray-50 border border-gray-100
                      hover:bg-gray-100 transition-colors
                      cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500 flex items-center justify-center">
                      <ClockCircleOutlined className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Bookings</p>
                  </button>

                  <button
                    onClick={() => router.push(routes.PRODUCER_COMPANY)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl
                      bg-gray-50 border border-gray-100
                      hover:bg-gray-100 transition-colors
                      cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
                      <CrownFilled className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">My Company</p>
                  </button>
                </div>
              </div>
            )}

            {/* Security Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Security</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-xs text-gray-400 mt-0.5">Last updated recently</p>
                  </div>
                  <button className="text-xs text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-600
                    transition-colors">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two Factor Auth</p>
                    <p className="text-xs text-gray-400 mt-0.5">Not enabled</p>
                  </div>
                  <button className="text-xs text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-600
                    transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
