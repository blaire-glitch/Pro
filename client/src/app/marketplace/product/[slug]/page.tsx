'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { 
  HiStar, HiShoppingCart, HiHeart, HiShare, HiLocationMarker, 
  HiBadgeCheck, HiChevronLeft, HiChevronRight, HiMinus, HiPlus,
  HiTruck, HiShieldCheck, HiRefresh, HiChat
} from 'react-icons/hi';
import toast from 'react-hot-toast';

// Mock product data (would come from API)
const mockProduct = {
  id: '1',
  name: 'Samsung Galaxy A54 5G',
  slug: 'samsung-galaxy-a54-5g',
  description: `The Samsung Galaxy A54 5G is a feature-packed smartphone that offers flagship-level performance at a mid-range price. 

Key Features:
• 6.4" Super AMOLED display with 120Hz refresh rate
• Triple camera system with 50MP main sensor
• 5000mAh battery with fast charging
• IP67 water and dust resistance
• 5G connectivity for blazing-fast speeds
• 128GB storage with expandable memory

Perfect for photography enthusiasts, gamers, and anyone who wants a premium smartphone experience without the premium price tag.`,
  category: 'electronics',
  price: 45000,
  comparePrice: 52000,
  currency: 'KES',
  images: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800',
  ],
  rating: 4.7,
  reviewCount: 234,
  quantity: 15,
  sold: 89,
  variants: [
    { name: 'Color', options: ['Awesome Graphite', 'Awesome Violet', 'Awesome Lime'] },
    { name: 'Storage', options: ['128GB', '256GB'] },
  ],
  shop: {
    id: '1',
    name: 'Tech Hub Kisumu',
    slug: 'tech-hub-kisumu',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    isVerified: true,
    city: 'Kisumu',
    rating: 4.8,
    responseRate: 98,
    followers: 1234,
  },
  isFeatured: true,
  specifications: [
    { label: 'Brand', value: 'Samsung' },
    { label: 'Model', value: 'Galaxy A54 5G' },
    { label: 'Display', value: '6.4" Super AMOLED' },
    { label: 'Processor', value: 'Exynos 1380' },
    { label: 'RAM', value: '8GB' },
    { label: 'Battery', value: '5000mAh' },
    { label: 'OS', value: 'Android 13' },
  ],
};

const mockReviews = [
  {
    id: '1',
    user: { name: 'James O.', avatar: null },
    rating: 5,
    comment: 'Excellent phone! The camera quality is amazing and battery lasts all day. Fast delivery too.',
    date: '2024-01-15',
    helpful: 12,
  },
  {
    id: '2',
    user: { name: 'Mary W.', avatar: null },
    rating: 4,
    comment: 'Great value for money. Only giving 4 stars because the charger was not included.',
    date: '2024-01-10',
    helpful: 8,
  },
  {
    id: '3',
    user: { name: 'Peter K.', avatar: null },
    rating: 5,
    comment: 'Best phone I\'ve ever owned. Tech Hub Kisumu provided excellent customer service.',
    date: '2024-01-05',
    helpful: 15,
  },
];

const relatedProducts = [
  {
    id: '2',
    name: 'Wireless Bluetooth Earbuds',
    slug: 'wireless-bluetooth-earbuds',
    price: 2500,
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    rating: 4.4,
    shop: { name: 'Tech Hub Kisumu' },
  },
  {
    id: '3',
    name: 'Phone Case - Galaxy A54',
    slug: 'phone-case-galaxy-a54',
    price: 800,
    thumbnail: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
    rating: 4.6,
    shop: { name: 'Tech Hub Kisumu' },
  },
  {
    id: '4',
    name: 'Fast Charging Cable',
    slug: 'fast-charging-cable',
    price: 500,
    thumbnail: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    rating: 4.3,
    shop: { name: 'Tech Hub Kisumu' },
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = mockProduct; // In real app, fetch based on params.id

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      thumbnail: product.images[0],
      shopId: product.shop.id,
      shopName: product.shop.name,
    });
    toast.success(`Added ${quantity} item(s) to cart!`);
    openCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/marketplace/cart');
  };

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/marketplace" className="hover:text-primary-500">Marketplace</Link>
          <span>/</span>
          <Link href={`/marketplace?category=${product.category}`} className="hover:text-primary-500 capitalize">
            {product.category.replace('_', ' ')}
          </Link>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{discount}%
                </span>
              )}
              
              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"
                  >
                    <HiChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"
                  >
                    <HiChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Shop Info */}
            <Link 
              href={`/shop/${product.shop.slug}`}
              className="inline-flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={product.shop.logo} alt={product.shop.name} fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{product.shop.name}</span>
                  {product.shop.isVerified && (
                    <HiBadgeCheck className="w-5 h-5 text-primary-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <HiLocationMarker className="w-4 h-4" />
                  <span>{product.shop.city}</span>
                </div>
              </div>
            </Link>

            {/* Product Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <HiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {product.reviewCount} reviews
                </span>
                <span className="text-sm text-gray-500">
                  {product.sold} sold
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary-50 p-4 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-600">
                  KES {product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    KES {product.comparePrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    Save KES {(product.comparePrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants.map((variant) => (
              <div key={variant.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {variant.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedVariants[variant.name] === option
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-3 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <HiMinus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                    className="p-3 hover:bg-gray-100"
                    disabled={quantity >= product.quantity}
                  >
                    <HiPlus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.quantity} pieces available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
              >
                <HiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 btn-primary"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border rounded-xl transition-colors ${
                  isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <HiHeart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 border border-gray-200 rounded-xl hover:border-gray-300">
                <HiShare className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <HiTruck className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Fast Delivery</p>
                  <p className="text-gray-500">1-3 days in Western Kenya</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <HiShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-gray-500">M-Pesa & Airtel Money</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <HiRefresh className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">7-Day Returns</p>
                  <p className="text-gray-500">Easy return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          {/* Tab Headers */}
          <div className="flex border-b">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'specs' && 'Specifications'}
                {tab === 'reviews' && `Reviews (${product.reviewCount})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-gray-700">{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex py-3 border-b">
                    <span className="w-1/3 text-gray-500">{spec.label}</span>
                    <span className="w-2/3 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Overall Rating */}
                <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-600">{product.rating}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiStar
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</p>
                  </div>
                </div>

                {/* Review List */}
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary-600">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <HiStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <button className="mt-3 text-sm text-gray-500 hover:text-primary-500">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/marketplace/product/${item.slug}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{item.shop.name}</p>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">
                      KES {item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <HiStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
