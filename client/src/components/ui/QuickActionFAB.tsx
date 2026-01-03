'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HiPlus, HiX, HiPhone, HiChat, HiCalendar, 
  HiShoppingCart, HiQuestionMarkCircle 
} from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Book a Service',
    icon: HiCalendar,
    href: '/search',
    color: 'bg-primary-500 hover:bg-primary-600',
  },
  {
    label: 'Shop Now',
    icon: HiShoppingCart,
    href: '/marketplace',
    color: 'bg-secondary-500 hover:bg-secondary-600',
  },
  {
    label: 'Get Help',
    icon: HiQuestionMarkCircle,
    href: '/help',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Contact Support',
    icon: HiPhone,
    onClick: () => window.open('tel:+254700000000'),
    color: 'bg-green-500 hover:bg-green-600',
  },
];

export function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Action Items */}
      <div className={cn(
        'flex flex-col-reverse gap-3 mb-3 transition-all duration-300',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const Component = action.href ? Link : 'button';
          
          return (
            <div 
              key={action.label}
              className="flex items-center gap-3 justify-end"
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              <span className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap">
                {action.label}
              </span>
              <Component
                href={action.href || '#'}
                onClick={(e) => {
                  if (action.onClick) {
                    e.preventDefault();
                    action.onClick();
                  }
                  setIsOpen(false);
                }}
                className={cn(
                  'p-3 rounded-full text-white shadow-lg transition-all duration-200 transform hover:scale-110',
                  action.color
                )}
              >
                <Icon className="w-5 h-5" />
              </Component>
            </div>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-4 rounded-full shadow-lg transition-all duration-300 transform',
          isOpen 
            ? 'bg-gray-800 hover:bg-gray-900 rotate-45' 
            : 'bg-accent-500 hover:bg-accent-600 rotate-0'
        )}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
      >
        {isOpen ? (
          <HiX className="w-6 h-6 text-white" />
        ) : (
          <HiPlus className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
