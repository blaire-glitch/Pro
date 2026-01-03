'use client';

import Link from 'next/link';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center gap-1 flex-wrap">
        {showHome && (
          <>
            <li>
              <Link 
                href="/" 
                className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
              >
                <HiHome className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {items.length > 0 && (
              <li className="flex items-center">
                <HiChevronRight className="w-4 h-4 text-gray-400" />
              </li>
            )}
          </>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <HiChevronRight className="w-4 h-4 text-gray-400 ml-1" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
