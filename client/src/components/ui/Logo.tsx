'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 40, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
  xl: { icon: 64, text: 'text-3xl' },
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* The Afrio Loop - Circular logo with X breaking out - Kenya colors */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Gradient definitions - Kenya colors */}
        <defs>
          {/* Black to Red gradient for the loop */}
          <linearGradient id="loopGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="100%" stopColor="#BB0000" />
          </linearGradient>
          <linearGradient id="loopGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BB0000" />
            <stop offset="100%" stopColor="#006600" />
          </linearGradient>
          {/* X gradient - Kenya tricolor */}
          <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="50%" stopColor="#BB0000" />
            <stop offset="100%" stopColor="#006600" />
          </linearGradient>
        </defs>

        {/* The Circle Loop - Two gradient strokes forming the circle */}
        {/* Top arc (black to red) */}
        <path
          d="M 32 8 A 24 24 0 0 1 56 32"
          stroke="url(#loopGradient1)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right to bottom arc */}
        <path
          d="M 56 32 A 24 24 0 0 1 32 56"
          stroke="url(#loopGradient2)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom to left arc */}
        <path
          d="M 32 56 A 24 24 0 0 1 8 32"
          stroke="#006600"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left to top arc (with gap for X) */}
        <path
          d="M 8 32 A 24 24 0 0 1 22 12"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* The X breaking out of the circle - symbolizing innovation */}
        <g transform="translate(32, 32)">
          {/* X strokes breaking through the top-left of the circle */}
          <path
            d="M -6 -6 L 8 8"
            stroke="url(#xGradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 8 -6 L -6 8"
            stroke="url(#xGradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Extended stroke breaking out */}
          <path
            d="M -6 -6 L -16 -16"
            stroke="#BB0000"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Afrionex text - Kenya colors */}
      {showText && (
        <span className={`font-bold tracking-tight ${text}`}>
          <span className="text-black">Afrio</span>
          <span className="text-[#BB0000]">n</span>
          <span className="text-[#006600]">ex</span>
        </span>
      )}
    </div>
  );
}

// Compact version for favicons and small spaces
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="loopGradientIcon1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#BB0000" />
        </linearGradient>
        <linearGradient id="loopGradientIcon2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BB0000" />
          <stop offset="100%" stopColor="#006600" />
        </linearGradient>
        <linearGradient id="xGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="50%" stopColor="#BB0000" />
          <stop offset="100%" stopColor="#006600" />
        </linearGradient>
      </defs>

      {/* Circle Loop */}
      <path
        d="M 32 8 A 24 24 0 0 1 56 32"
        stroke="url(#loopGradientIcon1)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 56 32 A 24 24 0 0 1 32 56"
        stroke="url(#loopGradientIcon2)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 32 56 A 24 24 0 0 1 8 32"
        stroke="#006600"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 8 32 A 24 24 0 0 1 22 12"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Breaking X */}
      <g transform="translate(32, 32)">
        <path
          d="M -6 -6 L 8 8"
          stroke="url(#xGradientIcon)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 8 -6 L -6 8"
          stroke="url(#xGradientIcon)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M -6 -6 L -16 -16"
          stroke="#BB0000"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
