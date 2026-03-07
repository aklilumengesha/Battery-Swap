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
  const [scrolled, setScrolled] = React.useState(false);
  const [barDismissed, setBarDismissed] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Announcement Bar */}
      {!barDismissed && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 relative">
            {/* Shimmer animation */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_3s_ease-in-out_infinite]" />
            </div>

            <div className="relative flex items-center gap-3 flex-wrap justify-center">
              {/* Badge */}
              <span className="flex items-center gap-1 bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold text-yellow-400 flex-shrink-0">
                <ThunderboltFilled className="text-xs" />
                NEW
              </span>

              <p className="text-xs sm:text-sm text-gray-200 text-center">
                🎉 50 new stations added across Addis Ababa this month — 
                <button
                  onClick={() => router.push(routes.SIGNUP)}
                  className="font-semibold text-white underline underline-offset-2 ml-1 hover:text-gray-300 transition-colors"
                >
                  Claim your free trial →
                </button>
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setBarDismissed(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-gray-400 hover:text-white text-xs flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 nav-slide-down ${barDismissed ? 'top-0' : 'top-[38px]'} ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <ThunderboltFilled className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">BatterySwap</span>
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
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm"
              >
                Get Started
                <ArrowRightOutlined className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300 ${barDismissed ? 'pt-32' : 'pt-44'}`}>
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
      <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-wider mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Three simple steps to never run out of power
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line between steps */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <EnvironmentOutlined className="text-white text-3xl" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                  1
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find a Station</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Use our app to locate the nearest battery swap station. Hundreds of stations available across the city.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <ThunderboltFilled className="text-white text-3xl" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                  2
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Swap Your Battery</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Exchange your depleted battery for a fully charged one in under 2 minutes. No waiting, no charging.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <RocketOutlined className="text-white text-3xl" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                  3
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Back on the Road</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Hit the road with a full charge. Track your usage and plan your next swap from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for Speed
              <br />
              <span className="text-gray-400">and Reliability</span>
            </h2>
          </div>

          {/* Feature grid - asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large feature card */}
            <div className="lg:col-span-2 relative bg-gray-900 rounded-3xl p-8 text-white overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                  <ThunderboltFilled className="text-yellow-400 text-xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Instant Battery Swap</h3>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  No more waiting hours for your EV to charge. Our swap stations replace your battery in under 2 minutes, keeping you on the road.
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-3xl font-bold">&lt;2min</p>
                    <p className="text-xs text-gray-400">Swap Time</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-3xl font-bold">24/7</p>
                    <p className="text-xs text-gray-400">Available</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-3xl font-bold">500+</p>
                    <p className="text-xs text-gray-400">Stations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small feature card 1 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-colors duration-300">
                <SafetyOutlined className="text-gray-900 text-xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Certified Safe</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                All batteries are tested and certified to the highest safety standards.
              </p>
            </div>

            {/* Small feature card 2 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-colors duration-300">
                <ClockCircleOutlined className="text-gray-900 text-xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Live station availability so you always find a charged battery nearby.
              </p>
            </div>

            {/* Small feature card 3 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-colors duration-300">
                <RocketOutlined className="text-gray-900 text-xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Plans</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Monthly plans that fit your driving habits — from casual to heavy daily use.
              </p>
            </div>

            {/* Wide bottom card */}
            <div className="md:col-span-2 lg:col-span-1 bg-gray-50 rounded-3xl border border-gray-100 p-7 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-colors duration-300">
                <EnvironmentOutlined className="text-gray-900 text-xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Wide Coverage</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Stations available at major roads, malls, and business districts.
              </p>
            </div>
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

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Full width split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
            {/* LEFT — Dark side */}
            <div className="relative bg-gray-900 p-12 flex flex-col justify-between min-h-[400px]">
              {/* Subtle grid */}
              <div 
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                  backgroundSize: '32px 32px'
                }} 
              />
              
              {/* Orb */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Live badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white font-medium mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  500+ stations live now
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  Start swapping
                  <br />
                  <span className="text-gray-400">today for free</span>
                </h2>
                <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                  No credit card required. Set up your account in minutes and find your nearest station.
                </p>
              </div>

              {/* Bottom trust row */}
              <div className="relative z-10 flex items-center gap-4 mt-10 flex-wrap">
                {[
                  '7-day free trial',
                  'No credit card',
                  'Cancel anytime',
                ].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CheckCircleFilled className="text-green-400 text-xs" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Light side */}
            <div className="bg-white p-12 flex flex-col justify-center relative">
              {/* Subtle top-right decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h3>
                <p className="text-gray-500 text-sm mb-8">
                  Join thousands of EV drivers already using BatterySwap
                </p>

                {/* Social proof avatars */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex -space-x-2">
                    {['E', 'A', 'M', 'S', 'K'].map((letter, i) => (
                      <div 
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                        style={{
                          background: ['#1a1a1a', '#374151', '#4b5563', '#6b7280', '#9ca3af'][i]
                        }}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">50,000+ drivers</p>
                    <p className="text-xs text-gray-400">already on board</p>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(routes.SIGNUP)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02] shadow-sm group"
                  >
                    <RocketOutlined className="group-hover:rotate-12 transition-transform duration-200" />
                    Get Started Free
                    <ArrowRightOutlined className="text-xs ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  <button
                    onClick={() => router.push(routes.SIGNIN)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-4 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Already have an account? <span className="text-gray-900 font-bold">Sign In</span>
                  </button>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-2 mt-6">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">4.9/5 from 2,000+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
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
