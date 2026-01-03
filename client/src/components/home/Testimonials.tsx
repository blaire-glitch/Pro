'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const testimonials = [
  {
    id: 1,
    name: 'Grace Achieng',
    role: 'Business Owner',
    location: 'Kisumu',
    avatar: 'https://ui-avatars.com/api/?name=Grace+Achieng&background=FF6B9D&color=fff',
    rating: 5,
    text: 'Afrionex has transformed how I run my salon business. I get bookings from all over Kisumu now, and the M-Pesa integration makes payments seamless. My revenue has grown by 40% since joining!',
    service: 'Beauty Provider',
  },
  {
    id: 2,
    name: 'Samuel Wafula',
    role: 'Customer',
    location: 'Kakamega',
    avatar: 'https://ui-avatars.com/api/?name=Samuel+Wafula&background=4ECDC4&color=fff',
    rating: 5,
    text: 'Finding reliable home repair services used to be a nightmare. With Afrionex, I found a verified electrician within minutes. The live tracking feature is a game-changer!',
    service: 'Home Services',
  },
  {
    id: 3,
    name: 'Faith Nekesa',
    role: 'Regular User',
    location: 'Bungoma',
    avatar: 'https://ui-avatars.com/api/?name=Faith+Nekesa&background=95E1D3&color=fff',
    rating: 5,
    text: 'I use Afrionex for everything - from booking my hairdresser to ordering groceries. The rewards program is amazing, and I love supporting local businesses in my community.',
    service: 'Multiple Services',
  },
  {
    id: 4,
    name: 'Kevin Odhiambo',
    role: 'Boda Rider',
    location: 'Busia',
    avatar: 'https://ui-avatars.com/api/?name=Kevin+Odhiambo&background=F7B32B&color=fff',
    rating: 5,
    text: 'As a delivery rider, Afrionex has given me a steady stream of customers. The GPS tracking builds trust with customers, and I get paid directly to my M-Pesa. Best decision I made!',
    service: 'Transport Provider',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users and providers who are transforming how services work in Western Kenya.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <HiStar key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "{testimonial.text}"
              </p>
              
              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                {testimonial.service}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <HiStar key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      "{testimonial.text}"
                    </p>
                    
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                      {testimonial.service}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous testimonial"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next testimonial"
          >
            <HiChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">10K+</div>
            <div className="text-sm text-gray-500">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">500+</div>
            <div className="text-sm text-gray-500">Verified Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 flex items-center justify-center gap-1">4.8 <HiStar className="w-8 h-8" /></div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">25K+</div>
            <div className="text-sm text-gray-500">Services Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
