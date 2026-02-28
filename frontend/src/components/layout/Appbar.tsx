"use client";

import React from "react";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import { routes } from "../../routes";
import { usePathname } from "next/navigation";

const MenuItem = ({ label, icon, route }: { label: string; icon: string; route: string }) => {
  const pathname = usePathname();
  const isActive = route === pathname;
  
  return (
    <Link href={route} className="flex-1 flex justify-center">
      <div className="relative flex flex-col items-center justify-center cursor-pointer py-2 px-4 group">
        {/* Active indicator - animated background */}
        <div
          className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out ${
            isActive
              ? "bg-primary/10 scale-100 opacity-100"
              : "bg-transparent scale-95 opacity-0 group-hover:bg-gray-100/50 group-hover:scale-100 group-hover:opacity-100"
          }`}
        />
        
        {/* Icon container with scale animation */}
        <div
          className={`relative z-10 transition-all duration-300 ${
            isActive ? "scale-110" : "scale-100 group-hover:scale-105"
          }`}
        >
          <FeatherIcon
            size={24}
            icon={icon}
            className={`transition-colors duration-300 ${
              isActive ? "text-primary" : "text-gray-600 group-hover:text-gray-900"
            }`}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </div>
        
        {/* Label with fade animation */}
        <p
          className={`relative z-10 text-xs mt-1.5 font-medium transition-all duration-300 ${
            isActive
              ? "text-primary opacity-100"
              : "text-gray-600 opacity-80 group-hover:text-gray-900 group-hover:opacity-100"
          }`}
        >
          {label}
        </p>
        
        {/* Active dot indicator */}
        <div
          className={`absolute -top-1 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        />
      </div>
    </Link>
  );
};

const Appbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        {/* Glassmorphism container */}
        <div className="glass-nav relative flex items-center justify-around px-2 py-1.5 rounded-3xl overflow-hidden border border-white/60 shadow-lg">
          {/* Subtle gradient overlay */}
          <div className="glass-gradient absolute inset-0 opacity-50 pointer-events-none" />
          
          {/* Navigation items */}
          <div className="relative z-10 flex items-center justify-around w-full">
            <MenuItem label="Home" icon="home" route={routes.HOME} />
            <MenuItem label="Profile" icon="user" route={routes.PROFILE} />
            <MenuItem label="History" icon="clock" route={routes.HISTORY} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
