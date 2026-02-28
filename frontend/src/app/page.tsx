"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ThunderboltFilled,
  RocketOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { routes } from "../routes";

const LandingPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <ThunderboltFilled className="text-4xl" />,
      title: "Instant Swap",
      description: "Replace your battery in under 3 minutes at any of our stations",
    },
    {
      icon: <EnvironmentOutlined className="text-4xl" />,
      title: "Nationwide Network",
      description: "Access thousands of swap stations across the country",
    },
    {
      icon: <SafetyOutlined className="text-4xl" />,
      title: "Safe & Certified",
      description: "All batteries are tested and certified for your safety",
    },
    {
      icon: <ClockCircleOutlined className="text-4xl" />,
      title: "24/7 Available",
      description: "Swap anytime, anywhere with our always-open stations",
    },
    {
      icon: <RocketOutlined className="text-4xl" />,
      title: "Smart Booking",
      description: "Reserve your battery in advance through our mobile app",
    },
    {
      icon: <CheckCircleFilled className="text-4xl" />,
      title: "Quality Assured",
      description: "Premium batteries with guaranteed performance",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Find a Station",
      description: "Use our app to locate the nearest battery swap station",
    },
    {
      number: "02",
      title: "Book Your Swap",
      description: "Reserve a battery with just one tap on your phone",
    },
    {
      number: "03",
      title: "Swap & Go",
      description: "Visit the station, swap your battery, and continue your journey",
    },
  ];

  const plans = [
    { name: "Basic", price: "9.99", swaps: "10" },
    { name: "Premium", price: "19.99", swaps: "30" },
    { name: "Unlimited", price: "99.99", swaps: "999" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ThunderboltFilled className="text-2xl" />
              <span className="text-xl font-bold">BatterySwap</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <Link href={routes.PRICING} className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={routes.SIGNIN}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={routes.SIGNUP}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Power Your Journey,
              <span className="bg-gradient-to-r from-black via-gray-700 to-gray-900 bg-clip-text text-transparent">
                {" "}Swap in Seconds
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              The fastest and most convenient way to keep your electric vehicle charged.
              Join thousands of drivers who never worry about battery range.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push(routes.SIGNUP)}
                className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => router.push(routes.PRICING)}
                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-200 transition-all hover:scale-105"
              >
                View Pricing
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to never run out of power
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl font-bold text-gray-100 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose BatterySwap?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for worry-free electric vehicle charging
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border ${
                  index === 1
                    ? "border-white scale-105"
                    : "border-white/20"
                } hover:scale-110 transition-all duration-300`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  {plan.swaps} swaps per month
                </p>
                <button
                  onClick={() => router.push(routes.PRICING)}
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href={routes.PRICING}
              className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              View all plans and features
              <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied EV drivers today. No commitments, cancel anytime.
          </p>
          <button
            onClick={() => router.push(routes.SIGNUP)}
            className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            Create Free Account
            <ArrowRightOutlined />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThunderboltFilled className="text-2xl" />
                <span className="text-xl font-bold">BatterySwap</span>
              </div>
              <p className="text-gray-400">
                The future of electric vehicle charging
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link href={routes.PRICING} className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BatterySwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
