import React, { useState } from 'react';
import { INITIAL_STORY_CLIPS } from './data/storyClips';
import { StoryClip, AudioSettings } from './types';
import { CinematicPlayer } from './components/CinematicPlayer';
import { StoryClipTimeline } from './components/StoryClipTimeline';
import { ScriptAndPromptInspector } from './components/ScriptAndPromptInspector';
import { InteractiveIOISPortal } from './components/InteractiveIOISPortal';
import { 
  Sparkles, 
  Film, 
  Sliders, 
  Globe, 
  ExternalLink, 
  Play, 
  Share2, 
  Check, 
  Award,
  Video,
  MonitorPlay
} from 'lucide-react';

export default function App() {
  const [clips, setClips] = useState<StoryClip[]>(INITIAL_STORY_CLIPS);
  const [activeClipId, setActiveClipId] = useState<string>(INITIAL_STORY_CLIPS[0].id);
  const [activeViewTab, setActiveViewTab] = useState<'cinema' | 'script' | 'portal'>('cinema');
  const [isContinuousPlay, setIsContinuousPlay] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speechRate: 0.95,
    speechPitch: 1.18,
    musicVolume: 0.22,
    voiceVolume: 1.0,
    selectedVoiceIndex: 0,
    enableAmbientMusic: true,
    enableHindiDevanagari: true,
    enableHinglishRoman: true,
  });

  const activeClip = clips.find((c) => c.id === activeClipId) || clips[0];

  const handleSelectClip = (clip: StoryClip) => {
    setActiveClipId(clip.id);
  };

  const handleAddNewClip = (newClip: StoryClip) => {
    setClips((prev) => [...prev, newClip]);
    setActiveClipId(newClip.id);
  };

  const handleUpdateClipText = (hindiText: string, goldenText: string) => {
    setClips((prev) =>
      prev.map((c) =>
        c.id === activeClip.id
          ? {
              ...c,
              audioTextHindi: hindiText,
              golden3DText: goldenText,
            }
          : c
      )
    );
  };

  const handleClipComplete = () => {
    if (isContinuousPlay) {
      const currentIndex = clips.findIndex((c) => c.id === activeClipId);
      if (currentIndex >= 0 && currentIndex < clips.length - 1) {
        setActiveClipId(clips[currentIndex + 1].id);
      }
    }
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'IOIS Viral Video Studio',
        text: 'Ye Website Har Student Use Kar Raha Hai - IOIS Platform',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-amber-500/25">
                🔥
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                  IOIS Platform
                </span>
                <span className="bg-amber-400/15 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                  4K VIRAL CINEMA
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                ioisplatform.github.io/iois &bull; First Clip Story Player & Prompt Studio
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveViewTab('cinema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewTab === 'cinema'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Cinema Studio</span>
            </button>

            <button
              onClick={() => setActiveViewTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewTab === 'script'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Voice & Prompt</span>
            </button>

            <button
              onClick={() => setActiveViewTab('portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewTab === 'portal'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore Portal</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareApp}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Share Viral Video"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <a
              href="https://ioisplatform.github.io/iois"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
            >
              <span>ioisplatform.github.io/iois</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Main Cinema View */}
        {activeViewTab === 'cinema' && (
          <div className="flex flex-col items-center gap-6">
            {/* The 16:9 Cinema Player */}
            <CinematicPlayer
              clip={activeClip}
              audioSettings={audioSettings}
              onAudioSettingsChange={setAudioSettings}
              onClipComplete={handleClipComplete}
              autoPlayNext={isContinuousPlay}
            />

            {/* Story Timeline Bar */}
            <StoryClipTimeline
              clips={clips}
              activeClipId={activeClipId}
              onSelectClip={handleSelectClip}
              onAddNewClip={handleAddNewClip}
              isContinuousPlay={isContinuousPlay}
              onToggleContinuousPlay={() => setIsContinuousPlay(!isContinuousPlay)}
            />

            {/* Prompt & Specs Card */}
            <ScriptAndPromptInspector
              clip={activeClip}
              audioSettings={audioSettings}
              onAudioSettingsChange={setAudioSettings}
              onUpdateClipText={handleUpdateClipText}
            />
          </div>
        )}

        {/* Script & Voice Synthesizer Inspector View */}
        {activeViewTab === 'script' && (
          <div className="flex flex-col gap-6">
            <ScriptAndPromptInspector
              clip={activeClip}
              audioSettings={audioSettings}
              onAudioSettingsChange={setAudioSettings}
              onUpdateClipText={handleUpdateClipText}
            />
            
            <StoryClipTimeline
              clips={clips}
              activeClipId={activeClipId}
              onSelectClip={handleSelectClip}
              onAddNewClip={handleAddNewClip}
              isContinuousPlay={isContinuousPlay}
              onToggleContinuousPlay={() => setIsContinuousPlay(!isContinuousPlay)}
            />
          </div>
        )}

        {/* Explore IOIS Portal View */}
        {activeViewTab === 'portal' && (
          <div className="flex flex-col gap-6">
            <InteractiveIOISPortal />
          </div>
        )}

      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          IOIS Viral Video Studio &bull; Official Portal: <a href="https://ioisplatform.github.io/iois" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">ioisplatform.github.io/iois</a>
        </p>
      </footer>
    </div>
  );
}
