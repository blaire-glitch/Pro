'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiGift, HiCheckCircle, HiLockClosed, HiFire,
  HiStar, HiChevronRight, HiSparkles
} from 'react-icons/hi';

interface DayReward {
  day: number;
  points: number;
  claimed: boolean;
  isToday: boolean;
  bonus?: string;
}

const generateWeekRewards = (): DayReward[] => {
  const today = new Date().getDay();
  return [
    { day: 1, points: 10, claimed: today > 1, isToday: today === 1 },
    { day: 2, points: 15, claimed: today > 2, isToday: today === 2 },
    { day: 3, points: 20, claimed: today > 3, isToday: today === 3 },
    { day: 4, points: 25, claimed: today > 4, isToday: today === 4 },
    { day: 5, points: 30, claimed: today > 5, isToday: today === 5 },
    { day: 6, points: 40, claimed: today > 6, isToday: today === 6 },
    { day: 7, points: 100, claimed: false, isToday: today === 0, bonus: 'Bonus!' },
  ];
};

export function DailyRewards() {
  const [rewards, setRewards] = useState<DayReward[]>([]);
  const [streak, setStreak] = useState(5);
  const [todayClaimed, setTodayClaimed] = useState(false);

  useEffect(() => {
    setRewards(generateWeekRewards());
  }, []);

  const handleClaim = () => {
    setTodayClaimed(true);
    // Show celebration animation
  };

  const todayReward = rewards.find(r => r.isToday);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-3xl p-6 text-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HiFire className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold">{streak} Day Streak!</span>
                </div>
                <p className="text-white/80 text-sm">Check in daily to earn rewards</p>
              </div>
              <Link 
                href="/dashboard/rewards"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <HiStar className="w-4 h-4" />
                2,450 pts
              </Link>
            </div>

            {/* Weekly Progress */}
            <div className="flex justify-between mb-6">
              {rewards.map((reward) => (
                <div key={reward.day} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      reward.claimed 
                        ? 'bg-green-400' 
                        : reward.isToday 
                          ? 'bg-yellow-400 animate-pulse ring-4 ring-yellow-400/30' 
                          : 'bg-white/20'
                    }`}
                  >
                    {reward.claimed ? (
                      <HiCheckCircle className="w-6 h-6 text-white" />
                    ) : reward.isToday ? (
                      <HiGift className="w-5 h-5 text-yellow-900" />
                    ) : (
                      <HiLockClosed className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                  <span className="text-xs text-white/80">Day {reward.day}</span>
                  <span className={`text-xs font-semibold ${reward.bonus ? 'text-yellow-300' : 'text-white'}`}>
                    {reward.bonus || `+${reward.points}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Claim Button */}
            {todayReward && !todayClaimed ? (
              <button
                onClick={handleClaim}
                className="w-full bg-white text-primary-600 py-3 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
              >
                <HiSparkles className="w-5 h-5" />
                Claim Today's {todayReward.points} Points!
              </button>
            ) : (
              <div className="w-full bg-white/20 text-white py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2">
                <HiCheckCircle className="w-5 h-5" /> Today&apos;s reward claimed! Come back tomorrow
              </div>
            )}

            {/* Tier Progress */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Gold Tier</span>
                <span className="text-yellow-300 font-semibold">550 pts to Platinum</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
