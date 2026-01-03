'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiShoppingCart, HiX } from 'react-icons/hi';
import { useCartStore } from '@/store/cartStore';

export function FloatingCart() {
  const { items, getItemCount, getTotal, isOpen, toggleCart, closeCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const itemCount = getItemCount();
  const total = getTotal();

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-40 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all hover:scale-105"
      >
        <HiShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {/* Mini Cart Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeCart}
          />
          
          {/* Cart Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold">Your Cart ({itemCount})</h3>
              <button onClick={closeCart} className="p-1 hover:bg-white/20 rounded">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-4 space-y-3">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × KES {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{items.length - 3} more items
                </p>
              )}
            </div>

            <div className="border-t p-4">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-primary-600">KES {total.toLocaleString()}</span>
              </div>
              <Link
                href="/marketplace/cart"
                onClick={closeCart}
                className="block w-full bg-primary-500 text-white text-center py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                View Cart & Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
