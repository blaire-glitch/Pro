'use client';

import { HiStar } from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  className,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Full Stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <button
          key={`full-${i}`}
          type="button"
          onClick={() => handleStarClick(i)}
          className={cn(
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          )}
          disabled={!interactive}
        >
          <HiStar className={cn(sizeClasses[size], 'text-yellow-400 fill-current')} />
        </button>
      ))}

      {/* Half Star */}
      {hasHalfStar && (
        <button
          type="button"
          onClick={() => handleStarClick(fullStars)}
          className={cn(
            'relative',
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          )}
          disabled={!interactive}
        >
          <HiStar className={cn(sizeClasses[size], 'text-gray-300')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <HiStar className={cn(sizeClasses[size], 'text-yellow-400 fill-current')} />
          </div>
        </button>
      )}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <button
          key={`empty-${i}`}
          type="button"
          onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
          className={cn(
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          )}
          disabled={!interactive}
        >
          <HiStar className={cn(sizeClasses[size], 'text-gray-300')} />
        </button>
      ))}

      {/* Rating Value */}
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
      )}

      {/* Review Count */}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
