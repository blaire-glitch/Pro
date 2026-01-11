'use client';

import { useEffect, useState } from 'react';
import { HiDownload, HiX, HiDeviceMobile } from 'react-icons/hi';
import { registerServiceWorker } from '@/lib/pushNotifications';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

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

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 30 seconds on the site
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <HiDeviceMobile className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Install Afrionex</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add to your home screen for a faster, app-like experience
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
              className="flex-1 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <HiDownload className="w-4 h-4" />
              Install
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
          <span>✓ Works offline</span>
          <span>•</span>
          <span>✓ Push notifications</span>
          <span>•</span>
          <span>✓ Fast loading</span>
        </div>
      </div>
    </div>
  );
}
