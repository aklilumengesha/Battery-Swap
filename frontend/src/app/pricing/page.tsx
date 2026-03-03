"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircleFilled, 
  ThunderboltFilled,
  CrownFilled,
  RocketFilled,
  LoadingOutlined,
  MinusOutlined,
  DownOutlined
} from "@ant-design/icons";
import { usePlans, useSubscriptionQuery, useMySubscription } from "../../features/subscription";
import { useAuthQuery } from "../../features/auth";
import { routes } from "../../routes";

const PricingPage = () => {
  const router = useRouter();
  const { data: plans = [], isLoading } = usePlans();
  const { data: currentSubscription } = useMySubscription();
  const { isAuthenticated } = useAuthQuery();
  const { subscribe, isSubscribing } = useSubscriptionQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubscribe = (planId: number) => {
    if (!isAuthenticated) {
      router.push(routes.SIGNIN);
      return;
    }

    setSelectedPlanId(planId);
    const durationMonths = billingCycle === 'yearly' ? 12 : 1;
    subscribe({ planId, durationMonths });
  };

  // Get plan icon based on name
  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return <ThunderboltFilled className="text-2xl" />;
    if (name.includes('premium') || name.includes('pro')) return <CrownFilled className="text-2xl" />;
    if (name.includes('unlimited') || name.includes('enterprise')) return <RocketFilled className="text-2xl" />;
    return <ThunderboltFilled className="text-2xl" />;
  };

  // Check if plan is most popular (Premium)
  const isMostPopular = (planName: string) => {
    return planName.toLowerCase().includes('premium');
  };

  // Check if user is currently on this plan
  const isCurrentPlan = (planId: number) => {
    return currentSubscription?.plan === planId;
  };

  // Calculate yearly price with discount
  const getDisplayPrice = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice);
    if (billingCycle === 'yearly') {
      return (price * 12 * 0.8).toFixed(2); // 20% discount
    }
    return price.toFixed(2);
  };

  // FAQ data
  const faqs = [
    {
      question: "Can I change my plan later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences in cost."
    },
    {
      question: "What happens if I exceed my swap limit?",
      answer: "If you reach your monthly swap limit, you'll need to upgrade to a higher plan or wait until your next billing cycle. We'll send you notifications when you're approaching your limit."
    },
    {
      question: "How does billing work?",
      answer: "You'll be charged at the beginning of each billing cycle (monthly or yearly). We accept all major credit cards and payment methods. You can cancel anytime with no penalties."
    },
    {
      question: "Is there a free trial?",
      answer: "We offer a 7-day money-back guarantee on all plans. Try any plan risk-free, and if you're not satisfied, we'll refund your payment in full."
    },
    {
      question: "What's included with Priority Support?",
      answer: "Priority Support includes faster response times, dedicated support channels, and priority access to new features. Available on Premium and Unlimited plans."
    }
  ];

  // Feature list for all plans
  const getFeatures = (plan: any) => {
    return [
      { text: `${plan.swap_limit_per_month} battery swaps per month`, included: true },
      { text: 'Real-time station availability', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Priority support', included: plan.priority_support },
      { text: '24/7 customer service', included: plan.priority_support },
    ];
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header skeleton */}
          <div className="text-center mb-16 animate-pulse">
            <div className="h-12 w-96 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-64 bg-gray-100 rounded mx-auto"></div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 w-24 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-3 mb-8">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-100 rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Power your journey with the right plan
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan: any) => {
            const mostPopular = isMostPopular(plan.name);
            const currentPlan = isCurrentPlan(plan.id);
            const isSubscribingPlan = isSubscribing && selectedPlanId === plan.id;
            const features = getFeatures(plan);

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                  mostPopular
                    ? 'ring-2 ring-black shadow-2xl scale-105 lg:scale-110'
                    : 'shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Most Popular Badge */}
                {mostPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {currentPlan && (
                  <div className="absolute -top-4 right-4 z-10">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      Current Plan
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  mostPopular 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {getPlanIcon(plan.name)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">
                      ${getDisplayPrice(plan.price)}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      ${(parseFloat(plan.price) * 12).toFixed(2)} billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircleFilled className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                      ) : (
                        <MinusOutlined className="text-gray-300 text-sm mt-1 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isSubscribingPlan || currentPlan}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    currentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : mostPopular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubscribingPlan ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingOutlined className="animate-spin" />
                      Subscribing...
                    </span>
                  ) : currentPlan ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <DownOutlined
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of EV drivers who trust our battery swap network for their daily commute.
            </p>
            {!isAuthenticated && (
              <button
                onClick={() => router.push(routes.SIGNUP)}
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
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
