'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthQuery } from '@/features/auth';
import { routes } from '@/routes';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  ThunderboltFilled,
  CrownFilled,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const navItems = [
  {
    label: 'Dashboard',
    href: routes.ADMIN_DASHBOARD,
    icon: <DashboardOutlined />,
    color: 'text-blue-500',
    activeBg: 'bg-blue-500',
  },
  {
    label: 'Users',
    href: routes.ADMIN_USERS,
    icon: <UserOutlined />,
    color: 'text-purple-500',
    activeBg: 'bg-purple-500',
  },
  {
    label: 'Producers',
    href: routes.ADMIN_PRODUCERS,
    icon: <CrownFilled />,
    color: 'text-orange-500',
    activeBg: 'bg-orange-500',
  },
  {
    label: 'Stations',
    href: routes.ADMIN_STATIONS,
    icon: <ShopOutlined />,
    color: 'text-green-500',
    activeBg: 'bg-green-500',
  },
  {
    label: 'Bookings',
    href: routes.ADMIN_BOOKINGS,
    icon: <ThunderboltFilled />,
    color: 'text-yellow-500',
    activeBg: 'bg-yellow-500',
  },
];

export default function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signout } = useAuthQuery();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignout = async () => {
    await signout();
    router.replace('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo + Admin badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <ThunderboltFilled className="text-white text-xs" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 hidden sm:block">
                BatterySwap
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                ADMIN
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: user + signout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center">
                <CrownFilled className="text-white" style={{ fontSize: 10 }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                {user?.name || 'Admin'}
              </span>
            </div>

            <button
              onClick={handleSignout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogoutOutlined />
              <span className="hidden sm:block">Sign Out</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-xl lg:hidden">
          <nav className="p-4 space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
