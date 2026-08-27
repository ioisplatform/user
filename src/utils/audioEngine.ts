/**
 * High quality Audio & Speech Engine for IOIS Cinematic Viral Video
 */

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private voiceGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private activeOscillators: OscillatorNode[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.availableVoices = window.speechSynthesis.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0) {
      this.loadVoices();
    }
    return this.availableVoices;
  }

  public getBestHindiVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    
    // Priority 1: Exact hi-IN female voices
    const hindiFemale = voices.find(
      v => (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in')) &&
           (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('heera') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('geeta') ||
            v.name.toLowerCase().includes('lekha') ||
            v.name.toLowerCase().includes('google हिन्दी'))
    );
    if (hindiFemale) return hindiFemale;

    // Priority 2: Any Hindi voice
    const anyHindi = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
    if (anyHindi) return anyHindi;

    // Priority 3: Indian English female voice
    const inFemale = voices.find(
      v => (v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase().includes('in')) &&
           (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('prabhat'))
    );
    if (inFemale) return inFemale;

    // Priority 4: Any pleasant female voice
    const anyFemale = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria') || v.name.toLowerCase().includes('karen'));
    if (anyFemale) return anyFemale;

    return voices[0] || null;
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      
      this.musicGainNode = this.audioCtx.createGain();
      this.musicGainNode.gain.value = 0.25;
      this.musicGainNode.connect(this.audioCtx.destination);

      this.voiceGainNode = this.audioCtx.createGain();
      this.voiceGainNode.gain.value = 1.0;
      this.voiceGainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Generates a lush, cinematic ambient musical pad with golden sparkles
   */
  public startCinematicMusic(volume: number = 0.25) {
    try {
      this.initAudioContext();
      if (!this.audioCtx || !this.musicGainNode) return;

      this.stopCinematicMusic();
      this.isMusicPlaying = true;
      this.musicGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

      const rootFreqs = [146.83, 220.0, 261.63, 329.63]; // D3, A3, C4, E4 (Cinematic Atmospheric Chord)
      const now = this.audioCtx.currentTime;

      // Filter for warm studio sound
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(2.0, now);
      filter.connect(this.musicGainNode);

      // LFO for slow breath-like movement
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, now);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(200, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.activeOscillators.push(lfo);

      // Main chord oscillators
      rootFreqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const oscGain = this.audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.08, now);
        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start(now);
        this.activeOscillators.push(osc);
      });

      // Sub Bass warmth
      const subOsc = this.audioCtx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(73.42, now); // D2
      const subGain = this.audioCtx.createGain();
      subGain.gain.setValueAtTime(0.12, now);
      subOsc.connect(subGain);
      subGain.connect(filter);
      subOsc.start(now);
      this.activeOscillators.push(subOsc);

    } catch (e) {
      console.warn('Could not start ambient music:', e);
    }
  }

  public stopCinematicMusic() {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
    this.isMusicPlaying = false;
  }

  public setMusicVolume(volume: number) {
    if (this.musicGainNode && this.audioCtx) {
      this.musicGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioCtx.currentTime);
    }
  }

  /**
   * Speak the Hindi dialogue using Web Speech API with customized sweet & confident female tone
   */
  public speakDialogue(
    text: string,
    options: {
      pitch?: number;
      rate?: number;
      voice?: SpeechSynthesisVoice | null;
      onBoundary?: (charIndex: number, elapsedTime: number) => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const chosenVoice = options.voice || this.getBestHindiVoice();
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Sweet, confident, attractive pitch and natural pace
      utterance.pitch = options.pitch !== undefined ? options.pitch : 1.18; // slightly higher sweet tone
      utterance.rate = options.rate !== undefined ? options.rate : 0.95; // clear articulate pace
      utterance.lang = chosenVoice?.lang || 'hi-IN';

      const startTime = performance.now();

      utterance.onboundary = (event) => {
        const elapsed = (performance.now() - startTime) / 1000;
        if (options.onBoundary) {
          options.onBoundary(event.charIndex, elapsed);
        }
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        if (options.onError) options.onError(e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
  }

  public playBase64Audio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stopSpeech();
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      audio.onended = () => {
        this.currentAudioElement = null;
        resolve();
      };
      audio.onerror = (e) => {
        this.currentAudioElement = null;
        reject(e);
      };
      audio.play().catch(reject);
    });
  }
}

export const audioEngine = new AudioEngine();
