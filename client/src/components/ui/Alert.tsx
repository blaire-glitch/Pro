'use client';

import { useEffect, useState } from 'react';
import { HiInformationCircle, HiExclamation, HiCheckCircle, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoClose?: number;
  className?: string;
}

const alertConfig = {
  info: {
    icon: HiInformationCircle,
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    iconClass: 'text-blue-500',
  },
  success: {
    icon: HiCheckCircle,
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    iconClass: 'text-green-500',
  },
  warning: {
    icon: HiExclamation,
    bgClass: 'bg-yellow-50 border-yellow-200',
    textClass: 'text-yellow-800',
    iconClass: 'text-yellow-500',
  },
  error: {
    icon: HiExclamation,
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-800',
    iconClass: 'text-red-500',
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  autoClose,
  className,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        config.bgClass,
        className
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('font-semibold mb-1', config.textClass)}>{title}</h4>
        )}
        <p className={cn('text-sm', config.textClass)}>{message}</p>
      </div>

      {dismissible && (
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className={cn('flex-shrink-0 hover:opacity-70', config.textClass)}
          aria-label="Dismiss alert"
        >
          <HiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
