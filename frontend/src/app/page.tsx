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
    <div className="min-h-screen bg-white overflow-hidden">
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
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top right orb */}
          <div 
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gray-100 via-gray-200 to-transparent opacity-60 blur-3xl animate-pulse" 
            style={{ animationDuration: '4s' }} 
          />
          {/* Bottom left orb */}
          <div 
            className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-gray-100 via-gray-50 to-transparent opacity-40 blur-3xl animate-pulse"
            style={{ animationDuration: '6s' }} 
          />
          {/* Center subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-30 blur-3xl" />
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} 
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium mb-8 animate-fade-in-up shadow-lg"
              style={{ animationDelay: '0ms' }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold">Live</span>
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <ThunderboltFilled className="text-yellow-400 text-xs" />
              <span>Battery swap in under 2 minutes</span>
              <ArrowRightOutlined className="text-xs text-gray-400" />
            </div>

            {/* Main heading with stagger */}
            <h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              Power Your Journey,
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                  Swap in Seconds
                </span>
                {/* Underline accent */}
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent rounded-full opacity-20" />
              </span>
            </h1>

            {/* Subtext */}
            <p 
              className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              The fastest and most convenient way to keep your electric vehicle charged.
              Join thousands of drivers who never worry about battery range.
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              {/* Primary button with glow */}
              <button
                onClick={() => router.push(routes.SIGNUP)}
                className="relative group bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                {/* Button shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  <RocketOutlined />
                  Start Free Trial
                </span>
              </button>

              {/* Secondary button */}
              <button
                onClick={() => router.push(routes.PRICING)}
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                View Pricing
                <ArrowRightOutlined className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Trust badges */}
            <p 
              className="text-sm text-gray-400 mb-12 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              No credit card required · 7-day free trial · Cancel anytime
            </p>

            {/* Stats counter row */}
            <div 
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '500ms' }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-gray-900 mb-1">500+</p>
                <p className="text-sm text-gray-500">Swap Stations</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-gray-900 mb-1">50K+</p>
                <p className="text-sm text-gray-500">Happy Drivers</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-gray-900 mb-1">&lt;2min</p>
                <p className="text-sm text-gray-500">Avg Swap Time</p>
              </div>
            </div>
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
