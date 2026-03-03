"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useAuthQuery } from "../../features/auth";
import { useMySubscription } from "../../features/subscription/hooks/useSubscriptionQuery";
import { routes } from "../../routes";

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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { data: subscription } = useMySubscription();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', route: routes.HOME, icon: HomeOutlined },
    { label: 'My Plan', route: routes.MY_PLAN, icon: CreditCardOutlined },
    { label: 'History', route: routes.HISTORY, icon: ClockCircleOutlined },
    { label: 'Profile', route: routes.PROFILE, icon: UserOutlined },
  ];

  const currentPage = navItems.find(item => pathname === item.route)?.label || title;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Fixed Top Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 shadow-md border-b border-gray-200' 
          : 'bg-white/80 shadow-sm border-b border-gray-100'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT: Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm">
                <ThunderboltFilled className="text-white text-sm" />
              </div>
              <span className="hidden xs:block font-bold text-lg text-gray-900 tracking-tight">
                BatterySwap
              </span>
            </div>

            {/* CENTER: Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.route;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {/* My Plan active subscription dot */}
                    {item.label === 'My Plan' && (
                      <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${
                        subscription?.is_active ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                    )}
                    <Icon className={`text-base transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`} />
                    <span className="hidden sm:block">{item.label}</span>
                    
                    {/* Animated bottom indicator */}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gray-900 transition-all duration-300 ${
                      isActive ? 'w-6 opacity-100' : 'w-0 opacity-0'
                    }`} />
                  </Link>
                );
              })}
            </div>

            {/* RIGHT: Location + User Avatar */}
            <div className="flex items-center gap-2">
              {/* Location pill - hidden on mobile */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500">
                <EnvironmentOutlined className="text-xs" />
                <span className="max-w-[100px] truncate">
                  {location?.name || 'Location'}
                </span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-semibold text-gray-900 leading-none">
                    {user?.name || 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {currentPage}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
