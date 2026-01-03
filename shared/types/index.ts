// Afrionex - Shared Types

// ============ USER TYPES ============
export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  location?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

// ============ SERVICE CATEGORIES ============
export type ServiceCategory = 
  | 'beauty'
  | 'home'
  | 'wellness'
  | 'lifestyle'
  | 'delivery'
  | 'transport';

export type BeautySubcategory = 'hair' | 'makeup' | 'nails' | 'barbering';
export type HomeSubcategory = 'cleaning' | 'plumbing' | 'electrical' | 'carpentry';
export type WellnessSubcategory = 'massage' | 'spa' | 'fitness';
export type LifestyleSubcategory = 'tutoring' | 'events' | 'photography';
export type DeliverySubcategory = 'package' | 'food' | 'grocery' | 'document' | 'moving';
export type TransportSubcategory = 'boda_boda' | 'tuktuk' | 'taxi' | 'car_hire' | 'shuttle' | 'airport_transfer';

export type ServiceSubcategory = 
  | BeautySubcategory 
  | HomeSubcategory 
  | WellnessSubcategory 
  | LifestyleSubcategory
  | DeliverySubcategory
  | TransportSubcategory;

// ============ PROVIDER TYPES ============
export interface Provider {
  id: string;
  userId: string;
  user: User;
  businessName: string;
  description: string;
  category: ServiceCategory;
  subcategories: ServiceSubcategory[];
  services: Service[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationDocuments?: string[];
  workingHours: WorkingHours[];
  location: Location;
  shareLink: string;
  gallery: string[];
  badges: ProviderBadge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderBadge {
  id: string;
  name: string;
  icon: string;
  earnedAt: Date;
}

export interface WorkingHours {
  day: number; // 0-6 (Sunday-Saturday)
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
}

// ============ SERVICE TYPES ============
export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  subcategory: ServiceSubcategory;
  price: number;
  currency: Currency;
  duration: number; // in minutes
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Currency = 'KES' | 'UGX' | 'TZS' | 'RWF' | 'USD';

// ============ BOOKING TYPES ============
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Booking {
  id: string;
  customerId: string;
  customer: User;
  providerId: string;
  provider: Provider;
  serviceId: string;
  service: Service;
  status: BookingStatus;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  location: Location;
  isInstantBooking: boolean;
  notes?: string;
  totalAmount: number;
  currency: Currency;
  payment?: Payment;
  review?: Review;
  createdAt: Date;
  updatedAt: Date;
}

// ============ PAYMENT TYPES ============
export type PaymentMethod = 'mpesa' | 'airtel_money' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  mpesaReceiptNumber?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============ REVIEW TYPES ============
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customer: User;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  response?: string; // Provider's response
  respondedAt?: Date;
  isVerified: boolean; // Verified purchase
  createdAt: Date;
  updatedAt: Date;
}

// ============ SUBSCRIPTION TYPES ============
export type SubscriptionTier = 'basic' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  services: string[]; // Service IDs
  frequency: 'weekly' | 'biweekly' | 'monthly';
  price: number;
  currency: Currency;
  discountPercent: number;
}

// ============ LOYALTY & REWARDS ============
export interface LoyaltyPoints {
  userId: string;
  points: number;
  lifetimePoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_service' | 'cashback';
  value: number;
  expiresAt: Date;
}

// ============ NOTIFICATION TYPES ============
export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'booking_cancelled'
  | 'payment_received'
  | 'new_review'
  | 'promotion'
  | 'sos_alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

// ============ ANALYTICS TYPES ============
export interface ProviderAnalytics {
  providerId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  averageRating: number;
  newReviews: number;
  profileViews: number;
  conversionRate: number;
}

// ============ SEARCH & FILTER TYPES ============
export interface SearchFilters {
  query?: string;
  category?: ServiceCategory;
  subcategory?: ServiceSubcategory;
  location?: Location;
  radius?: number; // in km
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isVerified?: boolean;
  isInstantBooking?: boolean;
  sortBy?: 'rating' | 'price_low' | 'price_high' | 'distance' | 'popularity';
}

export interface SearchResult {
  providers: Provider[];
  services: Service[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ AUTH TYPES ============
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// ============ DELIVERY TYPES ============
export type DeliveryType = 'package' | 'food' | 'grocery' | 'document' | 'moving';
export type PackageSize = 'small' | 'medium' | 'large' | 'extra_large';
export type DeliveryStatus = 'pending' | 'accepted' | 'picking_up' | 'in_transit' | 'delivered' | 'cancelled' | 'failed';

export interface DeliveryOrder {
  id: string;
  customerId: string;
  driverId?: string;
  deliveryType: DeliveryType;
  packageSize: PackageSize;
  isFragile: boolean;
  requiresSignature: boolean;
  pickupLocation: DeliveryLocation;
  dropoffLocation: DeliveryLocation;
  packageDescription?: string;
  estimatedWeight?: number;
  status: DeliveryStatus;
  estimatedFare: number;
  finalFare?: number;
  currency: Currency;
  distance: number;
  estimatedDuration: number;
  trackingCode: string;
  currentLatitude?: number;
  currentLongitude?: number;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

export interface DeliveryLocation {
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  instructions?: string;
}

// ============ TRANSPORT TYPES ============
export type RideType = 'boda_boda' | 'tuk_tuk' | 'taxi' | 'car_hire' | 'shuttle' | 'airport_transfer';
export type VehicleType = 'motorcycle' | 'tuk_tuk' | 'car' | 'suv' | 'van' | 'bicycle';
export type RideStatus = 'pending' | 'searching' | 'accepted' | 'driver_arriving' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface RideRequest {
  id: string;
  customerId: string;
  driverId?: string;
  rideType: RideType;
  pickupLocation: RideLocation;
  dropoffLocation: RideLocation;
  stops?: RideLocation[];
  passengerCount: number;
  passengerPhone?: string;
  status: RideStatus;
  estimatedFare: number;
  finalFare?: number;
  currency: Currency;
  distance: number;
  estimatedDuration: number;
  surgeMultiplier: number;
  currentLatitude?: number;
  currentLongitude?: number;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  arrivedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  cancellationFee?: number;
}

export interface RideLocation {
  address: string;
  latitude: number;
  longitude: number;
  name?: string;
}

export interface Driver {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehicleModel?: string;
  vehiclePlate: string;
  vehicleColor?: string;
  licenseNumber: string;
  isVerified: boolean;
  isOnline: boolean;
  isAvailable: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: Date;
  rating: number;
  totalDeliveries: number;
  totalRides: number;
  createdAt: Date;
  updatedAt: Date;
}
