'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary-500 to-primary-500 py-12">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="opacity-90">Last updated: December 28, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Afrionex, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                  Afrionex is a platform that connects users with local service providers, 
                  vendors, and delivery services in Western Kenya. We facilitate bookings, 
                  transactions, and communications but are not the direct provider of services.
                </p>

                <h2>3. User Accounts</h2>
                <h3>Registration</h3>
                <ul>
                  <li>You must provide accurate and complete information</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One person may not have multiple accounts</li>
                </ul>

                <h3>Account Responsibilities</h3>
                <ul>
                  <li>Keep your login credentials confidential</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>

                <h2>4. Service Provider Terms</h2>
                <p>If you register as a service provider, you agree to:</p>
                <ul>
                  <li>Provide accurate business information</li>
                  <li>Maintain required licenses and certifications</li>
                  <li>Deliver services as described and agreed</li>
                  <li>Respond to bookings in a timely manner</li>
                  <li>Maintain professional conduct with customers</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>

                <h2>5. Customer Terms</h2>
                <p>As a customer, you agree to:</p>
                <ul>
                  <li>Provide accurate booking information</li>
                  <li>Be present and available for scheduled services</li>
                  <li>Pay for services as agreed</li>
                  <li>Treat service providers with respect</li>
                  <li>Provide honest reviews and feedback</li>
                </ul>

                <h2>6. Marketplace Terms</h2>
                <p>For vendors and buyers on our marketplace:</p>
                <ul>
                  <li>Vendors must accurately describe products</li>
                  <li>Vendors are responsible for product quality and delivery</li>
                  <li>Buyers must pay for orders upon confirmation</li>
                  <li>Returns and refunds are subject to vendor policies</li>
                </ul>

                <h2>7. Payments</h2>
                <h3>Payment Processing</h3>
                <ul>
                  <li>We support M-Pesa and Airtel Money payments</li>
                  <li>Service fees are deducted from provider earnings</li>
                  <li>Payouts are processed according to our schedule</li>
                </ul>

                <h3>Cancellations & Refunds</h3>
                <ul>
                  <li>Cancellation policies vary by service type</li>
                  <li>Refunds are processed within 5-7 business days</li>
                  <li>No-shows may result in partial charges</li>
                </ul>

                <h2>8. Prohibited Conduct</h2>
                <p>Users may not:</p>
                <ul>
                  <li>Provide false or misleading information</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Circumvent platform fees or policies</li>
                  <li>Use the platform for illegal activities</li>
                  <li>Copy or misuse our intellectual property</li>
                  <li>Attempt to manipulate reviews or ratings</li>
                </ul>

                <h2>9. Content Guidelines</h2>
                <p>User-generated content must not:</p>
                <ul>
                  <li>Be defamatory, obscene, or offensive</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Contain malware or harmful code</li>
                  <li>Include spam or promotional content</li>
                </ul>

                <h2>10. Limitation of Liability</h2>
                <p>
                  Afrionex acts as a platform connecting users and is not liable for:
                </p>
                <ul>
                  <li>Quality of services provided by third parties</li>
                  <li>Disputes between users and service providers</li>
                  <li>Losses due to service cancellations or no-shows</li>
                  <li>Technical issues beyond our reasonable control</li>
                </ul>

                <h2>11. Indemnification</h2>
                <p>
                  You agree to indemnify Afrionex against any claims, damages, or expenses 
                  arising from your use of the platform or violation of these terms.
                </p>

                <h2>12. Termination</h2>
                <p>
                  We may suspend or terminate accounts that violate these terms. Users may 
                  delete their accounts at any time through account settings.
                </p>

                <h2>13. Dispute Resolution</h2>
                <p>
                  Disputes shall be resolved through mediation first. If mediation fails, 
                  disputes will be settled under the laws of Kenya in Kisumu courts.
                </p>

                <h2>14. Changes to Terms</h2>
                <p>
                  We may modify these terms at any time. Continued use after changes 
                  constitutes acceptance of new terms.
                </p>

                <h2>15. Contact Information</h2>
                <p>For questions about these terms:</p>
                <ul>
                  <li>Email: legal@afrionex.com</li>
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
