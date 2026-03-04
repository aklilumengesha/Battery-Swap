"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CrownFilled,
  ThunderboltFilled,
  CheckCircleFilled,
  ClockCircleOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useMySubscription } from "../../features/subscription";
import { routes } from "../../routes";

const MyPlanPage = () => {
  const router = useRouter();
  const { data: subscription, isLoading } = useMySubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Calculate usage percentage
  const getUsagePercentage = () => {
    if (!subscription?.plan_details) return 0;
    const used = subscription.swaps_used || 0;
    const limit = subscription.plan_details.swap_limit_per_month || 1;
    return (used / limit) * 100;
  };

  // Get color based on usage
  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage < 50) return { ring: 'stroke-green-500', bg: 'bg-green-50', text: 'text-green-600' };
    if (percentage < 80) return { ring: 'stroke-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' };
    return { ring: 'stroke-red-500', bg: 'bg-red-50', text: 'text-red-600' };
  };

  // Handle cancel subscription
  const handleCancelSubscription = () => {
    // TODO: Implement cancel subscription API call
    console.log('Cancel subscription');
    setShowCancelModal(false);
    // For now, just close the modal
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <DashboardLayout title="My Plan">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8"></div>
            
            {/* Main card skeleton */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-8 w-48 bg-gray-200 rounded"></div>
                  <div className="h-6 w-32 bg-gray-100 rounded"></div>
                  <div className="h-4 w-40 bg-gray-100 rounded"></div>
                  <div className="h-4 w-40 bg-gray-100 rounded"></div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No subscription state
  if (!subscription) {
    return (
      <DashboardLayout title="My Plan">
        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center">
            {/* Empty state SVG */}
          <svg
            className="w-64 h-64 mx-auto mb-8"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
            <path
              d="M100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60Z"
              fill="#E5E7EB"
            />
            <path
              d="M100 70C83.4315 70 70 83.4315 70 100C70 116.569 83.4315 130 100 130C116.569 130 130 116.569 130 100C130 83.4315 116.569 70 100 70Z"
              fill="white"
            />
            <path
              d="M95 90L95 110M105 90L105 110M90 100L110 100"
              stroke="#9CA3AF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You don&apos;t have an active plan
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Subscribe to a plan to start swapping batteries and power your journey.
          </p>
          
          <button
            onClick={() => router.push(routes.PRICING)}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            View Plans
            <ArrowRightOutlined />
          </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const usagePercentage = getUsagePercentage();
  const usageColors = getUsageColor();
  const swapsUsed = subscription.swaps_used || 0;
  const swapsLimit = subscription.plan_details?.swap_limit_per_month || 0;

  return (
    <DashboardLayout title="My Plan">
      <div className="w-full space-y-5">
        {/* Main Subscription Card - Full Width */}
        <div className="relative bg-gradient-to-br
          from-gray-900 via-gray-800 to-gray-900
          rounded-3xl p-6 text-white overflow-hidden w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-48 h-48
            bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32
            bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Top: Plan name + Active badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl
                  bg-white/10 border border-white/20
                  flex items-center justify-center">
                  <CrownFilled className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Current Plan</p>
                  <p className="text-white font-bold text-lg
                    leading-tight">
                    {subscription.plan_details?.name} Plan
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-full
                text-xs font-semibold
                bg-green-500/20 text-green-400 border border-green-500/30">
                ● Active
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-gray-400 text-xs mb-1">Monthly Price</p>
              <p className="text-4xl font-bold text-white">
                ${subscription.plan_details?.price}
                <span className="text-lg text-gray-400 font-normal">/mo</span>
              </p>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3
                border border-white/10">
                <p className="text-gray-400 text-xs mb-1">Started</p>
                <p className="text-white text-sm font-semibold">
                  {new Date(subscription.start_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-3
                border border-white/10">
                <p className="text-gray-400 text-xs mb-1">Renews</p>
                <p className="text-white text-sm font-semibold">
                  {new Date(subscription.end_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push(routes.PRICING)}
                className="py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold
                  hover:bg-gray-100 transition-colors">
                Change Plan
              </button>

              <button
                onClick={() => router.push(routes.PRICING)}
                className="py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500
                  text-white text-sm font-semibold
                  hover:opacity-90 transition-opacity">
                Upgrade ↑
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Swaps Used */}
              <div className="bg-white rounded-2xl border
                border-gray-100 shadow-sm p-4 text-center">
                <div className="w-9 h-9 rounded-xl bg-blue-50
                  flex items-center justify-center mx-auto mb-2">
                  <ThunderboltFilled className="text-blue-500 text-sm" />
                </div>
                <p className={`text-2xl font-bold mb-0.5
                  ${usageColors.text}`}>
                  {swapsUsed}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  Swaps Used
                </p>
              </div>

              {/* Swaps Remaining */}
              <div className="bg-white rounded-2xl border
                border-gray-100 shadow-sm p-4 text-center">
                <div className="w-9 h-9 rounded-xl bg-green-50
                  flex items-center justify-center mx-auto mb-2">
                  <ThunderboltFilled className="text-green-500 text-sm" />
                </div>
                <p className="text-2xl font-bold text-green-600 mb-0.5">
                  {swapsLimit - swapsUsed}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  Remaining
                </p>
              </div>

              {/* Days Until Renewal */}
              <div className="bg-white rounded-2xl border
                border-gray-100 shadow-sm p-4 text-center">
                <div className="w-9 h-9 rounded-xl bg-purple-50
                  flex items-center justify-center mx-auto mb-2">
                  <ClockCircleOutlined className="text-purple-500 text-sm" />
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-0.5">
                  {Math.max(0, Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  Days Left
                </p>
              </div>
            </div>

            {/* Battery Info Card - Placeholder for future content */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Subscription Timeline</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Plan Started</p>
                    <p className="text-xs text-gray-400">
                      {new Date(subscription.start_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Next Renewal</p>
                    <p className="text-xs text-gray-400">
                      {new Date(subscription.end_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            {/* Circular Progress Ring Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="px-1 pb-4 border-b border-gray-50 mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Usage This Month</h3>
              </div>
              <div className="flex flex-col items-center">
                {/* SVG Circle Progress */}
                <div className="relative">
                  <svg className="w-56 h-56 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      className={usageColors.ring}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 100}`}
                      strokeDashoffset={`${2 * Math.PI * 100 * (1 - usagePercentage / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-5xl font-bold ${usageColors.text}`}>
                      {swapsUsed}
                    </div>
                    <div className="text-gray-500 text-lg">
                      of {swapsLimit}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      swaps used
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  {usagePercentage.toFixed(0)}% of monthly limit used
                </p>
              </div>
            </div>

            {/* Plan Features Card */}
            <div className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-4 border-b border-gray-50
            flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Plan Features</h3>
            <span className="text-xs text-gray-400">
              {subscription.plan_details?.name} Plan
            </span>
          </div>

          {/* Features List */}
          <div className="p-5 space-y-4">
            {/* Swap limit from API */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-green-50
                flex items-center justify-center flex-shrink-0">
                <CheckCircleFilled className="text-green-500 text-xs" />
              </div>
              <span className="text-sm text-gray-700">
                {swapsLimit} battery swaps per month
              </span>
            </div>

            {/* Hardcoded features */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-green-50
                flex items-center justify-center flex-shrink-0">
                <CheckCircleFilled className="text-green-500 text-xs" />
              </div>
              <span className="text-sm text-gray-700">Real-time station availability</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-green-50
                flex items-center justify-center flex-shrink-0">
                <CheckCircleFilled className="text-green-500 text-xs" />
              </div>
              <span className="text-sm text-gray-700">Mobile app access</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-green-50
                flex items-center justify-center flex-shrink-0">
                <CheckCircleFilled className="text-green-500 text-xs" />
              </div>
              <span className="text-sm text-gray-700">Email notifications</span>
            </div>

            {/* Conditional premium features */}
            {subscription.plan_details?.priority_support && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-green-50
                    flex items-center justify-center flex-shrink-0">
                    <CheckCircleFilled className="text-green-500 text-xs" />
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    Priority support
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Premium
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-green-50
                    flex items-center justify-center flex-shrink-0">
                    <CheckCircleFilled className="text-green-500 text-xs" />
                  </div>
                  <span className="text-sm text-gray-700">24/7 customer service</span>
                </div>
              </>
            )}
          </div>
            </div>
          </div>
        </div>

        {/* Cancel Plan Button - Full Width */}
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3 rounded-2xl
            border border-red-200 text-red-500 text-sm font-medium
            hover:bg-red-50 transition-colors mb-4">
          Cancel Subscription
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloseCircleOutlined className="text-red-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cancel Subscription?
              </h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your {subscription.plan_details?.name} plan?
                You&apos;ll lose access to all features immediately.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyPlanPage;
