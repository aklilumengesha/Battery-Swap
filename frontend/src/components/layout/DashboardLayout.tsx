"use client";

import React from "react";
import { UserOutlined } from "@ant-design/icons";
import Appbar from "./Appbar";
import { useAuthQuery } from "../../features/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    name: string;
  };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Dashboard",
  location 
}) => {
  const { user } = useAuthQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Page Title */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                {location?.name && location.name !== "loading..." && (
                  <p className="text-xs text-gray-500">{location.name}</p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-sm">
                {user?.name ? (
                  <span className="text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserOutlined className="text-base" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <Appbar />
    </div>
  );
};

export default DashboardLayout;
