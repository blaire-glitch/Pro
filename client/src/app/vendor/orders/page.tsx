'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  HiChevronLeft,
  HiSearch,
  HiFilter,
  HiEye,
  HiPrinter,
  HiTruck,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiPhone,
  HiLocationMarker,
  HiX,
  HiChat,
} from 'react-icons/hi';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ready: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered'];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/vendor/orders');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2026-0156',
          customer: {
            name: 'Jane Achieng',
            phone: '+254 712 345 678',
            email: 'jane@email.com',
            address: 'Westlands, Nairobi',
          },
          items: [
            { id: '1', name: 'Wireless Bluetooth Headphones', quantity: 1, price: 4500, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
            { id: '2', name: 'Phone Case', quantity: 2, price: 500, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=100' },
          ],
          subtotal: 5500,
          deliveryFee: 200,
          total: 5700,
          status: 'pending',
          paymentStatus: 'paid',
          paymentMethod: 'M-Pesa',
          notes: 'Please call before delivery',
          createdAt: '2026-01-12T14:30:00',
          updatedAt: '2026-01-12T14:30:00',
        },
        {
          id: '2',
          orderNumber: 'ORD-2026-0155',
          customer: {
            name: 'Peter Omondi',
            phone: '+254 723 456 789',
            email: 'peter@email.com',
            address: 'Kilimani, Nairobi',
          },
          items: [
            { id: '3', name: 'Solar Power Bank 20000mAh', quantity: 2, price: 2800, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100' },
          ],
          subtotal: 5600,
          deliveryFee: 150,
          total: 5750,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Card',
          createdAt: '2026-01-12T12:15:00',
          updatedAt: '2026-01-12T12:45:00',
        },
        {
          id: '3',
          orderNumber: 'ORD-2026-0154',
          customer: {
            name: 'Mary Wanjiku',
            phone: '+254 734 567 890',
            email: 'mary@email.com',
            address: 'Karen, Nairobi',
          },
          items: [
            { id: '4', name: 'Organic Coffee Beans 1kg', quantity: 3, price: 1200, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100' },
            { id: '5', name: 'Coffee Mug Set', quantity: 1, price: 800, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100' },
          ],
          subtotal: 4400,
          deliveryFee: 250,
          total: 4650,
          status: 'preparing',
          paymentStatus: 'paid',
          paymentMethod: 'M-Pesa',
          createdAt: '2026-01-12T10:00:00',
          updatedAt: '2026-01-12T11:30:00',
        },
        {
          id: '4',
          orderNumber: 'ORD-2026-0153',
          customer: {
            name: 'John Kimani',
            phone: '+254 745 678 901',
            email: 'john@email.com',
            address: 'Lavington, Nairobi',
          },
          items: [
            { id: '6', name: 'African Print Dress', quantity: 1, price: 3500, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100' },
          ],
          subtotal: 3500,
          deliveryFee: 200,
          total: 3700,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'M-Pesa',
          createdAt: '2026-01-11T16:00:00',
          updatedAt: '2026-01-12T09:00:00',
        },
        {
          id: '5',
          orderNumber: 'ORD-2026-0152',
          customer: {
            name: 'Grace Muthoni',
            phone: '+254 756 789 012',
            email: 'grace@email.com',
            address: 'Kileleshwa, Nairobi',
          },
          items: [
            { id: '7', name: 'Handmade Leather Bag', quantity: 1, price: 3500, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100' },
          ],
          subtotal: 3500,
          deliveryFee: 150,
          total: 3650,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'Card',
          createdAt: '2026-01-10T14:00:00',
          updatedAt: '2026-01-11T12:00:00',
        },
        {
          id: '6',
          orderNumber: 'ORD-2026-0151',
          customer: {
            name: 'David Njoroge',
            phone: '+254 767 890 123',
            email: 'david@email.com',
            address: 'South B, Nairobi',
          },
          items: [
            { id: '8', name: 'Wireless Charger', quantity: 1, price: 1500, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=100' },
          ],
          subtotal: 1500,
          deliveryFee: 100,
          total: 1600,
          status: 'cancelled',
          paymentStatus: 'refunded',
          paymentMethod: 'M-Pesa',
          notes: 'Customer requested cancellation',
          createdAt: '2026-01-10T10:00:00',
          updatedAt: '2026-01-10T11:00:00',
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
        : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
    }
    toast.success(`Order status updated to ${newStatus}`);
  };

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Orders</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{orders.length} total orders</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending</p>
            <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{orderStats.pending}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">Processing</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{orderStats.processing}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">Shipped</p>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{orderStats.shipped}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-700 dark:text-green-300">Delivered</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">{orderStats.delivered}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <HiTruck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400">Orders will appear here when customers make purchases</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={() => {
                            const nextStatus = getNextStatus(order.status);
                            if (nextStatus) updateOrderStatus(order.id, nextStatus);
                          }}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          {order.status === 'pending' && 'Confirm'}
                          {order.status === 'confirmed' && 'Start Preparing'}
                          {order.status === 'preparing' && 'Mark Ready'}
                          {order.status === 'ready' && 'Ship'}
                          {order.status === 'shipped' && 'Mark Delivered'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <HiEye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg border-2 border-white dark:border-gray-800 object-cover"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-lg border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          KES {order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                  selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedOrder.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)} via {selectedOrder.paymentMethod}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Customer Details</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <HiPhone className="w-4 h-4" />
                    {selectedOrder.customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <HiLocationMarker className="w-4 h-4" />
                    {selectedOrder.customer.address}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={`tel:${selectedOrder.customer.phone}`} className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg text-center hover:bg-green-700">
                    <HiPhone className="w-4 h-4 inline mr-1" /> Call
                  </a>
                  <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <HiChat className="w-4 h-4 inline mr-1" /> Message
                  </button>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">KES {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="text-gray-900 dark:text-white">KES {selectedOrder.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600">KES {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Customer Note:</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => {
                      const nextStatus = getNextStatus(selectedOrder.status);
                      if (nextStatus) {
                        updateOrderStatus(selectedOrder.id, nextStatus);
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {selectedOrder.status === 'pending' && 'Confirm Order'}
                    {selectedOrder.status === 'confirmed' && 'Start Preparing'}
                    {selectedOrder.status === 'preparing' && 'Mark Ready'}
                    {selectedOrder.status === 'ready' && 'Ship Order'}
                    {selectedOrder.status === 'shipped' && 'Mark Delivered'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
