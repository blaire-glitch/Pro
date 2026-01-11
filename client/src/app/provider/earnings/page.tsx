'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { providersApi } from '@/lib/api';
import {
  HiArrowLeft,
  HiCash,
  HiTrendingUp,
  HiTrendingDown,
  HiCalendar,
  HiDownload,
  HiCreditCard,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiChartBar,
  HiFilter,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface EarningsSummary {
  totalEarnings: number;
  pendingPayout: number;
  availableBalance: number;
  thisMonth: number;
  lastMonth: number;
  thisWeek: number;
  growth: number;
}

interface Transaction {
  id: string;
  type: 'BOOKING' | 'PAYOUT' | 'REFUND' | 'TIP';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
  createdAt: string;
  bookingId?: string;
  customerName?: string;
}

interface PayoutMethod {
  id: string;
  type: 'MPESA' | 'BANK';
  name: string;
  details: string;
  isDefault: boolean;
}

// Mock data
const mockSummary: EarningsSummary = {
  totalEarnings: 125000,
  pendingPayout: 15000,
  availableBalance: 35000,
  thisMonth: 42000,
  lastMonth: 38000,
  thisWeek: 12500,
  growth: 10.5,
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'BOOKING',
    amount: 3500,
    status: 'COMPLETED',
    description: 'Box Braids - Mary Wanjiku',
    createdAt: new Date().toISOString(),
    customerName: 'Mary Wanjiku',
  },
  {
    id: '2',
    type: 'TIP',
    amount: 500,
    status: 'COMPLETED',
    description: 'Tip from Mary Wanjiku',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    customerName: 'Mary Wanjiku',
  },
  {
    id: '3',
    type: 'PAYOUT',
    amount: -20000,
    status: 'COMPLETED',
    description: 'M-Pesa withdrawal',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    type: 'BOOKING',
    amount: 5000,
    status: 'PENDING',
    description: 'Knotless Braids - Jane Akinyi',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    customerName: 'Jane Akinyi',
  },
  {
    id: '5',
    type: 'REFUND',
    amount: -1500,
    status: 'COMPLETED',
    description: 'Refund - Cancelled booking',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

const mockPayoutMethods: PayoutMethod[] = [
  {
    id: '1',
    type: 'MPESA',
    name: 'M-Pesa',
    details: '0712****45',
    isDefault: true,
  },
  {
    id: '2',
    type: 'BANK',
    name: 'Equity Bank',
    details: '****5678',
    isDefault: false,
  },
];

export default function ProviderEarningsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [summary, setSummary] = useState<EarningsSummary>(mockSummary);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>(mockPayoutMethods);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<string>('');
  const [filter, setFilter] = useState<'ALL' | 'BOOKING' | 'PAYOUT' | 'TIP' | 'REFUND'>('ALL');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with real API calls
        // const [summaryRes, transactionsRes] = await Promise.all([
        //   providersApi.getEarnings(),
        //   providersApi.getTransactions(),
        // ]);
        // setSummary(summaryRes.data.data);
        // setTransactions(transactionsRes.data.data);
        
        // Using mock data for now
        setSummary(mockSummary);
        setTransactions(mockTransactions);
        setPayoutMethods(mockPayoutMethods);
        setSelectedPayoutMethod(mockPayoutMethods.find(m => m.isDefault)?.id || '');
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > summary.availableBalance) {
      toast.error('Insufficient balance');
      return;
    }
    if (!selectedPayoutMethod) {
      toast.error('Please select a payout method');
      return;
    }

    try {
      // TODO: Implement withdrawal API
      toast.success(`KES ${amount.toLocaleString()} withdrawal initiated!`);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'ALL' ? true : t.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'BOOKING':
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'PAYOUT':
        return <HiCreditCard className="w-5 h-5 text-blue-500" />;
      case 'TIP':
        return <HiTrendingUp className="w-5 h-5 text-yellow-500" />;
      case 'REFUND':
        return <HiExclamationCircle className="w-5 h-5 text-red-500" />;
      default:
        return <HiCash className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Completed</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">Failed</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="pt-20 pb-24 container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/provider/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Earnings</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your income and manage payouts</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <HiDownload className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <HiCash className="w-5 h-5" />
                Withdraw
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Available Balance</span>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <HiCash className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                KES {summary.availableBalance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ready to withdraw</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Pending Payout</span>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <HiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                KES {summary.pendingPayout.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Processing</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">This Month</span>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <HiCalendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                KES {summary.thisMonth.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {summary.growth >= 0 ? (
                  <>
                    <HiTrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">+{summary.growth}%</span>
                  </>
                ) : (
                  <>
                    <HiTrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">{summary.growth}%</span>
                  </>
                )}
                <span className="text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</span>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <HiChartBar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                KES {summary.totalEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lifetime earnings</p>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Transaction History</h2>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                  >
                    <option value="ALL">All Types</option>
                    <option value="BOOKING">Bookings</option>
                    <option value="PAYOUT">Payouts</option>
                    <option value="TIP">Tips</option>
                    <option value="REFUND">Refunds</option>
                  </select>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No transactions found
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatDate(transaction.createdAt)}</span>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.amount >= 0 ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredTransactions.length > 0 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full py-2 text-center text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Withdraw Funds</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                KES {summary.availableBalance.toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="flex gap-2 mt-2">
                {[5000, 10000, 20000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setWithdrawAmount(amount.toString())}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => setWithdrawAmount(summary.availableBalance.toString())}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdraw To
              </label>
              <div className="space-y-2">
                {payoutMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayoutMethod(method.id)}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      selectedPayoutMethod === method.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        method.type === 'MPESA' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <HiCreditCard className={`w-5 h-5 ${
                          method.type === 'MPESA' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{method.details}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
