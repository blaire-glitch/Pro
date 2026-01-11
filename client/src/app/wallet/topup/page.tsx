'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiPhone, HiCreditCard, HiOfficeBuilding } from 'react-icons/hi';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { walletApi } from '@/lib/api';

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: HiPhone, color: 'bg-green-500', description: 'Pay via M-Pesa' },
  { id: 'airtel', name: 'Airtel Money', icon: HiPhone, color: 'bg-red-500', description: 'Pay via Airtel Money' },
  { id: 'card', name: 'Debit/Credit Card', icon: HiCreditCard, color: 'bg-blue-500', description: 'Visa, Mastercard' },
  { id: 'bank', name: 'Bank Transfer', icon: HiOfficeBuilding, color: 'bg-purple-500', description: 'Direct bank transfer' },
];

const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

export default function TopUpPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }
    if ((selectedMethod === 'mpesa' || selectedMethod === 'airtel') && !phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await walletApi.topUp({
        amount: parseFloat(amount),
        method: selectedMethod.toUpperCase(),
        phone: phoneNumber || undefined,
      });
      
      const message = response.data.data?.message || `Top up of KES ${parseFloat(amount).toLocaleString()} initiated!`;
      toast.success(message);
      
      if (response.data.data?.demo) {
        // In demo mode, balance is immediately updated
        router.push('/wallet');
      } else {
        // Show waiting for payment confirmation
        toast('Please check your phone for payment prompt', { icon: '📱' });
      }
      
      setAmount('');
      setSelectedMethod('');
      setPhoneNumber('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Top up failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Back Button */}
          <Link href="/wallet" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <HiArrowLeft className="w-5 h-5" />
            <span>Back to Wallet</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Money</h1>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount (KES)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium">
                KES
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-16 pr-4 py-4 text-3xl font-bold text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    amount === quickAmount.toString()
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number Input (for mobile money) */}
          {(selectedMethod === 'mpesa' || selectedMethod === 'airtel') && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                You will receive an STK push to confirm payment
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleTopUp}
            disabled={isLoading || !amount || !selectedMethod}
            className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Add KES ${amount ? parseFloat(amount).toLocaleString() : '0'}`
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
