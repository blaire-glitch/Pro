'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import {
  HiUsers,
  HiUserGroup,
  HiCash,
  HiClipboardList,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiEye,
  HiSearch,
  HiFilter,
  HiRefresh,
  HiChartBar,
  HiCog,
  HiLogout,
  HiMenu,
  HiX,
  HiBell,
  HiShieldCheck,
  HiDocumentText,
  HiPhotograph,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Provider {
  id: string;
  businessName: string;
  category: string;
  verificationStatus: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  city: string;
  address: string;
  verificationDocuments: string[];
  nationalId?: string;
  businessLicense?: string;
}

interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  pendingVerifications: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

// Mock data
const mockStats: DashboardStats = {
  totalUsers: 12458,
  totalProviders: 856,
  pendingVerifications: 23,
  totalBookings: 34521,
  totalRevenue: 4567800,
  monthlyGrowth: 12.5,
};

const mockPendingProviders: Provider[] = [
  {
    id: '1',
    businessName: 'Grace Beauty Salon',
    category: 'BEAUTY',
    verificationStatus: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 'u1',
      firstName: 'Grace',
      lastName: 'Wanjiku',
      email: 'grace@example.com',
      phone: '+254712345678',
    },
    city: 'Nairobi',
    address: 'Westlands, Nairobi',
    verificationDocuments: ['/docs/id.jpg', '/docs/cert.jpg'],
    nationalId: '12345678',
    businessLicense: 'BL-2024-001',
  },
  {
    id: '2',
    businessName: 'John\'s Plumbing Services',
    category: 'HOME',
    verificationStatus: 'IN_REVIEW',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    user: {
      id: 'u2',
      firstName: 'John',
      lastName: 'Omondi',
      email: 'john@example.com',
      phone: '+254723456789',
    },
    city: 'Kisumu',
    address: 'Milimani, Kisumu',
    verificationDocuments: ['/docs/id2.jpg'],
    nationalId: '23456789',
  },
  {
    id: '3',
    businessName: 'FitLife Training',
    category: 'WELLNESS',
    verificationStatus: 'PENDING',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    user: {
      id: 'u3',
      firstName: 'Sarah',
      lastName: 'Akinyi',
      email: 'sarah@example.com',
      phone: '+254734567890',
    },
    city: 'Mombasa',
    address: 'Nyali, Mombasa',
    verificationDocuments: ['/docs/id3.jpg', '/docs/license.jpg'],
    nationalId: '34567890',
    businessLicense: 'BL-2024-002',
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [pendingProviders, setPendingProviders] = useState<Provider[]>(mockPendingProviders);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'users' | 'bookings' | 'settings'>('overview');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'IN_REVIEW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (user?.role !== 'ADMIN') {
      toast.error('Access denied. Admin only.');
      router.push('/');
      return;
    }

    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API calls
      // const [statsRes, providersRes] = await Promise.all([
      //   api.get('/admin/stats'),
      //   api.get('/admin/providers/pending'),
      // ]);
      // setStats(statsRes.data.data);
      // setPendingProviders(providersRes.data.data);
      
      // Using mock data for now
      setStats(mockStats);
      setPendingProviders(mockPendingProviders);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId: string) => {
    try {
      // TODO: Implement API call
      // await api.patch(`/admin/providers/${providerId}/verify`, { status: 'VERIFIED' });
      
      setPendingProviders(prev => prev.filter(p => p.id !== providerId));
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1,
        totalProviders: prev.totalProviders + 1,
      }));
      toast.success('Provider approved successfully!');
      setShowReviewModal(false);
      setSelectedProvider(null);
    } catch (error) {
      toast.error('Failed to approve provider');
    }
  };

  const handleReject = async (providerId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      // TODO: Implement API call
      // await api.patch(`/admin/providers/${providerId}/verify`, { 
      //   status: 'REJECTED',
      //   reason: rejectionReason 
      // });
      
      setPendingProviders(prev => prev.filter(p => p.id !== providerId));
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1,
      }));
      toast.success('Provider rejected');
      setShowReviewModal(false);
      setSelectedProvider(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject provider');
    }
  };

  const filteredProviders = pendingProviders.filter(p => {
    const matchesStatus = filterStatus === 'ALL' || p.verificationStatus === filterStatus;
    const matchesSearch = 
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      BEAUTY: 'bg-pink-100 text-pink-700',
      HOME: 'bg-blue-100 text-blue-700',
      WELLNESS: 'bg-green-100 text-green-700',
      LIFESTYLE: 'bg-purple-100 text-purple-700',
      DELIVERY: 'bg-orange-100 text-orange-700',
      TRANSPORT: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: Provider['verificationStatus']) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
      case 'IN_REVIEW':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">In Review</span>;
      case 'VERIFIED':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Verified</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Rejected</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold text-white">
            Afrionex <span className="text-primary-400">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <HiChartBar className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'providers' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <HiUserGroup className="w-5 h-5" />
            Providers
            {stats.pendingVerifications > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {stats.pendingVerifications}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <HiUsers className="w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'bookings' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <HiClipboardList className="w-5 h-5" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <HiCog className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <HiLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
              <HiMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative">
                <HiBell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {activeTab === 'overview' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <HiUsers className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Providers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProviders.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <HiUserGroup className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Pending Verifications</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <HiClock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">KES {(stats.totalRevenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <HiCash className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Verifications */}
              {stats.pendingVerifications > 0 && (
                <div className="bg-white rounded-xl shadow-sm mb-8">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Pending Provider Verifications</h2>
                    <button
                      onClick={() => setActiveTab('providers')}
                      className="text-primary-600 text-sm font-medium hover:text-primary-700"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y">
                    {pendingProviders.slice(0, 3).map((provider) => (
                      <div key={provider.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <HiUserGroup className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{provider.businessName}</p>
                            <p className="text-sm text-gray-500">
                              {provider.user.firstName} {provider.user.lastName} • {provider.city}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(provider.category)}`}>
                            {provider.category}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedProvider(provider);
                              setShowReviewModal(true);
                            }}
                            className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'providers' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Provider Verifications</h1>
                <button onClick={fetchData} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <HiRefresh className="w-5 h-5" />
                  Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_REVIEW">In Review</option>
                </select>
              </div>

              {/* Providers List */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredProviders.length === 0 ? (
                  <div className="p-8 text-center">
                    <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No pending verifications at the moment.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredProviders.map((provider) => (
                          <tr key={provider.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <HiUserGroup className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{provider.businessName}</p>
                                  <p className="text-sm text-gray-500">
                                    {provider.user.firstName} {provider.user.lastName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(provider.category)}`}>
                                {provider.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-600">{provider.city}</td>
                            <td className="px-4 py-4">{getStatusBadge(provider.verificationStatus)}</td>
                            <td className="px-4 py-4 text-gray-600">{formatDate(provider.createdAt)}</td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => {
                                  setSelectedProvider(provider);
                                  setShowReviewModal(true);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
                              >
                                <HiEye className="w-4 h-4" />
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-12">
              <HiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
              <p className="text-gray-500">Coming soon - manage all registered users</p>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="text-center py-12">
              <HiClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Management</h2>
              <p className="text-gray-500">Coming soon - view and manage all bookings</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <HiCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-500">Coming soon - platform configuration</p>
            </div>
          )}
        </main>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Review Provider Application</h2>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedProvider(null);
                    setRejectionReason('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Business Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HiShieldCheck className="w-5 h-5 text-primary-500" />
                  Business Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Business Name</span>
                    <span className="font-medium">{selectedProvider.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedProvider.category)}`}>
                      {selectedProvider.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{selectedProvider.address}</span>
                  </div>
                  {selectedProvider.businessLicense && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Business License</span>
                      <span className="font-medium">{selectedProvider.businessLicense}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HiUsers className="w-5 h-5 text-primary-500" />
                  Owner Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">{selectedProvider.user.firstName} {selectedProvider.user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium">{selectedProvider.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium">{selectedProvider.user.phone}</span>
                  </div>
                  {selectedProvider.nationalId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">National ID</span>
                      <span className="font-medium">{selectedProvider.nationalId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HiDocumentText className="w-5 h-5 text-primary-500" />
                  Verification Documents
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProvider.verificationDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-gray-100 rounded-lg p-4 flex items-center gap-3">
                      <HiPhotograph className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Document {idx + 1}</p>
                        <p className="text-xs text-gray-500">Click to view</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason if you're rejecting this application..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => handleReject(selectedProvider.id)}
                className="flex-1 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <HiXCircle className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedProvider.id)}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <HiCheckCircle className="w-5 h-5" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
