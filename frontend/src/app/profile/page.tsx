"use client";

import React, { useState } from "react";
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
  const { user, signout } = useAuthQuery();
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');

  const handleLogout = () => {
    signout();
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
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-gray-900" />
            </div>
            
            {/* Name and info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white truncate">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-400 text-sm mt-0.5 truncate">
                {user?.email || ''}
              </p>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10 capitalize">
                {user?.user_type || 'Consumer'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
