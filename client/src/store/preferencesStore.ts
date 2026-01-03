import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User behavior tracking
interface UserBehavior {
  viewedCategories: Record<string, number>;
  viewedServices: string[];
  searchHistory: string[];
  bookingHistory: string[];
  clickedAds: string[];
  timeSpentOnPages: Record<string, number>;
  lastActiveTime: string;
  location: string;
  preferredPaymentMethod?: string;
  priceRange: { min: number; max: number };
}

// Derived preferences from AI analysis
interface UserPreferences {
  topCategories: string[];
  recommendedServices: string[];
  interestScore: Record<string, number>;
  pricePreference: 'budget' | 'mid-range' | 'premium';
  preferredTime: 'morning' | 'afternoon' | 'evening';
  engagementLevel: 'low' | 'medium' | 'high';
}

interface PreferencesState {
  behavior: UserBehavior;
  preferences: UserPreferences;
  isAnalyzing: boolean;
  
  // Tracking actions
  trackCategoryView: (category: string) => void;
  trackServiceView: (serviceId: string) => void;
  trackSearch: (query: string) => void;
  trackBooking: (serviceId: string) => void;
  trackAdClick: (adId: string) => void;
  trackPageTime: (page: string, seconds: number) => void;
  setLocation: (location: string) => void;
  setPaymentMethod: (method: string) => void;
  
  // AI Analysis
  analyzePreferences: () => void;
  getRecommendedServices: () => string[];
  getRecommendedAds: () => string[];
  getPersonalizedGreeting: () => string;
}

// AI scoring weights
const CATEGORY_WEIGHTS = {
  beauty: ['hair', 'makeup', 'nails', 'barbering', 'spa'],
  home: ['cleaning', 'plumbing', 'electrical', 'carpentry', 'painting'],
  wellness: ['massage', 'fitness', 'yoga', 'nutrition', 'therapy'],
  lifestyle: ['tutors', 'events', 'photography', 'catering', 'dj'],
  transport: ['boda', 'taxi', 'car-hire', 'delivery'],
  food: ['restaurants', 'groceries', 'catering', 'bakery'],
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      behavior: {
        viewedCategories: {},
        viewedServices: [],
        searchHistory: [],
        bookingHistory: [],
        clickedAds: [],
        timeSpentOnPages: {},
        lastActiveTime: new Date().toISOString(),
        location: 'Kisumu',
        priceRange: { min: 0, max: 10000 },
      },
      preferences: {
        topCategories: [],
        recommendedServices: [],
        interestScore: {},
        pricePreference: 'mid-range',
        preferredTime: 'afternoon',
        engagementLevel: 'medium',
      },
      isAnalyzing: false,

      trackCategoryView: (category) => {
        set((state) => ({
          behavior: {
            ...state.behavior,
            viewedCategories: {
              ...state.behavior.viewedCategories,
              [category]: (state.behavior.viewedCategories[category] || 0) + 1,
            },
            lastActiveTime: new Date().toISOString(),
          },
        }));
        // Trigger analysis after tracking
        setTimeout(() => get().analyzePreferences(), 100);
      },

      trackServiceView: (serviceId) => {
        set((state) => ({
          behavior: {
            ...state.behavior,
            viewedServices: [...new Set([...state.behavior.viewedServices, serviceId])].slice(-50),
            lastActiveTime: new Date().toISOString(),
          },
        }));
      },

      trackSearch: (query) => {
        set((state) => ({
          behavior: {
            ...state.behavior,
            searchHistory: [...new Set([query, ...state.behavior.searchHistory])].slice(0, 20),
            lastActiveTime: new Date().toISOString(),
          },
        }));
        get().analyzePreferences();
      },

      trackBooking: (serviceId) => {
        set((state) => ({
          behavior: {
            ...state.behavior,
            bookingHistory: [...state.behavior.bookingHistory, serviceId],
            lastActiveTime: new Date().toISOString(),
          },
        }));
        get().analyzePreferences();
      },

      trackAdClick: (adId) => {
        set((state) => ({
          behavior: {
            ...state.behavior,
            clickedAds: [...state.behavior.clickedAds, adId],
            lastActiveTime: new Date().toISOString(),
          },
        }));
      },

      trackPageTime: (page, seconds) => {
        set((state) => ({
          behavior: {
            ...state.behavior,
            timeSpentOnPages: {
              ...state.behavior.timeSpentOnPages,
              [page]: (state.behavior.timeSpentOnPages[page] || 0) + seconds,
            },
          },
        }));
      },

      setLocation: (location) => {
        set((state) => ({
          behavior: { ...state.behavior, location },
        }));
      },

      setPaymentMethod: (method) => {
        set((state) => ({
          behavior: { ...state.behavior, preferredPaymentMethod: method },
        }));
      },

      analyzePreferences: () => {
        set({ isAnalyzing: true });
        
        const { behavior } = get();
        
        // Calculate interest scores using AI-like weighted algorithm
        const interestScore: Record<string, number> = {};
        
        // Weight from category views (highest impact)
        Object.entries(behavior.viewedCategories).forEach(([cat, count]) => {
          interestScore[cat] = (interestScore[cat] || 0) + count * 10;
        });
        
        // Weight from search history
        behavior.searchHistory.forEach((query) => {
          const lowerQuery = query.toLowerCase();
          Object.entries(CATEGORY_WEIGHTS).forEach(([cat, keywords]) => {
            if (keywords.some(kw => lowerQuery.includes(kw))) {
              interestScore[cat] = (interestScore[cat] || 0) + 5;
            }
          });
        });
        
        // Weight from booking history (highest signal)
        behavior.bookingHistory.forEach(() => {
          // In production, would map service to category
          interestScore['booked'] = (interestScore['booked'] || 0) + 20;
        });
        
        // Weight from time spent
        Object.entries(behavior.timeSpentOnPages).forEach(([page, time]) => {
          const category = page.split('/')[1];
          if (category) {
            interestScore[category] = (interestScore[category] || 0) + Math.floor(time / 30);
          }
        });
        
        // Determine top categories
        const topCategories = Object.entries(interestScore)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([cat]) => cat);
        
        // Determine engagement level
        const totalInteractions = 
          Object.values(behavior.viewedCategories).reduce((a, b) => a + b, 0) +
          behavior.searchHistory.length +
          behavior.bookingHistory.length;
        
        const engagementLevel = totalInteractions > 20 ? 'high' : totalInteractions > 5 ? 'medium' : 'low';
        
        // Determine price preference based on behavior
        const pricePreference = behavior.priceRange.max > 5000 ? 'premium' : 
                               behavior.priceRange.max > 2000 ? 'mid-range' : 'budget';
        
        // Determine preferred time based on activity
        const hour = new Date(behavior.lastActiveTime).getHours();
        const preferredTime = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        
        set({
          preferences: {
            topCategories,
            recommendedServices: [], // Would be populated from backend
            interestScore,
            pricePreference,
            preferredTime,
            engagementLevel,
          },
          isAnalyzing: false,
        });
      },

      getRecommendedServices: () => {
        const { preferences } = get();
        return preferences.topCategories;
      },

      getRecommendedAds: () => {
        const { preferences } = get();
        // Return ad categories based on top interests
        return preferences.topCategories.slice(0, 3);
      },

      getPersonalizedGreeting: () => {
        const { preferences, behavior } = get();
        const hour = new Date().getHours();
        const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        
        if (preferences.topCategories.length > 0) {
          const topCat = preferences.topCategories[0];
          return `${timeGreeting}! Looking for ${topCat} services today?`;
        }
        
        return `${timeGreeting}! Welcome to Afrionex`;
      },
    }),
    {
      name: 'afrionex-preferences',
      partialize: (state) => ({ behavior: state.behavior, preferences: state.preferences }),
    }
  )
);
