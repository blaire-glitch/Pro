'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  HiTrash, HiPlus, HiMinus, HiArrowLeft, HiShoppingCart,
  HiShieldCheck, HiTruck, HiClock
} from 'react-icons/hi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Group items by shop
  const itemsByShop = items.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = {
        shopName: item.shopName,
        items: [],
      };
    }
    acc[item.shopId].items.push(item);
    return acc;
  }, {} as Record<string, { shopName: string; items: typeof items }>);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate checkout
    setTimeout(() => {
      alert('Checkout feature coming soon! Your cart has been saved.');
      setIsProcessing(false);
    }, 1500);
  };

  const subtotal = getTotal();
  const deliveryFee = items.length > 0 ? 200 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Marketplace', href: '/marketplace' },
              { label: 'Cart' },
            ]}
            className="mb-6"
          />

          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            // Empty Cart
            <EmptyState type="cart" />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {Object.entries(itemsByShop).map(([shopId, { shopName, items: shopItems }]) => (
                  <div key={shopId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Shop Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-800">{shopName}</h3>
                    </div>

                    {/* Items */}
                    <div className="divide-y">
                      {shopItems.map((item) => (
                        <div key={item.id} className="p-4 flex gap-4">
                          {/* Image */}
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={item.thumbnail}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                            <p className="text-primary-600 font-semibold mt-1">
                              KES {item.price.toLocaleString()}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-3">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <HiMinus className="w-4 h-4" />
                                </button>
                                <span className="px-4 font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <HiPlus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <HiTrash className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Clear all items
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({items.length} items)</span>
                      <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>KES {deliveryFee.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary-600">KES {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>

                  {/* Payment Options */}
                  <div className="mt-4 flex justify-center gap-2">
                    <div className="w-10 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      M
                    </div>
                    <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      V
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    M-Pesa • Airtel Money • Visa
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <HiShieldCheck className="w-5 h-5 text-green-500" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <HiTruck className="w-5 h-5 text-blue-500" />
                      <span>Fast delivery across Western Kenya</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <HiClock className="w-5 h-5 text-orange-500" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
