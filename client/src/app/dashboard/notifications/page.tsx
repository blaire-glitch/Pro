'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiBell, HiCheck, HiCalendar, HiCurrencyDollar, 
  HiStar, HiGift, HiArrowLeft, HiTrash, HiCheckCircle
} from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const mockNotifications = [
  {
    id: '1',
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your appointment with Wanjiku Beauty Studio for Box Braids has been confirmed for Jan 20 at 10:00 AM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    icon: HiCalendar,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    actionUrl: '/dashboard',
  },
  {
    id: '2',
    type: 'payment_received',
    title: 'Payment Successful',
    message: 'Your payment of KES 3,500 for Box Braids has been processed successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    icon: HiCurrencyDollar,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    actionUrl: '/dashboard',
  },
  {
    id: '3',
    type: 'review_request',
    title: 'Rate Your Experience',
    message: 'How was your Swedish Massage with Serenity Wellness Spa? Share your feedback!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
    icon: HiStar,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    actionUrl: '/provider/3',
  },
  {
    id: '4',
    type: 'reward',
    title: 'You Earned Points!',
    message: 'You earned 350 loyalty points from your last booking. You now have 2,450 points!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    icon: HiGift,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    actionUrl: '/dashboard/rewards',
  },
  {
    id: '5',
    type: 'promo',
    title: '20% Off This Weekend!',
    message: 'Enjoy 20% off all wellness services this weekend. Use code RELAX20 at checkout.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    icon: HiGift,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    actionUrl: '/search?category=wellness',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                <HiArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">{unreadCount} unread</p>
              </div>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Mark all as read
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiBell className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h2>
              <p className="text-gray-600">You have no new notifications</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={`p-4 flex gap-4 ${!notification.read ? 'bg-primary-50/50' : ''} ${
                    index !== notifications.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className={`w-6 h-6 ${notification.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-2">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Mark as read"
                          >
                            <HiCheckCircle className="w-5 h-5 text-gray-400 hover:text-primary-600" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Delete"
                        >
                          <HiTrash className="w-5 h-5 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.actionUrl && (
                      <Link 
                        href={notification.actionUrl}
                        className="inline-block mt-3 text-sm text-primary-600 hover:underline"
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
