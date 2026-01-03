'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiPlus, HiPencil, HiTrash, HiEye, HiCurrencyDollar,
  HiShoppingBag, HiTruck, HiStar, HiPhotograph, HiCog,
  HiChartBar, HiClipboardList, HiUserGroup
} from 'react-icons/hi';

// Mock shop data
const mockShop = {
  id: '1',
  name: 'Tech Hub Kisumu',
  slug: 'tech-hub-kisumu',
  description: 'Your trusted electronics store in Kisumu',
  logo: 'https://ui-avatars.com/api/?name=Tech+Hub&background=4ECDC4&color=fff&size=200',
  banner: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200',
  isVerified: true,
  rating: 4.8,
  reviewCount: 234,
  city: 'Kisumu',
};

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy A54 5G',
    price: 45000,
    stock: 15,
    sold: 47,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  },
  {
    id: '2',
    name: 'JBL Bluetooth Speaker',
    price: 8500,
    stock: 8,
    sold: 23,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
  },
  {
    id: '3',
    name: 'Wireless Earbuds Pro',
    price: 3500,
    stock: 0,
    sold: 89,
    status: 'out_of_stock',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
  },
];

// Mock orders
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Ochieng',
    items: 2,
    total: 48500,
    status: 'pending',
    date: '2024-01-03',
  },
  {
    id: 'ORD-002',
    customer: 'Mary Wanjiku',
    items: 1,
    total: 8500,
    status: 'processing',
    date: '2024-01-02',
  },
  {
    id: 'ORD-003',
    customer: 'Peter Kimani',
    items: 3,
    total: 52000,
    status: 'delivered',
    date: '2024-01-01',
  },
];

const stats = [
  { label: 'Total Revenue', value: 'KES 285,000', icon: HiCurrencyDollar, color: 'bg-green-500' },
  { label: 'Total Orders', value: '47', icon: HiShoppingBag, color: 'bg-blue-500' },
  { label: 'Products', value: '12', icon: HiClipboardList, color: 'bg-purple-500' },
  { label: 'Rating', value: '4.8', icon: HiStar, color: 'bg-yellow-500' },
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Shop Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="relative h-40 bg-gradient-to-r from-primary-500 to-secondary-500">
              {mockShop.banner && (
                <Image
                  src={mockShop.banner}
                  alt="Shop banner"
                  fill
                  className="object-cover opacity-50"
                />
              )}
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-12 relative z-10">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src={mockShop.logo}
                    alt={mockShop.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">{mockShop.name}</h1>
                    {mockShop.isVerified && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Verified</span>
                    )}
                  </div>
                  <p className="text-gray-500">{mockShop.city} • {mockShop.reviewCount} reviews</p>
                </div>
                <Link
                  href="/vendor/settings"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <HiCog className="w-5 h-5" />
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b">
              <nav className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: HiChartBar },
                  { id: 'products', label: 'Products', icon: HiClipboardList },
                  { id: 'orders', label: 'Orders', icon: HiShoppingBag },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
                      <div className="space-y-3">
                        {mockOrders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.customer}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">KES {order.total.toLocaleString()}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Products */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">Top Products</h3>
                      <div className="space-y-3">
                        {mockProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                              <Image
                                src={product.thumbnail}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sold} sold</p>
                            </div>
                            <p className="font-medium">KES {product.price.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">All Products</h3>
                    <button className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">
                      <HiPlus className="w-5 h-5" />
                      Add Product
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-medium text-gray-500">Product</th>
                          <th className="pb-3 font-medium text-gray-500">Price</th>
                          <th className="pb-3 font-medium text-gray-500">Stock</th>
                          <th className="pb-3 font-medium text-gray-500">Sold</th>
                          <th className="pb-3 font-medium text-gray-500">Status</th>
                          <th className="pb-3 font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {mockProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                  <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4">KES {product.price.toLocaleString()}</td>
                            <td className="py-4">{product.stock}</td>
                            <td className="py-4">{product.sold}</td>
                            <td className="py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                                {product.status === 'out_of_stock' ? 'Out of Stock' : 'Active'}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <HiEye className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <HiPencil className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-lg">
                                  <HiTrash className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">All Orders</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-medium text-gray-500">Order ID</th>
                          <th className="pb-3 font-medium text-gray-500">Customer</th>
                          <th className="pb-3 font-medium text-gray-500">Items</th>
                          <th className="pb-3 font-medium text-gray-500">Total</th>
                          <th className="pb-3 font-medium text-gray-500">Date</th>
                          <th className="pb-3 font-medium text-gray-500">Status</th>
                          <th className="pb-3 font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {mockOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="py-4 font-medium">{order.id}</td>
                            <td className="py-4">{order.customer}</td>
                            <td className="py-4">{order.items} items</td>
                            <td className="py-4">KES {order.total.toLocaleString()}</td>
                            <td className="py-4">{order.date}</td>
                            <td className="py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
