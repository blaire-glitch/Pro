'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiSearch,
  HiStar,
  HiClock,
  HiLocationMarker,
  HiPlus,
  HiMinus,
  HiShoppingCart,
  HiX,
  HiCheckCircle,
  HiPhone
} from 'react-icons/hi';
import { FaUtensils, FaMotorcycle } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';

// Food categories
const categories = [
  { id: 'all', name: 'All', icon: FaUtensils },
  { id: 'popular', name: 'Popular', icon: HiStar },
  { id: 'fast-food', name: 'Fast Food', icon: FaUtensils },
  { id: 'local', name: 'Local', icon: FaUtensils },
  { id: 'pizza', name: 'Pizza', icon: FaUtensils },
  { id: 'chicken', name: 'Chicken', icon: FaUtensils },
];

// Restaurants
const restaurants = [
  {
    id: 1,
    name: 'Java House Kisumu',
    category: 'popular',
    rating: 4.8,
    reviews: 245,
    deliveryTime: '25-35',
    deliveryFee: 100,
    minOrder: 500,
    image: 'J',
    menu: [
      { id: 'm1', name: 'Java Burger', desc: 'Beef patty, cheese, lettuce, tomato', price: 750 },
      { id: 'm2', name: 'Chicken Wings', desc: '8 pcs with BBQ sauce', price: 850 },
      { id: 'm3', name: 'Fish & Chips', desc: 'Fried fish fillet with fries', price: 900 },
      { id: 'm4', name: 'Caesar Salad', desc: 'Romaine, parmesan, croutons', price: 550 },
    ]
  },
  {
    id: 2,
    name: 'KFC Kisumu',
    category: 'chicken',
    rating: 4.5,
    reviews: 189,
    deliveryTime: '20-30',
    deliveryFee: 80,
    minOrder: 400,
    image: 'K',
    menu: [
      { id: 'k1', name: 'Streetwise Two', desc: '2 pcs chicken, chips, drink', price: 450 },
      { id: 'k2', name: 'Bucket 9 Pieces', desc: '9 pcs original recipe chicken', price: 1650 },
      { id: 'k3', name: 'Zinger Burger', desc: 'Spicy chicken fillet burger', price: 550 },
      { id: 'k4', name: 'Twister Wrap', desc: 'Chicken wrap with slaw', price: 450 },
    ]
  },
  {
    id: 3,
    name: 'Pizza Inn Mega City',
    category: 'pizza',
    rating: 4.6,
    reviews: 156,
    deliveryTime: '30-45',
    deliveryFee: 120,
    minOrder: 600,
    image: 'P',
    menu: [
      { id: 'p1', name: 'Meat Feast', desc: 'Beef, sausage, bacon, pepperoni', price: 1200 },
      { id: 'p2', name: 'Hawaiian', desc: 'Ham, pineapple, cheese', price: 1000 },
      { id: 'p3', name: 'Veggie Delight', desc: 'Mushroom, peppers, onion', price: 950 },
      { id: 'p4', name: 'Garlic Bread', desc: '6 pieces with garlic butter', price: 350 },
    ]
  },
  {
    id: 4,
    name: 'Mama Oliech',
    category: 'local',
    rating: 4.9,
    reviews: 312,
    deliveryTime: '25-40',
    deliveryFee: 100,
    minOrder: 300,
    image: 'M',
    menu: [
      { id: 'o1', name: 'Fried Tilapia', desc: 'Whole fish with ugali & sukuma', price: 650 },
      { id: 'o2', name: 'Nyama Choma', desc: 'Grilled beef with kachumbari', price: 800 },
      { id: 'o3', name: 'Mukimo & Beef', desc: 'Mashed potatoes with stew', price: 450 },
      { id: 'o4', name: 'Pilau', desc: 'Spiced rice with beef', price: 400 },
    ]
  },
  {
    id: 5,
    name: 'Burger King',
    category: 'fast-food',
    rating: 4.4,
    reviews: 98,
    deliveryTime: '20-30',
    deliveryFee: 80,
    minOrder: 400,
    image: 'B',
    menu: [
      { id: 'b1', name: 'Whopper', desc: 'Flame-grilled beef burger', price: 650 },
      { id: 'b2', name: 'Double Cheeseburger', desc: '2 beef patties, cheese', price: 550 },
      { id: 'b3', name: 'Chicken Royale', desc: 'Crispy chicken fillet', price: 500 },
      { id: 'b4', name: 'Onion Rings', desc: 'Crispy battered onion rings', price: 250 },
    ]
  },
];

interface CartItem {
  menuItem: typeof restaurants[0]['menu'][0];
  quantity: number;
  restaurant: typeof restaurants[0];
}

export default function FoodPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [step, setStep] = useState<'browse' | 'checkout' | 'success'>('browse');
  const [deliveryAddress, setDeliveryAddress] = useState('Milimani, Kisumu');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const filteredRestaurants = restaurants.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (restaurant: typeof restaurants[0], menuItem: typeof restaurants[0]['menu'][0]) => {
    // Check if item from different restaurant
    if (cart.length > 0 && cart[0].restaurant.id !== restaurant.id) {
      toast.error('You can only order from one restaurant at a time');
      return;
    }

    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.menuItem.id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { menuItem, quantity: 1, restaurant }]);
    }
    toast.success('Added to cart');
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.menuItem.id === menuItemId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? cart[0].restaurant.deliveryFee : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setStep('checkout');
  };

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/services" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Food Delivery</h1>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <HiLocationMarker className="w-4 h-4" />
                  <span>{deliveryAddress}</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants or food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>

        {step === 'browse' && (
          <div className="container mx-auto px-4 -mt-4">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurant or Menu View */}
            {selectedRestaurant ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                {/* Restaurant Header */}
                <div className="p-4 border-b">
                  <button 
                    onClick={() => setSelectedRestaurant(null)}
                    className="flex items-center gap-2 text-gray-500 text-sm mb-3"
                  >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to restaurants
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                      {selectedRestaurant.image}
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">{selectedRestaurant.name}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <HiStar className="w-4 h-4 text-yellow-500" />
                          {selectedRestaurant.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock className="w-4 h-4" />
                          {selectedRestaurant.deliveryTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-4">
                  {selectedRestaurant.menu.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                        <p className="font-bold text-orange-600 mt-1">KES {item.price}</p>
                      </div>
                      <button
                        onClick={() => addToCart(selectedRestaurant, item)}
                        className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                      >
                        <HiPlus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Restaurants List */
              <div className="space-y-4">
                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="w-full bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                        {restaurant.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <HiStar className="w-4 h-4 text-yellow-500" />
                            {restaurant.rating} ({restaurant.reviews})
                          </span>
                          <span className="flex items-center gap-1">
                            <HiClock className="w-4 h-4" />
                            {restaurant.deliveryTime} min
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            Delivery: KES {restaurant.deliveryFee}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            Min: KES {restaurant.minOrder}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <div className="container mx-auto px-4 -mt-4">
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">KES {item.menuItem.price} x {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">KES {item.menuItem.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>KES {deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>KES {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <h2 className="font-bold text-gray-900 mb-4">Delivery Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Address</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Delivery Instructions (optional)</label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="E.g., Call when you arrive, leave at gate..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('browse')}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Place Order - KES {grandTotal.toLocaleString()}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="container mx-auto px-4 -mt-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="font-bold text-gray-900 text-xl mb-2">Order Placed!</h2>
              <p className="text-gray-500 mb-6">
                Your food is being prepared and will be delivered soon.
              </p>

              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaMotorcycle className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-orange-600">Estimated Delivery</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {cart[0]?.restaurant.deliveryTime || '25-35'} minutes
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/services"
                  className="block w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  Back to Services
                </Link>
                <button className="w-full flex items-center justify-center gap-2 text-orange-600 font-medium">
                  <HiPhone className="w-5 h-5" />
                  Call Restaurant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Cart Button */}
        {cart.length > 0 && step === 'browse' && (
          <div className="fixed bottom-20 left-4 right-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
                <span>View Cart</span>
              </div>
              <span>KES {grandTotal.toLocaleString()}</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
