'use client';

import { useState, useEffect } from 'react';
import { HiArrowUp } from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
}

export function BackToTop({ 
  threshold = 400, 
  smooth = true,
  className 
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary-500 text-white shadow-lg',
        'hover:bg-primary-600 hover:shadow-xl transform hover:-translate-y-1',
        'transition-all duration-300 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none',
        className
      )}
    >
      <HiArrowUp className="w-5 h-5" />
    </button>
  );
}
