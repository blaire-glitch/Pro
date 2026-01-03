// Afrionex - Shared Utilities

import { CURRENCIES, LOYALTY_TIERS } from '../constants';
import type { Currency, Location, LoyaltyPoints } from '../types';

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currency: Currency = 'KES'): string {
  const currencyInfo = CURRENCIES[currency];
  return `${currencyInfo.symbol} ${amount.toLocaleString()}`;
}

/**
 * Calculate distance between two locations using Haversine formula
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const lat1 = toRad(loc1.latitude);
  const lat2 = toRad(loc2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Generate a ShareLink for providers
 */
export function generateShareLink(providerId: string, providerName: string): string {
  const slug = providerName.toLowerCase().replace(/\s+/g, '-');
  return `https://afrionex.com/p/${slug}-${providerId.slice(0, 8)}`;
}

/**
 * Format phone number for M-Pesa (Kenyan format)
 */
export function formatPhoneForMpesa(phone: string): string {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.slice(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
}

/**
 * Calculate loyalty tier based on points
 */
export function calculateLoyaltyTier(points: number): keyof typeof LOYALTY_TIERS {
  if (points >= LOYALTY_TIERS.platinum.minPoints) return 'platinum';
  if (points >= LOYALTY_TIERS.gold.minPoints) return 'gold';
  if (points >= LOYALTY_TIERS.silver.minPoints) return 'silver';
  return 'bronze';
}

/**
 * Calculate points earned for a booking
 */
export function calculatePointsEarned(
  amount: number,
  loyalty: LoyaltyPoints
): number {
  const tier = LOYALTY_TIERS[loyalty.tier];
  const basePoints = Math.floor(amount / 100); // 1 point per 100 currency units
  return Math.floor(basePoints * tier.multiplier);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Calculate average rating
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * Generate time slots for booking
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  
  let currentMinutes = startHours * 60 + startMins;
  const endMinutes = endHours * 60 + endMins;
  
  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    currentMinutes += intervalMinutes;
  }
  
  return slots;
}

/**
 * Validate Kenyan phone number
 */
export function isValidKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Kenyan numbers: 254XXXXXXXXX or 0XXXXXXXXX
  return /^(254|0)?[17]\d{8}$/.test(cleaned);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
