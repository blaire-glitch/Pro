'use client';

import { useState, useEffect } from 'react';
import { HiBell, HiCheck, HiExclamation, HiX } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import {
  isPushSupported,
  requestNotificationPermission,
  getNotificationPermission,
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
  sendSubscriptionToServer,
} from '@/lib/pushNotifications';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  compact?: boolean;
}

export function NotificationSettings({ compact = false }: NotificationSettingsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const checkStatus = async () => {
      const supported = isPushSupported();
      setIsSupported(supported);
      
      if (supported) {
        setPermission(getNotificationPermission());
        
        // Check if already subscribed
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    };
    
    checkStatus();
  }, []);

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported on this device');
      return;
    }

    setLoading(true);
    
    try {
      // Request permission
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      
      if (newPermission !== 'granted') {
        toast.error('Notification permission denied');
        return;
      }
      
      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        toast.error('Failed to register service worker');
        return;
      }
      
      // Subscribe to push
      const subscription = await subscribeToPush(registration);
      if (!subscription) {
        toast.error('Failed to subscribe to push notifications');
        return;
      }
      
      // Send to server
      if (accessToken) {
        await sendSubscriptionToServer(subscription, accessToken);
      }
      
      setIsSubscribed(true);
      toast.success('Notifications enabled!');
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    
    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
      toast.success('Notifications disabled');
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      toast.error('Failed to disable notifications');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    if (compact) return null;
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <HiExclamation className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Push notifications are not supported on this device/browser.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={isSubscribed ? handleDisableNotifications : handleEnableNotifications}
        disabled={loading || permission === 'denied'}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isSubscribed
            ? 'bg-primary-100 text-primary-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubscribed ? (
          <>
            <HiBell className="w-5 h-5" />
            <span>Notifications On</span>
          </>
        ) : (
          <>
            <HiX className="w-5 h-5" />
            <span>Enable Notifications</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Push Notifications</h3>
          <p className="text-sm text-gray-600">
            Get instant updates about bookings, messages, and payments
          </p>
        </div>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSubscribed ? 'bg-primary-100' : 'bg-gray-100'
        }`}>
          {isSubscribed ? (
            <HiBell className="w-6 h-6 text-primary-600" />
          ) : (
            <HiX className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {permission === 'denied' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        ) : isSubscribed ? (
          <>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <HiCheck className="w-4 h-4" />
              <span>Notifications are enabled</span>
            </div>
            <button
              onClick={handleDisableNotifications}
              disabled={loading}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable Notifications'}
            </button>
          </>
        ) : (
          <button
            onClick={handleEnableNotifications}
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Enabling...'
            ) : (
              <>
                <HiBell className="w-5 h-5" />
                Enable Push Notifications
              </>
            )}
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          You'll receive notifications for:
        </p>
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li>• Booking confirmations & updates</li>
          <li>• Provider arrival alerts</li>
          <li>• New messages</li>
          <li>• Payment confirmations</li>
          <li>• Special offers & promotions</li>
        </ul>
      </div>
    </div>
  );
}
