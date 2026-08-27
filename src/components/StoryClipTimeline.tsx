import React, { useState } from 'react';
import { StoryClip } from '../types';
import { 
  Play, 
  Sparkles, 
  Plus, 
  Film, 
  Clock, 
  Volume2, 
  Layers, 
  Check, 
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface Props {
  clips: StoryClip[];
  activeClipId: string;
  onSelectClip: (clip: StoryClip) => void;
  onAddNewClip: (newClip: StoryClip) => void;
  isContinuousPlay: boolean;
  onToggleContinuousPlay: () => void;
}

export const StoryClipTimeline: React.FC<Props> = ({
  clips,
  activeClipId,
  onSelectClip,
  onAddNewClip,
  isContinuousPlay,
  onToggleContinuousPlay,
}) => {
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);

  const handleGenerateNextClip = async () => {
    setIsGeneratingNext(true);
    try {
      const nextNumber = clips.length + 1;
      const res = await fetch('/api/generate-clip-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clipNumber: nextNumber,
          topic: customTopic || 'Student success stories and free coding projects on IOIS Platform',
          currentStory: 'Sequence introducing IOIS platform to students and homemakers.',
          tone: 'Sweet, confident, attractive, viral influencer style',
        }),
      });

      const data = await res.json();
      const script = data.script;

      // Create new clip maintaining the same character visual
      const newClip: StoryClip = {
        id: `clip-${nextNumber}`,
        clipNumber: nextNumber,
        title: `Clip ${nextNumber}: ${script.heading3D || 'Next Viral Segment'}`,
        tagline: script.heading3D || 'IOIS Platform Feature Spotlight',
        duration: script.duration || 10,
        // Reuse clip 1/2/3 character photo to ensure 100% same character identity
        imageSrc: clips[0].imageSrc,
        audioTextHindi: script.hindiAudio || 'IOIS Platform पर अपनी पसंदीदा स्किल चुनें और आज ही फ्री सीखना शुरू करें!',
        audioTextEnglish: script.englishAudio || 'Choose your favorite skill on IOIS Platform and start learning today for free!',
        subtitles: [
          { word: 'IOIS', start: 0.0, end: 1.0 },
          { word: 'Platform', start: 1.0, end: 2.0 },
          { word: 'पर', start: 2.0, end: 2.5 },
          { word: 'सीखिए', start: 2.5, end: 3.5 },
          { word: 'आसान', start: 3.5, end: 4.5 },
          { word: 'तरीके', start: 4.5, end: 5.5 },
          { word: 'से!', start: 5.5, end: 6.5 },
        ],
        golden3DText: script.heading3D || 'Master In-Demand Skills',
        dollyZoomEffect: 'slow-in',
        lightingStyle: 'dark-blue-gold',
        particleDensity: 'ultra',
        voiceTone: 'Hindi female, sweet, confident',
        status: 'ready',
      };

      onAddNewClip(newClip);
      setShowGenModal(false);
      setCustomTopic('');
    } catch (e) {
      console.error('Failed to generate clip', e);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Viral Story Sequence</span>
              <span className="text-xs text-amber-400 font-normal">
                (Character: 23yo Indian Girl in Dark Blue Saree)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Select or generate sequence clips for YouTube, Shorts & Reels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleContinuousPlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isContinuousPlay
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Continuous Story Play: {isContinuousPlay ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowGenModal(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Add Next Clip</span>
          </button>
        </div>
      </div>

      {/* Story Clips Cards Horizontal Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {clips.map((c, index) => {
          const isActive = c.id === activeClipId;

          return (
            <div
              key={c.id}
              onClick={() => onSelectClip(c)}
              className={`group relative rounded-xl border p-3 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-b from-blue-950/90 via-slate-900 to-slate-950 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
              )}

              {/* Clip Thumbnail Preview */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5 border border-slate-800">
                <img
                  src={c.imageSrc}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                {/* Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 text-[10px] font-black border border-amber-400/30">
                  CLIP #{c.clipNumber}
                </div>

                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-amber-400" />
                  <span>{c.duration}s</span>
                </div>
              </div>

              {/* Clip Details */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className={`text-xs font-bold truncate ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                    {c.title}
                  </h4>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                <p className="text-[11px] text-amber-400/90 font-medium line-clamp-1 mb-1">
                  &ldquo;{c.golden3DText}&rdquo;
                </p>

                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {c.audioTextHindi}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono text-[10px]">
                  {index === 0 ? 'Viral Hook (Requested)' : index === 1 ? 'Explore Portal' : 'CTA Outro'}
                </span>
                <span className={`font-bold flex items-center gap-1 ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <span>{isActive ? 'Playing' : 'Switch Clip'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding next clip */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-amber-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Generate Next Story Clip (Same 23yo Presenter)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Gemini will write the Hindi dialogue, 3D title, and timing while preserving the exact same 23yo Indian influencer character in dark blue saree with golden border.
            </p>

            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Specific Topic or Focus for this Clip (Optional):
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Free Full Stack Roadmap, Homemaker Freelancing, AI study buddy..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mb-4"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateNextClip}
                disabled={isGeneratingNext}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/30 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingNext ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing Script & Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Clip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
