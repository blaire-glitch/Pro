'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiSearch, HiChevronDown, HiChevronUp,
  HiQuestionMarkCircle, HiCreditCard, HiCalendar, HiShieldCheck,
  HiPhone, HiMail, HiChat, HiLocationMarker
} from 'react-icons/hi';

const faqs = [
  {
    category: 'Getting Started',
    icon: HiQuestionMarkCircle,
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Download the Afrionex app or visit our website, click "Sign Up", enter your phone number or email, and follow the verification steps. It takes less than 2 minutes!'
      },
      {
        question: 'How do I book a service?',
        answer: 'Search for the service you need, browse providers in your area, select a date and time, and confirm your booking. You can pay via M-Pesa or Airtel Money.'
      },
      {
        question: 'Which areas do you cover?',
        answer: 'We currently operate in Kisumu, Kakamega, Bungoma, and Busia. We\'re expanding to more areas in Western Kenya soon!'
      },
    ]
  },
  {
    category: 'Payments',
    icon: HiCreditCard,
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept M-Pesa and Airtel Money for seamless mobile payments. All transactions are secure and instant.'
      },
      {
        question: 'When will I be charged?',
        answer: 'For services, you\'re charged when the provider completes the job. For marketplace orders, payment is required at checkout.'
      },
      {
        question: 'How do refunds work?',
        answer: 'Refunds are processed within 5-7 business days to your original payment method. Contact support if you need assistance.'
      },
    ]
  },
  {
    category: 'Bookings',
    icon: HiCalendar,
    questions: [
      {
        question: 'Can I cancel a booking?',
        answer: 'Yes, you can cancel bookings from your dashboard. Free cancellation is available up to 24 hours before the appointment. Later cancellations may incur a fee.'
      },
      {
        question: 'How do I reschedule?',
        answer: 'Go to your bookings, select the appointment you want to change, and choose "Reschedule". Select a new date and time that works for you.'
      },
      {
        question: 'What if the provider doesn\'t show up?',
        answer: 'If a provider fails to appear, contact our support team immediately. We\'ll arrange an alternative provider or issue a full refund.'
      },
    ]
  },
  {
    category: 'Safety & Trust',
    icon: HiShieldCheck,
    questions: [
      {
        question: 'How are providers verified?',
        answer: 'All providers undergo ID verification, background checks, and skill assessments. We also verify business licenses and certifications.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and never store your full payment details. All transactions go through secure M-Pesa/Airtel Money channels.'
      },
      {
        question: 'How do I report an issue?',
        answer: 'You can report issues through the app\'s "Help" section, by calling our support line, or emailing support@afrionex.com. We take all reports seriously.'
      },
    ]
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-500 to-secondary-500 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help?
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Find answers to common questions or reach out to our support team.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((category, catIndex) => (
                  <div key={catIndex} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      {category.questions.map((item, qIndex) => {
                        const key = `${catIndex}-${qIndex}`;
                        return (
                          <div key={qIndex} className="border-b last:border-0">
                            <button
                              onClick={() => toggleItem(key)}
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                              {openItems[key] ? (
                                <HiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <HiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            {openItems[key] && (
                              <div className="px-5 pb-5 text-gray-600">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <HiQuestionMarkCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try different keywords or contact our support team.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Still need help?</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <a 
                href="tel:+254700123456"
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <HiPhone className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-gray-600 text-sm text-center">+254 700 123 456</p>
                <p className="text-gray-500 text-xs mt-1">Mon-Sat, 8am-8pm</p>
              </a>

              <a 
                href="mailto:support@afrionex.com"
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <HiMail className="w-7 h-7 text-secondary-600" />
                </div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-gray-600 text-sm text-center">support@afrionex.com</p>
                <p className="text-gray-500 text-xs mt-1">We reply within 24 hours</p>
              </a>

              <a 
                href="https://wa.me/254700123456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <HiChat className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">WhatsApp</h3>
                <p className="text-gray-600 text-sm text-center">Chat with us</p>
                <p className="text-gray-500 text-xs mt-1">Quick responses</p>
              </a>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HiLocationMarker className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Visit Our Office</h3>
            </div>
            <p className="text-gray-600">Oginga Odinga Street, Kisumu, Kenya</p>
            <p className="text-gray-500 text-sm mt-1">Open Monday - Friday, 9am - 5pm</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
