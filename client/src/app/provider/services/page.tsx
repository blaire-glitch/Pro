'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiPhotograph,
  HiX,
  HiCheck,
  HiClock,
  HiCurrencyDollar,
  HiTag,
  HiEye,
  HiEyeOff,
  HiSearch,
  HiFilter,
  HiChevronLeft,
  HiUpload,
  HiStar,
} from 'react-icons/hi';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  duration: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  _count?: {
    bookings: number;
  };
}

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  duration: number;
  images: string[];
}

const categories = [
  { value: 'BEAUTY', label: 'Beauty', subcategories: ['Hair', 'Makeup', 'Nails', 'Skincare', 'Barbering'] },
  { value: 'HOME', label: 'Home Services', subcategories: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'] },
  { value: 'WELLNESS', label: 'Wellness', subcategories: ['Massage', 'Spa', 'Fitness', 'Yoga', 'Nutrition'] },
  { value: 'LIFESTYLE', label: 'Lifestyle', subcategories: ['Tutoring', 'Photography', 'Event Planning', 'Personal Shopping'] },
  { value: 'DELIVERY', label: 'Delivery', subcategories: ['Food', 'Groceries', 'Packages', 'Documents'] },
  { value: 'TRANSPORT', label: 'Transport', subcategories: ['Rides', 'Moving', 'Courier'] },
];

export default function ProviderServicesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    duration: 60,
    images: [],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/provider/services');
      return;
    }
    // Backend returns roles in UPPERCASE (ADMIN, CUSTOMER, PROVIDER)
    if (user?.role !== 'PROVIDER') {
      toast.error('Access denied. Providers only.');
      router.push('/');
      return;
    }
    fetchServices();
  }, [isAuthenticated, user, router]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/providers/me/services');
      setServices(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      // Use mock data if API fails
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingService) {
        await api.patch(`/services/${editingService.id}`, formData);
        toast.success('Service updated successfully!');
      } else {
        await api.post('/services', formData);
        toast.success('Service created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await api.patch(`/services/${service.id}`, { isActive: !service.isActive });
      toast.success(service.isActive ? 'Service hidden from customers' : 'Service now visible');
      setServices(prev =>
        prev.map(s => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Service deleted');
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      subcategory: service.subcategory,
      price: service.price,
      duration: service.duration,
      images: service.images,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      subcategory: '',
      price: 0,
      duration: 60,
      images: [],
    });
  };

  const selectedCategory = categories.find(c => c.value === formData.category);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'active' && service.isActive) ||
                          (filterStatus === 'inactive' && !service.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!isAuthenticated || user?.role !== 'PROVIDER') {
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
              <Link href="/provider/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <HiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Services</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your service offerings</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
            >
              <HiPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Service</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{services.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Services</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600">{services.filter(s => s.isActive).length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-400">{services.filter(s => !s.isActive).length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hidden</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-primary-600">
              {services.reduce((sum, s) => sum + (s._count?.bookings || 0), 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Hidden</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <HiTag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {services.length === 0 ? 'No services yet' : 'No matching services'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {services.length === 0
                ? 'Start by adding your first service to attract customers'
                : 'Try adjusting your filters'}
            </p>
            {services.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
              >
                Add Your First Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border overflow-hidden transition ${
                  service.isActive
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                {/* Service Image */}
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                  {service.images && service.images.length > 0 ? (
                    <Image
                      src={service.images[0]}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <HiPhotograph className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  {!service.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
                        Hidden
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-700 dark:text-gray-300">
                      {categories.find(c => c.value === service.category)?.label || service.category}
                    </span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold">
                      <HiCurrencyDollar className="w-4 h-4" />
                      KES {service.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <HiClock className="w-4 h-4" />
                      {service.duration} min
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
                    >
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition text-sm ${
                        service.isActive
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {service.isActive ? (
                        <>
                          <HiEyeOff className="w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <HiEye className="w-4 h-4" />
                          Show
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Knotless Braids"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your service in detail..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subcategory *
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      required
                      disabled={!formData.category}
                    >
                      <option value="">Select</option>
                      {selectedCategory?.subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price (KES) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">KES</span>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        step="50"
                        className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes) *
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                      <option value={240}>4 hours</option>
                      <option value={300}>5 hours</option>
                      <option value={360}>6 hours</option>
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.images[0] || ''}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Add a URL to an image of your service</p>
                </div>

                {/* Preview Image */}
                {formData.images[0] && (
                  <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={formData.images[0]}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [] })}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <HiCheck className="w-5 h-5" />
                        {editingService ? 'Update Service' : 'Create Service'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
