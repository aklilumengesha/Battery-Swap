"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CrownFilled,
  ThunderboltFilled,
  CheckCircleFilled,
  CalendarOutlined,
  FireOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
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

  // Calculate days until renewal
  const getDaysUntilRenewal = () => {
    if (!subscription?.end_date) return 0;
    const endDate = new Date(subscription.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
      </div>
    );
  }

  // No subscription state
  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
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
            You don't have an active plan
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
    );
  }

  const usagePercentage = getUsagePercentage();
  const usageColors = getUsageColor();
  const daysUntilRenewal = getDaysUntilRenewal();
  const swapsUsed = subscription.swaps_used || 0;
  const swapsLimit = subscription.plan_details?.swap_limit_per_month || 0;
  const swapsRemaining = Math.max(0, swapsLimit - swapsUsed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your plan and track your usage</p>
        </div>

        {/* Section A: Current Plan Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Plan Details */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CrownFilled className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {subscription.plan_details?.name} Plan
                  </h2>
                  <p className="text-gray-600">
                    ${subscription.plan_details?.price}/month
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <CalendarOutlined className="text-lg text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(subscription.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CalendarOutlined className="text-lg text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Renewal Date</p>
                    <p className="font-medium">{formatDate(subscription.end_date)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(routes.PRICING)}
                className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
              >
                Upgrade Plan
              </button>
            </div>

            {/* Right: Circular Progress */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* SVG Circle Progress */}
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
            </div>
          </div>
        </div>

        {/* Section B: Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Swaps Used */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ThunderboltFilled className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{swapsUsed}</div>
                <div className="text-sm text-gray-500">Swaps Used</div>
              </div>
            </div>
          </div>

          {/* Swaps Remaining */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FireOutlined className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{swapsRemaining}</div>
                <div className="text-sm text-gray-500">Swaps Remaining</div>
              </div>
            </div>
          </div>

          {/* Days Until Renewal */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrophyOutlined className="text-purple-600 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{daysUntilRenewal}</div>
                <div className="text-sm text-gray-500">Days Until Renewal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Plan Features */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircleFilled className="text-green-500 text-xl flex-shrink-0" />
              <span className="text-gray-700">
                {swapsLimit} battery swaps per month
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleFilled className="text-green-500 text-xl flex-shrink-0" />
              <span className="text-gray-700">Real-time station availability</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleFilled className="text-green-500 text-xl flex-shrink-0" />
              <span className="text-gray-700">Mobile app access</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleFilled className="text-green-500 text-xl flex-shrink-0" />
              <span className="text-gray-700">Email notifications</span>
            </div>
            {subscription.plan_details?.priority_support && (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircleFilled className="text-green-500 text-xl flex-shrink-0" />
                  <span className="text-gray-700 flex items-center gap-2">
                    Priority support
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Premium
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleFilled className="text-green-500 text-xl flex-shrink-0" />
                  <span className="text-gray-700">24/7 customer service</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section D: Danger Zone */}
        <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
          <div className="flex items-start gap-4">
            <ExclamationCircleOutlined className="text-red-600 text-2xl flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-red-700 mb-4">
                Once you cancel your subscription, you will lose access to all premium features immediately.
                This action cannot be undone.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-white text-red-600 border-2 border-red-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
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
                You'll lose access to all features immediately.
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
    </div>
  );
};

export default MyPlanPage;
