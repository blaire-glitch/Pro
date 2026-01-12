// User types
// Note: Backend Prisma enum uses UPPERCASE roles (CUSTOMER, PROVIDER, ADMIN)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    isActive: boolean;
    plan?: string;
    expiresAt?: string;
  };
}

// Provider types
export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  tagline?: string;
  bio?: string;
  category: string;
  subcategories: string[];
  avatar?: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  yearsExperience: number;
  isVerified: boolean;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  services: Service[];
}

// Service types
export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
}

// Booking types
export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  location: string;
  notes?: string;
  createdAt: string;
}

// Review types
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

// Payment types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'mpesa' | 'airtel_money' | 'card' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
