'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  HiChevronLeft,
  HiCurrencyDollar,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiDownload,
  HiFilter,
  HiCalendar,
  HiCreditCard,
  HiArrowRight,
  HiExclamation,
} from 'react-icons/hi';
import { HiBanknotes } from 'react-icons/hi2';

interface Settlement {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
  accountDetails: string;
  ordersCount: number;
  periodStart: string;
  periodEnd: string;
  processedAt?: string;
  reference?: string;
  createdAt: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface MobileWallet {
  id: string;
  provider: string;
  phoneNumber: string;
  isDefault: boolean;
}

export default function SettlementsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'mpesa'>('mpesa');

  const [balance, setBalance] = useState({
    available: 45780,
    pending: 12500,
    totalEarned: 358280,
  });

  const [bankAccounts] = useState<BankAccount[]>([
    { id: '1', bankName: 'Equity Bank', accountNumber: '****4523', accountName: 'John Kamau', isDefault: true },
    { id: '2', bankName: 'KCB', accountNumber: '****7891', accountName: 'John Kamau', isDefault: false },
  ]);

  const [mobileWallets] = useState<MobileWallet[]>([
    { id: '1', provider: 'M-Pesa', phoneNumber: '0712****89', isDefault: true },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/vendor/settlements');
      return;
    }
    fetchSettlements();
  }, [isAuthenticated, router]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockSettlements: Settlement[] = [
        {
          id: '1',
          amount: 25000,
          fee: 250,
          netAmount: 24750,
          status: 'completed',
          paymentMethod: 'M-Pesa',
          accountDetails: '0712****89',
          ordersCount: 18,
          periodStart: '2026-01-01',
          periodEnd: '2026-01-07',
          processedAt: '2026-01-08',
          reference: 'STL-2026-001',
          createdAt: '2026-01-08T10:30:00',
        },
        {
          id: '2',
          amount: 18500,
          fee: 185,
          netAmount: 18315,
          status: 'processing',
          paymentMethod: 'Bank Transfer',
          accountDetails: 'Equity ****4523',
          ordersCount: 12,
          periodStart: '2026-01-08',
          periodEnd: '2026-01-10',
          reference: 'STL-2026-002',
          createdAt: '2026-01-11T09:00:00',
        },
        {
          id: '3',
          amount: 32000,
          fee: 320,
          netAmount: 31680,
          status: 'pending',
          paymentMethod: 'M-Pesa',
          accountDetails: '0712****89',
          ordersCount: 24,
          periodStart: '2026-01-10',
          periodEnd: '2026-01-12',
          createdAt: '2026-01-12T14:00:00',
        },
        {
          id: '4',
          amount: 15000,
          fee: 150,
          netAmount: 14850,
          status: 'completed',
          paymentMethod: 'Bank Transfer',
          accountDetails: 'KCB ****7891',
          ordersCount: 10,
          periodStart: '2025-12-25',
          periodEnd: '2025-12-31',
          processedAt: '2026-01-02',
          reference: 'STL-2025-089',
          createdAt: '2026-01-02T11:15:00',
        },
        {
          id: '5',
          amount: 8500,
          fee: 85,
          netAmount: 8415,
          status: 'failed',
          paymentMethod: 'M-Pesa',
          accountDetails: '0712****89',
          ordersCount: 6,
          periodStart: '2025-12-20',
          periodEnd: '2025-12-24',
          reference: 'STL-2025-078',
          createdAt: '2025-12-25T08:00:00',
        },
      ];
      setSettlements(mockSettlements);
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
      toast.error('Failed to load settlements');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 100) {
      toast.error('Minimum withdrawal is KES 100');
      return;
    }
    if (amount > balance.available) {
      toast.error('Insufficient balance');
      return;
    }
    
    toast.success(`Withdrawal of KES ${amount.toLocaleString()} initiated`);
    setBalance(prev => ({ ...prev, available: prev.available - amount, pending: prev.pending + amount }));
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <HiCheckCircle className="w-4 h-4" />;
      case 'processing': return <HiRefresh className="w-4 h-4 animate-spin" />;
      case 'pending': return <HiClock className="w-4 h-4" />;
      case 'failed': return <HiXCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredSettlements = settlements.filter(s => 
    filterStatus === 'all' || s.status === filterStatus
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/vendor/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <HiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payment Settlements</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your earnings and withdrawals</p>
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <HiCurrencyDollar className="w-5 h-5" />
              Withdraw
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-green-100">Available Balance</p>
              <HiCurrencyDollar className="w-8 h-8 text-green-200" />
            </div>
            <p className="text-3xl font-bold mb-2">KES {balance.available.toLocaleString()}</p>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="text-sm text-green-100 hover:text-white flex items-center gap-1"
            >
              Withdraw now <HiArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 dark:text-gray-400">Pending Settlement</p>
              <HiClock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">KES {balance.pending.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Processing within 24-48 hours</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 dark:text-gray-400">Total Earned</p>
              <HiCheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">KES {balance.totalEarned.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lifetime earnings</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
            <button 
              onClick={() => setShowAccountModal(true)}
              className="text-sm text-green-600 hover:text-green-700"
            >
              + Add Account
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile Wallets */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Mobile Money</p>
              {mobileWallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <HiCreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{wallet.provider}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{wallet.phoneNumber}</p>
                    </div>
                  </div>
                  {wallet.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bank Accounts */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bank Accounts</p>
              <div className="space-y-2">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <HiBanknotes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{account.bankName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{account.accountNumber}</p>
                      </div>
                    </div>
                    {account.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settlement History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settlement History</h3>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <HiDownload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredSettlements.length === 0 ? (
            <div className="p-12 text-center">
              <HiCurrencyDollar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No settlements found</h3>
              <p className="text-gray-500 dark:text-gray-400">Your settlement history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Orders</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Net</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSettlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{settlement.reference || '-'}</p>
                        <p className="text-xs text-gray-500">{new Date(settlement.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(settlement.periodStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(settlement.periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{settlement.ordersCount}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        KES {settlement.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        -KES {settlement.fee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-green-600">
                        KES {settlement.netAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{settlement.paymentMethod}</p>
                          <p className="text-xs text-gray-500">{settlement.accountDetails}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(settlement.status)}`}>
                          {getStatusIcon(settlement.status)}
                          {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Withdraw Funds</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available: KES {balance.available.toLocaleString()}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  min="100"
                  max={balance.available}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                />
                <div className="flex gap-2 mt-2">
                  {[1000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWithdrawAmount(String(Math.min(amt, balance.available)))}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setWithdrawAmount(String(balance.available))}
                    className="px-3 py-1 text-sm border border-green-500 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdraw to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedMethod('mpesa')}
                    className={`p-3 border rounded-lg flex items-center gap-2 ${
                      selectedMethod === 'mpesa' 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <HiCreditCard className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">M-Pesa</span>
                  </button>
                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-3 border rounded-lg flex items-center gap-2 ${
                      selectedMethod === 'bank' 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <HiBanknotes className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Bank</span>
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 flex items-start gap-2">
                <HiExclamation className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Processing time</p>
                  <p>{selectedMethod === 'mpesa' ? 'Instant - 5 minutes' : '1-2 business days'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
