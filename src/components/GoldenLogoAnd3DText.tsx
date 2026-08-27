import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  text: string;
  showLogo?: boolean;
  show3DText?: boolean;
  isAnimated?: boolean;
}

export const GoldenLogoAnd3DText: React.FC<Props> = ({
  text,
  showLogo = true,
  show3DText = true,
  isAnimated = true,
}) => {
  return (
    <>
      {/* Top-Right Golden Phoenix IOIS Logo */}
      {showLogo && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30 flex items-center gap-2.5 pointer-events-auto group">
          <div className="relative">
            {/* Outer Golden Aura Pulser */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/40 via-yellow-400/50 to-amber-600/30 rounded-full blur-md animate-pulse" />
            
            {/* Golden Phoenix Logo Emblem */}
            <div className="relative w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/40 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-1 relative overflow-hidden">
                {/* Golden specular reflection shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/20 to-transparent opacity-60 animate-[shimmer_3s_infinite]" />
                
                {/* Stylized Phoenix Wings Icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 md:w-7 md:h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                  fill="currentColor"
                >
                  <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" opacity="0.2" />
                  <path d="M12 3C12.5 5 14 7 17 7.5C14.5 9 13.5 11 14 13C12.8 11.5 11.2 11.5 10 13C10.5 11 9.5 9 7 7.5C10 7 11.5 5 12 3Z" />
                  <path d="M12 11C13 13 16 14.5 19 14C16.5 16 15 18 15 21C13.5 19 12.5 18 12 18C11.5 18 10.5 19 9 21C9 18 7.5 16 5 14C8 14.5 11 13 12 11Z" />
                </svg>
                <span className="text-[7px] md:text-[8px] font-black tracking-tighter text-amber-300 -mt-0.5">
                  IOIS
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xs md:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                IOIS Platform
              </span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <span className="text-[9px] text-amber-300/80 font-medium tracking-tight">
              ioisplatform.github.io/iois
            </span>
          </div>
        </div>
      )}

      {/* 3D Golden Text Animation Floating Overlay */}
      {show3DText && (
        <div className="absolute top-12 left-0 right-0 z-25 px-4 text-center pointer-events-none flex justify-center">
          <div className="relative inline-block max-w-4xl">
            {/* Ambient backlight glow */}
            <div className="absolute -inset-4 bg-amber-500/20 blur-xl rounded-full opacity-70" />

            {/* 3D Text Container */}
            <h1
              id="cinematic-golden-heading"
              className={`relative text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase select-none px-4 py-2 ${
                isAnimated ? 'animate-[float3D_4s_ease-in-out_infinite]' : ''
              }`}
              style={{
                background: 'linear-gradient(180deg, #FFF6D0 0%, #FFD700 35%, #FFA500 70%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.45))',
                textShadow: '0 1px 0 #ffe066, 0 2px 0 #cca01d, 0 3px 0 #997300, 0 4px 0 #664d00, 0 8px 16px rgba(0,0,0,0.9)',
                transform: 'perspective(600px) rotateX(8deg)',
              }}
            >
              &ldquo;{text}&rdquo;
            </h1>

            {/* Sub-label banner */}
            <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/80 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Viral YouTube & Reels First Clip &bull; Trending 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
