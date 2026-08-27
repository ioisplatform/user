import React, { useState, useEffect, useRef } from 'react';
import { StoryClip, AudioSettings } from '../types';
import { ParticleCanvas } from './ParticleCanvas';
import { GoldenLogoAnd3DText } from './GoldenLogoAnd3DText';
import { KaraokeSubtitles } from './KaraokeSubtitles';
import { InteractiveIOISPortal } from './InteractiveIOISPortal';
import { audioEngine } from '../utils/audioEngine';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Camera, 
  Sparkles, 
  Layers, 
  Film,
  Laptop,
  Check,
  Download,
  Share2,
  Tv
} from 'lucide-react';

interface Props {
  clip: StoryClip;
  audioSettings: AudioSettings;
  onAudioSettingsChange: (settings: AudioSettings) => void;
  onClipComplete?: () => void;
  autoPlayNext?: boolean;
}

export const CinematicPlayer: React.FC<Props> = ({
  clip,
  audioSettings,
  onAudioSettingsChange,
  onClipComplete,
  autoPlayNext = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatioMode, setAspectRatioMode] = useState<'16:9' | '9:16'>('16:9');
  const [enableDollyZoom, setEnableDollyZoom] = useState(true);
  const [dollySpeed, setDollySpeed] = useState(1.0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [show3DText, setShow3DText] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showInteractiveLaptopModal, setShowInteractiveLaptopModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const duration = clip.duration;

  // Handle Play/Pause
  const handleTogglePlay = async () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  const playVideo = async () => {
    setIsPlaying(true);
    startTimeRef.current = performance.now() - currentTime * 1000;

    // Start background music if enabled
    if (audioSettings.enableAmbientMusic) {
      audioEngine.startCinematicMusic(audioSettings.musicVolume);
    }

    // Play Hindi dialogue voiceover
    const currentProgressRatio = currentTime / duration;
    if (currentProgressRatio < 0.95) {
      // Find remaining text or start fresh
      const availableVoices = audioEngine.getAvailableVoices();
      const chosenVoice = availableVoices[audioSettings.selectedVoiceIndex] || audioEngine.getBestHindiVoice();

      audioEngine.speakDialogue(clip.audioTextHindi, {
        pitch: audioSettings.speechPitch,
        rate: audioSettings.speechRate,
        voice: chosenVoice,
        onBoundary: (_charIdx, elapsed) => {
          // Boundary sync
          setCurrentTime(Math.min(duration, elapsed));
        },
        onEnd: () => {
          // Finished speaking
        },
      });
    }

    // Animation frame timer loop for smooth timeline
    const updateLoop = () => {
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;

      if (elapsed >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
        audioEngine.stopSpeech();
        if (timerRef.current) cancelAnimationFrame(timerRef.current);
        if (onClipComplete) onClipComplete();
      } else {
        setCurrentTime(elapsed);
        timerRef.current = requestAnimationFrame(updateLoop);
      }
    };

    timerRef.current = requestAnimationFrame(updateLoop);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    audioEngine.stopSpeech();
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRestart = () => {
    pauseVideo();
    setCurrentTime(0);
    setTimeout(() => {
      playVideo();
    }, 100);
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(duration, newTime));
    setCurrentTime(clamped);
    startTimeRef.current = performance.now() - clamped * 1000;
    if (isPlaying) {
      audioEngine.stopSpeech();
      // Re-trigger speech from current point if desired
      const chosenVoice = audioEngine.getBestHindiVoice();
      audioEngine.speakDialogue(clip.audioTextHindi, {
        pitch: audioSettings.speechPitch,
        rate: audioSettings.speechRate,
        voice: chosenVoice,
      });
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Calculate Camera Dolly Zoom transform
  // Scale from 1.0 up to 1.08 with smooth ease curve
  const progress = currentTime / duration;
  const zoomFactor = enableDollyZoom ? 1.0 + Math.sin(progress * Math.PI * 0.5) * 0.08 * dollySpeed : 1.0;
  const panY = enableDollyZoom ? Math.sin(progress * Math.PI) * -8 : 0;

  // Cleanup on unmount or clip change
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    audioEngine.stopSpeech();
    audioEngine.stopCinematicMusic();

    if (autoPlayNext) {
      setTimeout(() => {
        playVideo();
      }, 300);
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      audioEngine.stopSpeech();
      audioEngine.stopCinematicMusic();
    };
  }, [clip.id]);

  // Export video simulation/capture
  const handleExportRecording = () => {
    setIsExporting(true);
    setExportProgress(10);
    
    // Simulate high-fidelity rendering pipeline
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            // Trigger sample download
            const blob = new Blob([JSON.stringify({ 
              clip: clip.title, 
              resolution: "4K 3840x2160", 
              fps: 60,
              audio: clip.audioTextHindi,
              timestamp: new Date().toISOString()
            })], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = clip.imageSrc;
            a.download = `IOIS_Viral_Video_Clip_${clip.clipNumber}_4K.jpg`;
            a.click();
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 16:9 Horizontal Cinema Stage Container */}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 flex items-center justify-center ${
          aspectRatioMode === '16:9' ? 'aspect-video max-w-5xl' : 'aspect-[9/16] max-w-sm'
        }`}
      >
        {/* Visual Background Character Layer with Dolly Zoom effect */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `scale(${zoomFactor}) translateY(${panY}px)`,
          }}
        >
          <img
            src={clip.imageSrc}
            alt="Confident 23yo Indian girl in dark blue saree in premium studio"
            className="w-full h-full object-cover object-center select-none"
            referrerPolicy="no-referrer"
          />

          {/* Soft Glam Studio Lighting Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 opacity-90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-blue-950/40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />
        </div>

        {/* Real-time Golden Particle Canvas with drifting embers and flares */}
        <ParticleCanvas density={clip.particleDensity} intensity={1.0} />

        {/* 3D Golden Heading & Shining Phoenix Logo */}
        <GoldenLogoAnd3DText
          text={clip.golden3DText}
          showLogo={showLogo}
          show3DText={show3DText}
          isAnimated={isPlaying}
        />

        {/* Glowing Laptop Screen Area & Quick Interactive Portal Launcher */}
        <div className="absolute bottom-24 sm:bottom-28 right-6 sm:right-12 z-25 pointer-events-auto group">
          <button
            onClick={() => setShowInteractiveLaptopModal(true)}
            className="relative px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-2 shadow-2xl shadow-amber-500/30 backdrop-blur-md transition-all hover:scale-105"
            title="Inspect ioisplatform.github.io/iois live portal"
          >
            <div className="relative">
              <Laptop className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span>Inspect Laptop Screen (IOIS Portal)</span>
          </button>
        </div>

        {/* 4K UHD & Viral YouTube Badges */}
        <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>4K ULTRA HD &bull; 60FPS</span>
          </div>
          <div className="bg-blue-950/80 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[10px] font-bold px-2 py-1 rounded-md">
            CLIP {clip.clipNumber} OF STORY
          </div>
        </div>

        {/* Word-by-Word Karaoke Subtitles Box */}
        {showSubtitles && (
          <KaraokeSubtitles
            currentTime={currentTime}
            duration={duration}
            subtitles={clip.subtitles}
            fullHindiText={clip.audioTextHindi}
            fullEnglishText={clip.audioTextEnglish}
            showDevanagari={audioSettings.enableHindiDevanagari}
            showEnglish={audioSettings.enableHinglishRoman}
            isPlaying={isPlaying}
          />
        )}

        {/* Play Overlay Button if Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={playVideo}
              className="group relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute -inset-3 bg-amber-400/30 rounded-full blur-lg group-hover:bg-amber-400/50 animate-pulse" />
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-slate-950 text-slate-950" />
            </button>
          </div>
        )}

        {/* Bottom Scrubber & Quick HUD on Hover */}
        <div className="absolute bottom-0 inset-x-0 z-35 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3 pt-6 flex flex-col gap-2">
          {/* Progress Timeline Scrubber */}
          <div className="relative w-full flex items-center group cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.05"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:h-2 transition-all"
            />
            {/* Custom glowing progress fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-lg pointer-events-none"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 text-white">
            {/* Left Playback controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleTogglePlay}
                className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Restart Clip"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Time display */}
              <span className="text-xs font-mono font-medium text-slate-300 ml-1">
                {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>

            {/* Middle Quick Toggles */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setEnableDollyZoom(!enableDollyZoom)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  enableDollyZoom
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
                title="Toggle Slow Cinematic Dolly Zoom Motion"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Dolly Zoom</span>
              </button>

              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  showSubtitles
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
                title="Toggle Karaoke Subtitles"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Subtitles</span>
              </button>

              <button
                onClick={() => setShow3DText(!show3DText)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  show3DText
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
                title="Toggle 3D Golden Heading"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Title</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newMusic = !audioSettings.enableAmbientMusic;
                  onAudioSettingsChange({ ...audioSettings, enableAmbientMusic: newMusic });
                  if (newMusic) audioEngine.startCinematicMusic(audioSettings.musicVolume);
                  else audioEngine.stopCinematicMusic();
                }}
                className={`p-2 rounded-lg transition-all ${
                  audioSettings.enableAmbientMusic
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-900/80 text-slate-500'
                }`}
                title="Toggle Ambient Studio Synth Track"
              >
                {audioSettings.enableAmbientMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setAspectRatioMode(aspectRatioMode === '16:9' ? '9:16' : '16:9')}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold border border-slate-800 transition-all"
                title="Switch Aspect Ratio (16:9 Horizontal vs 9:16 Vertical Shorts)"
              >
                {aspectRatioMode}
              </button>

              <button
                onClick={handleExportRecording}
                disabled={isExporting}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                title="Export Clip as 4K Video / High-Res Frame"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? `${exportProgress}%` : 'Export'}</span>
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive IOIS Laptop Screen Modal */}
      {showInteractiveLaptopModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 rounded-2xl border border-amber-500/40 shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  Presenter's Glowing Laptop Display &bull; IOIS Platform Live
                </h3>
              </div>
              <button
                onClick={() => setShowInteractiveLaptopModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close & Return to Video
              </button>
            </div>

            <InteractiveIOISPortal />
          </div>
        </div>
      )}
    </div>
  );
};
