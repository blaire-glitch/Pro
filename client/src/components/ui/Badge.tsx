'use client';

import { cn } from '@/lib/utils';
import { HiBadgeCheck, HiClock, HiLocationMarker, HiStar } from 'react-icons/hi';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: 'verified' | 'clock' | 'location' | 'star' | React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  outline: 'bg-transparent border border-gray-300 text-gray-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconMap = {
  verified: HiBadgeCheck,
  clock: HiClock,
  location: HiLocationMarker,
  star: HiStar,
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
}: BadgeProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
      {typeof icon !== 'string' && icon}
      {children}
    </span>
  );
}

// Preset badges for common use cases
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="primary" icon="verified" className={className}>
      Verified
    </Badge>
  );
}

export function NewBadge({ className }: { className?: string }) {
  return (
    <Badge variant="success" className={className}>
      New
    </Badge>
  );
}

export function SaleBadge({ discount }: { discount: number }) {
  return (
    <Badge variant="error">
      {discount}% OFF
    </Badge>
  );
}

export function FeaturedBadge() {
  return (
    <Badge variant="warning" icon="star">
      Featured
    </Badge>
  );
}
