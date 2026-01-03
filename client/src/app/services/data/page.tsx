'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiWifi, 
  HiPhone, 
  HiCheckCircle,
  HiClock,
  HiRefresh,
  HiGlobe,
  HiDeviceMobile
} from 'react-icons/hi';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';

// Network providers with data bundles
const networks = [
  { 
    id: 'safaricom', 
    name: 'Safaricom', 
    color: 'bg-green-500',
    logo: 'S',
    bundles: [
      { id: 's1', name: 'Daily', data: '1GB', validity: '24 hours', price: 99 },
      { id: 's2', name: 'Daily', data: '2GB', validity: '24 hours', price: 149 },
      { id: 's3', name: 'Weekly', data: '6GB', validity: '7 days', price: 700 },
      { id: 's4', name: 'Weekly', data: '10GB', validity: '7 days', price: 1000 },
      { id: 's5', name: 'Monthly', data: '15GB', validity: '30 days', price: 1500 },
      { id: 's6', name: 'Monthly', data: '25GB', validity: '30 days', price: 2500 },
      { id: 's7', name: 'Monthly', data: '40GB', validity: '30 days', price: 3500 },
      { id: 's8', name: 'Unlimited', data: 'Unlimited', validity: '30 days', price: 5000 },
    ]
  },
  { 
    id: 'airtel', 
    name: 'Airtel', 
    color: 'bg-red-500',
    logo: 'A',
    bundles: [
      { id: 'a1', name: 'Daily', data: '1.5GB', validity: '24 hours', price: 99 },
      { id: 'a2', name: 'Daily', data: '3GB', validity: '24 hours', price: 199 },
      { id: 'a3', name: 'Weekly', data: '8GB', validity: '7 days', price: 500 },
      { id: 'a4', name: 'Weekly', data: '12GB', validity: '7 days', price: 850 },
      { id: 'a5', name: 'Monthly', data: '20GB', validity: '30 days', price: 1500 },
      { id: 'a6', name: 'Monthly', data: '35GB', validity: '30 days', price: 2500 },
      { id: 'a7', name: 'Monthly', data: '50GB', validity: '30 days', price: 3500 },
    ]
  },
  { 
    id: 'telkom', 
    name: 'Telkom', 
    color: 'bg-blue-500',
    logo: 'T',
    bundles: [
      { id: 't1', name: 'Daily', data: '2GB', validity: '24 hours', price: 55 },
      { id: 't2', name: 'Daily', data: '5GB', validity: '24 hours', price: 100 },
      { id: 't3', name: 'Weekly', data: '10GB', validity: '7 days', price: 300 },
      { id: 't4', name: 'Weekly', data: '15GB', validity: '7 days', price: 500 },
      { id: 't5', name: 'Monthly', data: '30GB', validity: '30 days', price: 1000 },
      { id: 't6', name: 'Monthly', data: '50GB', validity: '30 days', price: 1500 },
    ]
  },
];

const bundleTypes = ['All', 'Daily', 'Weekly', 'Monthly', 'Unlimited'];

export default function DataPage() {
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [selectedNetwork, setSelectedNetwork] = useState('safaricom');
  const [selectedBundle, setSelectedBundle] = useState<typeof networks[0]['bundles'][0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentNetwork = networks.find(n => n.id === selectedNetwork)!;
  
  const filteredBundles = activeFilter === 'All' 
    ? currentNetwork.bundles 
    : currentNetwork.bundles.filter(b => b.name === activeFilter);

  const handleSelectBundle = (bundle: typeof networks[0]['bundles'][0]) => {
    setSelectedBundle(bundle);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
    toast.success('Data bundle purchased successfully!');
  };

  const handleBuyAgain = () => {
    setStep('select');
    setSelectedBundle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/services" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Buy Data Bundles</h1>
                <p className="text-white/80 text-sm">Stay connected always</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-4">
          {step === 'select' && (
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

              {/* Phone Number */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Phone Number</h2>
                <div className="relative">
                  <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Bundle Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {bundleTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === type
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Bundles Grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredBundles.map((bundle) => (
                  <button
                    key={bundle.id}
                    onClick={() => handleSelectBundle(bundle)}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <HiWifi className={`w-5 h-5 ${currentNetwork.color.replace('bg-', 'text-')}`} />
                      <span className="text-xs text-gray-500">{bundle.name}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{bundle.data}</p>
                    <p className="text-sm text-gray-500 mb-3">{bundle.validity}</p>
                    <div className={`${currentNetwork.color} text-white py-2 rounded-lg text-center font-semibold`}>
                      KES {bundle.price}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'confirm' && selectedBundle && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 text-xl mb-6 text-center">Confirm Purchase</h2>

              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white text-center mb-6">
                <HiWifi className="w-12 h-12 mx-auto mb-2 opacity-80" />
                <p className="text-4xl font-bold mb-1">{selectedBundle.data}</p>
                <p className="text-white/80">{selectedBundle.validity}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium text-gray-900">{currentNetwork.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Phone Number</span>
                  <span className="font-medium text-gray-900">{phoneNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Bundle</span>
                  <span className="font-medium text-gray-900">{selectedBundle.name} - {selectedBundle.data}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-xl text-gray-900">KES {selectedBundle.price.toLocaleString()}</span>
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
                  onClick={() => setStep('select')}
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
                    `Pay KES ${selectedBundle.price.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && selectedBundle && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="font-bold text-gray-900 text-xl mb-2">Purchase Successful!</h2>
              <p className="text-gray-500 mb-6">
                {selectedBundle.data} data bundle activated on {phoneNumber}
              </p>

              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-4 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Data Balance</p>
                    <p className="text-2xl font-bold">{selectedBundle.data}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Expires</p>
                    <p className="font-medium">{selectedBundle.validity}</p>
                  </div>
                </div>
              </div>

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
