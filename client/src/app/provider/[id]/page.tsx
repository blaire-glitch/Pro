'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { providersApi } from '@/lib/api';
import {
  HiStar, HiLocationMarker, HiBadgeCheck, HiShare,
  HiHeart, HiPhone, HiChat, HiClock, HiCalendar,
  HiShieldCheck, HiThumbUp, HiPhotograph
} from 'react-icons/hi';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

interface Provider {
  id: string;
  businessName: string;
  category: string;
  bio: string;
  rating: number;
  reviewCount: number;
  completedBookings: number;
  location: string;
  latitude: number;
  longitude: number;
  avatar: string;
  coverImage: string;
  isVerified: boolean;
  instantBooking: boolean;
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  services: Service[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  service: {
    name: string;
  };
}

// Fallback mock data for when API fails or for demo purposes
const mockProvider = {
  id: '1',
  businessName: 'Wanjiku Beauty Studio',
  tagline: 'Transform your look, elevate your confidence',
  category: 'Beauty',
  rating: 4.8,
  reviewCount: 127,
  completedBookings: 450,
  location: 'Westlands, Nairobi',
  fullAddress: 'Westgate Mall, 2nd Floor, Westlands, Nairobi',
  coordinates: { lat: -1.2635, lng: 36.8058 },
  image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  avatar: 'https://ui-avatars.com/api/?name=Mary+Wanjiku&background=FF6B9D&color=fff&size=200',
  coverImages: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
  ],
  isVerified: true,
  instantBooking: true,
  yearsExperience: 8,
  responseTime: '< 1 hour',
  bio: 'Professional hairstylist with 8+ years of experience. Specializing in African hair braiding, dreadlocks, and natural hair care. I bring the salon experience to your doorstep!',
  services: [
    { id: 's1', name: 'Box Braids', duration: 180, price: 3500, description: 'Classic box braids, small to medium size' },
    { id: 's2', name: 'Knotless Braids', duration: 240, price: 5000, description: 'Painless knotless braids for a natural look' },
    { id: 's3', name: 'Dreadlock Installation', duration: 300, price: 6000, description: 'New dreadlock installation and styling' },
    { id: 's4', name: 'Dreadlock Retwist', duration: 120, price: 2500, description: 'Maintenance retwist for existing dreadlocks' },
    { id: 's5', name: 'Cornrows', duration: 90, price: 1500, description: 'Traditional cornrow styling' },
    { id: 's6', name: 'Bridal Makeup', duration: 120, price: 8000, description: 'Complete bridal makeup with trials' },
  ],
  workingHours: {
    monday: { open: '08:00', close: '18:00' },
    tuesday: { open: '08:00', close: '18:00' },
    wednesday: { open: '08:00', close: '18:00' },
    thursday: { open: '08:00', close: '18:00' },
    friday: { open: '08:00', close: '18:00' },
    saturday: { open: '09:00', close: '16:00' },
    sunday: null,
  },
  badges: ['Top Rated', 'Quick Responder', 'Repeat Customers'],
  languages: ['English', 'Swahili'],
  paymentMethods: ['M-Pesa', 'Cash', 'Card'],
};

const mockReviews = [
  {
    id: 'r1',
    user: { name: 'Sarah M.', avatar: 'https://ui-avatars.com/api/?name=Sarah+M&background=random' },
    rating: 5,
    comment: 'Amazing work! Mary did my knotless braids perfectly. Very gentle and patient. Will definitely book again!',
    date: '2024-01-15',
    service: 'Knotless Braids',
    photos: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200'],
  },
  {
    id: 'r2',
    user: { name: 'Jane K.', avatar: 'https://ui-avatars.com/api/?name=Jane+K&background=random' },
    rating: 5,
    comment: 'Best hairstylist in Nairobi! Very professional and the results are always stunning.',
    date: '2024-01-10',
    service: 'Box Braids',
    photos: [],
  },
  {
    id: 'r3',
    user: { name: 'Amina H.', avatar: 'https://ui-avatars.com/api/?name=Amina+H&background=random' },
    rating: 4,
    comment: 'Great service, came to my home on time. My dreadlocks look fantastic.',
    date: '2024-01-05',
    service: 'Dreadlock Retwist',
    photos: [],
  },
];

export default function ProviderPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'gallery'>('services');
  const [selectedService, setSelectedService] = useState<typeof mockProvider.services[0] | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookService = (service: typeof mockProvider.services[0]) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 bg-gray-200">
          <Image
            src={mockProvider.image}
            alt={mockProvider.businessName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Provider Info Card */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative mx-auto md:mx-0 w-32 h-32 md:w-40 md:h-40">
                  <Image
                    src={mockProvider.avatar}
                    alt=""
                    fill
                    className="rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                  {mockProvider.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full">
                      <HiBadgeCheck className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                    {mockProvider.businessName}
                  </h1>
                  {mockProvider.badges.map((badge) => (
                    <span key={badge} className="badge badge-primary text-xs">{badge}</span>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4">{mockProvider.tagline}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <HiStar className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{mockProvider.rating}</span>
                    <span>({mockProvider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiLocationMarker className="w-5 h-5 text-gray-400" />
                    <span>{mockProvider.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiThumbUp className="w-5 h-5 text-gray-400" />
                    <span>{mockProvider.completedJobs}+ jobs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiClock className="w-5 h-5 text-gray-400" />
                    <span>Responds {mockProvider.responseTime}</span>
                  </div>
                </div>

                <p className="text-gray-600 max-w-2xl">{mockProvider.bio}</p>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-3 justify-center">
                <button className="btn-outline flex items-center gap-2">
                  <HiHeart className="w-5 h-5" />
                  <span className="hidden md:inline">Save</span>
                </button>
                <button className="btn-outline flex items-center gap-2">
                  <HiShare className="w-5 h-5" />
                  <span className="hidden md:inline">Share</span>
                </button>
                <button className="btn-outline flex items-center gap-2">
                  <HiChat className="w-5 h-5" />
                  <span className="hidden md:inline">Message</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex border-b">
              {(['services', 'reviews', 'gallery'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && (
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {mockProvider.reviewCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="grid gap-4">
                  {mockProvider.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <HiClock className="w-4 h-4" />
                            {Math.floor(service.duration / 60)}h {service.duration % 60}m
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-lg text-gray-900">
                            KSh {service.price.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookService(service)}
                          className="btn-primary whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-1">{mockProvider.rating}</div>
                        <div className="flex justify-center text-yellow-500 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={`w-5 h-5 ${i < Math.floor(mockProvider.rating) ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">{mockProvider.reviewCount} reviews</div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.user.avatar}
                          alt=""
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{review.user.name}</span>
                            <span className="text-sm text-gray-500">• {review.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <HiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">for {review.service}</span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          {review.photos.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.photos.map((photo, i) => (
                                <Image
                                  key={i}
                                  src={photo}
                                  alt=""
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mockProvider.coverImages.map((image, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          provider={mockProvider}
          service={selectedService}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}
