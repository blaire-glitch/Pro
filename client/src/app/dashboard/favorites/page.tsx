'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiHeart, HiStar, HiLocationMarker, HiBadgeCheck, 
  HiTrash, HiArrowLeft 
} from 'react-icons/hi';

const mockFavorites = [
  {
    id: '1',
    businessName: 'Wanjiku Beauty Studio',
    category: 'Beauty',
    rating: 4.8,
    reviewCount: 127,
    location: 'Westlands, Nairobi',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Mary+Wanjiku&background=FF6B9D&color=fff',
    isVerified: true,
    startingPrice: 1500,
  },
  {
    id: '2',
    businessName: 'Serenity Wellness Spa',
    category: 'Wellness',
    rating: 4.9,
    reviewCount: 203,
    location: 'Karen, Nairobi',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Amina+Hassan&background=95E1D3&color=fff',
    isVerified: true,
    startingPrice: 4000,
  },
  {
    id: '3',
    businessName: 'Kimani Photography',
    category: 'Lifestyle',
    rating: 4.9,
    reviewCount: 78,
    location: 'CBD, Nairobi',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Peter+Kimani&background=F7B32B&color=fff',
    isVerified: true,
    startingPrice: 15000,
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <HiArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600">{favorites.length} saved providers</p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiHeart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">Start exploring and save providers you like!</p>
              <Link href="/search" className="btn-primary">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((provider) => (
                <div key={provider.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                  <div className="relative h-48">
                    <Image
                      src={provider.image}
                      alt={provider.businessName}
                      fill
                      className="object-cover"
                    />
                    <button 
                      onClick={() => removeFavorite(provider.id)}
                      aria-label={`Remove ${provider.businessName} from favorites`}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <HiHeart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Image
                        src={provider.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-gray-900">{provider.businessName}</h3>
                          {provider.isVerified && (
                            <HiBadgeCheck className="w-4 h-4 text-primary-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{provider.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <HiStar className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{provider.rating}</span>
                        <span>({provider.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiLocationMarker className="w-4 h-4 text-gray-400" />
                        <span>{provider.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="font-semibold text-primary-600">KES {provider.startingPrice.toLocaleString()}</p>
                      </div>
                      <Link 
                        href={`/provider/${provider.id}`}
                        className="btn-primary btn-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
