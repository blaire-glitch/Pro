'use client';

import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showDiscount?: boolean;
}

const sizeClasses = {
  sm: { price: 'text-sm', original: 'text-xs' },
  md: { price: 'text-base', original: 'text-sm' },
  lg: { price: 'text-lg', original: 'text-base' },
  xl: { price: 'text-2xl', original: 'text-lg' },
};

export function PriceDisplay({
  price,
  originalPrice,
  currency = 'KES',
  size = 'md',
  className,
  showDiscount = true,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-bold text-primary-600', sizeClasses[size].price)}>
        {currency} {price.toLocaleString()}
      </span>

      {hasDiscount && (
        <>
          <span className={cn('text-gray-400 line-through', sizeClasses[size].original)}>
            {currency} {originalPrice.toLocaleString()}
          </span>

          {showDiscount && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
