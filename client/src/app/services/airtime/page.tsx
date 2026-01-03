'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiPhone, 
  HiUser, 
  HiCheckCircle,
  HiClock,
  HiRefresh
} from 'react-icons/hi';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';

// Network providers
const networks = [
  { 
    id: 'safaricom', 
    name: 'Safaricom', 
    color: 'bg-green-500',
    logo: 'S',
    prefix: ['07', '01'],
    quickAmounts: [20, 50, 100, 200, 500, 1000]
  },
  { 
    id: 'airtel', 
    name: 'Airtel', 
    color: 'bg-red-500',
    logo: 'A',
    prefix: ['073', '075', '078'],
    quickAmounts: [20, 50, 100, 200, 500, 1000]
  },
  { 
    id: 'telkom', 
    name: 'Telkom', 
    color: 'bg-blue-500',
    logo: 'T',
    prefix: ['077'],
    quickAmounts: [20, 50, 100, 200, 500, 1000]
  },
];

// Recent top-ups
const recentTopUps = [
  { id: 1, name: 'My Number', phone: '0712 345 678', network: 'safaricom', lastAmount: 100 },
  { id: 2, name: 'Mama', phone: '0723 456 789', network: 'safaricom', lastAmount: 200 },
  { id: 3, name: 'Baba', phone: '0733 567 890', network: 'airtel', lastAmount: 100 },
];

// Detect network from phone number
const detectNetwork = (phone: string): string | null => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('07') || cleaned.startsWith('01') || cleaned.startsWith('+2547') || cleaned.startsWith('+2541')) {
    if (cleaned.startsWith('073') || cleaned.startsWith('075') || cleaned.startsWith('078') || 
        cleaned.startsWith('+25473') || cleaned.startsWith('+25475') || cleaned.startsWith('+25478')) {
      return 'airtel';
    }
    if (cleaned.startsWith('077') || cleaned.startsWith('+25477')) {
      return 'telkom';
    }
    return 'safaricom';
  }
  return null;
};

export default function AirtimePage() {
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [buyForSelf, setBuyForSelf] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-detect network when phone number changes
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const detected = detectNetwork(value);
    if (detected) {
      setSelectedNetwork(detected);
    }
  };

  // Get current network object
  const currentNetwork = networks.find(n => n.id === selectedNetwork);

  // Handle quick amount selection
  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!amount || parseInt(amount) < 5) {
      toast.error('Minimum amount is KES 5');
      return;
    }
    if (!selectedNetwork) {
      toast.error('Please select a network');
      return;
    }
    setStep('confirm');
  };

  // Handle payment confirmation
  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('success');
    toast.success('Airtime purchased successfully!');
  };

  // Handle buying again
  const handleBuyAgain = () => {
    setStep('input');
    setPhoneNumber('');
    setAmount('');
    setSelectedNetwork(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/services" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Buy Airtime</h1>
                <p className="text-white/80 text-sm">All networks supported</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-4">
          {step === 'input' && (
            <>
              {/* Network Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Select Network</h2>
                <div className="grid grid-cols-3 gap-3">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedNetwork === network.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{network.logo}</div>
                      <span className="font-medium text-gray-900 text-sm">{network.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Phone Number</h2>
                
                {/* Buy for Self Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      setBuyForSelf(true);
                      setPhoneNumber('0712 345 678'); // Mock user's number
                      setSelectedNetwork('safaricom');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      buyForSelf 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    For Myself
                  </button>
                  <button
                    onClick={() => {
                      setBuyForSelf(false);
                      setPhoneNumber('');
                      setSelectedNetwork(null);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      !buyForSelf 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    For Someone Else
                  </button>
                </div>

                <div className="relative">
                  <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {currentNetwork && (
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded-full ${currentNetwork.color} text-white`}>
                      {currentNetwork.name}
                    </span>
                  )}
                </div>

                {/* Recent Top-ups */}
                {!buyForSelf && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Recent</p>
                    <div className="space-y-2">
                      {recentTopUps.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => {
                            setPhoneNumber(contact.phone);
                            setSelectedNetwork(contact.network);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <HiUser className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                          </div>
                          <span className="text-sm text-gray-400">KES {contact.lastAmount}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Amount</h2>
                
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">KES</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-2xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                  />
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-3 gap-2">
                  {(currentNetwork?.quickAmounts || [20, 50, 100, 200, 500, 1000]).map((value) => (
                    <button
                      key={value}
                      onClick={() => handleQuickAmount(value)}
                      className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                        amount === value.toString()
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      KES {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!phoneNumber || !amount || !selectedNetwork}
                className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
              >
                Continue
              </button>
            </>
          )}

          {step === 'confirm' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 text-xl mb-6 text-center">Confirm Purchase</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium text-gray-900">{currentNetwork?.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Phone Number</span>
                  <span className="font-medium text-gray-900">{phoneNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-xl text-gray-900">KES {parseInt(amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Pay from</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">A</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Afrionex Wallet</p>
                      <p className="text-sm text-gray-500">Balance: KES 5,230</p>
                    </div>
                  </div>
                  <HiCheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-600 transition-colors"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <HiRefresh className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay KES ${parseInt(amount).toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="font-bold text-gray-900 text-xl mb-2">Purchase Successful!</h2>
              <p className="text-gray-500 mb-6">
                KES {parseInt(amount).toLocaleString()} airtime sent to {phoneNumber}
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <HiClock className="w-4 h-4" />
                  <span>Transaction ID: AFR-{Date.now().toString().slice(-8)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyAgain}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Buy Again
                </button>
                <Link
                  href="/wallet"
                  className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  Back to Wallet
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
