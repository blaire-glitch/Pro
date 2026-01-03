'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProviderCardSkeleton } from '@/components/ui/Skeleton';
import LiveMap from '@/components/map';
import { 
  HiSearch, HiLocationMarker, HiFilter, HiStar, 
  HiBadgeCheck, HiAdjustments, HiX, HiViewGrid, HiMap 
} from 'react-icons/hi';

// Coverage areas
const coverageCities = ['All Cities', 'Kisumu', 'Kakamega', 'Bungoma', 'Busia'];

const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'home', name: 'Home' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'delivery', name: 'Delivery' },
  { id: 'transport', name: 'Transport' },
];

// Service providers in Western Kenya coverage areas with GPS coordinates
const mockProviders = [
  {
    id: '1',
    businessName: 'Wanjiku Beauty Studio',
    category: 'beauty',
    subcategory: 'Hair',
    rating: 4.8,
    reviewCount: 127,
    location: 'Milimani, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.0917, lng: 34.7680 },
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Mary+Wanjiku&background=FF6B9D&color=fff',
    isVerified: true,
    services: ['Box Braids', 'Dreadlocks', 'Makeup'],
    startingPrice: 1500,
    availability: 'Available today',
  },
  {
    id: '2',
    businessName: 'Ochieng Home Services',
    category: 'home',
    subcategory: 'Cleaning',
    rating: 4.6,
    reviewCount: 89,
    location: 'Lurambi, Kakamega',
    city: 'Kakamega',
    coordinates: { lat: 0.2827, lng: 34.7519 },
    distance: 3.2,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    avatar: 'https://ui-avatars.com/api/?name=John+Ochieng&background=4ECDC4&color=fff',
    isVerified: true,
    services: ['Deep Cleaning', 'Plumbing', 'Repairs'],
    startingPrice: 2500,
    availability: 'Next available: Tomorrow',
  },
  {
    id: '3',
    businessName: 'Serenity Wellness Spa',
    category: 'wellness',
    subcategory: 'Massage',
    rating: 4.9,
    reviewCount: 203,
    location: 'Kanduyi, Bungoma',
    city: 'Bungoma',
    coordinates: { lat: 0.5635, lng: 34.5606 },
    distance: 8.5,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Amina+Hassan&background=95E1D3&color=fff',
    isVerified: true,
    services: ['Swedish Massage', 'Spa Day', 'Facial'],
    startingPrice: 4000,
    availability: 'Available today',
  },
  {
    id: '4',
    businessName: 'Makena Nails & Spa',
    category: 'beauty',
    subcategory: 'Nails',
    rating: 4.7,
    reviewCount: 156,
    location: 'Busia Town, Busia',
    city: 'Busia',
    coordinates: { lat: 0.4608, lng: 34.1108 },
    distance: 4.1,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Grace+Makena&background=FF6B9D&color=fff',
    isVerified: true,
    services: ['Gel Nails', 'Acrylics', 'Pedicure'],
    startingPrice: 800,
    availability: 'Available today',
  },
  {
    id: '5',
    businessName: 'Kimani Photography',
    category: 'lifestyle',
    subcategory: 'Photography',
    rating: 4.9,
    reviewCount: 78,
    location: 'CBD, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Peter+Kimani&background=F7B32B&color=fff',
    isVerified: true,
    services: ['Weddings', 'Events', 'Portraits'],
    startingPrice: 15000,
    availability: 'Book 3 days in advance',
  },
  {
    id: '6',
    businessName: 'FitPro Personal Training',
    category: 'wellness',
    subcategory: 'Fitness',
    rating: 4.8,
    reviewCount: 92,
    location: 'Shinyalu, Kakamega',
    city: 'Kakamega',
    coordinates: { lat: 0.2650, lng: 34.7320 },
    distance: 5.0,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Mwangi&background=95E1D3&color=fff',
    isVerified: true,
    services: ['Personal Training', 'Group Classes', 'Diet Plans'],
    startingPrice: 2500,
    availability: 'Available today',
  },
  {
    id: '7',
    businessName: 'Wekesa Electrical Services',
    category: 'home',
    subcategory: 'Electrical',
    rating: 4.7,
    reviewCount: 65,
    location: 'Webuye, Bungoma',
    city: 'Bungoma',
    coordinates: { lat: 0.6169, lng: 34.7694 },
    distance: 6.2,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Samuel+Wekesa&background=4ECDC4&color=fff',
    isVerified: true,
    services: ['Electrical Repair', 'House Wiring', 'Solar Installation'],
    startingPrice: 2000,
    availability: 'Available today',
  },
  {
    id: '8',
    businessName: 'Lake Barbers',
    category: 'beauty',
    subcategory: 'Barbering',
    rating: 4.6,
    reviewCount: 234,
    location: 'Kondele, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.0850, lng: 34.7450 },
    distance: 3.0,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Lake+Barbers&background=FF6B9D&color=fff',
    isVerified: true,
    services: ['Haircut', 'Beard Trim', 'Hot Towel Shave'],
    startingPrice: 300,
    availability: 'Walk-ins welcome',
  },
  // Delivery Providers
  {
    id: '9',
    businessName: 'Swift Delivery Kenya',
    category: 'delivery',
    subcategory: 'Package Delivery',
    rating: 4.7,
    reviewCount: 312,
    location: 'CBD, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.0917, lng: 34.7680 },
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Swift+Delivery&background=3B82F6&color=fff',
    isVerified: true,
    services: ['Same-Day Delivery', 'Express Courier', 'Bulk Packages'],
    startingPrice: 150,
    availability: 'Available 24/7',
    isOnline: true,
  },
  {
    id: '10',
    businessName: 'Mama Pima Foods',
    category: 'delivery',
    subcategory: 'Food Delivery',
    rating: 4.8,
    reviewCount: 567,
    location: 'Milimani, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.0850, lng: 34.7750 },
    distance: 2.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Mama+Pima&background=F97316&color=fff',
    isVerified: true,
    services: ['Local Cuisine', 'Fast Food', 'Restaurant Orders'],
    startingPrice: 100,
    availability: 'Open: 8AM - 10PM',
    isOnline: true,
  },
  {
    id: '11',
    businessName: 'Kakamega Grocers Express',
    category: 'delivery',
    subcategory: 'Grocery Delivery',
    rating: 4.5,
    reviewCount: 189,
    location: 'Town Centre, Kakamega',
    city: 'Kakamega',
    coordinates: { lat: 0.2827, lng: 34.7519 },
    distance: 3.5,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Kakamega+Grocers&background=22C55E&color=fff',
    isVerified: true,
    services: ['Fresh Produce', 'Household Items', 'Supermarket Orders'],
    startingPrice: 200,
    availability: 'Available today',
    isOnline: true,
  },
  {
    id: '12',
    businessName: 'DocuRush Couriers',
    category: 'delivery',
    subcategory: 'Document Courier',
    rating: 4.9,
    reviewCount: 156,
    location: 'Bungoma Town',
    city: 'Bungoma',
    coordinates: { lat: 0.5635, lng: 34.5606 },
    distance: 4.2,
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400',
    avatar: 'https://ui-avatars.com/api/?name=DocuRush&background=6366F1&color=fff',
    isVerified: true,
    services: ['Legal Documents', 'Bank Drafts', 'Contracts'],
    startingPrice: 300,
    availability: 'Mon-Sat: 7AM - 6PM',
    isOnline: true,
  },
  {
    id: '13',
    businessName: 'Onyango Movers',
    category: 'delivery',
    subcategory: 'Moving & Logistics',
    rating: 4.6,
    reviewCount: 98,
    location: 'Busia Town',
    city: 'Busia',
    coordinates: { lat: 0.4608, lng: 34.1108 },
    distance: 5.0,
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Onyango+Movers&background=8B5CF6&color=fff',
    isVerified: true,
    services: ['House Moving', 'Office Relocation', 'Furniture Delivery'],
    startingPrice: 5000,
    availability: 'Book 1 day ahead',
    isOnline: false,
  },
  // Transport Providers
  {
    id: '14',
    businessName: 'Boda Express Kisumu',
    category: 'transport',
    subcategory: 'Boda Boda',
    rating: 4.7,
    reviewCount: 1245,
    location: 'CBD, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.0900, lng: 34.7600 },
    distance: 0.5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Boda+Express&background=9333EA&color=fff',
    isVerified: true,
    services: ['City Rides', 'Package Drop', 'Hourly Hire'],
    startingPrice: 50,
    availability: 'Online Now',
    isOnline: true,
    vehicleType: 'Motorcycle',
  },
  {
    id: '15',
    businessName: 'Lake Taxi Services',
    category: 'transport',
    subcategory: 'Taxi & Car Hire',
    rating: 4.8,
    reviewCount: 432,
    location: 'Mega City, Kisumu',
    city: 'Kisumu',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    distance: 1.8,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Lake+Taxi&background=EC4899&color=fff',
    isVerified: true,
    services: ['Airport Pickup', 'City Tours', 'Long Distance'],
    startingPrice: 500,
    availability: 'Available 24/7',
    isOnline: true,
    vehicleType: 'Car',
  },
  {
    id: '16',
    businessName: 'TukTuk Kakamega',
    category: 'transport',
    subcategory: 'Tuk-Tuk',
    rating: 4.5,
    reviewCount: 287,
    location: 'Lurambi, Kakamega',
    city: 'Kakamega',
    coordinates: { lat: 0.2750, lng: 34.7450 },
    distance: 2.3,
    image: 'https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=400',
    avatar: 'https://ui-avatars.com/api/?name=TukTuk+KKM&background=14B8A6&color=fff',
    isVerified: true,
    services: ['Short Trips', 'Market Runs', 'Group Rides'],
    startingPrice: 100,
    availability: 'Online Now',
    isOnline: true,
    vehicleType: 'Tuk-Tuk',
  },
  {
    id: '17',
    businessName: 'Western Shuttle Services',
    category: 'transport',
    subcategory: 'Shuttle Services',
    rating: 4.9,
    reviewCount: 178,
    location: 'Bungoma Bus Park',
    city: 'Bungoma',
    coordinates: { lat: 0.5700, lng: 34.5650 },
    distance: 3.0,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Western+Shuttle&background=0EA5E9&color=fff',
    isVerified: true,
    services: ['Kisumu Route', 'Nairobi Route', 'Group Booking'],
    startingPrice: 800,
    availability: 'Daily: 6AM, 2PM, 6PM',
    isOnline: true,
    vehicleType: 'Van',
  },
  {
    id: '18',
    businessName: 'Border Riders',
    category: 'transport',
    subcategory: 'Boda Boda',
    rating: 4.4,
    reviewCount: 534,
    location: 'Busia Border',
    city: 'Busia',
    coordinates: { lat: 0.4650, lng: 34.1150 },
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400',
    avatar: 'https://ui-avatars.com/api/?name=Border+Riders&background=F59E0B&color=fff',
    isVerified: true,
    services: ['Border Crossing', 'Town Rides', 'Parcels'],
    startingPrice: 30,
    availability: 'Online Now',
    isOnline: true,
    vehicleType: 'Motorcycle',
  },
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'All Cities';

  const [searchQuery, setSearchQuery] = useState(initialCategory === 'all' ? initialQuery : '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // City center coordinates for map
  const cityCoordinates: Record<string, [number, number]> = {
    'All Cities': [-0.0917, 34.7680], // Default to Kisumu
    'Kisumu': [-0.0917, 34.7680],
    'Kakamega': [0.2827, 34.7519],
    'Bungoma': [0.5635, 34.5606],
    'Busia': [0.4608, 34.1108],
  };

  // Sync state with URL params when they change
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || 'All Cities';
    
    setSelectedCategory(category);
    setSearchQuery(query);
    setSelectedCity(city);
  }, [searchParams]);

  // Filter providers based on criteria
  const filteredProviders = mockProviders.filter((provider) => {
    // Filter by city
    if (selectedCity !== 'All Cities' && provider.city !== selectedCity) {
      return false;
    }
    if (selectedCategory !== 'all' && provider.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !provider.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    if (provider.rating < minRating) return false;
    if (onlyVerified && !provider.isVerified) return false;
    if (provider.startingPrice < priceRange[0] || provider.startingPrice > priceRange[1]) {
      return false;
    }
    return true;
  });

  // Sort providers
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'price_low':
        return a.startingPrice - b.startingPrice;
      case 'price_high':
        return b.startingPrice - a.startingPrice;
      default:
        return 0;
    }
  });

  // Get current category name for breadcrumb
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'All Services';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb
              items={[
                { label: 'Services', href: '/search' },
                ...(selectedCategory !== 'all' ? [{ label: currentCategoryName }] : []),
              ]}
            />
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            {/* Search Bar */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="input pl-12"
                />
              </div>
              {/* City Selector */}
              <div className="relative">
                <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="input pl-10 pr-8 appearance-none cursor-pointer min-w-[140px]"
                  aria-label="Select city"
                  title="Select city"
                >
                  {coverageCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} flex items-center gap-2`}
              >
                <HiAdjustments className="w-5 h-5" />
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t bg-gray-50 py-4">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      id="sort-by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="min-rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      id="min-rating"
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="input"
                    >
                      <option value="0">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="input w-24"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="input w-24"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyVerified}
                        onChange={(e) => setOnlyVerified(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Verified Providers Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{sortedProviders.length}</span> providers found
              {selectedCategory !== 'all' && (
                <span> in <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span></span>
              )}
            </p>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiViewGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiMap className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="mb-8">
              <LiveMap
                providers={sortedProviders.map(p => ({
                  id: p.id,
                  name: p.businessName,
                  category: p.category,
                  rating: p.rating,
                  location: {
                    lat: p.coordinates.lat,
                    lng: p.coordinates.lng,
                    city: p.city,
                    address: p.location,
                  },
                  services: p.services,
                  image: p.image,
                }))}
                center={cityCoordinates[selectedCity]}
                zoom={selectedCity === 'All Cities' ? 9 : 13}
                showUserLocation={true}
                className="h-[500px]"
              />
            </div>
          )}

          {sortedProviders.length === 0 ? (
            <div className="text-center py-16">
              <HiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMinRating(0);
                  setPriceRange([0, 50000]);
                  setOnlyVerified(false);
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders.map((provider) => (
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="badge bg-white/90 text-gray-800 backdrop-blur-sm capitalize">
                        {provider.subcategory}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="badge bg-green-500 text-white text-xs">
                        {provider.availability}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative flex-shrink-0">
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
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <HiLocationMarker className="w-4 h-4" />
                            <span className="truncate">{provider.location}</span>
                          </div>
                          <span>•</span>
                          <span>{provider.distance} km</span>
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
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Loading fallback for Suspense
function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Export the page wrapped in Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
