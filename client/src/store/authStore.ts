import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Separate axios instance for auth to avoid circular dependency
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Demo accounts for testing (works without backend)
        const demoAccounts: Record<string, { password: string; user: User }> = {
          'admin@afrionex.com': {
            password: 'admin123',
            user: {
              id: 'demo-admin-1',
              email: 'admin@afrionex.com',
              firstName: 'Admin',
              lastName: 'User',
              phone: '+254700000001',
              role: 'admin',
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              subscription: { isActive: true, plan: 'premium' },
            },
          },
          'customer@test.com': {
            password: 'customer123',
            user: {
              id: 'demo-customer-1',
              email: 'customer@test.com',
              firstName: 'Jane',
              lastName: 'Achieng',
              phone: '+254700000002',
              role: 'customer',
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              subscription: { isActive: true, plan: 'basic' },
            },
          },
        };

        // Try API login first
        try {
          const response = await authAxios.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = response.data.data;
          
          // Store refresh token in localStorage
          localStorage.setItem('refreshToken', refreshToken);
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        } catch (error: any) {
          // If API fails, try demo accounts as fallback
          const demoAccount = demoAccounts[email];
          if (demoAccount && demoAccount.password === password) {
            set({
              user: demoAccount.user,
              accessToken: 'demo-token-' + Date.now(),
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
          
          // Check if it's a demo account with wrong password
          if (demoAccount) {
            set({
              error: 'Invalid password for demo account',
              isLoading: false,
            });
            throw new Error('Invalid password');
          }
          
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAxios.post('/auth/register', data);
          const { user, accessToken, refreshToken } = response.data.data;
          
          localStorage.setItem('refreshToken', refreshToken);
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await authAxios.post('/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('refreshToken', newRefreshToken);
          
          set({ accessToken });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
