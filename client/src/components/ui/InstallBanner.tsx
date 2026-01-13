'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiDownload, HiX, HiDeviceMobile } from 'react-icons/hi';
import { usePWAInstall } from './PWAInstallPrompt';

export function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { isInstalled, isIOS, installApp } = usePWAInstall();

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled) return;

    // Check if dismissed
    const dismissed = localStorage.getItem('install-banner-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      // Show again after 3 days
      if (now.getTime() - dismissedDate.getTime() < 3 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Show banner after 5 seconds
    const timer = setTimeout(() => setShowBanner(true), 5000);
    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('install-banner-dismissed', new Date().toISOString());
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <HiDeviceMobile className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm truncate">
            <span className="hidden sm:inline">Install Afrionex app for a better experience!</span>
            <span className="sm:hidden">Get the app!</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/install"
            className="px-3 py-1 bg-white text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors flex items-center gap-1"
          >
            <HiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Install</span>
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-primary-400 rounded transition-colors"
            aria-label="Dismiss"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
