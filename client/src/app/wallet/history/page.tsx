'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiArrowLeft, 
  HiArrowUp, 
  HiArrowDown, 
  HiSearch,
  HiFilter,
  HiCalendar,
  HiDownload,
  HiChevronDown,
  HiRefresh
} from 'react-icons/hi';
import { SubscriptionGuard } from '@/components/guards/SubscriptionGuard';
import { walletApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'topup' | 'payment' | 'withdrawal';
  amount: number;
  description: string;
  recipient?: string;
  sender?: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const filterOptions = [
  { value: 'all', label: 'All Transactions' },
  { value: 'sent', label: 'Sent' },
  { value: 'received', label: 'Received' },
  { value: 'topup', label: 'Top Up' },
  { value: 'payment', label: 'Payments' },
  { value: 'withdrawal', label: 'Withdrawals' }
];

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [page, filterType]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const typeMap: Record<string, string> = {
        'sent': 'SEND',
        'received': 'RECEIVE',
        'topup': 'TOPUP',
        'payment': 'PAYMENT',
        'withdrawal': 'WITHDRAW'
      };
      
      const response = await walletApi.getTransactions({
        page,
        limit: 20,
        type: filterType !== 'all' ? typeMap[filterType] : undefined
      });
      
      const mappedTransactions = response.data.transactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type.toLowerCase() as Transaction['type'],
        amount: tx.amount,
        description: tx.description || tx.type,
        recipient: tx.recipientId,
        sender: tx.senderId,
        date: new Date(tx.createdAt).toISOString().split('T')[0],
        time: new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: tx.status.toLowerCase() as Transaction['status'],
        reference: tx.reference || tx.id.slice(0, 12).toUpperCase()
      }));
      
      setTransactions(mappedTransactions);
      setTotalPages(Math.ceil(response.data.total / 20));
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || tx.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sent':
      case 'withdrawal':
        return <HiArrowUp className="w-5 h-5 text-red-500" />;
      case 'received':
      case 'topup':
        return <HiArrowDown className="w-5 h-5 text-green-500" />;
      default:
        return <HiArrowUp className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Failed</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-KE', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = tx.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const totalInflow = filteredTransactions
    .filter(tx => tx.type === 'received' || tx.type === 'topup')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOutflow = filteredTransactions
    .filter(tx => tx.type === 'sent' || tx.type === 'payment' || tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <SubscriptionGuard feature="Transaction History">
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/wallet" 
              className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"
            >
              <HiArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-600">All your wallet activity</p>
            </div>
            <button className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
              <HiDownload className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HiArrowDown className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Money In</span>
              </div>
              <p className="text-xl font-bold text-green-700">
                KES {totalInflow.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HiArrowUp className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">Money Out</span>
              </div>
              <p className="text-xl font-bold text-red-700">
                KES {totalOutflow.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border ${showFilters ? 'bg-primary-50 border-primary-500' : 'bg-gray-50 border-gray-200'}`}
              >
                <HiFilter className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setFilterType(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterType === option.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <div className="relative">
                      <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <div className="relative">
                      <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transactions List */}
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, txs]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {formatDate(date)}
                </h3>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {txs.map((tx, index) => (
                    <div 
                      key={tx.id}
                      className={`p-4 flex items-center gap-4 ${
                        index !== txs.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'sent' || tx.type === 'withdrawal' || tx.type === 'payment'
                          ? 'bg-red-100'
                          : 'bg-green-100'
                      }`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {tx.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.recipient && `To: ${tx.recipient}`}
                          {tx.sender && `From: ${tx.sender}`}
                          {!tx.recipient && !tx.sender && tx.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          tx.type === 'received' || tx.type === 'topup'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {tx.type === 'received' || tx.type === 'topup' ? '+' : '-'}
                          KES {tx.amount.toLocaleString()}
                        </p>
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Load More */}
          {filteredTransactions.length > 0 && (
            <button className="w-full mt-6 py-3 text-primary-600 font-medium flex items-center justify-center gap-2 hover:bg-primary-50 rounded-xl transition-colors">
              Load More
              <HiChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </SubscriptionGuard>
  );
}
