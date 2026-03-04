"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuthQuery } from "../../features/auth";
import { Button } from "../../components";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  LogoutOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const Profile = () => {
  const { user, signout, updateProfile } = useAuthQuery();
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (user?.name && !editing) {
      setNameValue(user.name);
    }
    if (user?.phone && !editing) {
      setPhoneValue(user.phone || '');
    }
  }, [user?.name, user?.phone, editing]);

  const handleLogout = () => {
    signout();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
      await updateProfile({
        name: nameValue,
        phone: phoneValue,
        // Do NOT send vehicle - it is optional
      });
      // If we reach here, mutation succeeded
      // (errors throw and are caught below)
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      // Extract the most readable error message
      const errorMsg = err?.response?.data?.message ||
                      err?.message ||
                      'Update failed. Please try again.';
      setSaveError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Profile Header Card */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                {(nameValue || user?.name)?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-gray-900" />
            </div>
            
            {/* Name and info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white truncate">
                {nameValue || user?.name || 'User'}
              </h2>
              <p className="text-gray-400 text-sm mt-0.5 truncate">
                {user?.email || ''}
              </p>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10 capitalize">
                {user?.user_type || 'Consumer'}
              </span>
              {user?.date_joined && (
                <p className="text-xs text-gray-500 mt-3">
                  Member since {new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Account Information</h3>
            <button
              onClick={() => {
                setEditing(!editing);
                setSaveError('');
                setSaveSuccess(false);
                // Reset values when cancelling
                if (editing) {
                  setNameValue(user?.name || '');
                  setPhoneValue(user?.phone || '');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <EditOutlined />
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-50">
            {/* Name */}
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <UserOutlined className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Full Name</p>
                {editing ? (
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full text-sm font-medium text-gray-900 border-b-2 border-gray-900 outline-none pb-0.5 bg-transparent"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Email - always read only */}
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <MailOutlined className="text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Email Address</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'Not set'}</p>
                <span className="text-xs text-green-500 font-medium">✓ Verified</span>
              </div>
            </div>

            {/* Phone */}
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <PhoneOutlined className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                {editing ? (
                  <input
                    type="tel"
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    placeholder="Add phone number"
                    className="w-full text-sm font-medium text-gray-900 border-b-2 border-gray-900 outline-none pb-0.5 bg-transparent placeholder:text-gray-300"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{user?.phone || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Account Type - always read only */}
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <UserOutlined className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Account Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{user?.user_type || 'Consumer'}</p>
              </div>
            </div>
          </div>

          {/* Save button - only when editing */}
          {editing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Success message */}
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
            <span className="text-green-500">✓</span>
            <p className="text-sm text-green-700 font-medium">Profile updated successfully</p>
          </div>
        )}

        {/* Error message */}
        {saveError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
            <span className="text-red-500">✕</span>
            <p className="text-sm text-red-600 font-medium">{saveError}</p>
          </div>
        )}

        {/* Sign Out Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 group hover:bg-red-50 transition-colors duration-200"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
              <LogoutOutlined className="text-red-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-500">Sign Out</p>
              <p className="text-xs text-red-400">Sign out from your account</p>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
