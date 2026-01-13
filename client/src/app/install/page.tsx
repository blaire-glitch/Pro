'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  HiDownload, 
  HiDeviceMobile, 
  HiLightningBolt, 
  HiShieldCheck,
  HiWifi,
  HiBell,
  HiArrowLeft,
  HiShare,
  HiCheckCircle
} from 'react-icons/hi';
import { usePWAInstall } from '@/components/ui/PWAInstallPrompt';

export default function InstallPage() {
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    
    setInstalling(true);
    await installApp();
    setInstalling(false);
  };

  const features = [
    {
      icon: HiLightningBolt,
      title: 'Lightning Fast',
      description: 'Instant loading, no app store delays'
    },
    {
      icon: HiWifi,
      title: 'Works Offline',
      description: 'Access key features without internet'
    },
    {
      icon: HiBell,
      title: 'Push Notifications',
      description: 'Get updates on bookings and messages'
    },
    {
      icon: HiShieldCheck,
      title: 'Safe & Secure',
      description: 'No extra permissions required'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <HiArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-semibold text-gray-900">Install Afrionex</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/30">
            <HiDeviceMobile className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Get the Afrionex App
          </h2>
          <p className="text-gray-600">
            Install directly from your browser - no app store needed!
          </p>
        </div>

        {/* Install Status */}
        {isInstalled ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
            <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 text-lg mb-2">
              App Already Installed!
            </h3>
            <p className="text-green-700 text-sm">
              Afrionex is installed on your device. Look for it on your home screen.
            </p>
            <Link 
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
            >
              Open App
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {/* Main Install Button */}
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 disabled:opacity-50"
            >
              {installing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <HiDownload className="w-6 h-6" />
                  Install Free App
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Free • No signup required • 2MB
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Why Install?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* iOS Instructions */}
        {isIOS && !isInstalled && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <HiShare className="w-5 h-5" />
              iPhone/iPad Instructions
            </h3>
            <ol className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  1
                </span>
                <span>Tap the <strong>Share</strong> button at the bottom of Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  2
                </span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  3
                </span>
                <span>Tap <strong>"Add"</strong> in the top right corner</span>
              </li>
            </ol>
          </div>
        )}

        {/* Comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-center">
              Web App vs Native App
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">App Store Download</span>
                <span className="text-green-600 font-medium">Not Required ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage Space</span>
                <span className="text-green-600 font-medium">~2MB ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Auto Updates</span>
                <span className="text-green-600 font-medium">Yes ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Home Screen Icon</span>
                <span className="text-green-600 font-medium">Yes ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Push Notifications</span>
                <span className="text-green-600 font-medium">Yes ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Works Offline</span>
                <span className="text-green-600 font-medium">Yes ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skip Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue in browser instead →
          </Link>
        </div>
      </main>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">Install on iPhone/iPad</h3>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap the Share button</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      Look for <HiShare className="w-5 h-5" /> at the bottom of Safari
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Scroll and tap</p>
                    <p className="text-sm text-gray-600">"Add to Home Screen"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap "Add"</p>
                    <p className="text-sm text-gray-600">Afrionex will appear on your home screen</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6 py-3 px-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
