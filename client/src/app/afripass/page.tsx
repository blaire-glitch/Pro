'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiCheck, HiStar, HiCash, HiGift, HiShieldCheck,
  HiLightningBolt, HiUsers, HiSparkles, HiPhone,
  HiChevronRight, HiCreditCard
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299,
    period: 'month',
    description: 'Perfect for occasional users',
    color: 'border-gray-200 bg-white',
    features: [
      { text: '5% cashback on all services', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'No booking fees', included: true },
      { text: 'Free delivery', included: false },
      { text: 'Service upgrades', included: false },
      { text: 'Afrionex Concierge', included: false },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 599,
    period: 'month',
    description: 'Best value for regular users',
    color: 'border-primary-500 bg-primary-50 ring-2 ring-primary-500',
    popular: true,
    features: [
      { text: '10% cashback on all services', included: true },
      { text: 'VIP customer support', included: true },
      { text: 'No booking fees', included: true },
      { text: '2 free deliveries per week', included: true },
      { text: '1 free service upgrade/month', included: true },
      { text: 'Afrionex Concierge', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    period: 'month',
    description: 'For power users who want it all',
    color: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50',
    features: [
      { text: '15% cashback on all services', included: true },
      { text: 'Dedicated support line', included: true },
      { text: 'No booking fees', included: true },
      { text: 'Unlimited free delivery', included: true },
      { text: 'Unlimited service upgrades', included: true },
      { text: 'Afrionex Concierge access', included: true },
    ],
  },
];

const benefits = [
  {
    icon: HiCash,
    title: 'Earn Cashback',
    description: 'Get up to 15% back on every service you book',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: HiGift,
    title: 'Free Delivery',
    description: 'Enjoy free delivery on food and packages',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: HiLightningBolt,
    title: 'Priority Access',
    description: 'Skip the queue and get served first',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: HiShieldCheck,
    title: 'VIP Support',
    description: 'Get help from our dedicated support team',
    color: 'bg-purple-100 text-purple-600',
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your Afrionex Pass anytime. Your benefits will continue until the end of your billing period.',
  },
  {
    question: 'How does cashback work?',
    answer: 'Cashback is automatically credited to your Afrionex wallet within 24 hours of completing a service or purchase.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely! You can change your plan at any time. The new rate will be applied from your next billing cycle.',
  },
  {
    question: 'Is there a family plan?',
    answer: 'Coming soon! We are working on family and business plans. Stay tuned for updates.',
  },
];

export default function AfriPassPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>('plus');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = (planId: string) => {
    toast.success(`Great choice! Redirecting to payment...`);
    // In production, redirect to payment flow
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
              <HiSparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">Introducing Afrionex Pass</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your VIP Pass to <br />
              <span className="text-yellow-300">Unlimited Savings</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              One subscription. Cashback on everything. Free delivery. Priority support. 
              Join thousands of Kenyans saving more every day.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#plans" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-colors">
                View Plans
              </a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Get Afrionex Pass?</h2>
              <p className="text-gray-600">Unlock premium benefits that pay for themselves</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center p-6">
                  <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="plans" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-gray-600">Start saving today. Cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative rounded-2xl border-2 p-6 transition-all ${plan.color} ${
                    selectedPlan === plan.id ? 'scale-105 shadow-xl' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">KES {plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <HiCheck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          feature.included ? 'text-green-500' : 'text-gray-300'
                        }`} />
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      plan.popular 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Get {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <HiChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-secondary-500 to-primary-500">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Join Afrionex Pass today and unlock a world of savings and convenience.
            </p>
            <a href="#plans" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-colors">
              Get Started Now
              <HiChevronRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
