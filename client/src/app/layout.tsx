import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import { FloatingCart } from '@/components/marketplace/FloatingCart';
import { BackToTop } from '@/components/ui/BackToTop';
import { QuickActionFAB } from '@/components/ui/QuickActionFAB';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { AIChatBot } from '@/components/chat/AIChatBot';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Afrionex - The Next-Generation Super App for Africa',
  description: 'Afrionex is a next-generation super app designed to simplify life across Africa. One platform, one wallet, one seamless experience.',
  keywords: ['super app', 'Africa', 'services', 'payments', 'booking', 'Kenya', 'marketplace', 'digital', 'fintech'],
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
  manifest: '/manifest.json',
  themeColor: '#059669',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Afrionex',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Providers>
          <SplashScreen />
          {children}
          <FloatingCart />
          <QuickActionFAB />
          <BackToTop />
          <AIChatBot />
          <PWAInstallPrompt />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
