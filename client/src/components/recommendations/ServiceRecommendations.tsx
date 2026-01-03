'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePreferencesStore } from '@/store/preferencesStore';
import { AIRecommendationEngine, servicesDatabase } from '@/lib/aiRecommendation';
import { HiStar, HiLocationMarker, HiSparkles, HiArrowRight, HiRefresh } from 'react-icons/hi';
import { FaCut, FaHome, FaSpa, FaCamera, FaUtensils, FaCar } from 'react-icons/fa';

interface ServiceData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  rating: number;
  location: string;
  tags: string[];
}

const categoryIcons: Record<string, React.ElementType> = {
  beauty: FaCut,
  home: FaHome,
  wellness: FaSpa,
  lifestyle: FaCamera,
  food: FaUtensils,
  transport: FaCar,
};

const categoryColors: Record<string, string> = {
  beauty: 'from-pink-500 to-rose-500',
  home: 'from-blue-500 to-indigo-500',
  wellness: 'from-green-500 to-emerald-500',
  lifestyle: 'from-purple-500 to-violet-500',
  food: 'from-orange-500 to-amber-500',
  transport: 'from-cyan-500 to-teal-500',
};

interface ServiceRecommendationsProps {
  title?: string;
  showPersonalizedMessage?: boolean;
  maxItems?: number;
  variant?: 'grid' | 'horizontal' | 'compact';
  relatedToServiceId?: string;
  className?: string;
}

export function ServiceRecommendations({
  title = 'Recommended for You',
  showPersonalizedMessage = true,
  maxItems = 6,
  variant = 'grid',
  relatedToServiceId,
  className = '',
}: ServiceRecommendationsProps) {
  const { behavior, preferences, trackServiceView, trackCategoryView } = usePreferencesStore();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
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

      let recommendedServices: ServiceData[];
      
      if (relatedToServiceId) {
        recommendedServices = engine.getRelatedServices(relatedToServiceId, maxItems);
      } else {
        recommendedServices = engine.getRecommendedServices(maxItems);
      }

      setServices(recommendedServices);
      setMessage(engine.getPersonalizedMessage());
      setIsLoading(false);
    }, 300);
  }, [behavior, preferences, maxItems, relatedToServiceId]);

  const handleServiceClick = (service: ServiceData) => {
    trackServiceView(service.id);
    trackCategoryView(service.category);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(maxItems)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  // Compact variant - horizontal scroll
  if (variant === 'compact') {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HiSparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <Link href="/search" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            See All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {services.map((service) => {
            const Icon = categoryIcons[service.category] || FaCut;
            const colorClass = categoryColors[service.category] || 'from-gray-500 to-gray-600';
            
            return (
              <Link
                key={service.id}
                href={`/search?service=${service.id}`}
                onClick={() => handleServiceClick(service)}
                className="flex-shrink-0 w-36 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`h-16 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-gray-900 text-xs line-clamp-2 mb-1">{service.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-600">{formatPrice(service.price)}</span>
                    <div className="flex items-center gap-0.5">
                      <HiStar className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-500">{service.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal variant - scrollable row
  if (variant === 'horizontal') {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HiSparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            </div>
            {showPersonalizedMessage && message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
          </div>
          <Link href="/search" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {services.map((service) => {
            const Icon = categoryIcons[service.category] || FaCut;
            const colorClass = categoryColors[service.category] || 'from-gray-500 to-gray-600';
            
            return (
              <Link
                key={service.id}
                href={`/search?service=${service.id}`}
                onClick={() => handleServiceClick(service)}
                className="flex-shrink-0 w-56 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className={`h-24 bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
                  <Icon className="w-10 h-10 text-white/90" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                    {service.subcategory}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{service.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <HiLocationMarker className="w-4 h-4" />
                    <span>{service.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">{formatPrice(service.price)}</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                      <HiStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">{service.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Grid variant - default
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          {showPersonalizedMessage && message && (
            <p className="text-sm text-gray-600 ml-10">{message}</p>
          )}
        </div>
        <Link href="/search" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
          View All <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = categoryIcons[service.category] || FaCut;
          const colorClass = categoryColors[service.category] || 'from-gray-500 to-gray-600';
          
          return (
            <Link
              key={service.id}
              href={`/search?service=${service.id}`}
              onClick={() => handleServiceClick(service)}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all"
            >
              <div className={`h-28 bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
                <Icon className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform" />
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                  <HiSparkles className="w-3 h-3" />
                  AI Pick
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                  {service.subcategory}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <HiLocationMarker className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">{formatPrice(service.price)}</span>
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-full">
                    <HiStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-700">{service.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Trending Services Component
export function TrendingServices({ className = '' }: { className?: string }) {
  const { trackServiceView, trackCategoryView } = usePreferencesStore();
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    // Get top-rated services as "trending"
    const trending = [...servicesDatabase]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    setServices(trending);
  }, []);

  const handleServiceClick = (service: ServiceData) => {
    trackServiceView(service.id);
    trackCategoryView(service.category);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
          <HiRefresh className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const Icon = categoryIcons[service.category] || FaCut;
          
          return (
            <Link
              key={service.id}
              href={`/search?service=${service.id}`}
              onClick={() => handleServiceClick(service)}
              className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-lg font-bold text-gray-400">
                {index + 1}
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[service.category]} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{service.name}</h4>
                <p className="text-sm text-gray-500">{service.location}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">{formatPrice(service.price)}</p>
                <div className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{service.rating}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
