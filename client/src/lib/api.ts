import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
        const newToken = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Functions

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Providers
export const providersApi = {
  list: (params?: { category?: string; page?: number; limit?: number }) =>
    api.get('/providers', { params }),
  getNearby: (lat: number, lng: number, radius?: number) =>
    api.get('/providers/nearby', { params: { lat, lng, radius } }),
  getById: (id: string) => api.get(`/providers/${id}`),
  getServices: (providerId: string) => api.get(`/providers/${providerId}/services`),
  getReviews: (providerId: string) => api.get(`/providers/${providerId}/reviews`),
};

// Services
export const servicesApi = {
  list: (params?: { category?: string; page?: number; limit?: number }) =>
    api.get('/services', { params }),
  getById: (id: string) => api.get(`/services/${id}`),
  getByCategory: (category: string) => api.get(`/services/category/${category}`),
};

// Bookings
export const bookingsApi = {
  list: (params?: { status?: string; page?: number }) =>
    api.get('/bookings', { params }),
  create: (data: {
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
    address?: string;
  }) => api.post('/bookings', data),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string, reason?: string) =>
    api.patch(`/bookings/${id}/cancel`, { reason }),
  reschedule: (id: string, data: { scheduledDate: string; scheduledTime: string }) =>
    api.patch(`/bookings/${id}/reschedule`, data),
};

// Payments
export const paymentsApi = {
  initiate: (data: {
    bookingId: string;
    method: 'mpesa' | 'airtel_money' | 'card';
    phone?: string;
  }) => api.post('/payments/initiate', data),
  getStatus: (id: string) => api.get(`/payments/${id}/status`),
};

// Reviews
export const reviewsApi = {
  create: (data: {
    bookingId: string;
    rating: number;
    comment: string;
    photos?: string[];
  }) => api.post('/reviews', data),
  getByProvider: (providerId: string) => api.get(`/reviews/provider/${providerId}`),
};

// Search
export const searchApi = {
  search: (params: {
    q?: string;
    category?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    minRating?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => api.get('/search', { params }),
  trending: () => api.get('/search/trending'),
  recommended: () => api.get('/search/recommended'),
};

// Notifications
export const notificationsApi = {
  list: () => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// Subscriptions
export const subscriptionsApi = {
  getPackages: () => api.get('/subscriptions/packages'),
  subscribe: (packageId: string) => api.post('/subscriptions/subscribe', { packageId }),
  cancel: (subscriptionId: string) => api.post(`/subscriptions/${subscriptionId}/cancel`),
};

// User
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
  }>) => api.patch('/users/profile', data),
  updateLocation: (lat: number, lng: number) =>
    api.patch('/users/location', { lat, lng }),
  getBookings: () => api.get('/users/bookings'),
  getLoyalty: () => api.get('/users/loyalty'),
};

// Wallet
export const walletApi = {
  getWallet: () => api.get('/wallet'),
  getTransactions: (params?: { type?: string; page?: number; limit?: number }) =>
    api.get('/wallet/transactions', { params }),
  topUp: (data: { amount: number; method: string; phone?: string }) =>
    api.post('/wallet/topup', data),
  sendMoney: (data: { recipientPhone: string; amount: number; note?: string }) =>
    api.post('/wallet/send', data),
  requestMoney: (data: { fromPhone: string; amount: number; note?: string }) =>
    api.post('/wallet/request', data),
  payBill: (data: { billType: string; accountNumber: string; amount: number; provider?: string }) =>
    api.post('/wallet/pay-bill', data),
};

// Auth password reset
export const passwordApi = {
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; email: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};
