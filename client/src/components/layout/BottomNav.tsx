'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiSearch, HiShoppingCart, HiChat, HiUser } from 'react-icons/hi';
import { useCartStore } from '@/store/cartStore';

const navItems = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'Search', href: '/search', icon: HiSearch },
  { name: 'Cart', href: '/marketplace/cart', icon: HiShoppingCart, showBadge: true },
  { name: 'Messages', href: '/messages', icon: HiChat },
  { name: 'Profile', href: '/dashboard', icon: HiUser },
];

export function BottomNav() {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  // Hide on certain pages
  const hiddenPaths = ['/login', '/register', '/provider/register', '/forgot-password'];
  if (hiddenPaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {item.showBadge && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
