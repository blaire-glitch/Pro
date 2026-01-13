'use client';

import { useEffect, useState } from 'react';
import { HiDownload, HiX, HiDeviceMobile, HiShare } from 'react-icons/hi';
import { registerServiceWorker } from '@/lib/pushNotifications';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Export hook for use in other components
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      return true;
    }
    
    setDeferredPrompt(null);
    return false;
  };

  return {
    canInstall: !!deferredPrompt || isIOS,
    isInstalled,
    isIOS,
    installApp,
  };
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Check if dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      // Show again after 7 days
      if (now.getTime() - dismissedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Show prompt after 15 seconds on the site
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    
    await installApp();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (isInstalled || (!showPrompt && !showIOSInstructions)) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-slide-up">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Install on iPhone/iPad</h3>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-400" />
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
                    Look for <HiShare className="w-5 h-5" /> at the bottom of your browser
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Scroll down and tap</p>
                  <p className="text-sm text-gray-600">"Add to Home Screen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tap "Add"</p>
                  <p className="text-sm text-gray-600">The app will appear on your home screen</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="w-full mt-6 py-3 px-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <HiDeviceMobile className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Install Afrionex App</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get the full app experience on your phone - it's free!
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiX className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2.5 px-4 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
            >
              <HiDownload className="w-4 h-4" />
              Install Free
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary-50 to-emerald-50 px-4 py-2.5 text-xs text-gray-600 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">✓ Works offline</span>
          <span className="flex items-center gap-1">✓ Fast & secure</span>
          <span className="flex items-center gap-1">✓ No app store</span>
        </div>
      </div>
    </div>
  );
}

// Standalone Install Button Component for use in menus/settings
export function InstallAppButton({ className = '' }: { className?: string }) {
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <HiDeviceMobile className="w-5 h-5" />
        <span className="text-sm font-medium">App Installed ✓</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    await installApp();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-lg shadow-primary-500/25 ${className}`}
      >
        <HiDownload className="w-5 h-5" />
        <span>Install App</span>
      </button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">Install on iPhone/iPad</h3>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiX className="w-5 h-5 text-gray-400" />
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
                onClick={() => setShowIOSModal(false)}
                className="w-full mt-6 py-3 px-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
