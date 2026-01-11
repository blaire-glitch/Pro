'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiMenu, HiX, HiUser, HiBell, HiSearch, HiShoppingCart, HiLockClosed, HiChat } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { chatApi } from '@/lib/api';
import Logo from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user, isAuthenticated } = useAuthStore();
  const { getItemCount } = useCartStore();
  const router = useRouter();
  const cartCount = getItemCount();

  // Check if user has subscription access (subscriber/client)
  const hasSubscriberAccess = isAuthenticated && user?.subscription?.isActive;

  // Fetch unread message count
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchUnreadCount = async () => {
      try {
        const response = await chatApi.getConversations();
        const conversations = response.data.data || [];
        const totalUnread = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        setUnreadMessages(totalUnread);
      } catch (error) {
        console.error('Failed to fetch unread messages:', error);
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${category}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => handleCategoryClick('beauty')} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
              Beauty
            </button>
            <button onClick={() => handleCategoryClick('home')} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
              Home
            </button>
            <button onClick={() => handleCategoryClick('wellness')} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
              Wellness
            </button>
            <button onClick={() => handleCategoryClick('lifestyle')} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
              Lifestyle
            </button>
            <button onClick={() => handleCategoryClick('delivery')} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
              Delivery
            </button>
            {/* Services link hidden for preview */}
            {/* Transport, Marketplace, Wallet - Only visible to subscribers */}
            {hasSubscriberAccess && (
              <>
                <button onClick={() => handleCategoryClick('transport')} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Transport
                </button>
                <Link href="/marketplace" className="text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm">
                  Marketplace
                </Link>
                <Link href="/wallet" className="text-green-600 font-medium hover:text-green-700 transition-colors text-sm">
                  Wallet
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle size="sm" />
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Search"
            >
              <HiSearch className="w-5 h-5" />
            </button>
            {hasSubscriberAccess && (
              <Link 
                href="/marketplace/cart"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Shopping Cart"
              >
                <HiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/messages"
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors relative"
                  aria-label="Messages"
                >
                  <HiChat className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </span>
                  )}
                </Link>
                <button 
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors relative"
                  aria-label="Notifications"
                >
                  <HiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <HiUser className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <nav className="container mx-auto px-4 flex flex-col gap-4">
            <button onClick={() => handleCategoryClick('beauty')} className="py-2 text-left text-gray-600 hover:text-primary-600">
              Beauty
            </button>
            <button onClick={() => handleCategoryClick('home')} className="py-2 text-left text-gray-600 hover:text-primary-600">
              Home Services
            </button>
            <button onClick={() => handleCategoryClick('wellness')} className="py-2 text-left text-gray-600 hover:text-primary-600">
              Wellness
            </button>
            <button onClick={() => handleCategoryClick('lifestyle')} className="py-2 text-left text-gray-600 hover:text-primary-600">
              Lifestyle
            </button>
            <button onClick={() => handleCategoryClick('delivery')} className="py-2 text-left text-gray-600 hover:text-primary-600">
              Delivery
            </button>
            {/* Services link hidden for preview */}
            
            {/* Subscriber-only sections */}
            {hasSubscriberAccess ? (
              <>
                <hr className="my-2" />
                <p className="text-xs text-gray-400 uppercase tracking-wider">Subscriber Access</p>
                <button onClick={() => handleCategoryClick('transport')} className="py-2 text-left text-gray-600 hover:text-primary-600">
                  Transport
                </button>
                <Link href="/marketplace" className="py-2 text-primary-600 font-medium hover:text-primary-700">
                  Marketplace
                </Link>
                <Link href="/wallet" className="py-2 text-green-600 font-medium hover:text-green-700">
                  Wallet
                </Link>
                <Link href="/marketplace/cart" className="py-2 text-gray-600 hover:text-primary-600 flex items-center gap-2">
                  <HiShoppingCart className="w-5 h-5" /> Cart
                </Link>
              </>
            ) : (
              <>
                <hr className="my-2" />
                <Link href="/afripass" className="py-2 text-primary-600 font-medium hover:text-primary-700 flex items-center gap-2">
                  <HiLockClosed className="w-4 h-4" />
                  Unlock Premium Features
                </Link>
              </>
            )}
            
            <hr className="my-2" />
            {isAuthenticated ? (
              <Link href="/dashboard" className="py-2 text-gray-600 hover:text-primary-600">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="py-2 text-gray-600 hover:text-primary-600">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary text-center">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
