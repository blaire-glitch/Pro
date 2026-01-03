'use client';

import { useState } from 'react';
import { 
  HiLocationMarker, HiArrowRight, HiClock, HiPhone,
  HiCube, HiDocumentText, HiShoppingCart, HiTruck, HiHome
} from 'react-icons/hi';

interface DeliveryOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  basePrice: number;
  pricePerKm: number;
  estimatedTime: string;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'package',
    name: 'Package',
    icon: <HiCube className="w-6 h-6" />,
    description: 'Send parcels & packages',
    basePrice: 150,
    pricePerKm: 20,
    estimatedTime: '30-60 min',
  },
  {
    id: 'food',
    name: 'Food',
    icon: <HiShoppingCart className="w-6 h-6" />,
    description: 'Restaurant & fast food',
    basePrice: 100,
    pricePerKm: 15,
    estimatedTime: '20-40 min',
  },
  {
    id: 'grocery',
    name: 'Grocery',
    icon: <HiShoppingCart className="w-6 h-6" />,
    description: 'Fresh produce & supplies',
    basePrice: 120,
    pricePerKm: 18,
    estimatedTime: '45-90 min',
  },
  {
    id: 'document',
    name: 'Document',
    icon: <HiDocumentText className="w-6 h-6" />,
    description: 'Urgent papers & contracts',
    basePrice: 200,
    pricePerKm: 25,
    estimatedTime: '15-30 min',
  },
  {
    id: 'moving',
    name: 'Moving',
    icon: <HiHome className="w-6 h-6" />,
    description: 'Furniture & large items',
    basePrice: 2000,
    pricePerKm: 100,
    estimatedTime: '2-4 hours',
  },
];

const packageSizes = [
  { id: 'small', name: 'Small', description: 'Fits in hand (envelope, phone)', icon: 'S' },
  { id: 'medium', name: 'Medium', description: 'Fits in basket (books, clothes)', icon: 'M' },
  { id: 'large', name: 'Large', description: 'Needs vehicle (appliances)', icon: 'L' },
  { id: 'extra', name: 'Extra Large', description: 'Moving items (furniture)', icon: 'XL' },
];

interface Location {
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  instructions?: string;
}

interface DeliveryBookingProps {
  onBook: (booking: {
    deliveryType: string;
    pickup: Location;
    dropoff: Location;
    packageSize: string;
    packageDescription: string;
    isFragile: boolean;
    requiresSignature: boolean;
    estimatedFare: number;
    estimatedTime: string;
  }) => void;
  userLocation?: { lat: number; lng: number };
}

export function DeliveryBooking({ onBook, userLocation }: DeliveryBookingProps) {
  const [step, setStep] = useState<'type' | 'details' | 'locations' | 'confirm'>('type');
  const [selectedType, setSelectedType] = useState<DeliveryOption | null>(null);
  const [packageSize, setPackageSize] = useState('medium');
  const [packageDescription, setPackageDescription] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [requiresSignature, setRequiresSignature] = useState(false);
  
  const [pickup, setPickup] = useState<Location>({
    address: '',
    lat: userLocation?.lat || -0.0917,
    lng: userLocation?.lng || 34.768,
    phone: '',
    instructions: '',
  });
  
  const [dropoff, setDropoff] = useState<Location>({
    address: '',
    lat: -0.1022,
    lng: 34.7617,
    phone: '',
    instructions: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [distance] = useState(5); // km (mock)

  // Calculate estimated fare
  const calculateFare = (): number => {
    if (!selectedType) return 0;
    let fare = selectedType.basePrice + (selectedType.pricePerKm * distance);
    
    // Add size multiplier
    const sizeMultipliers: Record<string, number> = {
      small: 1,
      medium: 1.2,
      large: 1.5,
      extra: 2,
    };
    fare *= sizeMultipliers[packageSize] || 1;
    
    // Add extras
    if (isFragile) fare += 50;
    if (requiresSignature) fare += 30;
    
    return Math.round(fare);
  };

  const handleConfirmDelivery = () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      onBook({
        deliveryType: selectedType.id,
        pickup,
        dropoff,
        packageSize,
        packageDescription,
        isFragile,
        requiresSignature,
        estimatedFare: calculateFare(),
        estimatedTime: selectedType.estimatedTime,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <h2 className="text-xl font-bold">Send a Delivery</h2>
        <p className="text-sm opacity-80">Fast & reliable delivery services</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        {['Type', 'Details', 'Locations', 'Confirm'].map((label, index) => {
          const stepIndex = ['type', 'details', 'locations', 'confirm'].indexOf(step);
          const isActive = index <= stepIndex;
          const isCurrent = index === stepIndex;
          
          return (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              } ${isCurrent ? 'ring-2 ring-blue-200' : ''}`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-8 h-0.5 mx-1 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Delivery Type */}
      {step === 'type' && (
        <div className="p-4">
          <h3 className="font-medium text-gray-700 mb-3">What are you sending?</h3>
          <div className="grid grid-cols-2 gap-3">
            {deliveryOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedType(option)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedType?.id === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">
                  {typeof option.icon === 'string' ? option.icon : option.icon}
                </div>
                <h4 className="font-semibold text-gray-800">{option.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('details')}
            disabled={!selectedType}
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
            <HiArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Package Details */}
      {step === 'details' && (
        <div className="p-4">
          <h3 className="font-medium text-gray-700 mb-3">Package Size</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {packageSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setPackageSize(size.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  packageSize === size.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="text-xl">{size.icon}</span>
                <h4 className="font-medium text-gray-800 text-sm mt-1">{size.name}</h4>
                <p className="text-xs text-gray-500">{size.description}</p>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Package Description</label>
            <textarea
              value={packageDescription}
              onChange={(e) => setPackageDescription(e.target.value)}
              placeholder="What's inside? (e.g., Electronics, Documents, Clothes)"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isFragile}
                onChange={(e) => setIsFragile(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Fragile Item</span>
                <p className="text-xs text-gray-500">Handle with extra care (+KES 50)</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={requiresSignature}
                onChange={(e) => setRequiresSignature(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Require Signature</span>
                <p className="text-xs text-gray-500">Recipient must sign on delivery (+KES 30)</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('type')}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep('locations')}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              Continue
              <HiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Locations */}
      {step === 'locations' && (
        <div className="p-4">
          {/* Pickup */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              Pickup Location
            </h3>
            <input
              type="text"
              placeholder="Pickup address"
              value={pickup.address}
              onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl mb-2 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  placeholder="Pickup phone"
                  value={pickup.phone}
                  onChange={(e) => setPickup({ ...pickup, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Pickup instructions (optional)"
              value={pickup.instructions}
              onChange={(e) => setPickup({ ...pickup, instructions: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-sm mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Connector */}
          <div className="flex items-center justify-center my-2">
            <div className="border-l-2 border-dashed border-gray-300 h-6" />
          </div>

          {/* Dropoff */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <HiLocationMarker className="w-4 h-4 text-red-500" />
              Dropoff Location
            </h3>
            <input
              type="text"
              placeholder="Dropoff address"
              value={dropoff.address}
              onChange={(e) => setDropoff({ ...dropoff, address: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl mb-2 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  placeholder="Recipient phone"
                  value={dropoff.phone}
                  onChange={(e) => setDropoff({ ...dropoff, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Delivery instructions (optional)"
              value={dropoff.instructions}
              onChange={(e) => setDropoff({ ...dropoff, instructions: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-sm mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('details')}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep('confirm')}
              disabled={!pickup.address || !dropoff.address || !pickup.phone || !dropoff.phone}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <HiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 'confirm' && selectedType && (
        <div className="p-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                {typeof selectedType.icon === 'string' ? selectedType.icon : selectedType.icon}
              </div>
              <div>
                <h3 className="font-bold">{selectedType.name} Delivery</h3>
                <p className="text-sm text-gray-500">{packageSizes.find(s => s.id === packageSize)?.name} package</p>
              </div>
            </div>

            {/* Route Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="font-medium text-sm">{pickup.address}</p>
                </div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-4" />
              <div className="flex items-start gap-3">
                <HiLocationMarker className="w-3 h-3 text-red-500 mt-1.5" />
                <div>
                  <p className="text-xs text-gray-500">Dropoff</p>
                  <p className="font-medium text-sm">{dropoff.address}</p>
                </div>
              </div>
            </div>

            {/* Fare */}
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base fare</span>
                <span>KES {selectedType.basePrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distance ({distance} km)</span>
                <span>KES {selectedType.pricePerKm * distance}</span>
              </div>
              {isFragile && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fragile handling</span>
                  <span>KES 50</span>
                </div>
              )}
              {requiresSignature && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Signature required</span>
                  <span>KES 30</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">KES {calculateFare().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-4">
            <HiClock className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Estimated delivery time</p>
              <p className="font-semibold text-blue-600">{selectedType.estimatedTime}</p>
            </div>
          </div>

          {/* Payment */}
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
            <button className="text-sm text-blue-600">Change</button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('locations')}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleConfirmDelivery}
              disabled={isLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding driver...
                </>
              ) : (
                <>
                  <HiTruck className="w-5 h-5" />
                  Send Now
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
