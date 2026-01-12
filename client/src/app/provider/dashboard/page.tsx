'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  HiHome, HiCalendar, HiCurrencyDollar, HiChartBar,
  HiStar, HiCog, HiMenu, HiX, HiBell, HiTrendingUp,
  HiTrendingDown, HiUserGroup, HiClock, HiCheck,
  HiPencil, HiGift, HiLink, HiTag
} from 'react-icons/hi';
import { format } from 'date-fns';
import Logo, { LogoIcon } from '@/components/ui/Logo';

// Mock provider data
// Provider data - Kisumu based
const mockProviderData = {
  name: 'Wanjiku Beauty Studio',
  location: 'Milimani, Kisumu',
  avatar: 'https://ui-avatars.com/api/?name=Mary+Wanjiku&background=FF6B9D&color=fff&size=100',
  rating: 4.8,
  reviewCount: 127,
  isVerified: true,
  subscription: 'Premium',
};

const mockStats = {
  todayBookings: 3,
  weeklyEarnings: 45000,
  monthlyEarnings: 185000,
  totalCustomers: 450,
  avgRating: 4.8,
  completionRate: 98,
};

const mockRecentBookings = [
  {
    id: 'b1',
    customer: { name: 'Sarah A.', avatar: 'https://ui-avatars.com/api/?name=Sarah+A&background=random' },
    service: 'Knotless Braids',
    date: '2024-01-20',
    time: '10:00',
    status: 'confirmed',
    price: 5000,
  },
  {
    id: 'b2',
    customer: { name: 'Jane W.', avatar: 'https://ui-avatars.com/api/?name=Jane+W&background=random' },
    service: 'Box Braids',
    date: '2024-01-20',
    time: '14:00',
    status: 'pending',
    price: 3500,
  },
  {
    id: 'b3',
    customer: { name: 'Amina O.', avatar: 'https://ui-avatars.com/api/?name=Amina+O&background=random' },
    service: 'Dreadlock Retwist',
    date: '2024-01-21',
    time: '09:00',
    status: 'confirmed',
    price: 2500,
  },
];

const mockEarningsData = [
  { day: 'Mon', amount: 8500 },
  { day: 'Tue', amount: 12000 },
  { day: 'Wed', amount: 9500 },
  { day: 'Thu', amount: 15000 },
  { day: 'Fri', amount: 18000 },
  { day: 'Sat', amount: 22000 },
  { day: 'Sun', amount: 0 },
];

const navItems = [
  { icon: HiHome, label: 'Dashboard', href: '/provider/dashboard', active: true },
  { icon: HiCalendar, label: 'Bookings', href: '/provider/bookings' },
  { icon: HiTag, label: 'Services', href: '/provider/services' },
  { icon: HiCurrencyDollar, label: 'Earnings', href: '/provider/earnings' },
  { icon: HiChartBar, label: 'Analytics', href: '/provider/analytics' },
  { icon: HiStar, label: 'Reviews', href: '/provider/reviews' },
  { icon: HiCog, label: 'Settings', href: '/provider/settings' },
];

export default function ProviderDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const maxEarning = Math.max(...mockEarningsData.map(d => d.amount));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <HiMenu className="w-6 h-6 text-gray-600" />
          </button>
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <button aria-label="Notifications" className="relative">
            <HiBell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <HiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Provider Profile */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Image
              src={mockProviderData.avatar}
              alt=""
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{mockProviderData.name}</h3>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary text-xs">{mockProviderData.subscription}</span>
                <span className="flex items-center text-xs text-yellow-600">
                  <HiStar className="w-3 h-3 mr-0.5" />
                  {mockProviderData.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
                item.active
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-4 text-white">
            <h4 className="font-semibold mb-1">Boost Your Visibility</h4>
            <p className="text-sm opacity-90 mb-3">Upgrade to Premium for featured listings</p>
            <button className="w-full bg-white text-primary-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Mary!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <HiBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <Image
              src={mockProviderData.avatar}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Today&apos;s Bookings</span>
                <div className="p-2 bg-primary-100 rounded-lg">
                  <HiCalendar className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.todayBookings}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <HiTrendingUp className="w-4 h-4 mr-1" />
                <span>+2 from yesterday</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Weekly Earnings</span>
                <div className="p-2 bg-green-100 rounded-lg">
                  <HiCurrencyDollar className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">KSh {mockStats.weeklyEarnings.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <HiTrendingUp className="w-4 h-4 mr-1" />
                <span>+15% vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Total Customers</span>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HiUserGroup className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.totalCustomers}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <HiTrendingUp className="w-4 h-4 mr-1" />
                <span>+28 this month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Avg Rating</span>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <HiStar className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.avgRating}</div>
              <div className="text-sm text-gray-500 mt-1">
                {mockStats.completionRate}% completion rate
              </div>
            </div>
          </div>

          {/* Charts and Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-gray-900">Weekly Earnings</h2>
                <span className="text-primary-600 font-semibold">
                  KSh {mockEarningsData.reduce((a, b) => a + b.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-end justify-between h-48 gap-2">
                {mockEarningsData.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                      style={{ height: `${(day.amount / maxEarning) * 100}%`, minHeight: day.amount > 0 ? '8px' : '0' }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg text-gray-900">Upcoming</h2>
                <Link href="/provider/bookings" className="text-primary-600 text-sm hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {mockRecentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Image
                      src={booking.customer.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{booking.customer.name}</h4>
                      <p className="text-xs text-gray-500">{booking.service}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <HiClock className="w-3 h-3" />
                        <span>{booking.date} at {booking.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-xs ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/provider/services" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiPencil className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900">Edit Services</h3>
              <p className="text-sm text-gray-500">Update your offerings</p>
            </Link>
            <Link href="/provider/availability" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiCalendar className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-medium text-gray-900">Set Availability</h3>
              <p className="text-sm text-gray-500">Manage your schedule</p>
            </Link>
            <Link href="/provider/promotions" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiGift className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900">Promotions</h3>
              <p className="text-sm text-gray-500">Create offers</p>
            </Link>
            <Link href="/provider/share" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiLink className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">ShareLink</h3>
              <p className="text-sm text-gray-500">Get more customers</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
