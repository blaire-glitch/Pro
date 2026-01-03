'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SubscriptionGuard } from '@/components/guards/SubscriptionGuard';
import { 
  HiCash, HiCreditCard, HiArrowUp, HiArrowDown, HiRefresh,
  HiUsers, HiLightningBolt, HiShieldCheck, HiPlus, HiDotsHorizontal,
  HiChevronRight, HiPhone, HiWifi, HiHome, HiLightBulb, HiTruck,
  HiGift, HiStar, HiEye, HiEyeOff, HiQrcode, HiClock
} from 'react-icons/hi';
import { FaMobileAlt } from 'react-icons/fa';

// Mock wallet data
const walletData = {
  balance: 15750.00,
  currency: 'KES',
  accountNumber: '**** 4521',
  tier: 'Gold',
  points: 2450,
  pendingCashback: 125.50,
};

const quickActions = [
  { icon: HiArrowUp, label: 'Send', color: 'bg-blue-500', href: '/wallet/send' },
  { icon: HiArrowDown, label: 'Request', color: 'bg-green-500', href: '/wallet/request' },
  { icon: HiPlus, label: 'Add Money', color: 'bg-purple-500', href: '/wallet/topup' },
  { icon: HiQrcode, label: 'Scan & Pay', color: 'bg-orange-500', href: '/wallet/scan' },
];

const billCategories = [
  { icon: HiPhone, label: 'Airtime', color: 'text-green-600 bg-green-100' },
  { icon: HiWifi, label: 'Internet', color: 'text-blue-600 bg-blue-100' },
  { icon: HiLightBulb, label: 'Electricity', color: 'text-yellow-600 bg-yellow-100' },
  { icon: HiHome, label: 'Rent', color: 'text-purple-600 bg-purple-100' },
  { icon: FaMobileAlt, label: 'TV', color: 'text-red-600 bg-red-100' },
  { icon: HiTruck, label: 'Water', color: 'text-cyan-600 bg-cyan-100' },
];

const recentTransactions = [
  { id: 1, type: 'sent', name: 'John Ochieng', amount: -500, time: '10 mins ago', icon: 'user' },
  { id: 2, type: 'received', name: 'Salary - Safaricom', amount: 45000, time: '2 hours ago', icon: 'office' },
  { id: 3, type: 'bill', name: 'KPLC Tokens', amount: -1500, time: 'Yesterday', icon: 'lightning' },
  { id: 4, type: 'cashback', name: 'Cashback Reward', amount: 75, time: 'Yesterday', icon: 'gift' },
  { id: 5, type: 'sent', name: 'Mama Mboga', amount: -350, time: '2 days ago', icon: 'shopping' },
];

const savingsPockets = [
  { name: 'Emergency Fund', balance: 5000, goal: 20000, color: 'bg-red-500' },
  { name: 'Holiday Trip', balance: 12500, goal: 50000, color: 'bg-blue-500' },
  { name: 'New Phone', balance: 8000, goal: 15000, color: 'bg-purple-500' },
];

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SubscriptionGuard feature="Wallet">
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-24">
        {/* Wallet Card */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 pt-8 pb-16">
          <div className="container mx-auto px-4">
            {/* Greeting */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm">Habari, karibu!</p>
                <h1 className="text-white text-xl font-bold">Your Wallet</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <HiStar className="w-3 h-3" /> {walletData.tier}
                </span>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Available Balance</span>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/80 hover:text-white"
                >
                  {showBalance ? <HiEye className="w-5 h-5" /> : <HiEyeOff className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-white">
                  {showBalance ? formatCurrency(walletData.balance) : '••••••'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-white/60">Points: </span>
                    <span className="text-yellow-300 font-semibold">{walletData.points.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/60">Cashback: </span>
                    <span className="text-green-300 font-semibold">{formatCurrency(walletData.pendingCashback)}</span>
                  </div>
                </div>
                <span className="text-white/60 text-xs">{walletData.accountNumber}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between mt-6 px-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 ${action.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pay Bills */}
        <section className="container mx-auto px-4 -mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Pay Bills</h2>
              <Link href="/wallet/bills" className="text-primary-600 text-sm font-medium flex items-center gap-1">
                See All <HiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {billCategories.map((bill) => (
                <button
                  key={bill.label}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${bill.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <bill.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600">{bill.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Savings Pockets */}
        <section className="container mx-auto px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Savings Pockets</h2>
              <button className="text-primary-600 text-sm font-medium flex items-center gap-1">
                <HiPlus className="w-4 h-4" /> New Pocket
              </button>
            </div>
            <div className="space-y-4">
              {savingsPockets.map((pocket) => {
                const progress = (pocket.balance / pocket.goal) * 100;
                return (
                  <div key={pocket.name} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{pocket.name}</span>
                      <span className="text-sm text-gray-500">{formatCurrency(pocket.balance)} / {formatCurrency(pocket.goal)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${pocket.color} rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{progress.toFixed(0)}% saved</span>
                      <span className="text-xs text-primary-600 font-medium">
                        {formatCurrency(pocket.goal - pocket.balance)} to go
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="container mx-auto px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Transactions</h2>
              <Link href="/wallet/history" className="text-primary-600 text-sm font-medium flex items-center gap-1">
                View All <HiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                      {tx.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tx.name}</p>
                      <p className="text-xs text-gray-500">{tx.time}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="container mx-auto px-4 mt-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <HiGift className="w-6 h-6" />
                <span className="font-bold">Cashback Week!</span>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Get 5% cashback on all bill payments this week. Hakuna matata!
              </p>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors">
                Pay Bills Now
              </button>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="container mx-auto px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Security & Privacy</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <HiShieldCheck className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">Transaction PIN</p>
                  <p className="text-xs text-gray-500">Change your PIN</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <HiLightningBolt className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">Biometric Login</p>
                  <p className="text-xs text-gray-500">Face ID enabled</p>
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </SubscriptionGuard>
  );
}
