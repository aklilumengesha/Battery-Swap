"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircleFilled, 
  ThunderboltFilled,
  CrownFilled,
  RocketFilled,
  LoadingOutlined,
  MinusOutlined,
  DownOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { usePlans, useSubscriptionQuery, useMySubscription } from "../../features/subscription";
import { useAuthQuery } from "../../features/auth";
import { routes } from "../../routes";

interface SelectedPlan {
  id: number;
  name: string;
  price: string;
}

const PricingPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: plans = [], isLoading, error } = usePlans();
  const { data: currentSubscription } = useMySubscription();
  const { isAuthenticated, profileLoading } = useAuthQuery();
  const { subscribe, isSubscribing } = useSubscriptionQuery();

  // Debug logging
  console.log('Pricing Page Debug:', { plans, isLoading, error });
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [duration, setDuration] = useState<1 | 3 | 6 | 12>(1);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // Clean URL after redirect from signin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect') && isAuthenticated) {
      // Clean the URL without reload
      window.history.replaceState({}, '', '/pricing');
    }
  }, [isAuthenticated]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal && !isSubscribing) {
        closeModal();
      }
    };
    if (showModal) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, isSubscribing]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handlePlanClick = (plan: any) => {
    // Guard: Don't do anything while auth state is loading
    if (profileLoading) return;

    // Check if user is logged in
    if (!isAuthenticated) {
      router.push(`${routes.SIGNIN}?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }

    // Don't allow subscribing to current plan
    if (isCurrentPlan(plan.id)) {
      return;
    }

    // Open modal with selected plan
    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price: plan.price,
    });
    setDuration(1);
    setSubscriptionSuccess(false);
    setSubscriptionError(null);
    openModal();
  };

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    if (isSubscribing) return; // Prevent closing during subscription
    setModalVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setSelectedPlan(null);
      setDuration(1);
      setSubscriptionSuccess(false);
      setSubscriptionError(null);
    }, 300); // Match transition duration
  };

  const handleCloseModal = closeModal;

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;

    setSubscriptionError(null);
    
    try {
      await new Promise<void>((resolve, reject) => {
        subscribe(
          { planId: selectedPlan.id, durationMonths: duration },
          {
            onSuccess: () => {
              setSubscriptionSuccess(true);
              
              // Invalidate queries immediately
              queryClient.invalidateQueries({ queryKey: ['subscriptions', 'my-subscription'] });
              queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
              
              // Wait 2 seconds for success animation
              setTimeout(() => {
                // Close modal with animation
                closeModal();
                // Wait for modal close animation, then redirect
                setTimeout(() => {
                  router.push(routes.MY_PLAN);
                }, 350);
              }, 2000);
              
              resolve();
            },
            onError: (error: any) => {
              // Extract error message from various possible response shapes
              const msg = error?.response?.data?.detail ||
                         error?.response?.data?.message ||
                         error?.message ||
                         'Failed to subscribe. Please try again.';
              setSubscriptionError(msg);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      // Error already handled in onError
    }
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

  // Calculate total price based on duration
  const calculateTotalPrice = (monthlyPrice: string, months: number) => {
    const price = parseFloat(monthlyPrice);
    let total = price * months;
    
    // Apply discounts
    if (months === 3) total *= 0.95; // 5% off
    if (months === 6) total *= 0.90; // 10% off
    if (months === 12) total *= 0.80; // 20% off
    
    return total.toFixed(2);
  };

  // Get discount percentage
  const getDiscount = (months: number) => {
    if (months === 3) return 5;
    if (months === 6) return 10;
    if (months === 12) return 20;
    return 0;
  };

  // Get current plan name
  const getCurrentPlanName = () => {
    if (!currentSubscription) return null;
    const plan = plans.find((p: any) => p.id === currentSubscription.plan);
    return plan?.name || "Unknown Plan";
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <ExclamationCircleOutlined className="text-red-600 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to Load Plans</h2>
          <p className="text-red-700 mb-4">
            {error instanceof Error ? error.message : 'Unable to fetch subscription plans'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!plans || plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
          <ThunderboltFilled className="text-gray-400 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Plans Available</h2>
          <p className="text-gray-600 mb-4">
            Subscription plans are not currently available. Please check back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Refresh
          </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {plans.map((plan: any) => {
            const mostPopular = isMostPopular(plan.name);
            const currentPlan = isCurrentPlan(plan.id);
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
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      Your Current Plan
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
                  onClick={() => handlePlanClick(plan)}
                  disabled={profileLoading || currentPlan}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    currentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : mostPopular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {profileLoading ? (
                    <span className="animate-pulse">Loading...</span>
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

      {/* Confirmation Modal */}
      {showModal && selectedPlan && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            modalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubscribing) {
              closeModal();
            }
          }}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              modalVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div 
            className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 transition-all duration-300 ${
              modalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            {subscriptionSuccess ? (
              // Success State
              <div className="p-8 text-center">
                {/* Large checkmark with animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-14 h-14 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Success message */}
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Subscription Activated!
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Redirecting to your plan<span className="animate-pulse">...</span>
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-[2000ms] ease-linear"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Confirm Your Plan
                  </h3>
                  {!isSubscribing && (
                    <button
                      onClick={handleCloseModal}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <CloseOutlined className="text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Error Banner */}
                  {subscriptionError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <ExclamationCircleOutlined className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-red-900 font-semibold mb-1">Subscription Failed</h4>
                        <p className="text-red-700 text-sm">{subscriptionError}</p>
                      </div>
                    </div>
                  )}

                  {/* Plan Upgrade Flow */}
                  {currentSubscription && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Current Plan</p>
                          <p className="font-semibold text-gray-900">{getCurrentPlanName()}</p>
                        </div>
                        <ArrowRightOutlined className="text-gray-400 text-xl" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">New Plan</p>
                          <p className="font-semibold text-gray-900">{selectedPlan.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Plan */}
                  {!currentSubscription && (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white">
                          {getPlanIcon(selectedPlan.name)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{selectedPlan.name}</h4>
                          <p className="text-gray-600">${selectedPlan.price}/month</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Duration Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Duration
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 3, 6, 12].map((months) => {
                        const discount = getDiscount(months);
                        return (
                          <button
                            key={months}
                            onClick={() => setDuration(months as 1 | 3 | 6 | 12)}
                            disabled={isSubscribing}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              duration === months
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <div className="text-left">
                              <p className="font-semibold text-gray-900">
                                {months} {months === 1 ? 'Month' : 'Months'}
                              </p>
                              {discount > 0 && (
                                <span className="inline-block mt-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                  Save {discount}%
                                </span>
                              )}
                            </div>
                            {duration === months && (
                              <div className="absolute top-2 right-2">
                                <CheckCircleFilled className="text-black text-lg" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Base Price</span>
                      <span className="text-gray-900">
                        ${(parseFloat(selectedPlan.price) * duration).toFixed(2)}
                      </span>
                    </div>
                    {getDiscount(duration) > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">Discount ({getDiscount(duration)}%)</span>
                        <span className="text-green-600">
                          -${(parseFloat(selectedPlan.price) * duration * (getDiscount(duration) / 100)).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${calculateTotalPrice(selectedPlan.price, duration)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        Billed once for {duration} {duration === 1 ? 'month' : 'months'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    disabled={isSubscribing}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSubscription}
                    disabled={isSubscribing}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingOutlined className="animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Confirm & Subscribe'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
