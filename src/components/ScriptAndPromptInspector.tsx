import React, { useState } from 'react';
import { StoryClip, AudioSettings } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { 
  FileText, 
  Copy, 
  Check, 
  Mic, 
  Sliders, 
  Volume2, 
  Sparkles, 
  Layers, 
  Code,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';

interface Props {
  clip: StoryClip;
  audioSettings: AudioSettings;
  onAudioSettingsChange: (settings: AudioSettings) => void;
  onUpdateClipText: (hindiText: string, goldenText: string) => void;
}

export const ScriptAndPromptInspector: React.FC<Props> = ({
  clip,
  audioSettings,
  onAudioSettingsChange,
  onUpdateClipText,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAudio, setCopiedAudio] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [editableHindi, setEditableHindi] = useState(clip.audioTextHindi);
  const [editableGolden, setEditableGolden] = useState(clip.golden3DText);

  const fullPromptText = `Cinematic viral video, beautiful confident Indian girl age 23, wearing elegant dark blue saree with golden border, long black hair, professional look, standing in premium studio with dark blue background and golden particle lights, holding a glowing laptop showing website ioisplatform.github.io/iois homepage, golden phoenix IOIS logo shining top right, 3D golden text animation "${clip.golden3DText}", soft glam lighting, camera slow dolly zoom, 16:9 horizontal, 4k photorealistic, ultra beautiful, YouTube viral style, first clip of story

Audio: "${clip.audioTextHindi}"
Voice: Hindi female, sweet, confident, attractive, viral influencer style
Duration: ${clip.duration} seconds
Style: Premium, attractive, curiosity, trustworthy, no money mention
Character must be same girl for all next clips`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyAudio = () => {
    navigator.clipboard.writeText(clip.audioTextHindi);
    setCopiedAudio(true);
    setTimeout(() => setCopiedAudio(false), 2000);
  };

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    const availableVoices = audioEngine.getAvailableVoices();
    const chosenVoice = availableVoices[audioSettings.selectedVoiceIndex] || audioEngine.getBestHindiVoice();

    await audioEngine.speakDialogue(editableHindi, {
      pitch: audioSettings.speechPitch,
      rate: audioSettings.speechRate,
      voice: chosenVoice,
    });
    setIsTestingVoice(false);
  };

  const handleSaveTextChanges = () => {
    onUpdateClipText(editableHindi, editableGolden);
  };

  const voices = audioEngine.getAvailableVoices();

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Viral Clip Prompt & Voice Synthesizer Studio
            </h3>
            <p className="text-xs text-slate-400">
              Live Hindi TTS voice tuning, AI prompt parameters & YouTube clip metadata
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyPrompt}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
        >
          {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Full AI Prompt'}</span>
        </button>
      </div>

      {/* Grid: Left: Voice Controls & Hindi Dialogue | Right: Prompt & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Voice Tuning & Dialogue */}
        <div className="flex flex-col gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Mic className="w-4 h-4" />
              <span>HINDI FEMALE VOICE TUNER</span>
            </div>
            <button
              onClick={handleTestVoice}
              disabled={isTestingVoice}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              <span>{isTestingVoice ? 'Speaking...' : 'Test Voice'}</span>
            </button>
          </div>

          {/* Hindi Script Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Hindi Dialogue Script:</span>
              <button
                onClick={handleCopyAudio}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
              >
                {copiedAudio ? 'Copied!' : 'Copy Text'}
              </button>
            </label>
            <textarea
              rows={3}
              value={editableHindi}
              onChange={(e) => setEditableHindi(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400/60 leading-relaxed"
            />
          </div>

          {/* 3D Golden Heading Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              3D Golden Animation Heading:
            </label>
            <input
              type="text"
              value={editableGolden}
              onChange={(e) => setEditableGolden(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Voice Presets */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onAudioSettingsChange({ ...audioSettings, speechPitch: 1.25, speechRate: 0.95 })}
              className={`p-2 rounded-lg border text-left transition-all ${
                audioSettings.speechPitch > 1.2
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">✨ Sweet Influencer</div>
              <div className="text-[9px] text-slate-400">Sweet & Welcoming</div>
            </button>

            <button
              onClick={() => onAudioSettingsChange({ ...audioSettings, speechPitch: 1.15, speechRate: 0.98 })}
              className={`p-2 rounded-lg border text-left transition-all ${
                audioSettings.speechPitch >= 1.1 && audioSettings.speechPitch <= 1.2
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">🎯 Confident Pro</div>
              <div className="text-[9px] text-slate-400">Crisp & Trustworthy</div>
            </button>

            <button
              onClick={() => onAudioSettingsChange({ ...audioSettings, speechPitch: 1.18, speechRate: 1.08 })}
              className={`p-2 rounded-lg border text-left transition-all ${
                audioSettings.speechRate > 1.0
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold">⚡ Viral Fast Hook</div>
              <div className="text-[9px] text-slate-400">Energetic Pace</div>
            </button>
          </div>

          {/* Sliders for Pitch and Speed */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Sweet Pitch:</span>
                <span className="font-mono text-amber-400">{audioSettings.speechPitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.02"
                value={audioSettings.speechPitch}
                onChange={(e) => onAudioSettingsChange({ ...audioSettings, speechPitch: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Speaking Rate:</span>
                <span className="font-mono text-amber-400">{audioSettings.speechRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.02"
                value={audioSettings.speechRate}
                onChange={(e) => onAudioSettingsChange({ ...audioSettings, speechRate: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Save updates button */}
          <button
            onClick={handleSaveTextChanges}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-all mt-1 cursor-pointer"
          >
            Apply Changes to Video Player
          </button>
        </div>

        {/* Right Column: Prompt Breakdown & Production Specs */}
        <div className="flex flex-col gap-3.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>EXACT SPECIFICATIONS & VIRAL PROMPT</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Character Model:</span>
              <span className="text-slate-200 font-semibold">23yo Confident Indian Girl, Long Black Hair</span>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Attire:</span>
              <span className="text-amber-300 font-semibold">Dark Blue Silk Saree with Golden Border</span>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Studio Setting:</span>
              <span className="text-slate-200 font-semibold">Dark Blue Studio with Floating Golden Particles</span>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Live Prop:</span>
              <span className="text-slate-200 font-semibold">Glowing Laptop (ioisplatform.github.io/iois)</span>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Top-Right Emblem:</span>
              <span className="text-amber-300 font-semibold">Golden Phoenix IOIS Logo</span>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Camera Dynamic:</span>
              <span className="text-slate-200 font-semibold">Slow Dolly Zoom & Soft Glam Lighting (16:9 4K)</span>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Duration & Tone:</span>
              <span className="text-emerald-400 font-semibold">10s &bull; Trustworthy, Curiosity, No Money Mention</span>
            </div>

            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center gap-2 text-amber-300 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Character consistency locked across all story clips!</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
