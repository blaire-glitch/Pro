'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  HiUsers,
  HiClipboardCheck,
  HiCurrencyDollar,
  HiShieldCheck,
  HiCheck,
  HiX,
  HiRefresh,
  HiSearch,
  HiBan,
  HiCheckCircle,
} from 'react-icons/hi';

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  pendingVerifications?: number;
}

interface Provider {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  businessName: string;
  category: string;
  verificationStatus: string;
  isVerified: boolean;
  createdAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  totalAmount: number;
  customer: { name: string; email: string };
  provider: { businessName: string };
  service: { name: string };
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'users' | 'bookings'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      router.push('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, providersRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: null })),
        api.get('/admin/providers/pending').catch(() => ({ data: null })),
        api.get('/admin/users').catch(() => ({ data: null })),
        api.get('/admin/bookings').catch(() => ({ data: null })),
      ]);
      
      // Handle stats
      const statsData = statsRes.data?.data || statsRes.data;
      setStats(statsData || {
        totalUsers: 0,
        totalProviders: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingProviders: 0,
      });
      
      // Handle providers - API returns { data: { items: [...] } }
      const providersData = providersRes.data?.data?.items || providersRes.data?.data || providersRes.data || [];
      setPendingProviders(Array.isArray(providersData) ? providersData : []);
      
      // Handle users
      const usersData = usersRes.data?.data?.items || usersRes.data?.data || usersRes.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      // Handle bookings
      const bookingsData = bookingsRes.data?.data?.items || bookingsRes.data?.data || bookingsRes.data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProvider = async (providerId: string, approved: boolean) => {
    try {
      const status = approved ? 'VERIFIED' : 'REJECTED';
      await api.patch(`/admin/providers/${providerId}/verify`, { 
        status,
        reason: approved ? undefined : 'Application did not meet requirements'
      });
      toast.success(approved ? 'Provider approved!' : 'Provider rejected');
      setPendingProviders(prev => prev.filter(p => p.id !== providerId));
      fetchData();
    } catch (error: any) {
      console.error('Verify error:', error);
      toast.error(error.response?.data?.message || 'Failed to update provider status');
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isActive: !isActive });
      toast.success(isActive ? 'User deactivated' : 'User activated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           u.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage Afrionex platform</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <HiRefresh className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: HiShieldCheck },
            { id: 'providers', label: 'Provider Requests', icon: HiClipboardCheck, badge: pendingProviders.length },
            { id: 'users', label: 'Users', icon: HiUsers },
            { id: 'bookings', label: 'Bookings', icon: HiCurrencyDollar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.badge ? (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={HiUsers}
                    color="blue"
                  />
                  <StatCard
                    title="Total Providers"
                    value={stats?.totalProviders || 0}
                    icon={HiShieldCheck}
                    color="green"
                  />
                  <StatCard
                    title="Total Bookings"
                    value={stats?.totalBookings || 0}
                    icon={HiClipboardCheck}
                    color="purple"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={HiCurrencyDollar}
                    color="yellow"
                  />
                </div>

                {pendingProviders.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                      ⚠️ {pendingProviders.length} provider(s) awaiting verification
                    </p>
                    <button
                      onClick={() => setActiveTab('providers')}
                      className="mt-2 text-yellow-600 dark:text-yellow-400 underline text-sm"
                    >
                      Review now →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pending Provider Requests ({pendingProviders.length})
                </h2>
                
                {pendingProviders.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                    <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No pending provider requests</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {provider.businessName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {provider.user?.firstName} {provider.user?.lastName} • {provider.user?.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Category: {provider.category} • Applied: {new Date(provider.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerifyProvider(provider.id, true)}
                              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              <HiCheck className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() => handleVerifyProvider(provider.id, false)}
                              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              <HiX className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((u) => (
                          <tr key={u.id}>
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{u.firstName} {u.lastName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                u.role === 'provider' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                u.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                                    u.isActive
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                                  }`}
                                >
                                  {u.isActive ? <HiBan className="w-4 h-4" /> : <HiCheckCircle className="w-4 h-4" />}
                                  {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Bookings
                </h2>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Booking</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Provider</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {booking.service?.name || 'Service'}
                              </p>
                              <p className="text-xs text-gray-500">#{booking.id.slice(0, 8)}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {booking.customer?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {booking.provider?.businessName || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              KES {booking.totalAmount?.toLocaleString() || 0}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(booking.scheduledAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {bookings.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No bookings found
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
