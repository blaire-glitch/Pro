'use client';

interface ChatBotAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChatBotAvatar({ size = 'md', className = '' }: ChatBotAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-12 h-14',
    lg: 'w-16 h-20',
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB887" />
            <stop offset="100%" stopColor="#C49A6C" />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D1B0E" />
            <stop offset="100%" stopColor="#4A3728" />
          </linearGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#2d4a6f" />
          </linearGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Legs */}
        <rect x="28" y="78" width="10" height="18" rx="4" fill="url(#pantsGradient)" />
        <rect x="42" y="78" width="10" height="18" rx="4" fill="url(#pantsGradient)" />
        
        {/* Shoes */}
        <ellipse cx="33" cy="96" rx="7" ry="4" fill="#1a1a1a" />
        <ellipse cx="47" cy="96" rx="7" ry="4" fill="#1a1a1a" />
        
        {/* Body/Torso - Polo shirt */}
        <path d="M25 52 Q22 55 20 70 L20 80 Q20 82 25 82 L55 82 Q60 82 60 80 L60 70 Q58 55 55 52 Q50 48 40 48 Q30 48 25 52Z" fill="url(#shirtGradient)" filter="url(#softShadow)" />
        
        {/* Collar */}
        <path d="M32 52 L40 58 L48 52" stroke="#009988" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Arms */}
        <path d="M20 55 Q12 60 10 72 Q9 76 12 78" stroke="url(#skinGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M60 55 Q68 60 70 72 Q71 76 68 78" stroke="url(#skinGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
        
        {/* Hands */}
        <circle cx="12" cy="78" r="5" fill="url(#skinGradient)" />
        <circle cx="68" cy="78" r="5" fill="url(#skinGradient)" />
        
        {/* Waving hand detail - right hand up */}
        <path d="M68 60 Q78 50 75 42" stroke="url(#skinGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="75" cy="42" r="5" fill="url(#skinGradient)" />
        
        {/* Neck */}
        <rect x="35" y="44" width="10" height="10" rx="2" fill="url(#skinGradient)" />
        
        {/* Head */}
        <ellipse cx="40" cy="30" rx="18" ry="20" fill="url(#skinGradient)" />
        
        {/* Hair - Afro style */}
        <ellipse cx="40" cy="18" rx="20" ry="16" fill="url(#hairGradient)" />
        <circle cx="22" cy="22" r="8" fill="url(#hairGradient)" />
        <circle cx="58" cy="22" r="8" fill="url(#hairGradient)" />
        <circle cx="18" cy="30" r="6" fill="url(#hairGradient)" />
        <circle cx="62" cy="30" r="6" fill="url(#hairGradient)" />
        
        {/* Ears */}
        <ellipse cx="22" cy="32" rx="3" ry="5" fill="url(#skinGradient)" />
        <ellipse cx="58" cy="32" rx="3" ry="5" fill="url(#skinGradient)" />
        
        {/* Earrings - tech style */}
        <circle cx="22" cy="36" r="2" fill="#00D4AA" filter="url(#glow)">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="58" cy="36" r="2" fill="#00D4AA" filter="url(#glow)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Eyes */}
        <ellipse cx="33" cy="30" rx="4" ry="4.5" fill="white" />
        <ellipse cx="47" cy="30" rx="4" ry="4.5" fill="white" />
        
        {/* Pupils */}
        <circle cx="34" cy="30" r="2" fill="#1e3a5f" />
        <circle cx="48" cy="30" r="2" fill="#1e3a5f" />
        <circle cx="34.5" cy="29" r="0.8" fill="white" />
        <circle cx="48.5" cy="29" r="0.8" fill="white" />
        
        {/* AI glow in eyes */}
        <circle cx="34" cy="30" r="3" fill="none" stroke="#00D4AA" strokeWidth="0.5" strokeOpacity="0.6" filter="url(#glow)" />
        <circle cx="48" cy="30" r="3" fill="none" stroke="#00D4AA" strokeWidth="0.5" strokeOpacity="0.6" filter="url(#glow)" />
        
        {/* Eyebrows */}
        <path d="M28 24 Q33 22 38 24" stroke="#2D1B0E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M42 24 Q47 22 52 24" stroke="#2D1B0E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Nose */}
        <path d="M40 32 Q41 36 40 38 Q39 36 40 32" fill="#B8956E" />
        
        {/* Friendly smile */}
        <path d="M33 42 Q40 48 47 42" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M35 43 Q40 46 45 43" fill="white" />
        
        {/* Cheek highlights */}
        <ellipse cx="27" cy="36" rx="3" ry="1.5" fill="#FFB6C1" fillOpacity="0.5" />
        <ellipse cx="53" cy="36" rx="3" ry="1.5" fill="#FFB6C1" fillOpacity="0.5" />
        
        {/* Badge/Name tag on shirt */}
        <rect x="44" y="60" width="12" height="8" rx="1" fill="white" />
        <text x="50" y="66" fontSize="4" fill="#1e3a5f" textAnchor="middle" fontWeight="bold">AI</text>
        
        {/* Sparkles around */}
        <circle cx="8" cy="35" r="1.5" fill="#FFD700" filter="url(#glow)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="72" cy="30" r="1" fill="#00D4AA" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="5" cy="55" r="1" fill="#00D4AA" filter="url(#glow)">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
