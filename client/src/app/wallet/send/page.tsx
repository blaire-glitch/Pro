'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiSearch, HiUser, HiPhone, HiCheck, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { SubscriptionGuard } from '@/components/guards/SubscriptionGuard';
import { walletApi } from '@/lib/api';

const recentContacts = [
  { id: '1', name: 'John Ochieng', phone: '0712 345 678', avatar: 'JO', color: 'bg-blue-500' },
  { id: '2', name: 'Mary Wanjiku', phone: '0723 456 789', avatar: 'MW', color: 'bg-pink-500' },
  { id: '3', name: 'Peter Kamau', phone: '0734 567 890', avatar: 'PK', color: 'bg-green-500' },
  { id: '4', name: 'Grace Adhiambo', phone: '0745 678 901', avatar: 'GA', color: 'bg-purple-500' },
];

const quickAmounts = [100, 500, 1000, 2500, 5000];

export default function SendMoneyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<typeof recentContacts[0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const walletBalance = 12450;

  const filteredContacts = recentContacts.filter(
    contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  const handleSelectContact = (contact: typeof recentContacts[0]) => {
    setSelectedContact(contact);
    setPhoneNumber(contact.phone.replace(/\s/g, ''));
    setStep(2);
  };

  const handleManualEntry = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setSelectedContact({
      id: 'manual',
      name: 'New Recipient',
      phone: phoneNumber,
      avatar: phoneNumber.slice(-2),
      color: 'bg-gray-500'
    });
    setStep(2);
  };

  const handleContinue = () => {
    const amountNum = parseFloat(amount);
    if (!amount || amountNum < 10) {
      toast.error('Minimum amount is KES 10');
      return;
    }
    if (amountNum > walletBalance) {
      toast.error('Insufficient balance');
      return;
    }
    setStep(3);
  };

  const handleSend = async () => {
    setIsProcessing(true);
    
    try {
      const response = await walletApi.sendMoney({
        recipientPhone: phoneNumber.startsWith('0') ? `+254${phoneNumber.slice(1)}` : phoneNumber,
        amount: parseFloat(amount),
        note: note || undefined,
      });
      
      toast.success(response.data.data?.message || `KES ${parseInt(amount).toLocaleString()} sent to ${selectedContact?.name}!`);
      router.push('/wallet');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to send money. Please try again.';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <SubscriptionGuard feature="Send Money">
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Send Money</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <HiCheck className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Recipient */}
        {step === 1 && (
          <>
            {/* Search/Phone Input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <div className="flex items-center gap-3">
                <HiSearch className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or enter phone number"
                  className="flex-1 outline-none text-sm"
                />
              </div>
            </div>

            {/* Manual Phone Entry */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <p className="text-sm text-gray-500 mb-3">Enter phone number</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm">+254</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="7XX XXX XXX"
                  className="flex-1 px-4 py-2 border rounded-lg outline-none focus:border-primary-500"
                />
              </div>
              <button
                onClick={handleManualEntry}
                disabled={phoneNumber.length < 9}
                className="w-full mt-4 py-3 bg-primary-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            {/* Recent Contacts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HiClock className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Recent</p>
              </div>
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                      {contact.avatar}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && selectedContact && (
          <>
            {/* Selected Recipient */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-4">
              <div className={`w-12 h-12 ${selectedContact.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                {selectedContact.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-sm text-gray-500">{selectedContact.phone}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-primary-600 text-sm font-medium">
                Change
              </button>
            </div>

            {/* Amount Input */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <label className="block text-sm text-gray-500 mb-2">Enter Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-400">KES</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="text-4xl font-bold w-full outline-none bg-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Balance: KES {walletBalance.toLocaleString()}
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Quick select</p>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value.toString())}
                    className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      amount === value.toString()
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    }`}
                  >
                    {value.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <label className="block text-sm text-gray-500 mb-2">Add a note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., For lunch"
                className="w-full outline-none text-sm"
                maxLength={50}
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!amount || parseFloat(amount) < 10}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedContact && (
          <>
            {/* Transaction Summary */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white text-center">
                <p className="text-sm opacity-80 mb-1">You&apos;re sending</p>
                <p className="text-4xl font-bold">KES {parseInt(amount).toLocaleString()}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-500">To</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${selectedContact.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                      {selectedContact.avatar}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{selectedContact.name}</p>
                      <p className="text-xs text-gray-500">{selectedContact.phone}</p>
                    </div>
                  </div>
                </div>
                
                {note && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-500">Note</span>
                    <span className="font-medium">{note}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-lg">KES {parseInt(amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isProcessing}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Money'
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              By sending, you agree to our terms of service
            </p>
          </>
        )}
      </div>
    </div>
    </SubscriptionGuard>
  );
}
