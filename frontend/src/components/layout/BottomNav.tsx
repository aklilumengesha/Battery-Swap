"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { routes } from "../../routes";
import { useMySubscription } from "../../features/subscription";

const BottomNav = () => {
  const pathname = usePathname();
  const { data: subscription } = useMySubscription();

  const navItems = [
    {
      label: "Home",
      icon: HomeOutlined,
      href: routes.HOME,
      active: pathname === routes.HOME,
    },
    {
      label: "My Plan",
      icon: CreditCardOutlined,
      href: routes.MY_PLAN,
      active: pathname === routes.MY_PLAN,
      showDot: true,
      dotColor: subscription?.is_active ? "bg-green-400" : "bg-red-400",
    },
    {
      label: "History",
      icon: ClockCircleOutlined,
      href: routes.HISTORY,
      active: pathname === routes.HISTORY,
    },
    {
      label: "Profile",
      icon: UserOutlined,
      href: routes.PROFILE,
      active: pathname === routes.PROFILE,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  item.active
                    ? "text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`text-2xl ${
                      item.active ? "scale-110" : ""
                    } transition-transform`}
                  />
                  {item.showDot && (
                    <span
                      className={`absolute -top-1 -right-1 w-2 h-2 ${item.dotColor} rounded-full border-2 border-white`}
                    ></span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    item.active ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
