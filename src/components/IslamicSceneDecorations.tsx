import React from 'react';

export const IslamicSceneDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Left Hanging Lantern in Navy Blue #17436A and Mint Green #BCEBDD */}
      <div className="absolute top-0 right-4 sm:right-10 md:right-16 w-14 sm:w-18 md:w-20 z-10 opacity-70">
        <svg viewBox="0 0 100 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xs">
          {/* Chain */}
          <line x1="50" y1="0" x2="50" y2="70" stroke="#17436A" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
          <circle cx="50" cy="72" r="3" fill="#BCEBDD" />
          {/* Top Cap */}
          <path d="M 32,85 Q 50,72 68,85 L 64,95 L 36,95 Z" fill="#BCEBDD" stroke="#17436A" strokeWidth="1.2" />
          {/* Lantern Dome */}
          <path d="M 34,95 C 34,95 24,115 28,145 L 72,145 C 76,115 66,95 66,95 Z" fill="#FFFFFF" stroke="#17436A" strokeWidth="1.2" />
          {/* Glass Windows */}
          <rect x="38" y="105" width="24" height="30" rx="3" fill="#BCEBDD" opacity="0.45" />
          <line x1="50" y1="105" x2="50" y2="135" stroke="#17436A" strokeWidth="1" opacity="0.5" />
          <line x1="38" y1="120" x2="62" y2="120" stroke="#17436A" strokeWidth="1" opacity="0.5" />
          {/* Inner Light Glow */}
          <circle cx="50" cy="120" r="7" fill="#BCEBDD" />
          {/* Bottom Base */}
          <path d="M 30,145 L 70,145 L 60,162 L 40,162 Z" fill="#BCEBDD" stroke="#17436A" strokeWidth="1.2" />
          {/* Bottom Finial */}
          <circle cx="50" cy="168" r="3.5" fill="#17436A" />
          <polygon points="50,172 52.5,182 47.5,182" fill="#17436A" />
        </svg>
      </div>

      {/* 2. Right Hanging Lantern */}
      <div className="absolute top-0 left-4 sm:left-10 md:left-16 w-12 sm:w-16 md:w-18 z-10 opacity-65">
        <svg viewBox="0 0 100 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xs">
          {/* Chain */}
          <line x1="50" y1="0" x2="50" y2="48" stroke="#17436A" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
          <circle cx="50" cy="50" r="2.5" fill="#BCEBDD" />
          {/* Top Cap */}
          <path d="M 34,60 Q 50,48 66,60 L 62,69 L 38,69 Z" fill="#BCEBDD" stroke="#17436A" strokeWidth="1.2" />
          {/* Lantern Dome */}
          <path d="M 36,69 C 36,69 26,88 30,116 L 70,116 C 74,88 64,69 64,69 Z" fill="#FFFFFF" stroke="#17436A" strokeWidth="1.2" />
          {/* Glass Windows */}
          <rect x="40" y="78" width="20" height="28" rx="3" fill="#BCEBDD" opacity="0.4" />
          <line x1="50" y1="78" x2="50" y2="106" stroke="#17436A" strokeWidth="1" opacity="0.5" />
          <circle cx="50" cy="92" r="6" fill="#BCEBDD" />
          {/* Bottom Base */}
          <path d="M 32,116 L 68,116 L 58,132 L 42,132 Z" fill="#BCEBDD" stroke="#17436A" strokeWidth="1.2" />
          <circle cx="50" cy="137" r="3" fill="#17436A" />
        </svg>
      </div>

      {/* 3. Mosque Silhouettes & Domes (Mint Green #BCEBDD & Navy Blue #17436A) */}
      <div className="absolute -bottom-6 -right-6 sm:right-0 w-40 sm:w-60 md:w-72 opacity-50 z-0">
        <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Palm Fronds in Mint Green (#BCEBDD) */}
          <path d="M 40,240 Q 60,140 10,90 Q 50,120 70,220" stroke="#BCEBDD" strokeWidth="8" strokeLinecap="round" />
          <path d="M 70,240 Q 110,130 50,70 Q 100,120 95,220" stroke="#17436A" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />

          {/* Mosque Main Dome */}
          <path d="M 90,260 L 90,190 C 90,150 110,120 140,110 C 140,95 142,95 140,90 Q 140,85 145,85 Q 150,85 150,90 C 148,95 150,95 150,110 C 180,120 200,150 200,190 L 200,260 Z" fill="#FFFFFF" stroke="#BCEBDD" strokeWidth="2.5" />
          {/* Crescent Finial */}
          <circle cx="145" cy="78" r="4.5" fill="#BCEBDD" stroke="#17436A" strokeWidth="0.8" />

          {/* Left Minaret */}
          <rect x="55" y="140" width="22" height="120" fill="#FFFFFF" stroke="#BCEBDD" strokeWidth="2" rx="2" />
          <polygon points="66,80 50,140 82,140" fill="#BCEBDD" stroke="#BCEBDD" strokeWidth="1" />
          <circle cx="66" cy="74" r="3" fill="#17436A" />

          {/* Foreground Mint Leaves */}
          <path d="M 0,260 Q 40,180 120,200 Q 60,225 10,260" fill="#BCEBDD" opacity="0.6" />
          <path d="M 0,260 Q 70,200 150,230 Q 70,250 15,260" fill="#17436A" opacity="0.1" />
        </svg>
      </div>

      {/* 4. Holy Quran on Wooden Rehal in Mint & Navy */}
      <div className="absolute -bottom-6 -left-6 sm:left-0 w-40 sm:w-60 md:w-72 opacity-50 z-0">
        <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Mint Palm Leaves */}
          <path d="M 260,240 Q 230,120 290,60 Q 240,110 220,220" stroke="#BCEBDD" strokeWidth="8" strokeLinecap="round" />
          <path d="M 230,240 Q 180,120 240,50 Q 190,110 200,220" stroke="#17436A" strokeOpacity="0.15" strokeWidth="6" strokeLinecap="round" />

          {/* Wooden Rehal / Quran Stand */}
          <g transform="translate(60, 110)">
            <polygon points="40,90 120,10 135,18 55,98" fill="#17436A" opacity="0.8" />
            <polygon points="120,90 40,10 25,18 105,98" fill="#17436A" />

            {/* Holy Quran Book */}
            <polygon points="78,14 10,32 25,75 82,50" fill="#17436A" stroke="#BCEBDD" strokeWidth="1.5" />
            <polygon points="75,17 14,34 27,72 80,48" fill="#BCEBDD" opacity="0.4" />
            <circle cx="48" cy="44" r="8" fill="none" stroke="#BCEBDD" strokeWidth="1.5" />

            <polygon points="82,14 150,32 135,75 78,50" fill="#17436A" stroke="#BCEBDD" strokeWidth="1.5" />
            <polygon points="85,17 146,34 133,72 80,48" fill="#BCEBDD" opacity="0.4" />
            <circle cx="112" cy="44" r="8" fill="none" stroke="#BCEBDD" strokeWidth="1.5" />

            <path d="M 80,18 Q 45,22 15,35 L 20,42 Q 50,28 80,24 Z" fill="#FFFFFF" />
            <path d="M 80,18 Q 115,22 145,35 L 140,42 Q 110,28 80,24 Z" fill="#FFFFFF" />
          </g>

          {/* Foreground Leaves */}
          <path d="M 300,260 Q 250,170 160,200 Q 220,230 280,260" fill="#BCEBDD" opacity="0.6" />
        </svg>
      </div>

      {/* 5. Subtle Stars in Mint Green (#BCEBDD) and Navy (#17436A) */}
      <div className="absolute top-1/6 right-8 sm:right-24 text-[#BCEBDD] opacity-70">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
        </svg>
      </div>
      <div className="absolute top-1/4 left-10 sm:left-28 text-[#17436A] opacity-25">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
        </svg>
      </div>
      <div className="absolute top-1/2 right-4 sm:right-12 text-[#BCEBDD] opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
        </svg>
      </div>
      <div className="absolute top-3/5 left-4 sm:left-12 text-[#BCEBDD] opacity-70">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
        </svg>
      </div>
    </div>
  );
};
