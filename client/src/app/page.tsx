'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { CategoryCard } from '@/components/home/CategoryCard';
import { FeaturedProviders } from '@/components/home/FeaturedProviders';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Footer } from '@/components/layout/Footer';
import { Testimonials } from '@/components/home/Testimonials';
import { SmartSuggestions } from '@/components/home/SmartSuggestions';
import { QuickActions } from '@/components/home/QuickActions';
import { DailyRewards } from '@/components/home/DailyRewards';
import { PersonalizedAds } from '@/components/ads/PersonalizedAds';
import { ServiceRecommendations } from '@/components/recommendations/ServiceRecommendations';
import { HiSearch, HiLocationMarker, HiStar, HiShieldCheck, HiClock, HiArrowRight, HiCreditCard } from 'react-icons/hi';

// Coverage cities in Western Kenya
const coverageCities = ['Kisumu', 'Kakamega', 'Bungoma', 'Busia'];

const categories = [
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Hair, makeup, nails & more',
    color: 'from-pink-500 to-rose-500',
    services: ['Hair Styling', 'Braids & Dreadlocks', 'Makeup', 'Nails', 'Barbering'],
  },
  {
    id: 'home',
    name: 'Home Services',
    description: 'Cleaning, repairs & maintenance',
    color: 'from-teal-500 to-cyan-500',
    services: ['Deep Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'],
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Massage, spa & fitness',
    color: 'from-green-500 to-emerald-500',
    services: ['Massage', 'Spa Treatments', 'Yoga', 'Personal Training', 'Meditation'],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Tutoring, events & photography',
    color: 'from-orange-500 to-amber-500',
    services: ['Tutoring', 'Event Planning', 'Photography', 'DJ Services', 'Catering'],
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'Fast & reliable delivery services',
    color: 'from-blue-500 to-indigo-500',
    services: ['Package Delivery', 'Food Delivery', 'Grocery Delivery', 'Document Courier', 'Moving & Logistics'],
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Ride & get around the city',
    color: 'from-purple-500 to-violet-500',
    services: ['Boda Boda', 'Taxi & Car Hire', 'Tuk-Tuk', 'Shuttle Services', 'Airport Transfer'],
  },
];

const features = [
  {
    icon: HiShieldCheck,
    title: 'Verified Providers',
    description: 'All service providers are verified with background checks',
  },
  {
    icon: HiStar,
    title: 'Trusted Reviews',
    description: 'Real reviews from verified customers',
  },
  {
    icon: HiClock,
    title: 'Instant Booking',
    description: 'Book services instantly, get confirmed in minutes',
  },
  {
    icon: HiLocationMarker,
    title: 'Local Providers',
    description: 'Find skilled professionals near you',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity) params.set('city', selectedCity);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-500 via-secondary-400 to-primary-500 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              The Next-Generation
              <span className="block text-accent-500">Super App for Africa</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              One platform. One wallet. One seamless experience. Welcome to Afrionex — your world, connected.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What service do you need?"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-gray-800"
                  />
                </div>
                <div className="flex-1 relative">
                  <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-gray-800 appearance-none bg-white cursor-pointer"
                    aria-label="Select city"
                  >
                    <option value="">All Cities</option>
                    {coverageCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary btn-lg whitespace-nowrap flex items-center gap-2">
                  Search
                  <HiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-white/80">Cities & Growing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Western Kenya</div>
                <div className="text-sm text-white/80">Kisumu • Kakamega • Bungoma • Busia</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Quick Actions */}
      <QuickActions />

      {/* Smart Suggestions */}
      <SmartSuggestions />

      {/* Daily Rewards */}
      <DailyRewards />

      {/* AI-Powered Personalized Ads */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <PersonalizedAds variant="carousel" maxAds={4} />
        </div>
      </section>

      {/* AI-Recommended Services */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <ServiceRecommendations 
            title="Services Picked for You" 
            showPersonalizedMessage={true}
            maxItems={6}
            variant="grid"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From beauty treatments to home repairs, find the perfect service provider for your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Why Choose Afrionex?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visionary technology meets reliable service. Built for Africa, ready for the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <FeaturedProviders />

      {/* More AI Recommendations */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <ServiceRecommendations 
            title="You Might Also Like" 
            showPersonalizedMessage={false}
            maxItems={4}
            variant="horizontal"
          />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* How It Works */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-500 to-primary-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Life Moves Fast. Afrionex Moves With You.
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of Africans who connect, transact, and thrive on Afrionex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              Find a Service
            </Link>
            <Link href="/provider/register" className="btn btn-lg border-2 border-white text-white hover:bg-white/10">
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
