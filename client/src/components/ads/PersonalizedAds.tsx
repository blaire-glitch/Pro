'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePreferencesStore } from '@/store/preferencesStore';
import { AIRecommendationEngine, adsDatabase, type AdData } from '@/lib/aiRecommendation';
import { HiSparkles, HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PersonalizedAdsProps {
  variant?: 'banner' | 'card' | 'carousel';
  maxAds?: number;
  className?: string;
}

export function PersonalizedAds({ variant = 'carousel', maxAds = 3, className = '' }: PersonalizedAdsProps) {
  const { behavior, preferences, trackAdClick } = usePreferencesStore();
  const [ads, setAds] = useState<AdData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // Create AI engine and get personalized ads
    const engine = new AIRecommendationEngine({
      viewedCategories: behavior.viewedCategories,
      searchHistory: behavior.searchHistory,
      bookingHistory: behavior.bookingHistory,
      location: behavior.location,
      priceRange: behavior.priceRange,
      topCategories: preferences.topCategories,
      interestScore: preferences.interestScore,
      pricePreference: preferences.pricePreference,
    });

    const personalizedAds = engine.getPersonalizedAds(maxAds + 2);
    setAds(personalizedAds.filter((ad) => !dismissed.includes(ad.id)));
  }, [behavior, preferences, maxAds, dismissed]);

  // Auto-rotate carousel
  useEffect(() => {
    if (variant === 'carousel' && ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [variant, ads.length]);

  const handleAdClick = (adId: string) => {
    trackAdClick(adId);
  };

  const handleDismiss = (adId: string) => {
    setDismissed((prev) => [...prev, adId]);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  if (ads.length === 0) return null;

  // Banner variant - single full-width ad
  if (variant === 'banner') {
    const ad = ads[0];
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        <div className="relative h-32 md:h-40 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <HiSparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-medium text-white/80">Recommended for you</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1">{ad.title}</h3>
              <p className="text-sm text-white/90 mb-2 line-clamp-1">{ad.description}</p>
              <Link
                href={ad.link}
                onClick={() => handleAdClick(ad.id)}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary-600 text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                {ad.cta}
              </Link>
            </div>
            <div className="hidden md:block w-32 h-32 relative">
              <Image
                src={ad.image}
                alt={ad.title}
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
          <button
            onClick={() => handleDismiss(ad.id)}
            className="absolute top-2 right-2 p-1 text-white/60 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-2 left-4 text-xs text-white/60">
          Sponsored by {ad.sponsor}
        </div>
      </div>
    );
  }

  // Card variant - single card ad
  if (variant === 'card') {
    const ad = ads[0];
    return (
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <div className="relative h-36">
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-medium rounded-full">
            <HiSparkles className="w-3 h-3" />
            For You
          </div>
          <button
            onClick={() => handleDismiss(ad.id)}
            className="absolute top-2 right-2 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
          >
            <HiX className="w-3 h-3" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1">{ad.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Sponsored</span>
            <Link
              href={ad.link}
              onClick={() => handleAdClick(ad.id)}
              className="px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-colors"
            >
              {ad.cta}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Carousel variant - sliding ads
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <HiSparkles className="w-5 h-5 text-yellow-500" />
        <span className="text-sm font-medium text-gray-600">Recommended for you</span>
      </div>
      
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {ads.slice(0, maxAds).map((ad) => (
            <div key={ad.id} className="w-full flex-shrink-0">
              <div className="relative h-44 md:h-52 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center p-6">
                  <div className="flex-1 text-white">
                    <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full mb-2">
                      SPONSORED
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{ad.title}</h3>
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">{ad.description}</p>
                    <Link
                      href={ad.link}
                      onClick={() => handleAdClick(ad.id)}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {ad.cta}
                    </Link>
                  </div>
                </div>
                <div className="absolute bottom-3 left-6 text-xs text-white/50">
                  {ad.sponsor}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <HiChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <HiChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Dots */}
        {ads.length > 1 && (
          <div className="absolute bottom-3 right-6 flex gap-1.5">
            {ads.slice(0, maxAds).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
