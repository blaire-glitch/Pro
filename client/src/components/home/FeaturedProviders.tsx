'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HiStar, HiLocationMarker, HiBadgeCheck } from 'react-icons/hi';

// Sample featured providers data - Western Kenya coverage areas
const featuredProviders = [
  {
    id: '1',
    businessName: 'Wanjiku Beauty Studio',
    category: 'Beauty',
    rating: 4.8,
    reviewCount: 127,
    location: 'Milimani, Kisumu',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Mary+Wanjiku&background=FF6B9D&color=fff',
    isVerified: true,
    services: ['Box Braids', 'Dreadlocks', 'Makeup'],
    startingPrice: 1500,
  },
  {
    id: '2',
    businessName: 'Ochieng Home Services',
    category: 'Home',
    rating: 4.6,
    reviewCount: 89,
    location: 'Lurambi, Kakamega',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    avatar: 'https://ui-avatars.com/api/?name=John+Ochieng&background=4ECDC4&color=fff',
    isVerified: true,
    services: ['Deep Cleaning', 'Plumbing', 'Repairs'],
    startingPrice: 2500,
  },
  {
    id: '3',
    businessName: 'Serenity Wellness Spa',
    category: 'Wellness',
    rating: 4.9,
    reviewCount: 203,
    location: 'Kanduyi, Bungoma',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Amina+Hassan&background=95E1D3&color=fff',
    isVerified: true,
    services: ['Swedish Massage', 'Spa Day', 'Facial'],
    startingPrice: 4000,
  },
];

export function FeaturedProviders() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading mb-2">Top-Rated Providers</h2>
            <p className="text-gray-600">Discover the best service providers near you</p>
          </div>
          <Link href="/search" className="btn-outline hidden md:flex">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <Link 
              key={provider.id}
              href={`/provider/${provider.id}`}
              className="card-hover group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={provider.image}
                  alt={provider.businessName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge bg-white/90 text-gray-800 backdrop-blur-sm">
                    {provider.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <Image
                      src={provider.avatar}
                      alt=""
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {provider.isVerified && (
                      <HiBadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-primary-500 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {provider.businessName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <HiLocationMarker className="w-4 h-4" />
                      <span className="truncate">{provider.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <HiStar className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-gray-900">{provider.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({provider.reviewCount} reviews)
                  </span>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.services.map((service) => (
                    <span key={service} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Starting from</span>
                  <span className="font-semibold text-primary-600">
                    KSh {provider.startingPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/search" className="btn-outline">
            View All Providers
          </Link>
        </div>
      </div>
    </section>
  );
}
