'use client';

import Link from 'next/link';
import { HiShoppingCart, HiSearch, HiHeart, HiCalendar } from 'react-icons/hi';

interface EmptyStateProps {
  type: 'cart' | 'search' | 'favorites' | 'bookings' | 'orders' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const emptyStateConfig = {
  cart: {
    icon: HiShoppingCart,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added anything to your cart yet. Start exploring our marketplace!',
    actionLabel: 'Browse Marketplace',
    actionHref: '/marketplace',
  },
  search: {
    icon: HiSearch,
    title: 'No results found',
    description: 'We couldn\'t find what you\'re looking for. Try adjusting your search or filters.',
    actionLabel: 'Clear Filters',
    actionHref: '/search',
  },
  favorites: {
    icon: HiHeart,
    title: 'No favorites yet',
    description: 'Save your favorite providers and products for quick access later.',
    actionLabel: 'Discover Providers',
    actionHref: '/search',
  },
  bookings: {
    icon: HiCalendar,
    title: 'No bookings yet',
    description: 'You haven\'t made any bookings yet. Find a service and book your first appointment!',
    actionLabel: 'Find Services',
    actionHref: '/search',
  },
  orders: {
    icon: HiShoppingCart,
    title: 'No orders yet',
    description: 'Your order history is empty. Start shopping to see your orders here.',
    actionLabel: 'Shop Now',
    actionHref: '/marketplace',
  },
  generic: {
    icon: HiSearch,
    title: 'Nothing here',
    description: 'This section is empty.',
    actionLabel: 'Go Home',
    actionHref: '/',
  },
};

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionLabel, 
  actionHref,
  onAction 
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || config.title}
      </h3>
      
      <p className="text-gray-500 max-w-md mb-6">
        {description || config.description}
      </p>
      
      {(actionHref || config.actionHref || onAction) && (
        onAction ? (
          <button
            onClick={onAction}
            className="btn-primary"
          >
            {actionLabel || config.actionLabel}
          </button>
        ) : (
          <Link 
            href={actionHref || config.actionHref}
            className="btn-primary"
          >
            {actionLabel || config.actionLabel}
          </Link>
        )
      )}
    </div>
  );
}
