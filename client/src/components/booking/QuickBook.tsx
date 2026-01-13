'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiArrowRight, HiCalendar, HiClock, HiStar } from 'react-icons/hi';

interface QuickBookCardProps {
  provider: {
    id: string;
    name: string;
    service: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    availableToday: boolean;
  };
}

export function QuickBookCard({ provider }: QuickBookCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <img
            src={provider.image}
            alt={provider.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{provider.name}</h3>
            <p className="text-sm text-gray-500">{provider.service}</p>
            <div className="flex items-center gap-1 mt-1">
              <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{provider.rating}</span>
              <span className="text-sm text-gray-400">({provider.reviews})</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">
              KSh {provider.price.toLocaleString()}
            </p>
            {provider.availableToday && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <HiClock className="w-3 h-3" />
                Today
              </span>
            )}
          </div>
        </div>

        {/* Quick Book Button */}
        <Link
          href={`/provider/${provider.id}/book`}
          className="mt-4 w-full py-3 bg-primary-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
        >
          Book Now <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Simple time slot picker
export function TimeSlotPicker({ 
  selectedTime, 
  onSelect 
}: { 
  selectedTime: string | null;
  onSelect: (time: string) => void;
}) {
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {timeSlots.map((time) => (
        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            selectedTime === time
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}

// Simple date picker
export function SimpleDatePicker({
  selectedDate,
  onSelect
}: {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}) {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDay = (date: Date) => {
    if (date.toDateString() === new Date().toDateString()) return 'Today';
    if (date.toDateString() === new Date(Date.now() + 86400000).toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      {dates.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => onSelect(date)}
          className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-colors ${
            selectedDate?.toDateString() === date.toDateString()
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <p className="text-xs font-medium">{formatDay(date)}</p>
          <p className="text-lg font-bold">{date.getDate()}</p>
        </button>
      ))}
    </div>
  );
}
