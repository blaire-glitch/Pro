'use client';

import { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if we've shown splash this session
    const hasShown = sessionStorage.getItem('splash-shown');
    if (hasShown) {
      setShow(false);
      return;
    }

    // Show splash for 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('splash-shown', 'true');
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse delay-300" />
      </div>

      {/* Logo */}
      <div className="relative z-10 animate-bounce-slow">
        <Logo size="xl" />
      </div>

      {/* Tagline */}
      <p className="relative z-10 text-white/80 text-lg mt-4 animate-fade-in">
        Africa's Super App
      </p>

      {/* Loading indicator */}
      <div className="relative z-10 mt-8 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Swahili greeting */}
      <p className="absolute bottom-8 text-white/60 text-sm">
        Karibu • Welcome • Bienvenue
      </p>
    </div>
  );
}
