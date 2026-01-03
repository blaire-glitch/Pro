// Afrionex - Shared Constants

export const SERVICE_CATEGORIES = {
  beauty: {
    name: 'Beauty',
    icon: 'beauty',
    color: '#FF6B9D',
    subcategories: {
      hair: { name: 'Hair', icon: 'scissors' },
      makeup: { name: 'Makeup', icon: 'lipstick' },
      nails: { name: 'Nails', icon: 'nails' },
      barbering: { name: 'Barbering', icon: 'barber' },
    },
  },
  home: {
    name: 'Home Services',
    icon: 'home',
    color: '#4ECDC4',
    subcategories: {
      cleaning: { name: 'Cleaning', icon: 'broom' },
      plumbing: { name: 'Plumbing', icon: 'wrench' },
      electrical: { name: 'Electrical', icon: 'bulb' },
      carpentry: { name: 'Carpentry', icon: 'saw' },
    },
  },
  wellness: {
    name: 'Wellness',
    icon: 'wellness',
    color: '#95E1D3',
    subcategories: {
      massage: { name: 'Massage', icon: 'massage' },
      spa: { name: 'Spa', icon: 'bath' },
      fitness: { name: 'Fitness', icon: 'muscle' },
    },
  },
  lifestyle: {
    name: 'Lifestyle',
    icon: 'sparkle',
    color: '#F38181',
    subcategories: {
      tutoring: { name: 'Tutoring', icon: 'book' },
      events: { name: 'Events', icon: 'party' },
      photography: { name: 'Photography', icon: 'camera' },
    },
  },
} as const;

export const CURRENCIES = {
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', code: 'KES' },
  UGX: { name: 'Ugandan Shilling', symbol: 'USh', code: 'UGX' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', code: 'TZS' },
  RWF: { name: 'Rwandan Franc', symbol: 'FRw', code: 'RWF' },
  USD: { name: 'US Dollar', symbol: '$', code: 'USD' },
} as const;

export const PAYMENT_METHODS = {
  mpesa: { name: 'M-Pesa', icon: 'mpesa', color: '#4CAF50' },
  airtel_money: { name: 'Airtel Money', icon: 'airtel', color: '#E53935' },
  card: { name: 'Card', icon: 'card', color: '#2196F3' },
  wallet: { name: 'Wallet', icon: 'wallet', color: '#FF9800' },
} as const;

export const BOOKING_STATUSES = {
  pending: { name: 'Pending', color: '#FFC107' },
  confirmed: { name: 'Confirmed', color: '#4CAF50' },
  in_progress: { name: 'In Progress', color: '#2196F3' },
  completed: { name: 'Completed', color: '#4CAF50' },
  cancelled: { name: 'Cancelled', color: '#F44336' },
  no_show: { name: 'No Show', color: '#9E9E9E' },
} as const;

export const LOYALTY_TIERS = {
  bronze: { name: 'Bronze', minPoints: 0, multiplier: 1, color: '#CD7F32' },
  silver: { name: 'Silver', minPoints: 500, multiplier: 1.5, color: '#C0C0C0' },
  gold: { name: 'Gold', minPoints: 2000, multiplier: 2, color: '#FFD700' },
  platinum: { name: 'Platinum', minPoints: 5000, multiplier: 3, color: '#E5E4E2' },
} as const;

export const PROVIDER_BADGES = {
  verified: { name: 'Verified', icon: 'check', description: 'Identity verified' },
  top_rated: { name: 'Top Rated', icon: 'star', description: 'Consistently high ratings' },
  fast_responder: { name: 'Fast Responder', icon: 'bolt', description: 'Responds within 1 hour' },
  experienced: { name: 'Experienced', icon: 'trophy', description: '100+ completed bookings' },
  new_provider: { name: 'New', icon: 'new', description: 'Joined recently' },
} as const;

export const APP_CONFIG = {
  name: 'Afrionex',
  tagline: 'The Next-Generation Super App for Africa',
  defaultCurrency: 'KES' as const,
  defaultCountry: 'Kenya',
  supportEmail: 'support@afrionex.com',
  supportPhone: '+254700000000',
  commissionRate: 0.15, // 15% commission
  instantBookingRadius: 5, // km
  maxSearchRadius: 50, // km
  pointsPerBooking: 10,
  referralBonus: 100, // points
  operatingCities: ['Kisumu', 'Kakamega', 'Bungoma', 'Busia'] as const,
  headquarters: 'Kisumu, Kenya',
  launchRegion: 'Western Kenya',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    verifyPhone: '/auth/verify-phone',
  },
  users: {
    profile: '/users/profile',
    update: '/users/update',
    location: '/users/location',
  },
  providers: {
    list: '/providers',
    detail: '/providers/:id',
    search: '/providers/search',
    nearby: '/providers/nearby',
    services: '/providers/:id/services',
    reviews: '/providers/:id/reviews',
    analytics: '/providers/:id/analytics',
  },
  services: {
    list: '/services',
    detail: '/services/:id',
    byCategory: '/services/category/:category',
  },
  bookings: {
    list: '/bookings',
    create: '/bookings',
    detail: '/bookings/:id',
    cancel: '/bookings/:id/cancel',
    reschedule: '/bookings/:id/reschedule',
  },
  payments: {
    initiate: '/payments/initiate',
    confirm: '/payments/confirm',
    status: '/payments/:id/status',
    mpesaCallback: '/payments/mpesa/callback',
  },
  reviews: {
    create: '/reviews',
    respond: '/reviews/:id/respond',
  },
  notifications: {
    list: '/notifications',
    markRead: '/notifications/:id/read',
    markAllRead: '/notifications/read-all',
  },
} as const;
