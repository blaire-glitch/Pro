'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiLightningBolt, HiClock, HiLocationMarker, HiSparkles,
  HiArrowRight, HiCash, HiCalendar, HiTruck
} from 'react-icons/hi';
import { FaBus, FaUtensils } from 'react-icons/fa';

interface Suggestion {
  id: string;
  type: 'routine' | 'reminder' | 'nearby' | 'promo';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: string;
  href: string;
}

// Get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Habari ya asubuhi', period: 'morning' };
  if (hour < 17) return { text: 'Habari ya mchana', period: 'afternoon' };
  if (hour < 20) return { text: 'Habari ya jioni', period: 'evening' };
  return { text: 'Usiku mwema', period: 'night' };
};

// Smart suggestions based on time and context
const getSmartSuggestions = (): Suggestion[] => {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const suggestions: Suggestion[] = [];

  // Morning routine
  if (hour >= 6 && hour < 10) {
    suggestions.push({
      id: 'morning-ride',
      type: 'routine',
      title: 'Your usual ride to work?',
      subtitle: 'Matatu to CBD • KES 50',
      icon: FaBus,
      color: 'bg-blue-500',
      action: 'Book Now',
      href: '/search?category=transport',
    });
  }

  // Lunch time
  if (hour >= 11 && hour < 14) {
    suggestions.push({
      id: 'lunch',
      type: 'routine',
      title: 'Lunch time',
      subtitle: 'Order from nearby restaurants',
      icon: FaUtensils,
      color: 'bg-orange-500',
      action: 'Order Food',
      href: '/search?category=delivery&service=food',
    });
  }

  // Evening commute
  if (hour >= 16 && hour < 19) {
    suggestions.push({
      id: 'evening-ride',
      type: 'routine',
      title: 'Heading home?',
      subtitle: 'Book your ride now to avoid the rush',
      icon: FaBus,
      color: 'bg-purple-500',
      action: 'Book Ride',
      href: '/search?category=transport',
    });
  }

  // Bill reminders (mid-month)
  const date = new Date().getDate();
  if (date >= 10 && date <= 15) {
    suggestions.push({
      id: 'bill-reminder',
      type: 'reminder',
      title: 'Electricity running low?',
      subtitle: 'Buy KPLC tokens before they run out',
      icon: HiLightningBolt,
      color: 'bg-yellow-500',
      action: 'Buy Tokens',
      href: '/wallet',
    });
  }

  // Weekend suggestions
  if (day === 0 || day === 6) {
    suggestions.push({
      id: 'weekend',
      type: 'promo',
      title: 'Weekend special',
      subtitle: '20% off beauty services today',
      icon: HiSparkles,
      color: 'bg-pink-500',
      action: 'Book Now',
      href: '/search?category=beauty',
    });
  }

  // Always show nearby services
  suggestions.push({
    id: 'nearby',
    type: 'nearby',
    title: 'Services near you',
    subtitle: '12 providers within 2km',
    icon: HiLocationMarker,
    color: 'bg-green-500',
    action: 'Explore',
    href: '/search',
  });

  return suggestions.slice(0, 3);
};

export function SmartSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const greeting = getGreeting();

  useEffect(() => {
    setSuggestions(getSmartSuggestions());
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {greeting.text}!
          </h2>
          <p className="text-gray-600">Here's what we suggest for you</p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.id}
              href={suggestion.href}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary-200"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${suggestion.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <suggestion.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{suggestion.subtitle}</p>
                  <div className="flex items-center gap-1 mt-2 text-primary-600 text-sm font-medium">
                    {suggestion.action}
                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
