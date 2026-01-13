'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HiSearch, HiLocationMarker, HiArrowRight, HiSparkles,
  HiPhone, HiLightningBolt, HiTruck, HiScissors,
  HiHome, HiHeart, HiCamera, HiShoppingCart
} from 'react-icons/hi';
import { FaUtensils, FaBus } from 'react-icons/fa';

interface SimpleHomeProps {
  onComplete?: () => void;
}

const popularServices = [
  { id: 'hair', name: 'Hair Styling', icon: HiScissors, color: 'bg-pink-500', category: 'beauty' },
  { id: 'cleaning', name: 'Cleaning', icon: HiHome, color: 'bg-teal-500', category: 'home' },
  { id: 'food', name: 'Food Delivery', icon: FaUtensils, color: 'bg-orange-500', category: 'delivery' },
  { id: 'transport', name: 'Book Ride', icon: FaBus, color: 'bg-purple-500', category: 'transport' },
  { id: 'massage', name: 'Massage', icon: HiHeart, color: 'bg-green-500', category: 'wellness' },
  { id: 'photography', name: 'Photography', icon: HiCamera, color: 'bg-indigo-500', category: 'lifestyle' },
];

const quickActions = [
  { name: 'Buy Airtime', icon: HiPhone, href: '/services/airtime', color: 'bg-blue-500' },
  { name: 'Pay Bills', icon: HiLightningBolt, href: '/services/bills', color: 'bg-yellow-500' },
  { name: 'Shop', icon: HiShoppingCart, href: '/marketplace', color: 'bg-pink-500' },
  { name: 'Delivery', icon: HiTruck, href: '/search?category=delivery', color: 'bg-teal-500' },
];

export function SimpleHome() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleServiceClick = (category: string, service?: string) => {
    const params = new URLSearchParams();
    params.set('category', category);
    if (service) params.set('service', service);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 pt-12 pb-24">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-100 text-sm">{greeting} 👋</p>
              <h1 className="text-xl font-bold">What do you need today?</h1>
            </div>
            <Link 
              href="/dashboard"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <HiSparkles className="w-5 h-5" />
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any service..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </form>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-4 -mt-12">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 text-center font-medium">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <div className="px-4 mt-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Popular Services</h2>
            <Link href="/services" className="text-primary-600 text-sm font-medium flex items-center gap-1">
              See all <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {popularServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.category, service.id)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{service.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - Simple Steps */}
      <div className="px-4 mt-8 mb-8">
        <div className="max-w-lg mx-auto">
          <h2 className="font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Search & Select</p>
                  <p className="text-sm text-gray-500">Find the service you need</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Book & Pay</p>
                  <p className="text-sm text-gray-500">Choose time, pay with M-Pesa</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Get Service</p>
                  <p className="text-sm text-gray-500">Provider comes to you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pb-24">
        <div className="max-w-lg mx-auto">
          <Link
            href="/search"
            className="block w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl text-center font-semibold shadow-lg shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    </div>
  );
}
