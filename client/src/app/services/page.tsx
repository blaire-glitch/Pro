'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import {
  HiSearch,
  HiArrowRight,
  HiSparkles,
  HiCreditCard,
  HiHeart,
  HiHome,
  HiFilm,
  HiShieldCheck,
  HiWifi,
  HiLightningBolt,
  HiDeviceMobile,
  HiOfficeBuilding,
  HiPlay,
  HiDocumentText,
  HiGlobe,
  HiLockClosed,
  HiX,
  HiLogin,
  HiUserAdd,
} from 'react-icons/hi';
import { FaUtensils, FaGraduationCap } from 'react-icons/fa';

// Public service categories (Transport, Marketplace, Wallet are hidden - subscriber only)
const categories = [
  {
    id: 'food',
    name: 'Food Delivery',
    description: 'Restaurants & Groceries',
    icon: FaUtensils,
    color: 'from-green-500 to-emerald-500',
    href: '/services/food',
    services: ['Restaurants', 'Groceries', 'Fast Food', 'Local Dishes'],
  },
  {
    id: 'bills',
    name: 'Pay Bills',
    description: 'Utilities & Subscriptions',
    icon: HiCreditCard,
    color: 'from-blue-500 to-indigo-500',
    href: '/wallet/bills',
    services: ['KPLC', 'Water', 'Internet', 'TV'],
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Doctors & Pharmacy',
    icon: HiHeart,
    color: 'from-red-500 to-pink-500',
    href: '/services/health',
    services: ['Doctors', 'Pharmacy', 'Lab Tests', 'Ambulance'],
  },
  {
    id: 'beauty',
    name: 'Beauty & Spa',
    description: 'Salons & Wellness',
    icon: HiSparkles,
    color: 'from-purple-500 to-pink-500',
    href: '/search?category=beauty',
    services: ['Hair', 'Nails', 'Massage', 'Spa'],
  },
  {
    id: 'home',
    name: 'Home Services',
    description: 'Cleaning & Repairs',
    icon: HiHome,
    color: 'from-teal-500 to-cyan-500',
    href: '/search?category=home',
    services: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry'],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Events & Tickets',
    icon: HiFilm,
    color: 'from-yellow-500 to-orange-500',
    href: '/services/entertainment',
    services: ['Movies', 'Events', 'Games', 'Streaming'],
  },
  {
    id: 'government',
    name: 'Government',
    description: 'eCitizen & KRA',
    icon: HiShieldCheck,
    color: 'from-gray-600 to-gray-800',
    href: '/services/government',
    services: ['eCitizen', 'KRA', 'NTSA', 'Huduma'],
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Tutors & Courses',
    icon: FaGraduationCap,
    color: 'from-indigo-500 to-purple-500',
    href: '/services/education',
    services: ['Tutoring', 'Online Courses', 'Skill Training', 'Languages'],
  },
];

// Quick access services (public) - using icons instead of emojis
const frequentServices = [
  { id: 1, name: 'Buy Airtime', icon: HiDeviceMobile, count: 38, href: '/services/airtime', color: 'bg-green-500' },
  { id: 2, name: 'Pay KPLC', icon: HiLightningBolt, count: 24, href: '/wallet/bills', color: 'bg-yellow-500' },
  { id: 3, name: 'Order Food', icon: FaUtensils, count: 22, href: '/services/food', color: 'bg-orange-500' },
  { id: 4, name: 'Buy Data', icon: HiWifi, count: 15, href: '/services/data', color: 'bg-blue-500' },
  { id: 5, name: 'Pay Bills', icon: HiDocumentText, count: 12, href: '/wallet/bills', color: 'bg-purple-500' },
  { id: 6, name: 'Health', icon: HiHeart, count: 10, href: '/services/health', color: 'bg-red-500' },
];

// Popular mini-apps (public versions only)
const miniApps = [
  {
    id: 1,
    name: 'Safaricom',
    icon: HiDeviceMobile,
    description: 'Airtime & Data',
    users: '5.2K',
    href: '/services/airtime',
    color: 'bg-green-500',
  },
  {
    id: 2,
    name: 'KPLC',
    icon: HiLightningBolt,
    description: 'Pay Tokens',
    users: '3.8K',
    href: '/wallet/bills',
    color: 'bg-yellow-500',
  },
  {
    id: 3,
    name: 'Showmax',
    icon: HiPlay,
    description: 'Streaming',
    users: '2.9K',
    href: '/services/entertainment',
    color: 'bg-red-500',
  },
  {
    id: 4,
    name: 'eCitizen',
    icon: HiOfficeBuilding,
    description: 'Government',
    users: '2.1K',
    href: '/services/government',
    color: 'bg-gray-600',
  },
  {
    id: 5,
    name: 'NHIF',
    icon: HiShieldCheck,
    description: 'Health Insurance',
    users: '1.8K',
    href: '/services/health',
    color: 'bg-blue-500',
  },
  {
    id: 6,
    name: 'DStv',
    icon: HiGlobe,
    description: 'TV Subscription',
    users: '1.5K',
    href: '/wallet/bills',
    color: 'bg-indigo-500',
  },
];

// Promotions
const promotions = [
  {
    id: 1,
    title: 'Free Delivery',
    description: 'Orders over KES 500',
    color: 'from-green-400 to-emerald-500',
    icon: FaUtensils,
  },
  {
    id: 2,
    title: 'Cashback on Bills',
    description: '5% back on KPLC',
    color: 'from-blue-400 to-indigo-500',
    icon: HiLightningBolt,
  },
  {
    id: 3,
    title: 'Health Discount',
    description: '10% off consultations',
    color: 'from-red-400 to-pink-500',
    icon: HiHeart,
  },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Handle service click - require login to use services
  const handleServiceClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPendingAction(href);
      setShowLoginPrompt(true);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push(`/login?redirect=${pendingAction || '/services'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2">Services</h1>
            <p className="text-white/80 mb-6">Essential services at your fingertips</p>
            
            {/* Search Bar */}
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services, bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-4">
          {/* Promotions Carousel */}
          <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3" style={{ width: 'max-content' }}>
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className={`bg-gradient-to-r ${promo.color} rounded-2xl p-4 text-white min-w-[260px]`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">{promo.title}</p>
                      <p className="text-white/80 text-sm">{promo.description}</p>
                    </div>
                    <promo.icon className="w-10 h-10 opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Quick Access</h2>
              <Link href="/dashboard" className="text-primary-500 text-sm font-medium flex items-center gap-1">
                See all <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {frequentServices.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  onClick={(e) => handleServiceClick(e, service.href)}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-2`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium">{service.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Service Categories */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  onClick={(e) => handleServiceClick(e, category.href)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {category.services.slice(0, 2).map((service, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Mini-Apps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Popular Services</h2>
              <button className="text-primary-500 text-sm font-medium flex items-center gap-1">
                View all <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {miniApps.map((app) => (
                <Link
                  key={app.id}
                  href={app.href}
                  onClick={(e) => handleServiceClick(e, app.href)}
                  className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{app.name}</h3>
                  <p className="text-xs text-gray-500">{app.description}</p>
                  <p className="text-xs text-primary-500 mt-1">{app.users} users</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              <Link href="/dashboard" className="text-primary-500 text-sm font-medium flex items-center gap-1">
                See all <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: HiLightningBolt, name: 'KPLC Bill', time: '2 hours ago', amount: '-KES 2,500', color: 'bg-yellow-500' },
                { icon: HiDeviceMobile, name: 'Safaricom Airtime', time: '5 hours ago', amount: '-KES 100', color: 'bg-green-500' },
                { icon: FaUtensils, name: 'Food Delivery', time: 'Yesterday', amount: '-KES 850', color: 'bg-orange-500' },
                { icon: HiHeart, name: 'Health Consultation', time: 'Yesterday', amount: '-KES 500', color: 'bg-red-500' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{activity.name}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-500 text-sm">{activity.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscriber-Only Notice */}
          <div className="mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4 border border-primary-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiLockClosed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Unlock Premium Services</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get access to Transport, Marketplace, and Wallet features with AfriPass subscription.
                </p>
                <Link 
                  href="/afripass"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Learn more about AfriPass <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Login Required Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiLockClosed className="w-8 h-8 text-primary-500" />
              </div>
              <p className="text-gray-600">
                To use this service, please log in or create an account.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <HiLogin className="w-5 h-5" />
                Log In
              </button>
              <Link
                href={`/register?redirect=${pendingAction || '/services'}`}
                className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <HiUserAdd className="w-5 h-5" />
                Create Account
              </Link>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
