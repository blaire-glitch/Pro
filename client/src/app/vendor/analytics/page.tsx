'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  HiChevronLeft,
  HiTrendingUp,
  HiTrendingDown,
  HiCurrencyDollar,
  HiShoppingCart,
  HiUsers,
  HiEye,
  HiCalendar,
  HiRefresh,
  HiDownload,
} from 'react-icons/hi';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
  trend: number;
}

interface CustomerInsight {
  metric: string;
  value: string;
  change: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  // Mock data
  const [stats, setStats] = useState({
    totalRevenue: 245780,
    revenueChange: 12.5,
    totalOrders: 156,
    ordersChange: 8.3,
    avgOrderValue: 1575,
    avgOrderChange: 3.2,
    totalCustomers: 89,
    customersChange: 15.7,
    views: 2456,
    viewsChange: -2.1,
    conversionRate: 6.35,
    conversionChange: 0.8,
  });

  const [salesData] = useState<SalesData[]>([
    { date: 'Jan 1', revenue: 8500, orders: 12 },
    { date: 'Jan 2', revenue: 12300, orders: 18 },
    { date: 'Jan 3', revenue: 9800, orders: 14 },
    { date: 'Jan 4', revenue: 15600, orders: 22 },
    { date: 'Jan 5', revenue: 11200, orders: 16 },
    { date: 'Jan 6', revenue: 18900, orders: 28 },
    { date: 'Jan 7', revenue: 14500, orders: 20 },
    { date: 'Jan 8', revenue: 16800, orders: 24 },
    { date: 'Jan 9', revenue: 13400, orders: 19 },
    { date: 'Jan 10', revenue: 19200, orders: 27 },
    { date: 'Jan 11', revenue: 21500, orders: 31 },
    { date: 'Jan 12', revenue: 17800, orders: 25 },
  ]);

  const [topProducts] = useState<TopProduct[]>([
    { id: '1', name: 'Wireless Bluetooth Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', sales: 45, revenue: 202500, trend: 23 },
    { id: '2', name: 'Solar Power Bank 20000mAh', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100', sales: 38, revenue: 106400, trend: 15 },
    { id: '3', name: 'Organic Coffee Beans 1kg', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100', sales: 67, revenue: 80400, trend: -5 },
    { id: '4', name: 'African Print Dress', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', sales: 22, revenue: 77000, trend: 8 },
    { id: '5', name: 'Handmade Leather Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100', sales: 18, revenue: 63000, trend: 12 },
  ]);

  const [customerInsights] = useState<CustomerInsight[]>([
    { metric: 'Returning Customers', value: '34%', change: 5.2 },
    { metric: 'Avg. Items per Order', value: '2.3', change: 0.4 },
    { metric: 'Cart Abandonment', value: '28%', change: -3.1 },
    { metric: 'Customer Lifetime Value', value: 'KES 4,250', change: 8.7 },
  ]);

  const [salesByCategory] = useState([
    { category: 'Electronics', percentage: 35, revenue: 86023 },
    { category: 'Fashion', percentage: 25, revenue: 61445 },
    { category: 'Food & Beverages', percentage: 20, revenue: 49156 },
    { category: 'Home & Garden', percentage: 12, revenue: 29494 },
    { category: 'Other', percentage: 8, revenue: 19662 },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/vendor/analytics');
      return;
    }
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, [isAuthenticated, router]);

  const maxRevenue = Math.max(...salesData.map(d => d.revenue));

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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your store performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <HiDownload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <HiCurrencyDollar className="w-8 h-8 text-green-500" />
                  <span className={`flex items-center text-xs font-medium ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.revenueChange >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stats.revenueChange)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <HiShoppingCart className="w-8 h-8 text-blue-500" />
                  <span className={`flex items-center text-xs font-medium ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.ordersChange >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stats.ordersChange)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <HiCurrencyDollar className="w-8 h-8 text-purple-500" />
                  <span className={`flex items-center text-xs font-medium ${stats.avgOrderChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.avgOrderChange >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stats.avgOrderChange)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">KES {stats.avgOrderValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Order Value</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <HiUsers className="w-8 h-8 text-orange-500" />
                  <span className={`flex items-center text-xs font-medium ${stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.customersChange >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stats.customersChange)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customers</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <HiEye className="w-8 h-8 text-cyan-500" />
                  <span className={`flex items-center text-xs font-medium ${stats.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.viewsChange >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stats.viewsChange)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Store Views</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <HiTrendingUp className="w-8 h-8 text-pink-500" />
                  <span className={`flex items-center text-xs font-medium ${stats.conversionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.conversionChange >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stats.conversionChange)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.conversionRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Conversion Rate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
                <div className="h-64 flex items-end gap-2">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500"
                        style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                        title={`KES ${data.revenue.toLocaleString()}`}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 rotate-45 origin-left">
                        {data.date.split(' ')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales by Category */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
                <div className="space-y-4">
                  {salesByCategory.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        KES {item.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">KES {product.revenue.toLocaleString()}</p>
                        <span className={`text-xs flex items-center justify-end ${product.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.trend >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                          {Math.abs(product.trend)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Insights</h3>
                <div className="grid grid-cols-2 gap-4">
                  {customerInsights.map((insight, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{insight.metric}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{insight.value}</p>
                        <span className={`text-xs flex items-center ${insight.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {insight.change >= 0 ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                          {Math.abs(insight.change)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">New order from <strong className="text-gray-900 dark:text-white">Jane A.</strong></span>
                      <span className="text-gray-400 text-xs ml-auto">2 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">Product viewed: <strong className="text-gray-900 dark:text-white">Headphones</strong></span>
                      <span className="text-gray-400 text-xs ml-auto">5 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">Low stock alert: <strong className="text-gray-900 dark:text-white">Coffee Beans</strong></span>
                      <span className="text-gray-400 text-xs ml-auto">15 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">Payment received: <strong className="text-gray-900 dark:text-white">KES 4,500</strong></span>
                      <span className="text-gray-400 text-xs ml-auto">32 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
