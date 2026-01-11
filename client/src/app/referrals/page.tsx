'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import {
  HiGift,
  HiUsers,
  HiCash,
  HiShare,
  HiClipboardCopy,
  HiCheckCircle,
  HiTrendingUp,
  HiStar,
  HiChevronRight,
  HiSparkles,
} from 'react-icons/hi';
import { FaWhatsapp, FaTwitter, FaFacebook, FaTelegram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referrals: Referral[];
}

interface Referral {
  id: string;
  referredUser: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  status: 'PENDING' | 'QUALIFIED' | 'REWARDED';
  reward: number;
  createdAt: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  value: number;
  type: 'CASHBACK' | 'DISCOUNT' | 'FREE_SERVICE';
  isClaimed: boolean;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  referralCount: number;
  earnings: number;
}

export default function ReferralsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'rewards' | 'leaderboard'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/referrals');
      return;
    }
    fetchReferralData();
  }, [isAuthenticated, router]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const [referralRes, rewardsRes, leaderboardRes] = await Promise.all([
        api.get('/referrals/my-referral'),
        api.get('/referrals/rewards'),
        api.get('/referrals/leaderboard'),
      ]);
      setReferralData(referralRes.data.data);
      setRewards(rewardsRes.data.data || []);
      setLeaderboard(leaderboardRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
      // Use mock data for demo
      setReferralData({
        referralCode: user?.id?.slice(0, 8).toUpperCase() || 'AFRI1234',
        totalReferrals: 12,
        successfulReferrals: 8,
        pendingReferrals: 4,
        totalEarnings: 2400,
        pendingEarnings: 600,
        referrals: [
          {
            id: '1',
            referredUser: { firstName: 'John', lastName: 'Doe' },
            status: 'REWARDED',
            reward: 300,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            referredUser: { firstName: 'Jane', lastName: 'Smith' },
            status: 'QUALIFIED',
            reward: 300,
            createdAt: new Date().toISOString(),
          },
          {
            id: '3',
            referredUser: { firstName: 'Mike', lastName: 'Johnson' },
            status: 'PENDING',
            reward: 300,
            createdAt: new Date().toISOString(),
          },
        ],
      });
      setRewards([
        { id: '1', title: '10% Off Next Booking', description: 'Use on any service', points: 500, value: 10, type: 'DISCOUNT', isClaimed: false },
        { id: '2', title: 'KES 200 Cashback', description: 'Added to wallet', points: 1000, value: 200, type: 'CASHBACK', isClaimed: false },
        { id: '3', title: 'Free Delivery', description: 'On your next order', points: 300, value: 150, type: 'FREE_SERVICE', isClaimed: true },
      ]);
      setLeaderboard([
        { rank: 1, user: { firstName: 'Sarah', lastName: 'K.' }, referralCount: 45, earnings: 13500 },
        { rank: 2, user: { firstName: 'James', lastName: 'M.' }, referralCount: 38, earnings: 11400 },
        { rank: 3, user: { firstName: 'Grace', lastName: 'W.' }, referralCount: 32, earnings: 9600 },
        { rank: 4, user: { firstName: 'Peter', lastName: 'O.' }, referralCount: 28, earnings: 8400 },
        { rank: 5, user: { firstName: 'Mary', lastName: 'N.' }, referralCount: 25, earnings: 7500 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `https://afrionex.com/register?ref=${referralData?.referralCode || ''}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareVia = (platform: string) => {
    const message = `Join Afrionex and get amazing services! Use my referral code: ${referralData?.referralCode}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedLink = encodeURIComponent(referralLink);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=${encodedLink}&text=${encodedMessage}`,
    };

    window.open(urls[platform], '_blank');
  };

  const claimReward = async (rewardId: string) => {
    try {
      await api.post(`/referrals/rewards/${rewardId}/claim`);
      toast.success('Reward claimed successfully!');
      fetchReferralData();
    } catch (error) {
      toast.error('Failed to claim reward');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REWARDED':
        return 'bg-green-100 text-green-700';
      case 'QUALIFIED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-24">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-2xl" />
              <div className="h-32 bg-gray-200 rounded-2xl" />
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-24">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <HiGift className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Refer & Earn</h1>
                <p className="text-white/80">Invite friends, earn rewards</p>
              </div>
            </div>

            {/* Referral Code Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
              <p className="text-white/70 text-sm mb-2">Your Referral Code</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold tracking-wider">
                  {referralData?.referralCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
                >
                  {copied ? (
                    <HiCheckCircle className="w-5 h-5" />
                  ) : (
                    <HiClipboardCopy className="w-5 h-5" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mt-4">
              <p className="text-white/70 text-sm mb-2">Share via</p>
              <div className="flex gap-3">
                <button
                  onClick={() => shareVia('whatsapp')}
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareVia('twitter')}
                  className="w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaTwitter className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareVia('facebook')}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaFacebook className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareVia('telegram')}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaTelegram className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <HiUsers className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralData?.totalReferrals}
                  </p>
                  <p className="text-xs text-gray-500">Total Referrals</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <HiCash className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    KES {referralData?.totalEarnings?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Earned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: HiSparkles },
              { id: 'referrals', label: 'My Referrals', icon: HiUsers },
              { id: 'rewards', label: 'Rewards', icon: HiGift },
              { id: 'leaderboard', label: 'Leaderboard', icon: HiTrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* How It Works */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">How It Works</h2>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Share Your Code', desc: 'Send your unique code to friends' },
                    { step: 2, title: 'Friends Sign Up', desc: 'They register using your code' },
                    { step: 3, title: 'They Book a Service', desc: 'Complete their first booking' },
                    { step: 4, title: 'Both Earn Rewards', desc: 'You get KES 300, they get KES 200!' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Earnings */}
              {referralData?.pendingEarnings && referralData.pendingEarnings > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">Pending Earnings</p>
                      <p className="text-sm text-yellow-600">
                        {referralData.pendingReferrals} referrals awaiting qualification
                      </p>
                    </div>
                    <p className="text-xl font-bold text-yellow-800">
                      KES {referralData.pendingEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Your Referrals</h2>
              </div>
              {referralData?.referrals && referralData.referrals.length > 0 ? (
                <div className="divide-y">
                  {referralData.referrals.map((referral) => (
                    <div key={referral.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {referral.referredUser.firstName[0]}
                            {referral.referredUser.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {referral.referredUser.firstName} {referral.referredUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          KES {referral.reward}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <HiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No referrals yet</p>
                  <p className="text-sm text-gray-400">Start sharing your code to earn!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm ${
                    reward.isClaimed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        reward.type === 'CASHBACK'
                          ? 'bg-green-100'
                          : reward.type === 'DISCOUNT'
                          ? 'bg-blue-100'
                          : 'bg-purple-100'
                      }`}>
                        {reward.type === 'CASHBACK' ? (
                          <HiCash className="w-6 h-6 text-green-600" />
                        ) : reward.type === 'DISCOUNT' ? (
                          <HiStar className="w-6 h-6 text-blue-600" />
                        ) : (
                          <HiGift className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{reward.title}</h3>
                        <p className="text-sm text-gray-500">{reward.description}</p>
                        <p className="text-xs text-primary-500 mt-1">{reward.points} points</p>
                      </div>
                    </div>
                    {reward.isClaimed ? (
                      <span className="text-sm text-gray-400">Claimed</span>
                    ) : (
                      <button
                        onClick={() => claimReward(reward.id)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Top Referrers This Month</h2>
              </div>
              <div className="divide-y">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-4 flex items-center justify-between ${
                      idx < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx === 0
                            ? 'bg-yellow-400 text-white'
                            : idx === 1
                            ? 'bg-gray-300 text-white'
                            : idx === 2
                            ? 'bg-orange-400 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {entry.user.firstName} {entry.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.referralCount} referrals
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-primary-600">
                      KES {entry.earnings.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
