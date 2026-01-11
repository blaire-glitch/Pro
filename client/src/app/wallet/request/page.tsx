'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiArrowLeft, HiClipboard, HiShare, HiQrcode, HiUserGroup, HiClock } from 'react-icons/hi';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { walletApi } from '@/lib/api';

const recentContacts = [
  { id: 1, name: 'John Ochieng', phone: '+254 712 345 678', avatar: 'JO' },
  { id: 2, name: 'Mary Wanjiku', phone: '+254 723 456 789', avatar: 'MW' },
  { id: 3, name: 'Peter Kamau', phone: '+254 734 567 890', avatar: 'PK' },
  { id: 4, name: 'Grace Akinyi', phone: '+254 745 678 901', avatar: 'GA' },
];

const pendingRequests = [
  { id: 1, name: 'David Mwangi', amount: 500, date: '2 hours ago', status: 'pending' },
  { id: 2, name: 'Sarah Otieno', amount: 1200, date: '1 day ago', status: 'pending' },
];

export default function RequestMoneyPage() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [requestMethod, setRequestMethod] = useState<'contact' | 'link' | 'qr'>('contact');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (requestMethod === 'contact' && !selectedContact) {
      toast.error('Please select a contact');
      return;
    }

    const contact = recentContacts.find(c => c.id === selectedContact);
    if (!contact) {
      toast.error('Please select a contact');
      return;
    }

    setIsLoading(true);
    try {
      await walletApi.requestMoney({ 
        fromPhone: contact.phone, 
        amount: parseFloat(amount), 
        note: note || undefined 
      });
      toast.success(`Request for KES ${parseFloat(amount).toLocaleString()} sent!`);
      setAmount('');
      setNote('');
      setSelectedContact(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `https://afrionex.app/pay/user123?amount=${amount}`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Request Payment - Afrionex',
        text: `I'm requesting KES ${amount} via Afrionex`,
        url: `https://afrionex.app/pay/user123?amount=${amount}`,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-lg mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/wallet" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HiArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">Request Money</h1>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <label className="block text-sm text-gray-500 mb-2">Amount to Request</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-400">KES</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-4xl font-bold w-full outline-none"
              />
            </div>

            {/* Quick Amounts */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {[100, 500, 1000, 2000, 5000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-600 transition-colors"
                >
                  {quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Request Method */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setRequestMethod('contact')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                  requestMethod === 'contact' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                }`}
              >
                <HiUserGroup className="w-6 h-6" />
                <span className="text-sm font-medium">Contact</span>
              </button>
              <button
                onClick={() => setRequestMethod('link')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                  requestMethod === 'link' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                }`}
              >
                <HiClipboard className="w-6 h-6" />
                <span className="text-sm font-medium">Link</span>
              </button>
              <button
                onClick={() => setRequestMethod('qr')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                  requestMethod === 'qr' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                }`}
              >
                <HiQrcode className="w-6 h-6" />
                <span className="text-sm font-medium">QR Code</span>
              </button>
            </div>
          </div>

          {/* Contact Selection */}
          {requestMethod === 'contact' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <h3 className="font-semibold mb-4">Select Contact</h3>
              <div className="space-y-2">
                {recentContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      selectedContact === contact.id
                        ? 'bg-primary-100 border-2 border-primary-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                    {selectedContact === contact.id && (
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Link */}
          {requestMethod === 'link' && amount && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold mb-4">Your Payment Link</h3>
              <div className="bg-gray-100 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-600 break-all font-mono">
                  https://afrionex.app/pay/user123?amount={amount}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <HiClipboard className="w-5 h-5" />
                  Copy Link
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  <HiShare className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          )}

          {/* QR Code */}
          {requestMethod === 'qr' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 text-center">
              <h3 className="font-semibold mb-4">Your QR Code</h3>
              <div className="inline-block p-6 bg-white border-4 border-primary-500 rounded-2xl mb-4">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <HiQrcode className="w-32 h-32 text-white" />
                </div>
              </div>
              {amount && (
                <p className="text-lg font-semibold text-primary-600">
                  KES {parseFloat(amount).toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Show this QR code to receive payment
              </p>
            </div>
          )}

          {/* Note */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <label className="block text-sm text-gray-500 mb-2">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              className="w-full p-3 bg-gray-50 rounded-xl resize-none h-20 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Request Button */}
          {requestMethod === 'contact' && (
            <button
              onClick={handleRequest}
              disabled={!amount || !selectedContact}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Send Request
            </button>
          )}

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <HiClock className="w-5 h-5 text-orange-500" />
                  Pending Requests
                </h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {pendingRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className={`p-4 flex items-center justify-between ${
                      index !== pendingRequests.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <HiClock className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-gray-500">{request.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-500">
                        KES {request.amount.toLocaleString()}
                      </p>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
