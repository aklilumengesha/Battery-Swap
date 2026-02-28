"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircleFilled, 
  ThunderboltFilled,
  CrownFilled,
  RocketFilled,
  LoadingOutlined
} from "@ant-design/icons";
import { usePlans, useSubscriptionQuery } from "../../features/subscription";
import { useAuthQuery } from "../../features/auth";
import { routes } from "../../routes";

const PricingPage = () => {
  const router = useRouter();
  const { data: plans = [], isLoading } = usePlans();
  const { isAuthenticated } = useAuthQuery();
  const { subscribe, isSubscribing } = useSubscriptionQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleSubscribe = (planId: number) => {
    if (!isAuthenticated) {
      router.push(routes.SIGNIN);
      return;
    }

    setSelectedPlanId(planId);
    subscribe({ planId, durationMonths: 1 });
  };

  // Get plan icon based on name
  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return <ThunderboltFilled />;
    if (name.includes('premium') || name.includes('pro')) return <CrownFilled />;
    if (name.includes('unlimited') || name.includes('enterprise')) return <RocketFilled />;
    return <ThunderboltFilled />;
  };

  // Determine recommended plan (middle plan or one with priority support)
  const getRecommendedPlan = () => {
    if (plans.length === 0) return null;
    
    // Find plan with priority support
    const priorityPlan = plans.find((p: any) => p.priority_support);
    if (priorityPlan) return priorityPlan.id;
    
    // Otherwise, return middle plan
    const middleIndex = Math.floor(plans.length / 2);
    return plans[middleIndex]?.id;
  };

  const recommendedPlanId = getRecommendedPlan();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingOutlined className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your battery swap needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan: any) => {
            const isRecommended = plan.id === recommendedPlanId;
            const isSubscribingPlan = isSubscribing && selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isRecommended ? 'ring-2 ring-black scale-105' : 'hover:scale-105'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isRecommended 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-2xl">{getPlanIcon(plan.name)}</span>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircleFilled className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-semibold">{plan.swap_limit_per_month}</span> battery swaps/month
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleFilled className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {plan.priority_support ? 'Priority' : 'Standard'} support
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleFilled className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Real-time station availability
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleFilled className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Mobile app access
                      </span>
                    </li>
                  </ul>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isSubscribingPlan}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                      isRecommended
                        ? 'bg-black text-white hover:bg-gray-800 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubscribingPlan ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingOutlined />
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my swap limit?
              </h3>
              <p className="text-gray-600">
                You'll need to upgrade to a higher plan or wait until your next billing cycle to continue swapping.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee on all plans. Try any plan risk-free!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of EV drivers who trust our battery swap network for their daily commute.
            </p>
            {!isAuthenticated && (
              <button
                onClick={() => router.push(routes.SIGNUP)}
                className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Create Free Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
