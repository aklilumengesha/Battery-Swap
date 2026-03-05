"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
  LogoutOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useAuthQuery } from "../../features/auth";
import { useMySubscription } from "../../features/subscription/hooks/useSubscriptionQuery";
import { useBookings } from "../../features/stations/hooks/useStationsQuery";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: subscription } = useMySubscription();
  const { signout } = useAuthQuery();
  
  const { data: bookings = [] } = useBookings();
  const activeBooking = bookings.find((b: any) => !b.is_collected);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const isProducer = user?.user_type === 'producer';

  const navItems = [
    { label: 'Home', route: routes.HOME, icon: HomeOutlined },
    { label: 'My Plan', route: routes.MY_PLAN, icon: CreditCardOutlined },
  ];

  const isDropdownPageActive = isProducer
    ? pathname === routes.PRODUCER_COMPANY || pathname === routes.PROFILE
    : pathname === routes.HISTORY || pathname === routes.PROFILE;

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Fixed Top Navbar */}
      <nav className={`nav-slide-down fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
            <nav className="flex items-center gap-1">
              {isProducer ? (
                // PRODUCER NAV
                <>
                  <Link
                    href={routes.PRODUCER_DASHBOARD}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pathname === routes.PRODUCER_DASHBOARD
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <ShopOutlined />
                    <span className="hidden sm:block">Dashboard</span>
                  </Link>
                  <Link
                    href={routes.PRODUCER_STATIONS}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pathname === routes.PRODUCER_STATIONS
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <ThunderboltFilled />
                    <span className="hidden sm:block">Stations</span>
                  </Link>
                  <Link
                    href={routes.PRODUCER_BOOKINGS}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pathname === routes.PRODUCER_BOOKINGS
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <ClockCircleOutlined />
                    <span className="hidden sm:block">Bookings</span>
                  </Link>
                </>
              ) : (
                // CONSUMER NAV
                <>
                  {navItems.map((item) => {
                    const isActive = pathname === item.route;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.route}
                        href={item.route}
                        title={item.label}
                        onClick={handleNavClick}
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

                  {/* Active Booking Indicator */}
                  {activeBooking && (
                    <Link
                      href={routes.HISTORY}
                      onClick={handleNavClick}
                      className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200"
                    >
                      {/* Pulse dot */}
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                      </span>
                      <ThunderboltFilled className="text-orange-500 text-xs" />
                      <span className="hidden sm:block text-xs font-semibold">Active</span>
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* RIGHT: Location + User Avatar */}
            <div className="flex items-center gap-2">
              {/* Location pill - hidden on mobile */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500">
                <EnvironmentOutlined className="text-xs" />
                <span className="max-w-[100px] truncate">
                  {location?.name || 'Location'}
                </span>
              </div>

              {/* User Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors duration-200 ${
                    isDropdownPageActive || dropdownOpen
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {/* Avatar circle */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
                    </div>
                    {/* Active dot when on History or Profile */}
                    {isDropdownPageActive && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gray-900 border-2 border-white" />
                    )}
                  </div>
                  
                  {/* User name - hidden on mobile */}
                  <span className="hidden md:block text-xs font-semibold text-gray-900 leading-none">
                    {user?.name || 'User'}
                  </span>
                  
                  {/* Chevron arrow */}
                  <span className={`text-gray-400 text-xs transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}>
                    ▾
                  </span>
                </button>

                {/* Dropdown Panel */}
                {dropdownOpen && (
                  <div className="dropdown-enter absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {user?.email || ''}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      {isProducer ? (
                        <>
                          <Link
                            href={routes.PRODUCER_COMPANY}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              pathname === routes.PRODUCER_COMPANY
                                ? 'bg-gray-50 text-gray-900 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <ShopOutlined className="text-gray-400" />
                            My Company
                          </Link>
                          <Link
                            href={routes.PROFILE}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              pathname === routes.PROFILE
                                ? 'bg-gray-50 text-gray-900 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <UserOutlined className="text-gray-400" />
                            Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href={routes.HISTORY}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              pathname === routes.HISTORY
                                ? 'bg-gray-50 text-gray-900 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <ClockCircleOutlined className="text-gray-400" />
                            History
                          </Link>
                          <Link
                            href={routes.PROFILE}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              pathname === routes.PROFILE
                                ? 'bg-gray-50 text-gray-900 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <UserOutlined className="text-gray-400" />
                            Profile
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-gray-100 py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogoutOutlined />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 w-full px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
