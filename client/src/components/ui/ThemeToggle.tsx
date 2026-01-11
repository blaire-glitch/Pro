'use client';

import { HiMoon, HiSun } from 'react-icons/hi';
import { useThemeStore } from '@/store/themeStore';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all duration-300
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <HiSun className={`${iconSizes[size]} text-yellow-500`} />
      ) : (
        <HiMoon className={`${iconSizes[size]} text-gray-600`} />
      )}
    </button>
  );
}

// Animated toggle switch version
export function ThemeToggleSwitch({ className = '' }: { className?: string }) {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative w-14 h-7 rounded-full
        bg-gray-200 dark:bg-gray-700
        transition-colors duration-300
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`
          absolute top-0.5 left-0.5
          w-6 h-6 rounded-full
          bg-white shadow-md
          flex items-center justify-center
          transition-transform duration-300
          ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}
        `}
      >
        {isDarkMode ? (
          <HiMoon className="w-3.5 h-3.5 text-indigo-600" />
        ) : (
          <HiSun className="w-3.5 h-3.5 text-yellow-500" />
        )}
      </span>
    </button>
  );
}
