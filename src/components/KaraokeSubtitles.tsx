import React from 'react';
import { SubtitleWord } from '../types';
import { Volume2 } from 'lucide-react';

interface Props {
  currentTime: number;
  duration: number;
  subtitles: SubtitleWord[];
  fullHindiText: string;
  fullEnglishText: string;
  showDevanagari?: boolean;
  showEnglish?: boolean;
  isPlaying: boolean;
}

export const KaraokeSubtitles: React.FC<Props> = ({
  currentTime,
  subtitles,
  fullHindiText,
  fullEnglishText,
  showDevanagari = true,
  showEnglish = true,
  isPlaying,
}) => {
  return (
    <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-30 px-4 pointer-events-none flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-slate-950/85 backdrop-blur-md rounded-2xl border border-amber-500/30 p-3 sm:p-4 shadow-2xl shadow-black/80 flex flex-col items-center text-center transition-all duration-300">
        
        {/* Top badge */}
        <div className="flex items-center gap-2 mb-1.5 text-[10px] sm:text-xs font-bold text-amber-400">
          <div className="flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
            <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-bounce text-amber-300' : 'text-slate-400'}`} />
            <span>HINDI VOICE SCRIPT</span>
          </div>
          <span className="text-slate-400 font-mono text-[10px]">
            {currentTime.toFixed(1)}s / 10.0s
          </span>
        </div>

        {/* Word-by-word Karaoke Highlighting for Hindi */}
        {showDevanagari && (
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 font-bold text-base sm:text-lg md:text-xl leading-relaxed text-slate-300">
            {subtitles.map((item, index) => {
              const isActive = currentTime >= item.start && currentTime <= item.end;
              const isPast = currentTime > item.end;

              return (
                <span
                  key={index}
                  className={`transition-all duration-150 rounded px-1 py-0.5 ${
                    isActive
                      ? 'text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-400 scale-110 shadow-lg shadow-amber-400/50 font-black'
                      : isPast
                      ? 'text-amber-200/90 font-medium'
                      : 'text-slate-400/70 font-normal'
                  }`}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        )}

        {/* English Translation */}
        {showEnglish && (
          <p className="mt-2 text-xs sm:text-sm text-slate-300/90 italic font-medium max-w-2xl border-t border-slate-800/80 pt-1.5">
            &ldquo;{fullEnglishText}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
};
