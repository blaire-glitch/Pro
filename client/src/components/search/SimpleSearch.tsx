'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HiSearch, HiArrowLeft, HiStar, HiLocationMarker, 
  HiBadgeCheck, HiClock, HiArrowRight
} from 'react-icons/hi';

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  services: string[];
}

const categories: ServiceCategory[] = [
  { 
    id: 'beauty', 
    name: 'Beauty', 
    icon: '💅', 
    color: 'bg-pink-100 text-pink-600',
    services: ['Hair Styling', 'Braids', 'Makeup', 'Nails', 'Barbering']
  },
  { 
    id: 'home', 
    name: 'Home', 
    icon: '🏠', 
    color: 'bg-teal-100 text-teal-600',
    services: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry']
  },
  { 
    id: 'wellness', 
    name: 'Wellness', 
    icon: '💆', 
    color: 'bg-green-100 text-green-600',
    services: ['Massage', 'Spa', 'Yoga', 'Fitness']
  },
  { 
    id: 'delivery', 
    name: 'Delivery', 
    icon: '📦', 
    color: 'bg-blue-100 text-blue-600',
    services: ['Food', 'Groceries', 'Packages', 'Documents']
  },
  { 
    id: 'transport', 
    name: 'Transport', 
    icon: '🚗', 
    color: 'bg-purple-100 text-purple-600',
    services: ['Boda Boda', 'Taxi', 'Tuk-Tuk', 'Shuttle']
  },
  { 
    id: 'lifestyle', 
    name: 'More', 
    icon: '✨', 
    color: 'bg-orange-100 text-orange-600',
    services: ['Photography', 'Events', 'Tutoring', 'DJ']
  },
];

const recentSearches = [
  'Hair braiding near me',
  'House cleaning',
  'Massage therapist',
];

export function SimpleSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/search?category=${categoryId}`);
  };

  const handleServiceClick = (service: string) => {
    router.push(`/search?q=${encodeURIComponent(service)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service do you need?"
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              autoFocus
            />
          </form>
        </div>
      </header>

      <main className="p-4">
        {/* Categories */}
        <section className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Browse Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl mb-2 block">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <section className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl text-left hover:bg-gray-50 transition-colors"
                >
                  <HiClock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Popular Services */}
        <section>
          <h2 className="font-semibold text-gray-900 mb-3">Popular Services</h2>
          <div className="flex flex-wrap gap-2">
            {['Hair Braiding', 'House Cleaning', 'Massage', 'Food Delivery', 'Boda Boda', 'Makeup'].map((service) => (
              <button
                key={service}
                onClick={() => handleServiceClick(service)}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-200 hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                {service}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Simple Provider Card for search results
export function SimpleProviderCard({ 
  provider 
}: { 
  provider: {
    id: string;
    name: string;
    service: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    location: string;
    isVerified?: boolean;
    availableToday?: boolean;
  }
}) {
  return (
    <Link 
      href={`/provider/${provider.id}`}
      className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <img
          src={provider.image}
          alt={provider.name}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                {provider.name}
                {provider.isVerified && (
                  <HiBadgeCheck className="w-4 h-4 text-primary-500" />
                )}
              </h3>
              <p className="text-sm text-gray-500">{provider.service}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{provider.rating}</span>
              <span className="text-sm text-gray-400">({provider.reviews})</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <HiLocationMarker className="w-3 h-3" />
              {provider.location}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-primary-600">
              From KSh {provider.price.toLocaleString()}
            </span>
            {provider.availableToday && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Available today
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
