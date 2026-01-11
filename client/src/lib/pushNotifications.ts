// Push Notification Utilities for Afrionex PWA

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return 'denied';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
}

// Get current notification permission status
export function getNotificationPermission(): NotificationPermission {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers not supported');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPush(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
  try {
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      return subscription;
    }
    
    // Convert VAPID key
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    
    console.log('Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Push unsubscription failed:', error);
    return false;
  }
}

// Send subscription to server
export async function sendSubscriptionToServer(
  subscription: PushSubscription,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    return false;
  }
}

// Show local notification (fallback for when push isn't available)
export function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    return null;
  }
  
  return new Notification(title, {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    ...options,
  });
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Notification types for Afrionex
export type AfriNotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'provider_arriving'
  | 'service_completed'
  | 'payment_received'
  | 'payment_sent'
  | 'new_message'
  | 'new_review'
  | 'promo_offer';

export interface AfriNotification {
  type: AfriNotificationType;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, unknown>;
}

// Create notification based on type
export function createNotification(notification: AfriNotification): NotificationOptions {
  const icons: Record<AfriNotificationType, string> = {
    booking_confirmed: '/icons/booking.png',
    booking_cancelled: '/icons/cancelled.png',
    provider_arriving: '/icons/arriving.png',
    service_completed: '/icons/completed.png',
    payment_received: '/icons/payment.png',
    payment_sent: '/icons/payment.png',
    new_message: '/icons/message.png',
    new_review: '/icons/review.png',
    promo_offer: '/icons/promo.png',
  };
  
  return {
    body: notification.body,
    icon: notification.icon || icons[notification.type] || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: notification.type,
    renotify: true,
    data: {
      url: notification.url || '/',
      ...notification.data,
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'View' },
      { action: 'close', title: 'Dismiss' },
    ],
  };
}
