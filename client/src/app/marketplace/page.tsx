'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { 
  HiSearch, HiFilter, HiStar, HiShoppingCart, HiHeart,
  HiLocationMarker, HiBadgeCheck, HiAdjustments, HiViewGrid, HiViewList
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { SubscriptionGuard } from '@/components/guards/SubscriptionGuard';

// Product categories
const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home_garden', name: 'Home & Garden' },
  { id: 'health_beauty', name: 'Health & Beauty' },
  { id: 'food_beverages', name: 'Food & Beverages' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'automotive', name: 'Automotive' },
];

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy A54 5G',
    slug: 'samsung-galaxy-a54-5g',
    description: 'Latest Samsung smartphone with amazing camera',
    category: 'electronics',
    price: 45000,
    comparePrice: 52000,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    images: [],
    rating: 4.7,
    reviewCount: 234,
    quantity: 15,
    shop: {
      id: '1',
      name: 'Tech Hub Kisumu',
      slug: 'tech-hub-kisumu',
      isVerified: true,
      city: 'Kisumu',
    },
    isFeatured: true,
  },
  {
    id: '2',
    name: 'African Print Maxi Dress',
    slug: 'african-print-maxi-dress',
    description: 'Beautiful handmade African print dress',
    category: 'fashion',
    price: 3500,
    comparePrice: 4500,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400',
    images: [],
    rating: 4.9,
    reviewCount: 89,
    quantity: 25,
    shop: {
      id: '2',
      name: 'Mama Afrika Designs',
      slug: 'mama-afrika-designs',
      isVerified: true,
      city: 'Kakamega',
    },
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Organic Honey - 1kg',
    slug: 'organic-honey-1kg',
    description: 'Pure organic honey from Western Kenya',
    category: 'food_beverages',
    price: 1200,
    comparePrice: null,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    images: [],
    rating: 4.8,
    reviewCount: 156,
    quantity: 50,
    shop: {
      id: '3',
      name: 'Kakamega Honey Farm',
      slug: 'kakamega-honey-farm',
      isVerified: true,
      city: 'Kakamega',
    },
    isFeatured: false,
  },
  {
    id: '4',
    name: 'Leather Messenger Bag',
    slug: 'leather-messenger-bag',
    description: 'Handcrafted genuine leather bag',
    category: 'fashion',
    price: 8500,
    comparePrice: 10000,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    images: [],
    rating: 4.6,
    reviewCount: 67,
    quantity: 8,
    shop: {
      id: '4',
      name: 'Busia Leather Works',
      slug: 'busia-leather-works',
      isVerified: true,
      city: 'Busia',
    },
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Wireless Bluetooth Earbuds',
    slug: 'wireless-bluetooth-earbuds',
    description: 'High quality wireless earbuds with noise cancellation',
    category: 'electronics',
    price: 2500,
    comparePrice: 3500,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    images: [],
    rating: 4.4,
    reviewCount: 312,
    quantity: 42,
    shop: {
      id: '1',
      name: 'Tech Hub Kisumu',
      slug: 'tech-hub-kisumu',
      isVerified: true,
      city: 'Kisumu',
    },
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Handwoven Sisal Basket',
    slug: 'handwoven-sisal-basket',
    description: 'Traditional Kenyan sisal basket - perfect for storage',
    category: 'home_garden',
    price: 1800,
    comparePrice: null,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
    images: [],
    rating: 4.9,
    reviewCount: 45,
    quantity: 20,
    shop: {
      id: '5',
      name: 'Nyanza Crafts',
      slug: 'nyanza-crafts',
      isVerified: false,
      city: 'Kisumu',
    },
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Organic Avocado Oil - 500ml',
    slug: 'organic-avocado-oil-500ml',
    description: 'Cold-pressed organic avocado oil for cooking & beauty',
    category: 'health_beauty',
    price: 950,
    comparePrice: 1200,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400',
    images: [],
    rating: 4.7,
    reviewCount: 89,
    quantity: 35,
    shop: {
      id: '6',
      name: 'Nature\'s Best Kenya',
      slug: 'natures-best-kenya',
      isVerified: true,
      city: 'Bungoma',
    },
    isFeatured: false,
  },
  {
    id: '8',
    name: 'Football Training Kit',
    slug: 'football-training-kit',
    description: 'Complete football training kit - jersey, shorts, socks',
    category: 'sports',
    price: 2800,
    comparePrice: 3500,
    currency: 'KES',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    images: [],
    rating: 4.5,
    reviewCount: 123,
    quantity: 60,
    shop: {
      id: '7',
      name: 'Sports World Kisumu',
      slug: 'sports-world-kisumu',
      isVerified: true,
      city: 'Kisumu',
    },
    isFeatured: false,
  },
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const calculateDiscount = (price: number, comparePrice: number | null) => {
    if (!comparePrice) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const { addItem, openCart } = useCartStore();

  const handleQuickAddToCart = (product: typeof mockProducts[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      thumbnail: product.thumbnail,
      shopId: product.shop.id,
      shopName: product.shop.name,
    });
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  return (
    <SubscriptionGuard feature="Marketplace">
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Afrionex Marketplace
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Discover amazing products from local vendors across Western Kenya
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 shadow-lg max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 text-gray-800"
                  />
                </div>
                <button className="btn-primary whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <p className="text-gray-600">
            <span className="font-medium">{sortedProducts.length}</span> products found
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <HiAdjustments className="w-5 h-5" />
              Filters
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <HiViewGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <HiViewList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Price Range (KES)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {sortedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/product/${product.slug}`}
              className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.comparePrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{calculateDiscount(product.price, product.comparePrice)}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="absolute top-2 right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600"
                    onClick={(e) => handleQuickAddToCart(product, e)}
                    title="Add to Cart"
                  >
                    <HiShoppingCart className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to wishlist
                      toast.success('Added to wishlist!');
                    }}
                    title="Add to Wishlist"
                  >
                    <HiHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1">
                {/* Shop Info */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs text-gray-500">{product.shop.name}</span>
                  {product.shop.isVerified && (
                    <HiBadgeCheck className="w-4 h-4 text-primary-500" />
                  )}
                </div>
                
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                
                {viewMode === 'list' && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <HiStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary-600">
                    KES {product.price.toLocaleString()}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      KES {product.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <HiLocationMarker className="w-3 h-3" />
                  <span>{product.shop.city}</span>
                </div>

                {/* Add to Cart Button */}
                {viewMode === 'list' && (
                  <button 
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    onClick={(e) => handleQuickAddToCart(product, e)}
                  >
                    <HiShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Become a Vendor CTA */}
        <div className="mt-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Start Selling on Afrionex</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Join thousands of vendors and reach customers across Western Kenya. 
            Set up your shop in minutes and start selling today!
          </p>
          <Link 
            href="/vendor/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Open Your Shop
          </Link>
        </div>
      </main>

      <Footer />
    </div>
    </SubscriptionGuard>
  );
}
