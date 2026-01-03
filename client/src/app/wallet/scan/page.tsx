'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiArrowLeft, HiQrcode, HiCamera, HiPhotograph, HiLightBulb, HiShieldCheck } from 'react-icons/hi';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { SubscriptionGuard } from '@/components/guards/SubscriptionGuard';

const recentScans = [
  { id: 1, merchant: 'Java House Kisumu', amount: 850, date: 'Today, 2:30 PM' },
  { id: 2, merchant: 'Nakumatt Mega', amount: 3200, date: 'Yesterday' },
  { id: 3, merchant: 'Quickmart', amount: 1450, date: '2 days ago' },
];

export default function ScanPayPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{merchant: string; amount?: number} | null>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setScannedData({
        merchant: 'Tuskys Supermarket',
        amount: 1250
      });
      setAmount('1250');
      toast.success('QR Code scanned successfully!');
    }, 2000);
  };

  const handlePay = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    toast.success(`Payment of KES ${parseFloat(amount).toLocaleString()} to ${scannedData?.merchant} successful!`);
    setScannedData(null);
    setAmount('');
    setPin('');
  };

  const handleUploadQR = () => {
    // In production, this would open file picker
    toast('Opening gallery...');
    setTimeout(() => {
      setScannedData({
        merchant: 'Shell Petrol Station',
      });
      toast.success('QR Code detected from image!');
    }, 1000);
  };

  return (
    <SubscriptionGuard feature="Scan & Pay">
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-lg mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/wallet" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HiArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">Scan & Pay</h1>
          </div>

          {/* Scanner Area */}
          {!scannedData ? (
            <>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 mb-6 relative overflow-hidden">
                {/* Scanner Frame */}
                <div className="aspect-square max-w-xs mx-auto relative">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-primary-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-primary-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-primary-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-primary-500 rounded-br-lg"></div>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isScanning ? (
                      <>
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white text-lg">Scanning...</p>
                      </>
                    ) : (
                      <>
                        <HiQrcode className="w-24 h-24 text-gray-600 mb-4" />
                        <p className="text-gray-400 text-center">
                          Position QR code within the frame
                        </p>
                      </>
                    )}
                  </div>

                  {/* Scan Line Animation */}
                  {isScanning && (
                    <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-pulse"
                      style={{ top: '50%', animation: 'scanLine 2s ease-in-out infinite' }}
                    ></div>
                  )}
                </div>

                {/* Scanner Controls */}
                <div className="flex justify-center gap-6 mt-6">
                  <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <HiLightBulb className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {isScanning ? 'Scanning...' : 'Start Scan'}
                  </button>
                  <button 
                    onClick={handleUploadQR}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <HiPhotograph className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <HiCamera className="w-5 h-5 text-primary-500" />
                  How to Scan
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    Point your camera at the merchant's QR code
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    Make sure the QR code is within the frame
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    Confirm the payment details and enter PIN
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Payment Confirmation */
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-1">Payment to</h3>
                <p className="text-lg text-primary-600 font-semibold">{scannedData.merchant}</p>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-2">Amount</label>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-4">
                  <span className="text-xl font-bold text-gray-400">KES</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="text-3xl font-bold w-full outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* PIN Input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-2">Enter PIN</label>
                <div className="flex gap-3 justify-center">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold"
                    >
                      {pin[index] ? '●' : ''}
                    </div>
                  ))}
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  maxLength={4}
                  className="w-full mt-4 p-3 bg-gray-50 rounded-xl text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="● ● ● ●"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setScannedData(null);
                    setAmount('');
                    setPin('');
                  }}
                  className="flex-1 py-4 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  disabled={!amount || pin.length !== 4}
                  className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {/* Recent Scans */}
          {recentScans.length > 0 && !scannedData && (
            <div>
              <h3 className="font-semibold mb-4">Recent Payments</h3>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {recentScans.map((scan, index) => (
                  <div
                    key={scan.id}
                    className={`p-4 flex items-center justify-between ${
                      index !== recentScans.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <HiQrcode className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">{scan.merchant}</p>
                        <p className="text-sm text-gray-500">{scan.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      KES {scan.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My QR Code */}
          {!scannedData && (
            <div className="mt-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white text-center">
              <h3 className="font-semibold mb-2">Your Payment QR</h3>
              <p className="text-sm text-primary-100 mb-4">Let others scan to pay you</p>
              <Link
                href="/wallet/request"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                <HiQrcode className="w-5 h-5" />
                Show My QR Code
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; opacity: 0; }
          50% { top: 90%; opacity: 1; }
        }
      `}</style>
    </div>
    </SubscriptionGuard>
  );
}
