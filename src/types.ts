export interface SubtitleWord {
  word: string;
  start: number; // in seconds
  end: number;
}

export interface StoryClip {
  id: string;
  clipNumber: number;
  title: string;
  tagline: string;
  duration: number; // in seconds
  imageSrc: string;
  audioTextHindi: string;
  audioTextEnglish: string;
  subtitles: SubtitleWord[];
  golden3DText: string;
  dollyZoomEffect: 'slow-in' | 'slow-out' | 'pan-zoom' | 'dramatic-push';
  lightingStyle: 'dark-blue-gold' | 'neon-cyan-gold' | 'glam-studio';
  particleDensity: 'subtle' | 'high' | 'ultra';
  voiceTone: string;
  status: 'ready' | 'generating';
}

export interface IOISCourse {
  id: string;
  title: string;
  category: 'Student' | 'Housewife' | 'Beginner' | 'Advanced';
  duration: string;
  enrolled: string;
  rating: number;
  badge: string;
  description: string;
  modules: string[];
}

export interface AudioSettings {
  speechRate: number;
  speechPitch: number;
  musicVolume: number;
  voiceVolume: number;
  selectedVoiceIndex: number;
  enableAmbientMusic: boolean;
  enableHindiDevanagari: boolean;
  enableHinglishRoman: boolean;
}
