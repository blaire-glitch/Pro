import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// For testing, use the emulator
// For production, use service account credentials

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    // Check if running with emulator
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'afrionex-test',
      });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Production: Use service account JSON
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Production: Use default credentials
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      console.warn('Firebase not configured. Push notifications disabled.');
      return null;
    }

    console.log('Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  badge?: number;
}

interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send push notification to a single device
 */
export const sendPushNotification = async (
  fcmToken: string,
  payload: PushNotificationPayload
): Promise<NotificationResult> => {
  if (!firebaseApp) {
    console.warn('Firebase not initialized. Skipping push notification.');
    return { success: false, error: 'Firebase not configured' };
  }

  const message: admin.messaging.Message = {
    token: fcmToken,
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.imageUrl,
    },
    data: payload.data,
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      },
    },
    apns: {
      payload: {
        aps: {
          badge: payload.badge,
          sound: 'default',
        },
      },
    },
    webpush: {
      notification: {
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error: any) {
    console.error('Push notification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send push notifications to multiple devices
 */
export const sendMulticastNotification = async (
  fcmTokens: string[],
  payload: PushNotificationPayload
): Promise<{ successCount: number; failureCount: number }> => {
  if (!firebaseApp || fcmTokens.length === 0) {
    return { successCount: 0, failureCount: fcmTokens.length };
  }

  const message: admin.messaging.MulticastMessage = {
    tokens: fcmTokens,
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.imageUrl,
    },
    data: payload.data,
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          badge: payload.badge,
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Multicast notification error:', error);
    return { successCount: 0, failureCount: fcmTokens.length };
  }
};

/**
 * Send notification to a topic
 */
export const sendTopicNotification = async (
  topic: string,
  payload: PushNotificationPayload
): Promise<NotificationResult> => {
  if (!firebaseApp) {
    return { success: false, error: 'Firebase not configured' };
  }

  const message: admin.messaging.Message = {
    topic,
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.imageUrl,
    },
    data: payload.data,
  };

  try {
    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error: any) {
    console.error('Topic notification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe device to a topic
 */
export const subscribeToTopic = async (
  fcmTokens: string[],
  topic: string
): Promise<boolean> => {
  if (!firebaseApp) return false;

  try {
    await admin.messaging().subscribeToTopic(fcmTokens, topic);
    return true;
  } catch (error) {
    console.error('Topic subscription error:', error);
    return false;
  }
};

/**
 * Unsubscribe device from a topic
 */
export const unsubscribeFromTopic = async (
  fcmTokens: string[],
  topic: string
): Promise<boolean> => {
  if (!firebaseApp) return false;

  try {
    await admin.messaging().unsubscribeFromTopic(fcmTokens, topic);
    return true;
  } catch (error) {
    console.error('Topic unsubscription error:', error);
    return false;
  }
};

// Notification templates for common events
export const NotificationTemplates = {
  bookingConfirmed: (serviceName: string, date: string) => ({
    title: 'Booking Confirmed! ✅',
    body: `Your ${serviceName} booking for ${date} has been confirmed.`,
    data: { type: 'booking_confirmed' },
  }),

  bookingCancelled: (serviceName: string) => ({
    title: 'Booking Cancelled',
    body: `Your ${serviceName} booking has been cancelled.`,
    data: { type: 'booking_cancelled' },
  }),

  paymentReceived: (amount: number) => ({
    title: 'Payment Received 💰',
    body: `KES ${amount.toLocaleString()} has been added to your wallet.`,
    data: { type: 'payment_received' },
  }),

  newBookingRequest: (customerName: string, serviceName: string) => ({
    title: 'New Booking Request! 🔔',
    body: `${customerName} wants to book ${serviceName}.`,
    data: { type: 'new_booking' },
  }),

  providerVerified: () => ({
    title: 'Account Verified! 🎉',
    body: 'Your provider account has been verified. You can now start accepting bookings!',
    data: { type: 'provider_verified' },
  }),

  newReview: (rating: number, serviceName: string) => ({
    title: `New ${rating}⭐ Review`,
    body: `You received a new review for ${serviceName}.`,
    data: { type: 'new_review' },
  }),

  promotionalOffer: (title: string, discount: string) => ({
    title: `🎁 ${title}`,
    body: `Get ${discount} off on selected services. Limited time offer!`,
    data: { type: 'promo' },
  }),
};

export default {
  initializeFirebase,
  sendPushNotification,
  sendMulticastNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  NotificationTemplates,
};
