'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  HiHome, HiCalendar, HiCurrencyDollar, HiChartBar,
  HiStar, HiCog, HiMenu, HiX, HiBell, HiCheck,
  HiClock, HiPhone, HiLocationMarker, HiChat
} from 'react-icons/hi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Logo from '@/components/ui/Logo';

const navItems = [
  { icon: HiHome, label: 'Dashboard', href: '/provider/dashboard' },
  { icon: HiCalendar, label: 'Bookings', href: '/provider/bookings', active: true },
  { icon: HiCurrencyDollar, label: 'Earnings', href: '/provider/earnings' },
  { icon: HiChartBar, label: 'Analytics', href: '/provider/analytics' },
  { icon: HiStar, label: 'Reviews', href: '/provider/reviews' },
  { icon: HiCog, label: 'Settings', href: '/provider/settings' },
];

const mockBookings = [
  {
    id: 'b1',
    customer: { name: 'Sarah A.', avatar: 'https://ui-avatars.com/api/?name=Sarah+A&background=random', phone: '+254 712 345 678' },
    service: 'Knotless Braids',
    date: '2024-01-20',
    time: '10:00',
    duration: 240,
    status: 'confirmed',
    price: 5000,
    location: 'Customer location',
    address: '123 Milimani Road, Kisumu',
    notes: 'Medium-sized braids, waist length',
  },
  {
    id: 'b2',
    customer: { name: 'Jane W.', avatar: 'https://ui-avatars.com/api/?name=Jane+W&background=random', phone: '+254 723 456 789' },
    service: 'Box Braids',
    date: '2024-01-20',
    time: '14:00',
    duration: 180,
    status: 'pending',
    price: 3500,
    location: 'Customer location',
    address: '456 Lurambi Estate, Kakamega',
    notes: '',
  },
  {
    id: 'b3',
    customer: { name: 'Amina O.', avatar: 'https://ui-avatars.com/api/?name=Amina+O&background=random', phone: '+254 734 567 890' },
    service: 'Dreadlock Retwist',
    date: '2024-01-21',
    time: '09:00',
    duration: 120,
    status: 'confirmed',
    price: 2500,
    location: 'My studio',
    address: 'Wanjiku Beauty Studio, Milimani, Kisumu',
    notes: 'Regular client - prefers natural products',
  },
  {
    id: 'b4',
    customer: { name: 'Grace M.', avatar: 'https://ui-avatars.com/api/?name=Grace+M&background=random', phone: '+254 745 678 901' },
    service: 'Bridal Makeup',
    date: '2024-01-25',
    time: '06:00',
    duration: 180,
    status: 'confirmed',
    price: 8000,
    location: 'Customer location',
    address: 'Karen Country Club',
    notes: 'Wedding day - need to be ready by 10am',
  },
  {
    id: 'b5',
    customer: { name: 'Lucy W.', avatar: 'https://ui-avatars.com/api/?name=Lucy+W&background=random', phone: '+254 756 789 012' },
    service: 'Cornrows',
    date: '2024-01-18',
    time: '11:00',
    duration: 90,
    status: 'completed',
    price: 1500,
    location: 'Customer location',
    address: '789 Lavington Green, Nairobi',
    notes: '',
  },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ProviderBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  const filteredBookings = filter === 'all' 
    ? mockBookings 
    : mockBookings.filter(b => b.status === filter);

  const handleAccept = (id: string) => {
    toast.success('Booking accepted!');
  };

  const handleDecline = (id: string) => {
    toast.success('Booking declined');
  };

  const handleComplete = (id: string) => {
    toast.success('Booking marked as complete!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <HiMenu className="w-6 h-6 text-gray-600" />
          </button>
          <span className="font-display font-bold text-primary-600">Bookings</span>
          <button className="relative" aria-label="Notifications">
            <HiBell className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close menu">
            <HiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
                item.active ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-500">Manage your appointments</p>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'pending', 'confirmed', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && (
                  <span className="ml-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {mockBookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Image
                      src={booking.customer.avatar}
                      alt=""
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.customer.name}</h3>
                      <p className="text-sm text-gray-500">{booking.service}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="w-5 h-5 text-gray-400" />
                      <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="w-5 h-5 text-gray-400" />
                      <span>{booking.time} ({booking.duration} min)</span>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className="font-semibold text-gray-900">KES {booking.price.toLocaleString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(booking.id)}
                          className="btn-sm bg-green-500 text-white hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(booking.id)}
                          className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleComplete(booking.id)}
                        className="btn-sm btn-primary"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="btn-sm btn-outline"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
                  <HiLocationMarker className="w-4 h-4" />
                  <span>{booking.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} aria-label="Close">
                  <HiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedBooking.customer.avatar}
                    alt=""
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBooking.customer.name}</h3>
                    <p className="text-gray-500">{selectedBooking.customer.phone}</p>
                  </div>
                </div>

                <hr />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">KES {selectedBooking.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{format(new Date(selectedBooking.date), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedBooking.time} ({selectedBooking.duration} min)</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedBooking.address}</p>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <a href={`tel:${selectedBooking.customer.phone}`} className="flex-1 btn-outline flex items-center justify-center gap-2">
                    <HiPhone className="w-5 h-5" />
                    Call
                  </a>
                  <button className="flex-1 btn-outline flex items-center justify-center gap-2">
                    <HiChat className="w-5 h-5" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
