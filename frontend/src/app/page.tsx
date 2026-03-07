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
  
  const statsRef = React.useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = React.useState(false);
  const [counts, setCounts] = React.useState({
    stations: 0,
    swaps: 0,
    drivers: 0,
    uptime: 0,
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer to trigger on scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  // Counter animation when visible
  React.useEffect(() => {
    if (!statsVisible) return;

    const targets = {
      stations: 500,
      swaps: 12400,
      drivers: 50000,
      uptime: 99.8,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts({
        stations: Math.round(targets.stations * eased),
        swaps: Math.round(targets.swaps * eased),
        drivers: Math.round(targets.drivers * eased),
        uptime: Math.round(targets.uptime * eased * 10) / 10,
      });

      if (step >= steps) {
        clearInterval(timer);
        // Snap to exact final values
        setCounts({
          stations: targets.stations,
          swaps: targets.swaps,
          drivers: targets.drivers,
          uptime: targets.uptime,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsVisible]);

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
      <section 
        className={`relative overflow-hidden transition-all duration-300 ${barDismissed ? 'pt-16' : 'pt-28'}`}
      >
        {/* Full bleed background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 pointer-events-none" />

        {/* Dot grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }} 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-0 items-center min-h-[88vh]">
            
            {/* ── LEFT ── */}
            <div className="flex flex-col justify-center py-16 lg:py-0 lg:pr-16">
              {/* Live badge */}
              <div 
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-900 text-white text-xs font-medium mb-8 w-fit animate-fade-in-up shadow-lg"
                style={{ animationDelay: '0ms' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold">Live</span>
                <span className="w-px h-3 bg-white/20" />
                <span>500+ stations active now</span>
              </div>

              {/* Heading — 2 clean lines */}
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.0] tracking-tight mb-5 animate-fade-in-up whitespace-nowrap"
                style={{ animationDelay: '100ms' }}
              >
                Power Your{' '}
                <span className="text-gray-300">Journey.</span>
              </h1>

              {/* Sub heading */}
              <p 
                className="text-3xl md:text-4xl font-semibold text-gray-400 mb-5 animate-fade-in-up"
                style={{ animationDelay: '150ms' }}
              >
                Swap in Seconds.
              </p>

              {/* Body */}
              <p 
                className="text-lg text-gray-400 mb-10 leading-relaxed max-w-md animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              >
                Replace your EV battery in under 2 minutes. No cables. No waiting.
              </p>

              {/* Buttons */}
              <div 
                className="flex items-center gap-3 mb-10 animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                <button
                  onClick={() => router.push(routes.SIGNUP)}
                  className="group relative bg-gray-900 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-xl flex items-center gap-2 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <ThunderboltFilled className="text-yellow-400 text-xs relative z-10" />
                  <span className="relative z-10">Start Free Trial</span>
                </button>

                <button
                  onClick={() => router.push(routes.PRICING)}
                  className="group text-gray-600 text-sm font-semibold flex items-center gap-1.5 hover:text-gray-900 transition-colors duration-200"
                >
                  See pricing
                  <ArrowRightOutlined className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

              {/* Social proof */}
              <div 
                className="flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: '400ms' }}
              >
                <div className="flex -space-x-2">
                  {['S','M','D','H','K'].map((l, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                      style={{ background: ['#111','#333','#555','#777','#999'][i] }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    <span className="font-bold text-gray-900">50K+</span>{' '}
                    happy drivers
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT — Phone mockup ── */}
            <div 
              className="relative flex justify-center lg:justify-start items-end pl-0 lg:pl-4 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {/* Ground glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gray-400/20 blur-3xl rounded-full pointer-events-none" />

              {/* Phone wrapper — angled */}
              <div 
                className="relative"
                style={{
                  transform: 'perspective(1000px) rotateY(-8deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Phone shell */}
                <div className="w-[260px] sm:w-[280px] bg-gray-950 rounded-[2.8rem] shadow-[0_40px_80px_rgba(0,0,0,0.35)] border border-gray-700/60 overflow-hidden">
                  {/* Notch bar */}
                  <div className="bg-gray-950 px-5 pt-4 pb-2 flex items-center justify-between">
                    <span className="text-white/80 text-xs font-medium">9:41</span>
                    <div className="w-14 h-4 bg-black rounded-full" />
                    <div className="w-4 h-2.5 border border-white/30 rounded-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-[80%] bg-green-400" />
                    </div>
                  </div>

                  {/* Screen content */}
                  <div className="bg-gray-950 px-3 pb-8 space-y-2.5">
                    {/* Hero greeting card */}
                    <div className="bg-gray-900 rounded-2xl p-4">
                      <p className="text-gray-400 text-[11px] mb-0.5">Good morning</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold text-base">Samuel ⚡</p>
                        <span className="text-[10px] text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                          Online
                        </span>
                      </div>

                      {/* Inline stats */}
                      <div className="grid grid-cols-3 gap-1.5 mt-3">
                        {[
                          { v: '5', l: 'Nearby' },
                          { v: '1', l: 'Active' },
                          { v: '12', l: 'Swaps' },
                        ].map((s, i) => (
                          <div 
                            key={i}
                            className="bg-white/5 border border-white/10 rounded-xl p-2 text-center"
                          >
                            <p className="text-white font-bold text-sm">{s.v}</p>
                            <p className="text-gray-500 text-[10px]">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plan card */}
                    <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-500/20 rounded-2xl p-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">👑</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-semibold">Premium Plan</p>
                        <div className="w-full h-1 bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                          <div className="w-[88%] h-full bg-purple-500 rounded-full" />
                        </div>
                      </div>
                      <p className="text-purple-300 text-xs font-bold flex-shrink-0">88 left</p>
                    </div>

                    {/* Stations */}
                    <div>
                      <p className="text-gray-500 text-[11px] px-1 mb-1.5">Nearby Stations</p>
                      <div className="space-y-1.5">
                        {[
                          { n: 'Beach Side', d: '0.3km', b: 43, hot: true },
                          { n: 'Mall Road', d: '0.8km', b: 38, hot: false },
                          { n: 'Tech Park', d: '1.2km', b: 12, hot: false },
                        ].map((st, i) => (
                          <div 
                            key={i}
                            className={`rounded-2xl p-3 flex items-center gap-2.5 ${
                              i === 0 ? 'bg-white/10 border border-white/15' : 'bg-gray-900'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <ThunderboltFilled className="text-white text-[10px]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold truncate">{st.n}</p>
                              <p className="text-gray-500 text-[10px]">{st.d} away</p>
                            </div>
                            <span 
                              className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                                st.b > 20 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {st.b}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating pill — swap complete */}
                <div className="absolute -left-14 top-1/3 bg-white rounded-2xl shadow-2xl p-3 border border-gray-100 flex items-center gap-2.5 animate-[float_3s_ease-in-out_infinite]">
                  <div className="w-7 h-7 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircleFilled className="text-green-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-900 whitespace-nowrap">Swap Complete!</p>
                    <p className="text-[10px] text-gray-400 whitespace-nowrap">2 min 14 sec</p>
                  </div>
                </div>

                {/* Floating pill — live stations */}
                <div 
                  className="absolute -right-10 bottom-28 bg-gray-900 rounded-2xl shadow-2xl px-3 py-2.5 border border-gray-700 flex items-center gap-2 animate-[float_4s_ease-in-out_infinite]"
                  style={{ animationDelay: '1.5s' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <p className="text-xs font-semibold text-white whitespace-nowrap">500+ live</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-gray-100 bg-white overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Compatible with leading EV brands
          </p>
        </div>

        {/* Scrolling logo track */}
        <div className="flex gap-12 animate-[scroll_20s_linear_infinite] w-max">
          {/* Render logos twice for seamless loop */}
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-12">
              {[
                {
                  name: 'Tesla',
                  color: '#CC0000',
                  svg: 'https://cdn.simpleicons.org/tesla/CC0000'
                },
                {
                  name: 'BMW',
                  color: '#0066B1',
                  svg: 'https://cdn.simpleicons.org/bmw/0066B1'
                },
                {
                  name: 'Audi',
                  color: '#BB0A30',
                  svg: 'https://cdn.simpleicons.org/audi/BB0A30'
                },
                {
                  name: 'Volkswagen',
                  color: '#001E50',
                  svg: 'https://cdn.simpleicons.org/volkswagen/001E50'
                },
                {
                  name: 'Hyundai',
                  color: '#002C5F',
                  svg: 'https://cdn.simpleicons.org/hyundai/002C5F'
                },
                {
                  name: 'Nissan',
                  color: '#C3002F',
                  svg: 'https://cdn.simpleicons.org/nissan/C3002F'
                },
                {
                  name: 'Kia',
                  color: '#05141F',
                  svg: 'https://cdn.simpleicons.org/kia/05141F'
                },
                {
                  name: 'Ford',
                  color: '#003478',
                  svg: 'https://cdn.simpleicons.org/ford/003478'
                },
              ].map((brand, brandIndex) => (
                <div 
                  key={`${setIndex}-${brandIndex}`}
                  className="flex items-center gap-3 flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:scale-110 transition-all duration-300 p-2">
                    <img
                      src={brand.svg}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-base font-semibold text-gray-400 group-hover:text-gray-900 transition-colors duration-300 whitespace-nowrap">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Live Stats Ticker */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Platform Stats
            </span>
          </div>

          {/* Stats grid */}
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                value: counts.stations >= 500 ? '500+' : `${counts.stations}`,
                label: 'Active Stations',
                sub: 'Across the network',
                icon: <EnvironmentOutlined />,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                value: counts.swaps >= 12400 ? '12,400' : counts.swaps.toLocaleString(),
                label: 'Swaps Today',
                sub: 'And counting',
                icon: <ThunderboltFilled />,
                color: 'text-yellow-500',
                bg: 'bg-yellow-50',
                live: true,
              },
              {
                value: counts.drivers >= 50000
                  ? '50K+'
                  : counts.drivers >= 1000
                  ? `${(counts.drivers / 1000).toFixed(1)}K`
                  : `${counts.drivers}`,
                label: 'Active Drivers',
                sub: 'Across all plans',
                icon: <RocketOutlined />,
                color: 'text-purple-500',
                bg: 'bg-purple-50',
              },
              {
                value: counts.uptime >= 99.8 ? '99.8%' : `${counts.uptime}%`,
                label: 'Uptime',
                sub: 'Last 30 days',
                icon: <SafetyOutlined />,
                color: 'text-green-500',
                bg: 'bg-green-50',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {/* Icon + live badge row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-base ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  {stat.live && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>

                {/* Value */}
                <p className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                  {stat.value}
                </p>

                {/* Label */}
                <p className="text-sm font-semibold text-gray-700 mb-0.5">
                  {stat.label}
                </p>

                {/* Sub */}
                <p className="text-xs text-gray-400">
                  {stat.sub}
                </p>
              </div>
            ))}
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

      {/* For Producers Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT — Content */}
            <div>
              {/* Label */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider mb-6">
                <ThunderboltFilled className="text-yellow-500 text-xs" />
                For Station Owners
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Own a station?
                <br />
                <span className="text-gray-400">Start earning today.</span>
              </h2>

              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                Join our growing network of battery swap station owners. List your station, manage your inventory, and earn revenue from every swap.
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-10">
                {[
                  {
                    icon: <RocketOutlined />,
                    title: 'Easy Station Setup',
                    desc: 'List your station in minutes. Add location, batteries, and go live instantly.'
                  },
                  {
                    icon: <ClockCircleOutlined />,
                    title: 'Real-Time Dashboard',
                    desc: 'Monitor bookings, battery inventory, and revenue from one dashboard.'
                  },
                  {
                    icon: <SafetyOutlined />,
                    title: 'Guaranteed Payments',
                    desc: 'Get paid automatically for every successful swap at your station.'
                  },
                  {
                    icon: <EnvironmentOutlined />,
                    title: 'Wide Reach',
                    desc: 'Your station listed to thousands of nearby EV drivers instantly.'
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 mt-0.5">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">
                        {feature.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(routes.SIGNUP)}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm group"
                >
                  <ThunderboltFilled className="text-yellow-400" />
                  Become a Producer
                  <ArrowRightOutlined className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-gray-400">Free to list · No upfront cost</p>
              </div>
            </div>

            {/* RIGHT — Visual dashboard preview */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl blur-2xl scale-95 opacity-70" />

              {/* Main dark card */}
              <div className="relative bg-gray-900 rounded-3xl p-6 shadow-2xl overflow-hidden">
                {/* Grid bg */}
                <div 
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }} 
                />

                {/* Dashboard header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Producer Dashboard</p>
                    <p className="text-white font-bold">My Stations</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    3 Live
                  </span>
                </div>

                {/* Mock station cards */}
                <div className="relative z-10 space-y-3 mb-6">
                  {[
                    { name: 'Beach Side Station', batteries: 43, revenue: 'Rs 12,400', status: 'green' },
                    { name: 'Mall Road Station', batteries: 38, revenue: 'Rs 9,800', status: 'green' },
                    { name: 'Airport Hub', batteries: 12, revenue: 'Rs 3,200', status: 'yellow' },
                  ].map((station, i) => (
                    <div 
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <ThunderboltFilled className="text-white text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {station.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {station.batteries} batteries
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-white">
                          {station.revenue}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          <span className={`w-1.5 h-1.5 rounded-full ${station.status === 'green' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                          <span className="text-xs text-gray-400">
                            {station.status === 'green' ? 'Active' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Revenue summary */}
                <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Total Revenue</p>
                    <p className="text-xl font-bold text-white">Rs 25,400</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-400 font-semibold">↑ 18% this month</p>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircleFilled className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">New booking!</p>
                  <p className="text-xs text-gray-400">Beach Side Station</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header row - left aligned */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider mb-4">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                What our drivers
                <br />
                <span className="text-gray-400">are saying</span>
              </h2>
            </div>

            {/* Rating summary pill */}
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 self-start lg:self-auto">
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-sm font-semibold text-gray-900">2,000+</p>
                <p className="text-xs text-gray-400">verified reviews</p>
              </div>
            </div>
          </div>

          {/* Masonry-style card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 - tall with highlight */}
            <div className="bg-gray-900 rounded-3xl p-7 text-white flex flex-col justify-between min-h-[280px] hover:scale-[1.01] transition-transform duration-300 row-span-1">
              <div>
                <div className="flex items-center gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-200 text-base leading-relaxed">
                  "I used to plan every trip around charging stations. Now I just swap and go. Takes less time than stopping for coffee. Absolute game changer."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  S
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Samuel Tesfaye</p>
                  <p className="text-xs text-gray-400">Tesla Model 3 · Addis Ababa</p>
                </div>
              </div>
            </div>

            {/* Card 2 - light */}
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-7 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
              <div>
                <div className="flex items-center gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-base leading-relaxed">
                  "As a rideshare driver I cannot afford downtime. BatterySwap keeps me earning without long charging stops. Best investment I made."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  D
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dawit Bekele</p>
                  <p className="text-xs text-gray-400">Kia EV6 · Rideshare driver</p>
                </div>
              </div>
            </div>

            {/* Card 3 - white with border */}
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
              <div>
                <div className="flex items-center gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-base leading-relaxed">
                  "Finding a swap station is so easy. Real-time availability means I always know exactly where to go before I even leave home."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-sm flex-shrink-0">
                  M
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Meron Alemu</p>
                  <p className="text-xs text-gray-400">Nissan Leaf · Daily commuter</p>
                </div>
              </div>
            </div>

            {/* Card 4 - wide spanning 2 cols */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex flex-col md:flex-row items-start md:items-center gap-6 hover:scale-[1.005] transition-transform duration-300">
              {/* Left quote */}
              <div className="flex-1">
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-base leading-relaxed">
                  "The Premium plan is worth every birr. Unlimited swaps mean I never stress about battery levels on long trips across the city."
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-20 bg-gray-100 flex-shrink-0" />

              {/* Author + stats */}
              <div className="flex flex-col gap-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    H
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Hana Girma</p>
                    <p className="text-xs text-gray-400">BMW i3 · Premium member</p>
                  </div>
                </div>

                {/* Mini stat */}
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 rounded-xl px-3 py-2 text-center border border-green-100">
                    <p className="text-lg font-bold text-green-600">47</p>
                    <p className="text-xs text-gray-400">swaps done</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl px-3 py-2 text-center border border-blue-100">
                    <p className="text-lg font-bold text-blue-600">3mo</p>
                    <p className="text-xs text-gray-400">member</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5 - single col stat card */}
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-7 flex flex-col justify-center items-center text-center hover:scale-[1.01] transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-4">
                <ThunderboltFilled className="text-yellow-400 text-xl" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">50K+</p>
              <p className="text-sm font-semibold text-gray-700 mb-1">Happy Drivers</p>
              <p className="text-xs text-gray-400">and growing every day</p>
              <div className="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Active right now</span>
              </div>
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
