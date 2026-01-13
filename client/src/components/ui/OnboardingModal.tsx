'use client';

import { useState, useEffect } from 'react';
import { HiArrowRight, HiX, HiLocationMarker, HiSparkles, HiShieldCheck } from 'react-icons/hi';

const slides = [
  {
    title: 'Welcome to Afrionex',
    description: 'Your one-stop app for services, payments, and more in Western Kenya',
    icon: HiSparkles,
    color: 'from-primary-500 to-primary-600',
  },
  {
    title: 'Find Services Near You',
    description: 'Book beauty, home, wellness services from verified local providers',
    icon: HiLocationMarker,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Safe & Secure',
    description: 'All providers are verified. Pay securely with M-Pesa',
    icon: HiShieldCheck,
    color: 'from-green-500 to-emerald-500',
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('afrionex-onboarding-seen');
    if (!hasSeenOnboarding) {
      // Show after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('afrionex-onboarding-seen', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden animate-slide-up">
        {/* Header with Skip */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1"
          >
            Skip <HiX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          {/* Icon */}
          <div className={`w-20 h-20 bg-gradient-to-br ${slide.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{slide.title}</h2>
          <p className="text-gray-600 mb-8">{slide.description}</p>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-6 bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30"
          >
            {currentSlide < slides.length - 1 ? (
              <>Next <HiArrowRight className="w-5 h-5" /></>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
