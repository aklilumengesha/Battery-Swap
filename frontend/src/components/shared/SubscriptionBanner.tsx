"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CrownOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { routes } from "../../routes";

interface SubscriptionBannerProps {
  planName?: string;
  swapsRemaining?: number;
  swapLimit?: number;
  onUpgradeClick?: () => void;
  isLoading?: boolean;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  planName = "Basic Plan",
  swapsRemaining = 8,
  swapLimit = 10,
  onUpgradeClick,
  isLoading = false,
}) => {
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      router.push(routes.PRICING);
    }
  };

  // Calculate percentage for progress bar
  const percentage = swapLimit > 0 ? (swapsRemaining / swapLimit) * 100 : 0;

  // Determine color based on remaining swaps
  const getProgressColor = () => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100/50 overflow-hidden animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
              <div>
                <div className="h-4 w-24 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          </div>
          <div className="w-24 h-10 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100/50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          {/* Left section - Plan info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <CrownOutlined className="text-white text-sm" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{planName}</h3>
                <p className="text-xs text-gray-600">Current subscription</p>
              </div>
            </div>

            {/* Swaps remaining */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">{swapsRemaining}</span>
                <span className="text-sm text-gray-600">of {swapLimit} swaps remaining</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right section - Upgrade button */}
          <button
            onClick={handleUpgradeClick}
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group"
          >
            Upgrade
            <ArrowRightOutlined className="text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
