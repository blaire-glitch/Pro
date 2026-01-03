'use client';

import { useState, useEffect } from 'react';
import { 
  HiLocationMarker, HiArrowRight, HiClock, HiCurrencyDollar,
  HiTruck, HiUser, HiPlus, HiMinus
} from 'react-icons/hi';

interface RideOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  estimatedTime: string;
  capacity: number;
}

const rideOptions: RideOption[] = [
  {
    id: 'boda',
    name: 'Boda Boda',
    icon: 'motorcycle',
    description: 'Fast motorcycle ride',
    basePrice: 50,
    pricePerKm: 15,
    estimatedTime: '3-5 min',
    capacity: 1,
  },
  {
    id: 'tuktuk',
    name: 'Tuk-Tuk',
    icon: 'tuktuk',
    description: 'Affordable 3-wheeler',
    basePrice: 80,
    pricePerKm: 20,
    estimatedTime: '5-8 min',
    capacity: 3,
  },
  {
    id: 'taxi',
    name: 'Taxi',
    icon: 'car',
    description: 'Comfortable car ride',
    basePrice: 200,
    pricePerKm: 40,
    estimatedTime: '5-10 min',
    capacity: 4,
  },
  {
    id: 'shuttle',
    name: 'Shuttle',
    icon: 'van',
    description: 'Shared van ride',
    basePrice: 100,
    pricePerKm: 25,
    estimatedTime: '10-15 min',
    capacity: 8,
  },
];

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface RideBookingProps {
  onBook: (booking: {
    rideType: string;
    pickup: Location;
    dropoff: Location;
    passengers: number;
    estimatedFare: number;
    estimatedTime: number;
  }) => void;
  userLocation?: { lat: number; lng: number };
}

export function RideBooking({ onBook, userLocation }: RideBookingProps) {
  const [step, setStep] = useState<'location' | 'options' | 'confirm'>('location');
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [distance, setDistance] = useState(5); // km (mock)
  const [isLoading, setIsLoading] = useState(false);

  // Calculate estimated fare
  const calculateFare = (option: RideOption): number => {
    return option.basePrice + (option.pricePerKm * distance);
  };

  // Calculate ETA in minutes
  const calculateETA = (option: RideOption): number => {
    // Base time based on ride type
    const baseTime = option.id === 'boda' ? 3 : option.id === 'tuktuk' ? 5 : 8;
    return baseTime + Math.round(distance * 2); // 2 min per km average
  };

  const handleConfirmRide = () => {
    if (!selectedRide || !pickup || !dropoff) return;
    
    setIsLoading(true);
    
    // Simulate booking
    setTimeout(() => {
      onBook({
        rideType: selectedRide.id,
        pickup,
        dropoff,
        passengers,
        estimatedFare: calculateFare(selectedRide),
        estimatedTime: calculateETA(selectedRide),
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 text-white">
        <h2 className="text-xl font-bold">Book a Ride</h2>
        <p className="text-sm opacity-80">Get where you need to go</p>
      </div>

      {/* Location Selection */}
      {step === 'location' && (
        <div className="p-4 space-y-4">
          {/* Pickup Location */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full" />
            <input
              type="text"
              placeholder="Pickup location"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={pickup?.address || ''}
              onChange={(e) => setPickup({ 
                address: e.target.value, 
                lat: userLocation?.lat || -0.0917, 
                lng: userLocation?.lng || 34.768 
              })}
            />
            {userLocation && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-600 hover:text-purple-800"
                onClick={() => setPickup({ 
                  address: 'Current Location', 
                  lat: userLocation.lat, 
                  lng: userLocation.lng 
                })}
              >
                Use GPS
              </button>
            )}
          </div>

          {/* Connecting Line */}
          <div className="flex items-center gap-2 pl-4">
            <div className="w-0.5 h-6 bg-gray-300 ml-1" />
          </div>

          {/* Dropoff Location */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <HiLocationMarker className="w-4 h-4 text-red-500" />
            </div>
            <input
              type="text"
              placeholder="Where to?"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dropoff?.address || ''}
              onChange={(e) => setDropoff({ 
                address: e.target.value, 
                lat: -0.1022, 
                lng: 34.7617 
              })}
            />
          </div>

          {/* Quick Destinations */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Popular destinations</p>
            <div className="flex flex-wrap gap-2">
              {['Kisumu CBD', 'Mega City', 'Airport', 'Lake Side'].map((dest) => (
                <button
                  key={dest}
                  onClick={() => setDropoff({ address: dest, lat: -0.1, lng: 34.75 })}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('options')}
            disabled={!pickup || !dropoff}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
            <HiArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Ride Options */}
      {step === 'options' && (
        <div className="p-4">
          {/* Distance Info */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{distance} km</span> estimated distance
            </div>
            <button 
              onClick={() => setStep('location')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Edit route
            </button>
          </div>

          {/* Passengers */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <HiUser className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Passengers</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              <span className="font-medium w-4 text-center">{passengers}</span>
              <button
                onClick={() => setPassengers(Math.min(8, passengers + 1))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ride Options */}
          <div className="space-y-3">
            {rideOptions
              .filter(option => option.capacity >= passengers)
              .map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedRide(option)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedRide?.id === option.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-800">{option.name}</h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <HiClock className="w-3 h-3" />
                        <span>{option.estimatedTime} pickup</span>
                        <span>•</span>
                        <HiUser className="w-3 h-3" />
                        <span>Up to {option.capacity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        KES {calculateFare(option).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        ~{calculateETA(option)} min
                      </p>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          <button
            onClick={() => setStep('confirm')}
            disabled={!selectedRide}
            className="w-full mt-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm {selectedRide?.name || 'Ride'}
          </button>
        </div>
      )}

      {/* Confirmation */}
      {step === 'confirm' && selectedRide && (
        <div className="p-4">
          {/* Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedRide.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{selectedRide.name}</h3>
                <p className="text-sm text-gray-500">{passengers} passenger(s)</p>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="font-medium">{pickup?.address}</p>
                </div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-4" />
              <div className="flex items-start gap-3">
                <HiLocationMarker className="w-3 h-3 text-red-500 mt-1.5" />
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="font-medium">{dropoff?.address}</p>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base fare</span>
                <span>KES {selectedRide.basePrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distance ({distance} km)</span>
                <span>KES {selectedRide.pricePerKm * distance}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-purple-600">KES {calculateFare(selectedRide).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <p className="font-medium">M-Pesa</p>
                <p className="text-xs text-gray-500">Pay with mobile money</p>
              </div>
            </div>
            <button className="text-sm text-purple-600">Change</button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('options')}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirmRide}
              disabled={isLoading}
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding driver...
                </>
              ) : (
                <>
                  <HiTruck className="w-5 h-5" />
                  Book Now
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
