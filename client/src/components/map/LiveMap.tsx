'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { HiStar } from 'react-icons/hi';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const providerIcon = createCustomIcon('#006600'); // Green for providers
const userIcon = createCustomIcon('#BB0000'); // Red for user location

interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  location: {
    lat: number;
    lng: number;
    city: string;
    address: string;
  };
  services: string[];
  image?: string;
}

interface LiveMapProps {
  providers: Provider[];
  center?: [number, number];
  zoom?: number;
  showUserLocation?: boolean;
  onProviderClick?: (provider: Provider) => void;
  className?: string;
}

// Component to handle user location tracking
function UserLocationTracker({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationFound(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [map, onLocationFound]);

  return null;
}

// Component to recenter map
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function LiveMap({
  providers,
  center = [-0.0917, 34.7680], // Default: Kisumu, Kenya
  zoom = 13,
  showUserLocation = true,
  onProviderClick,
  className = '',
}: LiveMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`} style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg ${className}`} style={{ minHeight: '400px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location tracking */}
        {showUserLocation && (
          <UserLocationTracker
            onLocationFound={(lat, lng) => setUserLocation([lat, lng])}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-center p-1">
                  <p className="font-semibold text-gray-800">Your Location</p>
                  <p className="text-xs text-gray-500">Live GPS tracking</p>
                </div>
              </Popup>
            </Marker>
            {/* Accuracy circle */}
            <Circle
              center={userLocation}
              radius={100}
              pathOptions={{
                color: '#BB0000',
                fillColor: '#BB0000',
                fillOpacity: 0.1,
              }}
            />
          </>
        )}

        {/* Provider markers */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.location.lat, provider.location.lng]}
            icon={providerIcon}
            eventHandlers={{
              click: () => onProviderClick?.(provider),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{provider.category}</p>
                <div className="flex items-center gap-1 my-1">
                  <HiStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-500">{provider.location.address}</p>
                <p className="text-xs text-gray-500">{provider.location.city}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {provider.services.slice(0, 2).map((service) => (
                    <span
                      key={service}
                      className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#006600]"></div>
          <span>Service Providers</span>
        </div>
        {showUserLocation && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-[#BB0000]"></div>
            <span>Your Location</span>
          </div>
        )}
      </div>

      {/* GPS Status */}
      {showUserLocation && (
        <div className="absolute top-4 right-4 z-[1000]">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
            userLocation ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${userLocation ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            {userLocation ? 'GPS Active' : 'Locating...'}
          </div>
        </div>
      )}
    </div>
  );
}
