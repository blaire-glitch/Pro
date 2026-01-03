'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { HiLockClosed, HiSparkles, HiCheck, HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: string;
}

const subscriptionPlans = [
  {
    name: 'Basic',
    price: 299,
    period: 'month',
    features: [
      'Send & Receive Money',
      'Bill Payments',
      'Basic Support',
      '5 Free Transfers/month',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Premium',
    price: 599,
    period: 'month',
    features: [
      'Everything in Basic',
      'Unlimited Free Transfers',
      'Priority Support',
      'Transport Booking',
      'Marketplace Access',
      'Exclusive Discounts',
    ],
    color: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    name: 'Business',
    price: 1499,
    period: 'month',
    features: [
      'Everything in Premium',
      'Business Analytics',
      'Multiple Users',
      'API Access',
      'Dedicated Account Manager',
    ],
    color: 'from-amber-500 to-orange-500',
  },
];

export function SubscriptionGuard({ children, feature = 'this feature' }: SubscriptionGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Short delay to allow auth state to load
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiLockClosed className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to access {feature}. Create an account to enjoy all Afrionex features.
          </p>
          <div className="space-y-3">
            <Link 
              href="/login"
              className="block w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Log In
            </Link>
            <Link 
              href="/register"
              className="block w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary-500 hover:text-primary-500 transition-all"
            >
              Create Account
            </Link>
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 w-full py-3 text-gray-500 hover:text-gray-700 transition-all"
            >
              <HiArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has active subscription - allow access
  if (user.subscription?.isActive) {
    return <>{children}</>;
  }

  // No subscription - show upgrade screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-white/10 rounded-full text-white transition-all"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">Subscription Required</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
            <HiSparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock {feature}
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Subscribe to AfriPass to access premium features including wallet services, 
            transport booking, marketplace, and exclusive rewards.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {subscriptionPlans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-6 ${
                plan.popular 
                  ? 'border-purple-500 ring-2 ring-purple-500/20' 
                  : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-white">KES {plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0`}>
                      <HiCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Why Subscribe to AfriPass?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🔐', label: 'Secure Payments' },
              { icon: '⚡', label: 'Instant Transfers' },
              { icon: '🎁', label: 'Exclusive Rewards' },
              { icon: '📞', label: 'Priority Support' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <button 
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
