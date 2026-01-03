'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiGift, HiArrowLeft, HiStar, HiChevronRight, 
  HiCheckCircle, HiLockClosed, HiSparkles
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const mockLoyalty = {
  points: 2450,
  tier: 'Silver',
  nextTier: 'Gold',
  pointsToNextTier: 550,
  totalPointsForNextTier: 3000,
  lifetimePoints: 5230,
  lifetimeSavings: 4500,
};

const tiers = [
  { name: 'Bronze', minPoints: 0, color: 'bg-amber-600', benefits: ['5% cashback on bookings', 'Birthday reward'] },
  { name: 'Silver', minPoints: 1000, color: 'bg-gray-400', benefits: ['7% cashback on bookings', 'Priority support', 'Birthday reward'] },
  { name: 'Gold', minPoints: 3000, color: 'bg-yellow-500', benefits: ['10% cashback on bookings', 'Priority support', 'Free service upgrade monthly', 'Exclusive offers'] },
  { name: 'Platinum', minPoints: 10000, color: 'bg-purple-600', benefits: ['15% cashback on bookings', 'VIP support', 'Free service upgrade weekly', 'Exclusive offers', 'Early access to new providers'] },
];

const availableRewards = [
  { id: '1', name: '10% Off Next Booking', points: 500, icon: 'gift', description: 'Get 10% discount on your next service' },
  { id: '2', name: 'Free Service Upgrade', points: 1000, icon: 'star', description: 'Upgrade to premium service for free' },
  { id: '3', name: 'KES 500 Credit', points: 1500, icon: 'wallet', description: 'Add KES 500 to your wallet' },
  { id: '4', name: 'VIP Priority Booking', points: 2000, icon: 'crown', description: 'Skip the queue for 30 days' },
  { id: '5', name: 'Free 60min Massage', points: 3500, icon: 'spa', description: 'Enjoy a complimentary massage session' },
];

const pointsHistory = [
  { id: '1', type: 'earned', description: 'Booking: Box Braids', points: 350, date: '2024-01-15' },
  { id: '2', type: 'earned', description: 'Booking: Deep Cleaning', points: 450, date: '2024-01-10' },
  { id: '3', type: 'redeemed', description: '10% Off Coupon', points: -500, date: '2024-01-05' },
  { id: '4', type: 'earned', description: 'Referral Bonus', points: 500, date: '2024-01-01' },
  { id: '5', type: 'earned', description: 'Booking: Swedish Massage', points: 400, date: '2023-12-28' },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  const currentTierIndex = tiers.findIndex(t => t.name === mockLoyalty.tier);
  const progressPercent = ((mockLoyalty.points - tiers[currentTierIndex].minPoints) / 
    (mockLoyalty.totalPointsForNextTier - tiers[currentTierIndex].minPoints)) * 100;

  const redeemReward = (reward: typeof availableRewards[0]) => {
    if (mockLoyalty.points >= reward.points) {
      toast.success(`Successfully redeemed: ${reward.name}`);
    } else {
      toast.error(`Not enough points. You need ${reward.points - mockLoyalty.points} more points.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <HiArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Rewards & Loyalty</h1>
              <p className="text-gray-600">Earn points on every booking</p>
            </div>
          </div>

          {/* Points Summary Card */}
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm">Available Points</p>
                <h2 className="text-4xl font-bold">{mockLoyalty.points.toLocaleString()}</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <HiSparkles className="w-5 h-5" />
                  <span className="font-semibold">{mockLoyalty.tier} Member</span>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  {mockLoyalty.pointsToNextTier} pts to {mockLoyalty.nextTier}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 mb-2">
              <div 
                className="bg-white rounded-full h-3 transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/80">
              <span>{mockLoyalty.tier}</span>
              <span>{mockLoyalty.nextTier}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-white/80 text-xs">Lifetime Points Earned</p>
                <p className="font-semibold">{mockLoyalty.lifetimePoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/80 text-xs">Total Savings</p>
                <p className="font-semibold">KES {mockLoyalty.lifetimeSavings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Membership Tiers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tiers.map((tier, index) => (
                <div 
                  key={tier.name}
                  className={`p-4 rounded-xl border-2 ${
                    tier.name === mockLoyalty.tier 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 ${tier.color} rounded-full flex items-center justify-center mb-3`}>
                    <HiStar className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                  <p className="text-xs text-gray-500">{tier.minPoints.toLocaleString()}+ pts</p>
                  {tier.name === mockLoyalty.tier && (
                    <span className="inline-block mt-2 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'rewards' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Available Rewards
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Points History
            </button>
          </div>

          {activeTab === 'rewards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRewards.map((reward) => {
                const canRedeem = mockLoyalty.points >= reward.points;
                return (
                  <div key={reward.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{reward.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-semibold text-primary-600">
                            {reward.points.toLocaleString()} pts
                          </span>
                          <button
                            onClick={() => redeemReward(reward)}
                            disabled={!canRedeem}
                            className={`btn-sm ${canRedeem ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                          >
                            {canRedeem ? 'Redeem' : (
                              <span className="flex items-center gap-1">
                                <HiLockClosed className="w-4 h-4" />
                                Locked
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {pointsHistory.map((item, index) => (
                <div 
                  key={item.id}
                  className={`p-4 flex items-center justify-between ${
                    index !== pointsHistory.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {item.type === 'earned' ? (
                        <HiCheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <HiGift className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    item.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </span>
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
