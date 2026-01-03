'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiLocationMarker,
  HiClock,
  HiStar,
  HiPhone,
  HiCheckCircle,
  HiCash,
  HiCreditCard,
  HiUser
} from 'react-icons/hi';
import { FaBus, FaMotorcycle, FaCar, FaTaxi } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { SubscriptionGuard } from '@/components/guards/SubscriptionGuard';

// Transport types
const transportTypes = [
  { id: 'boda', name: 'Boda Boda', icon: FaMotorcycle, color: 'bg-green-500', pricePerKm: 20, baseFare: 50 },
  { id: 'taxi', name: 'Taxi', icon: FaTaxi, color: 'bg-yellow-500', pricePerKm: 50, baseFare: 150 },
  { id: 'car', name: 'Car Hire', icon: FaCar, color: 'bg-blue-500', pricePerKm: 40, baseFare: 200 },
  { id: 'matatu', name: 'Matatu', icon: FaBus, color: 'bg-purple-500', pricePerKm: 10, baseFare: 30 },
];

// Popular routes
const popularRoutes = [
  { from: 'CBD Kisumu', to: 'Milimani', distance: 3, duration: '10 min' },
  { from: 'CBD Kisumu', to: 'Mamboleo', distance: 5, duration: '15 min' },
  { from: 'CBD Kisumu', to: 'Nyalenda', distance: 4, duration: '12 min' },
  { from: 'CBD Kisumu', to: 'Kondele', distance: 2, duration: '8 min' },
];

// Available drivers
const availableDrivers = [
  { id: 1, name: 'James Omondi', rating: 4.9, trips: 1250, vehicle: 'Honda CB125', plate: 'KDD 456Y', eta: 3 },
  { id: 2, name: 'Peter Wafula', rating: 4.7, trips: 890, vehicle: 'TVS Apache', plate: 'KCE 789Z', eta: 5 },
  { id: 3, name: 'David Otieno', rating: 4.8, trips: 2100, vehicle: 'Boxer BM150', plate: 'KDF 123X', eta: 7 },
];

export default function TransportPage() {
  const [step, setStep] = useState<'select' | 'drivers' | 'confirm' | 'tracking' | 'complete'>('select');
  const [selectedType, setSelectedType] = useState(transportTypes[0]);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<typeof availableDrivers[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash'>('wallet');

  // Calculate fare
  const calculateFare = () => {
    if (estimatedDistance === 0) return 0;
    return selectedType.baseFare + (estimatedDistance * selectedType.pricePerKm);
  };

  const handleSelectRoute = (route: typeof popularRoutes[0]) => {
    setPickup(route.from);
    setDestination(route.to);
    setEstimatedDistance(route.distance);
  };

  const handleFindRide = () => {
    if (!pickup || !destination) {
      toast.error('Please enter pickup and destination');
      return;
    }
    if (estimatedDistance === 0) {
      setEstimatedDistance(Math.floor(Math.random() * 10) + 2); // Random 2-12 km
    }
    setStep('drivers');
  };

  const handleSelectDriver = (driver: typeof availableDrivers[0]) => {
    setSelectedDriver(driver);
    setStep('confirm');
  };

  const handleConfirmRide = () => {
    toast.success('Ride confirmed! Driver is on the way.');
    setStep('tracking');
    
    // Simulate ride completion after 10 seconds
    setTimeout(() => {
      setStep('complete');
    }, 10000);
  };

  const fare = calculateFare();

  return (
    <SubscriptionGuard feature="Transport Booking">
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/services" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <HiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Book a Ride</h1>
                <p className="text-white/80 text-sm">Get where you need to go</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-4">
          {step === 'select' && (
            <>
              {/* Transport Type Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Choose Ride Type</h2>
                <div className="grid grid-cols-4 gap-2">
                  {transportTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedType.id === type.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 ${type.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-900 block text-center">{type.name}</span>
                      <span className="text-xs text-gray-500 block text-center">KES {type.pricePerKm}/km</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Where to?</h2>
                
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                    <input
                      type="text"
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Popular Routes */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Popular Routes</p>
                  <div className="space-y-2">
                    {popularRoutes.map((route, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectRoute(route)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <HiLocationMarker className="w-5 h-5 text-gray-400" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{route.from} → {route.to}</p>
                            <p className="text-sm text-gray-500">{route.distance} km • {route.duration}</p>
                          </div>
                        </div>
                        <span className="text-primary-600 font-medium text-sm">
                          ~KES {selectedType.baseFare + (route.distance * selectedType.pricePerKm)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fare Estimate */}
              {estimatedDistance > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Fare</p>
                      <p className="text-2xl font-bold text-gray-900">KES {fare}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-medium text-gray-900">{estimatedDistance} km</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleFindRide}
                className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                Find Ride
              </button>
            </>
          )}

          {step === 'drivers' && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Available Drivers</h2>
                  <button onClick={() => setStep('select')} className="text-primary-600 text-sm font-medium">
                    Change Route
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">{pickup}</span>
                    <span className="text-gray-400">→</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">{destination}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {availableDrivers.map((driver) => (
                    <button
                      key={driver.id}
                      onClick={() => handleSelectDriver(driver)}
                      className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                        <HiUser className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900">{driver.name}</p>
                        <p className="text-sm text-gray-500">{driver.vehicle} • {driver.plate}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-sm">
                            <HiStar className="w-4 h-4 text-yellow-500" />
                            {driver.rating}
                          </span>
                          <span className="text-sm text-gray-500">{driver.trips} trips</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">ETA</p>
                        <p className="font-bold text-primary-600">{driver.eta} min</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Estimated Fare</p>
                    <p className="text-2xl font-bold text-gray-900">KES {fare}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <selectedType.icon className={`w-5 h-5 ${selectedType.color.replace('bg-', 'text-')}`} />
                    <span className="font-medium text-gray-900">{selectedType.name}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 'confirm' && selectedDriver && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h2 className="font-bold text-gray-900 text-center mb-6">Confirm Your Ride</h2>

              {/* Driver Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <HiUser className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedDriver.name}</p>
                  <p className="text-sm text-gray-500">{selectedDriver.vehicle} • {selectedDriver.plate}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <HiStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{selectedDriver.rating}</span>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Pickup</span>
                  <span className="font-medium text-gray-900">{pickup}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Destination</span>
                  <span className="font-medium text-gray-900">{destination}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Distance</span>
                  <span className="font-medium text-gray-900">{estimatedDistance} km</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Fare</span>
                  <span className="font-bold text-xl text-gray-900">KES {fare}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Payment Method</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'wallet'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <HiCreditCard className="w-5 h-5" />
                    <span className="font-medium">Wallet</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <HiCash className="w-5 h-5" />
                    <span className="font-medium">Cash</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('drivers')}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmRide}
                  className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  Confirm Ride
                </button>
              </div>
            </div>
          )}

          {step === 'tracking' && selectedDriver && (
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <selectedType.icon className="w-10 h-10 text-primary-500" />
              </div>

              <h2 className="font-bold text-gray-900 text-xl mb-2">Driver is on the way!</h2>
              <p className="text-gray-500 mb-6">
                {selectedDriver.name} will arrive in {selectedDriver.eta} minutes
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-medium text-gray-900">{selectedDriver.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Plate Number</span>
                  <span className="font-bold text-primary-600">{selectedDriver.plate}</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                <HiPhone className="w-5 h-5" />
                Call Driver
              </button>
            </div>
          )}

          {step === 'complete' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="font-bold text-gray-900 text-xl mb-2">Ride Complete!</h2>
              <p className="text-gray-500 mb-6">
                Thank you for riding with Afrionex
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Fare</span>
                  <span className="font-bold text-xl text-gray-900">KES {fare}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium text-green-600 capitalize">{paymentMethod}</span>
                </div>
              </div>

              {/* Rate Driver */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Rate your ride</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="p-1 hover:scale-110 transition-transform">
                      <HiStar className="w-8 h-8 text-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/services"
                className="block w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
              >
                Back to Services
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </SubscriptionGuard>
  );
}
