'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  HiLocationMarker, HiPhone, HiChat, HiClock, 
  HiTruck, HiCheck, HiX, HiRefresh, HiStar
} from 'react-icons/hi';

interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: Date;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: string;
  vehiclePlate: string;
  rating: number;
  totalTrips: number;
}

interface OrderTrackerProps {
  orderId: string;
  orderType: 'delivery' | 'ride';
  status: 'searching' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
  driver?: Driver;
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  estimatedTime?: number; // minutes
  estimatedFare: number;
  onCancel?: () => void;
  onContactDriver?: () => void;
}

const statusSteps = {
  delivery: [
    { key: 'searching', label: 'Finding Driver', icon: HiRefresh },
    { key: 'accepted', label: 'Driver Assigned', icon: HiCheck },
    { key: 'arriving', label: 'Picking Up', icon: HiTruck },
    { key: 'in_progress', label: 'In Transit', icon: HiTruck },
    { key: 'completed', label: 'Delivered', icon: HiCheck },
  ],
  ride: [
    { key: 'searching', label: 'Finding Driver', icon: HiRefresh },
    { key: 'accepted', label: 'Driver Assigned', icon: HiCheck },
    { key: 'arriving', label: 'Driver Arriving', icon: HiTruck },
    { key: 'in_progress', label: 'On Trip', icon: HiTruck },
    { key: 'completed', label: 'Arrived', icon: HiCheck },
  ],
};

export function OrderTracker({
  orderId,
  orderType,
  status,
  driver,
  pickupLocation,
  dropoffLocation,
  estimatedTime,
  estimatedFare,
  onCancel,
  onContactDriver,
}: OrderTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<TrackingLocation | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time location updates
  useEffect(() => {
    if (status === 'in_progress' || status === 'arriving') {
      const interval = setInterval(() => {
        // Simulate driver movement
        setCurrentLocation(prev => {
          if (!prev) {
            return {
              lat: pickupLocation.lat,
              lng: pickupLocation.lng,
              timestamp: new Date(),
            };
          }
          // Move towards dropoff
          const latDiff = dropoffLocation.lat - prev.lat;
          const lngDiff = dropoffLocation.lng - prev.lng;
          return {
            lat: prev.lat + latDiff * 0.1,
            lng: prev.lng + lngDiff * 0.1,
            timestamp: new Date(),
          };
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [status, pickupLocation, dropoffLocation]);

  const steps = statusSteps[orderType];
  const currentStepIndex = steps.findIndex(s => s.key === status);

  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'bg-green-500';
    if (stepIndex === currentStepIndex) return 'bg-blue-500 animate-pulse';
    return 'bg-gray-300';
  };

  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
      case 'motorcycle':
        return 'M';
      case 'tuk-tuk':
        return 'T';
      case 'car':
        return 'C';
      case 'van':
        return 'V';
      case 'bicycle':
        return 'B';
      default:
        return 'D';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className={`p-4 ${status === 'cancelled' ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-secondary-500'}`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-80">Order #{orderId.slice(0, 8)}</p>
            <h3 className="text-lg font-semibold">
              {orderType === 'delivery' ? 'Delivery Tracking' : 'Ride Tracking'}
            </h3>
          </div>
          {isLive && status !== 'completed' && status !== 'cancelled' && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span className="text-sm">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(index)}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {isCurrent && (
                    <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-25 animate-ping" />
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${isActive ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`absolute h-0.5 w-full ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Info */}
      {driver && status !== 'searching' && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={driver.avatar} 
                alt={driver.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                {getVehicleIcon(driver.vehicleType)}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{driver.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center"><HiStar className="w-4 h-4 text-yellow-500" /> {driver.rating}</span>
                <span>•</span>
                <span>{driver.totalTrips} trips</span>
              </div>
              <p className="text-sm text-gray-600">{driver.vehiclePlate}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onContactDriver}
                className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
              >
                <HiPhone className="w-5 h-5" />
              </button>
              <button 
                onClick={onContactDriver}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                <HiChat className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locations */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {orderType === 'delivery' ? 'Pickup' : 'From'}
            </p>
            <p className="text-gray-800 font-medium">{pickupLocation.address}</p>
          </div>
        </div>
        
        <div className="ml-4 border-l-2 border-dashed border-gray-200 h-4" />
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <HiLocationMarker className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {orderType === 'delivery' ? 'Dropoff' : 'To'}
            </p>
            <p className="text-gray-800 font-medium">{dropoffLocation.address}</p>
          </div>
        </div>
      </div>

      {/* ETA and Fare */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiClock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Estimated Time</p>
              <p className="font-semibold text-gray-800">
                {estimatedTime ? `${estimatedTime} min` : 'Calculating...'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Fare</p>
            <p className="font-bold text-lg text-primary-600">
              KES {estimatedFare.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {status !== 'completed' && status !== 'cancelled' && (
        <div className="p-4 border-t">
          <button
            onClick={onCancel}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <HiX className="w-5 h-5" />
            Cancel {orderType === 'delivery' ? 'Delivery' : 'Ride'}
          </button>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && (
        <div className="p-4 bg-green-50 border-t">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-green-800">
              {orderType === 'delivery' ? 'Delivered Successfully!' : 'Trip Completed!'}
            </h4>
            <p className="text-sm text-green-600 mt-1">Thank you for using Afrionex</p>
          </div>
        </div>
      )}
    </div>
  );
}
