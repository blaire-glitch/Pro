'use client';

import Link from 'next/link';
import { 
  HiCash, HiCreditCard, HiPhone, HiGift, HiStar,
  HiChevronRight, HiSparkles, HiUsers
} from 'react-icons/hi';

interface AfriPassTier {
  name: string;
  price: number;
  period: string;
  features: string[];
  color: string;
  popular?: boolean;
}

const tiers: AfriPassTier[] = [
  {
    name: 'Basic',
    price: 299,
    period: '/month',
    features: [
      '5% cashback on all services',
      'Priority support',
      'No booking fees',
    ],
    color: 'bg-gray-100 border-gray-200',
  },
  {
    name: 'Plus',
    price: 599,
    period: '/month',
    features: [
      '10% cashback on all services',
      'Free delivery (2x/week)',
      'VIP support',
      '1 free service upgrade/month',
      'Early access to deals',
    ],
    color: 'bg-primary-50 border-primary-200',
    popular: true,
  },
  {
    name: 'Premium',
    price: 999,
    period: '/month',
    features: [
      '15% cashback on all services',
      'Unlimited free delivery',
      'Dedicated support line',
      'Unlimited service upgrades',
      'Exclusive partner discounts',
      'Afrionex Concierge access',
    ],
    color: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300',
  },
];

export function AfriPassBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-primary-600 to-secondary-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <HiSparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold">NEW</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Introducing Afrionex Pass
            </h2>
            <p className="text-white/90 text-lg mb-6">
              One subscription. Unlimited benefits. Get cashback on every transaction, 
              free deliveries, priority support, and exclusive access to deals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/afripass"
                className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-50 transition-colors flex items-center gap-2"
              >
                Get Afrionex Pass
                <HiChevronRight className="w-5 h-5" />
              </Link>
              <button className="text-white border-2 border-white/50 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Preview Cards */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-white min-w-[140px]">
              <HiCash className="w-8 h-8 mb-2 text-green-300" />
              <p className="font-bold text-2xl">15%</p>
              <p className="text-sm text-white/80">Cashback</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-white min-w-[140px]">
              <HiGift className="w-8 h-8 mb-2 text-yellow-300" />
              <p className="font-bold text-2xl">Free</p>
              <p className="text-sm text-white/80">Delivery</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-white min-w-[140px] hidden md:block">
              <HiStar className="w-8 h-8 mb-2 text-purple-300" />
              <p className="font-bold text-2xl">VIP</p>
              <p className="text-sm text-white/80">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AfriPassPricing() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Afrionex Pass</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of Kenyans saving money on everyday services
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative rounded-2xl border-2 p-6 ${tier.color} ${tier.popular ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">KES {tier.price}</span>
                <span className="text-gray-500">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <HiStar className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                tier.popular 
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                Get {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
