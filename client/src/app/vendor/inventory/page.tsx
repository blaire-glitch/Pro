'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  HiPlus, HiPencil, HiTrash, HiEye, HiSearch, HiFilter,
  HiPhotograph, HiX, HiCheck, HiChevronLeft, HiDownload,
  HiUpload, HiDuplicate, HiExclamation, HiSortAscending,
  HiSortDescending, HiViewGrid, HiViewList
} from 'react-icons/hi';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  category: string;
  subcategory?: string;
  images: string[];
  thumbnail: string;
  status: 'active' | 'draft' | 'out_of_stock' | 'archived';
  sold: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Health & Beauty',
  'Sports & Outdoors',
  'Food & Beverages',
  'Books & Stationery',
  'Automotive',
  'Other',
];

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sold'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    sku: '',
    barcode: '',
    stock: '',
    lowStockThreshold: '5',
    category: '',
    subcategory: '',
    images: [] as string[],
  });

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Samsung Galaxy A54 5G',
      description: 'Latest Samsung smartphone with 5G capability',
      price: 45000,
      comparePrice: 52000,
      sku: 'SAM-A54-5G',
      stock: 15,
      lowStockThreshold: 5,
      category: 'Electronics',
      subcategory: 'Smartphones',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      status: 'active',
      sold: 47,
      views: 1250,
      createdAt: '2025-12-01',
      updatedAt: '2026-01-10',
    },
    {
      id: '2',
      name: 'JBL Bluetooth Speaker',
      description: 'Portable wireless speaker with powerful bass',
      price: 8500,
      sku: 'JBL-BT-SPK',
      stock: 8,
      lowStockThreshold: 5,
      category: 'Electronics',
      subcategory: 'Audio',
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'],
      thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      status: 'active',
      sold: 23,
      views: 580,
      createdAt: '2025-11-15',
      updatedAt: '2026-01-08',
    },
    {
      id: '3',
      name: 'Wireless Earbuds Pro',
      description: 'Premium wireless earbuds with noise cancellation',
      price: 3500,
      comparePrice: 4500,
      sku: 'WEB-PRO-01',
      stock: 0,
      lowStockThreshold: 10,
      category: 'Electronics',
      subcategory: 'Audio',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
      thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      status: 'out_of_stock',
      sold: 89,
      views: 2100,
      createdAt: '2025-10-20',
      updatedAt: '2026-01-05',
    },
    {
      id: '4',
      name: 'Laptop Stand Adjustable',
      description: 'Ergonomic aluminum laptop stand',
      price: 2500,
      sku: 'LSA-ALU-01',
      stock: 34,
      lowStockThreshold: 10,
      category: 'Electronics',
      subcategory: 'Accessories',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
      thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      status: 'active',
      sold: 34,
      views: 890,
      createdAt: '2025-09-10',
      updatedAt: '2026-01-12',
    },
    {
      id: '5',
      name: 'USB-C Hub 7-in-1',
      description: 'Multi-port USB-C adapter for laptops',
      price: 4500,
      sku: 'USB-HUB-7',
      stock: 3,
      lowStockThreshold: 5,
      category: 'Electronics',
      subcategory: 'Accessories',
      images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'],
      thumbnail: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400',
      status: 'active',
      sold: 18,
      views: 420,
      createdAt: '2025-11-01',
      updatedAt: '2026-01-11',
    },
    {
      id: '6',
      name: 'Smart Watch Pro',
      description: 'Fitness tracker with heart rate monitor',
      price: 12000,
      comparePrice: 15000,
      sku: 'SWP-001',
      stock: 0,
      lowStockThreshold: 5,
      category: 'Electronics',
      subcategory: 'Wearables',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      status: 'draft',
      sold: 0,
      views: 0,
      createdAt: '2026-01-10',
      updatedAt: '2026-01-10',
    },
  ];

  useEffect(() => {
    // Check for action param
    const action = searchParams.get('action');
    if (action === 'add') {
      setShowAddModal(true);
    }
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'archived': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'price': comparison = a.price - b.price; break;
        case 'stock': comparison = a.stock - b.stock; break;
        case 'sold': comparison = a.sold - b.sold; break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) return;
    if (confirm(`Delete ${selectedProducts.length} product(s)?`)) {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      toast.success('Products deleted');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              description: formData.description,
              price: parseFloat(formData.price),
              comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
              sku: formData.sku,
              barcode: formData.barcode || undefined,
              stock: parseInt(formData.stock),
              lowStockThreshold: parseInt(formData.lowStockThreshold),
              category: formData.category,
              subcategory: formData.subcategory || undefined,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : p
      ));
      toast.success('Product updated');
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        sku: formData.sku || `SKU-${Date.now()}`,
        barcode: formData.barcode || undefined,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/400'],
        thumbnail: formData.images[0] || 'https://via.placeholder.com/400',
        status: parseInt(formData.stock) > 0 ? 'active' : 'out_of_stock',
        sold: 0,
        views: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added');
    }

    setShowAddModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      sku: '',
      barcode: '',
      stock: '',
      lowStockThreshold: '5',
      category: '',
      subcategory: '',
      images: [],
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      sku: product.sku,
      barcode: product.barcode || '',
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images,
    });
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inventory</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                <HiDownload className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                <HiUpload className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <HiPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Alerts */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="mb-6 space-y-3">
            {outOfStockProducts.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                <HiExclamation className="w-5 h-5 text-red-600" />
                <span className="text-red-800 dark:text-red-200">
                  {outOfStockProducts.length} product(s) out of stock
                </span>
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
                <HiExclamation className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 dark:text-yellow-200">
                  {lowStockProducts.length} product(s) running low on stock
                </span>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="archived">Archived</option>
              </select>
              <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <HiViewList className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <HiViewGrid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProducts.length} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete Selected
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400">
                Update Status
              </button>
            </div>
          )}
        </div>

        {/* Products Table/Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <button
                        onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className="flex items-center gap-1"
                      >
                        Product
                        {sortBy === 'name' && (sortOrder === 'asc' ? <HiSortAscending className="w-4 h-4" /> : <HiSortDescending className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <button
                        onClick={() => { setSortBy('price'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className="flex items-center gap-1"
                      >
                        Price
                        {sortBy === 'price' && (sortOrder === 'asc' ? <HiSortAscending className="w-4 h-4" /> : <HiSortDescending className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <button
                        onClick={() => { setSortBy('stock'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className="flex items-center gap-1"
                      >
                        Stock
                        {sortBy === 'stock' && (sortOrder === 'asc' ? <HiSortAscending className="w-4 h-4" /> : <HiSortDescending className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <button
                        onClick={() => { setSortBy('sold'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className="flex items-center gap-1"
                      >
                        Sold
                        {sortBy === 'sold' && (sortOrder === 'asc' ? <HiSortAscending className="w-4 h-4" /> : <HiSortDescending className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-500 line-through">{formatCurrency(product.comparePrice)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock <= product.lowStockThreshold ? 'text-yellow-600' :
                          'text-gray-900 dark:text-white'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{product.sold}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <HiPencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <HiDuplicate className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this product?')) {
                                setProducts(prev => prev.filter(p => p.id !== product.id));
                                toast.success('Product deleted');
                              }
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                          >
                            <HiTrash className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                  <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <HiPencil className="w-5 h-5 text-gray-800" />
                    </button>
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                      <HiEye className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-bold text-green-600">{formatCurrency(product.price)}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <HiPhotograph className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <HiPlus className="w-5 h-5" />
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <HiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price (KES) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Compare at Price
                    </label>
                    <input
                      type="number"
                      value={formData.comparePrice}
                      onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Category</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Images</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <HiPhotograph className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Drag and drop images or click to browse</p>
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Upload Images
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InventoryManagement() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    }>
      <InventoryContent />
    </Suspense>
  );
}
