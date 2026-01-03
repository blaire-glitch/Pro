'use client';

import Link from 'next/link';
import { 
  HiCash, HiPhone, HiLightningBolt, HiShoppingCart,
  HiTruck, HiCalendar, HiCreditCard, HiGift
} from 'react-icons/hi';
import { FaBus, FaUtensils } from 'react-icons/fa';

const quickActions = [
  { 
    name: 'Send Money', 
    icon: HiCash, 
    href: '/wallet/send',
    color: 'bg-green-500',
    description: 'Instant transfers'
  },
  { 
    name: 'Buy Airtime', 
    icon: HiPhone, 
    href: '/wallet?action=airtime',
    color: 'bg-blue-500',
    description: 'All networks'
  },
  { 
    name: 'Pay Bills', 
    icon: HiLightningBolt, 
    href: '/wallet',
    color: 'bg-yellow-500',
    description: 'KPLC, Water, TV'
  },
  { 
    name: 'Order Food', 
    icon: FaUtensils, 
    href: '/search?category=delivery&service=food',
    color: 'bg-orange-500',
    description: 'Delivered fast'
  },
  { 
    name: 'Book Ride', 
    icon: FaBus, 
    href: '/search?category=transport',
    color: 'bg-purple-500',
    description: 'Matatu & Boda'
  },
  { 
    name: 'Shop Now', 
    icon: HiShoppingCart, 
    href: '/marketplace',
    color: 'bg-pink-500',
    description: 'Local deals'
  },
  { 
    name: 'Book Service', 
    icon: HiCalendar, 
    href: '/search',
    color: 'bg-teal-500',
    description: 'Beauty, Home & more'
  },
  { 
    name: 'Rewards', 
    icon: HiGift, 
    href: '/dashboard/rewards',
    color: 'bg-red-500',
    description: 'Redeem points'
  },
];

export function QuickActions() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <Link href="/services" className="text-primary-600 text-sm font-medium hover:text-primary-700">
            See All Services →
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex flex-col items-center group"
            >
              <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-200`}>
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 mt-2 text-center">
                {action.name}
              </span>
              <span className="text-xs text-gray-500 text-center hidden md:block">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
