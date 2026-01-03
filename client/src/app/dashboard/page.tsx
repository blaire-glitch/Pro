'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import {
  HiCalendar, HiClock, HiLocationMarker, HiCurrencyDollar,
  HiStar, HiHeart, HiBell, HiCog, HiLogout, HiGift,
  HiChevronRight, HiCheck, HiX, HiRefresh, HiClipboardList
} from 'react-icons/hi';

// Mock data
const mockBookings = [
  {
    id: 'b1',
    service: 'Box Braids',
    provider: {
      name: 'Wanjiku Beauty Studio',
      avatar: 'https://ui-avatars.com/api/?name=Mary+Wanjiku&background=FF6B9D&color=fff',
    },
    date: '2024-01-20',
    time: '10:00',
    status: 'confirmed',
    price: 3500,
    location: 'At your location',
  },
  {
    id: 'b2',
    service: 'Deep Cleaning',
    provider: {
      name: 'Ochieng Home Services',
      avatar: 'https://ui-avatars.com/api/?name=John+Ochieng&background=4ECDC4&color=fff',
    },
    date: '2024-01-25',
    time: '09:00',
    status: 'pending',
    price: 4500,
    location: 'At your location',
  },
  {
    id: 'b3',
    service: 'Swedish Massage',
    provider: {
      name: 'Serenity Wellness Spa',
      avatar: 'https://ui-avatars.com/api/?name=Amina+Hassan&background=95E1D3&color=fff',
    },
    date: '2024-01-10',
    time: '14:00',
    status: 'completed',
    price: 4000,
    location: 'At provider location',
  },
];

const mockLoyalty = {
  points: 2450,
  tier: 'Silver',
  nextTier: 'Gold',
  pointsToNextTier: 550,
  rewards: [
    { id: 'r1', name: '10% Off Next Booking', points: 500, icon: 'gift' },
    { id: 'r2', name: 'Free Service Upgrade', points: 1000, icon: 'star' },
    { id: 'r3', name: 'VIP Priority Booking', points: 2000, icon: 'crown' },
  ],
};

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: HiClock,
  confirmed: HiCheck,
  completed: HiCheck,
  cancelled: HiX,
};

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'favorites'>('upcoming');

  const upcomingBookings = mockBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const pastBookings = mockBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="text-center">
                  <Image
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=FF6B9D&color=fff&size=100`}
                    alt=""
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h2 className="font-display font-bold text-xl text-gray-900">
                    {user?.firstName || 'Guest'} {user?.lastName || 'User'}
                  </h2>
                  <p className="text-gray-500 text-sm">{user?.email || 'guest@example.com'}</p>
                </div>

                <hr className="my-4" />

                <nav className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-600"
                  >
                    <HiCalendar className="w-5 h-5" />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    href="/dashboard/favorites"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <HiHeart className="w-5 h-5" />
                    <span>Favorites</span>
                  </Link>
                  <Link
                    href="/dashboard/notifications"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <HiBell className="w-5 h-5" />
                    <span>Notifications</span>
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                  </Link>
                  <Link
                    href="/dashboard/rewards"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <HiGift className="w-5 h-5" />
                    <span>Rewards</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <HiCog className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>

              {/* Loyalty Card */}
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm opacity-80">Loyalty Points</span>
                  <span className="badge bg-white/20 text-white">{mockLoyalty.tier}</span>
                </div>
                <div className="text-3xl font-bold mb-2">{mockLoyalty.points.toLocaleString()}</div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="opacity-80">Progress to {mockLoyalty.nextTier}</span>
                    <span>{mockLoyalty.pointsToNextTier} pts left</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${((3000 - mockLoyalty.pointsToNextTier) / 3000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Link href="/dashboard/rewards" className="text-sm underline hover:no-underline">
                  View Rewards →
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm">
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'upcoming'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upcoming ({upcomingBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'past'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Past ({pastBookings.length})
                  </button>
                </div>

                {/* Bookings List */}
                <div className="p-6">
                  {activeTab === 'upcoming' && (
                    <>
                      {upcomingBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming bookings</h3>
                          <p className="text-gray-600 mb-6">Find and book a service to get started!</p>
                          <Link href="/search" className="btn-primary">
                            Browse Services
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {upcomingBookings.map((booking) => {
                            const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];
                            return (
                              <div key={booking.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                  <Image
                                    src={booking.provider.avatar}
                                    alt=""
                                    width={56}
                                    height={56}
                                    className="rounded-xl"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                                      <span className={`badge ${statusStyles[booking.status as keyof typeof statusStyles]}`}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {booking.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{booking.provider.name}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <HiCalendar className="w-4 h-4" />
                                        {booking.date}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <HiClock className="w-4 h-4" />
                                        {booking.time}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <HiLocationMarker className="w-4 h-4" />
                                        {booking.location}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-gray-900 mb-2">
                                      KSh {booking.price.toLocaleString()}
                                    </div>
                                    <div className="flex gap-2">
                                      <button aria-label="Reschedule booking" className="btn-sm btn-outline">
                                        <HiRefresh className="w-4 h-4" />
                                      </button>
                                      <button aria-label="Cancel booking" className="btn-sm text-red-600 border-red-200 hover:bg-red-50">
                                        <HiX className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'past' && (
                    <>
                      {pastBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <HiClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No past bookings</h3>
                          <p className="text-gray-600">Your booking history will appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pastBookings.map((booking) => {
                            const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];
                            return (
                              <div key={booking.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                  <Image
                                    src={booking.provider.avatar}
                                    alt=""
                                    width={56}
                                    height={56}
                                    className="rounded-xl"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                                      <span className={`badge ${statusStyles[booking.status as keyof typeof statusStyles]}`}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {booking.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{booking.provider.name}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <HiCalendar className="w-4 h-4" />
                                        {booking.date}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <HiClock className="w-4 h-4" />
                                        {booking.time}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-gray-900 mb-2">
                                      KSh {booking.price.toLocaleString()}
                                    </div>
                                    {booking.status === 'completed' && (
                                      <Link href={`/review/${booking.id}`} className="btn-sm btn-primary">
                                        <HiStar className="w-4 h-4 mr-1" />
                                        Review
                                      </Link>
                                    )}
                                    {booking.status === 'completed' && (
                                      <button className="btn-sm btn-outline ml-2">
                                        Book Again
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
