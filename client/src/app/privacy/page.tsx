'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-500 to-secondary-500 py-12">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="opacity-90">Last updated: December 28, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <h2>1. Introduction</h2>
                <p>
                  Welcome to Afrionex. We respect your privacy and are committed to protecting 
                  your personal data. This privacy policy explains how we collect, use, and 
                  safeguard your information when you use our platform.
                </p>

                <h2>2. Information We Collect</h2>
                <h3>Personal Information</h3>
                <p>We may collect the following types of personal information:</p>
                <ul>
                  <li>Name and contact details (email, phone number)</li>
                  <li>Location data for service delivery</li>
                  <li>Payment information (M-Pesa, Airtel Money numbers)</li>
                  <li>Profile photos and verification documents</li>
                  <li>Service preferences and booking history</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <ul>
                  <li>Device information (type, operating system)</li>
                  <li>IP address and browser type</li>
                  <li>Usage patterns and preferences</li>
                  <li>GPS location (with your permission)</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                  <li>Connect you with service providers and vendors</li>
                  <li>Process payments and transactions</li>
                  <li>Send booking confirmations and updates</li>
                  <li>Improve our platform and services</li>
                  <li>Provide customer support</li>
                  <li>Ensure safety and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>4. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul>
                  <li>Service providers you book with (name, phone, location)</li>
                  <li>Payment processors (M-Pesa, Airtel Money)</li>
                  <li>Analytics providers (anonymized data)</li>
                  <li>Law enforcement when legally required</li>
                </ul>
                <p>
                  We never sell your personal data to third parties for marketing purposes.
                </p>

                <h2>5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your data, including:
                </p>
                <ul>
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Staff training on data protection</li>
                </ul>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw consent for location tracking</li>
                </ul>

                <h2>7. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, 
                  remember your preferences, and analyze platform usage. You can control 
                  cookie settings through your browser.
                </p>

                <h2>8. Data Retention</h2>
                <p>
                  We retain your data for as long as your account is active or as needed 
                  to provide services. After account deletion, we may retain certain data 
                  for legal compliance and fraud prevention.
                </p>

                <h2>9. Children's Privacy</h2>
                <p>
                  Afrionex is not intended for users under 18 years of age. We do not 
                  knowingly collect data from children.
                </p>

                <h2>10. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you 
                  of significant changes via email or in-app notification.
                </p>

                <h2>11. Contact Us</h2>
                <p>
                  If you have questions about this privacy policy or your data, contact us at:
                </p>
                <ul>
                  <li>Email: privacy@afrionex.com</li>
                  <li>Phone: +254 700 123 456</li>
                  <li>Address: Oginga Odinga Street, Kisumu, Kenya</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
