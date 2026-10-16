// Unified Audio Engine handling Local Audio (HTML5 Audio + Web Audio API synthesizer)
// and YouTube Music streams via YouTube IFrame API.

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface AudioEngineCallbacks {
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  onTrackEnd: () => void;
  onError: (msg: string) => void;
}

class AudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private synthGainNode: GainNode | null = null;
  private isSynthPlaying = false;
  private synthInterval: any = null;
  private synthStartTime = 0;
  private synthDuration = 180;

  private ytPlayer: any = null;
  private ytReady = false;
  private ytPlayerContainerId = 'yt-player-host';
  private ytInterval: any = null;

  private callbacks: AudioEngineCallbacks = {
    onTimeUpdate: () => {},
    onStateChange: () => {},
    onTrackEnd: () => {},
    onError: () => {},
  };

  private currentSource: 'local' | 'youtube' = 'local';
  private isPlaying = false;
  private currentVolume = 85;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
      this.initYouTubeAPI();
    }
  }

  public setCallbacks(callbacks: AudioEngineCallbacks) {
    this.callbacks = callbacks;
  }

  private initAudioElement() {
    this.audioElement = new Audio();
    this.audioElement.volume = this.currentVolume / 100;

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.currentSource === 'local' && !this.isSynthPlaying && this.audioElement) {
        this.callbacks.onTimeUpdate(
          this.audioElement.currentTime,
          this.audioElement.duration || 180
        );
      }
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.callbacks.onStateChange(true);
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.callbacks.onStateChange(false);
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.callbacks.onStateChange(false);
      this.callbacks.onTrackEnd();
    });

    this.audioElement.addEventListener('error', () => {
      // If audio file URL fails, fallback to synthesized audio
      this.startSynthesizerTrack(180);
    });
  }

  private initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.synthGainNode = this.audioContext.createGain();
        this.synthGainNode.gain.setValueAtTime(this.currentVolume / 100, this.audioContext.currentTime);
        this.synthGainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
    }
  }

  private initYouTubeAPI() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.ytReady = true;
      this.mountYouTubePlayer();
      return;
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      this.ytReady = true;
      this.mountYouTubePlayer();
    };

    if (!document.getElementById('yt-iframe-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }

  private mountYouTubePlayer() {
    if (!this.ytReady || this.ytPlayer) return;
    const container = document.getElementById(this.ytPlayerContainerId);
    if (!container) return;

    try {
      this.ytPlayer = new window.YT.Player(this.ytPlayerContainerId, {
        height: '100%',
        width: '100%',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            this.ytPlayer.setVolume(this.currentVolume);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) {
              this.isPlaying = true;
              this.callbacks.onStateChange(true);
              this.startYouTubeProgressTracker();
            } else if (event.data === 2) {
              this.isPlaying = false;
              this.callbacks.onStateChange(false);
              this.stopYouTubeProgressTracker();
            } else if (event.data === 0) {
              this.isPlaying = false;
              this.callbacks.onStateChange(false);
              this.stopYouTubeProgressTracker();
              this.callbacks.onTrackEnd();
            }
          },
          onError: (err: any) => {
            console.warn('YouTube Player notice:', err);
            // Non-fatal, fallback to synth stream
            this.startSynthesizerTrack(200);
          },
        },
      });
    } catch (e) {
      console.warn('YT Player init skipped:', e);
    }
  }

  private startYouTubeProgressTracker() {
    this.stopYouTubeProgressTracker();
    this.ytInterval = setInterval(() => {
      if (this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        const cur = this.ytPlayer.getCurrentTime() || 0;
        const dur = this.ytPlayer.getDuration() || 240;
        this.callbacks.onTimeUpdate(cur, dur);
      }
    }, 500);
  }

  private stopYouTubeProgressTracker() {
    if (this.ytInterval) {
      clearInterval(this.ytInterval);
      this.ytInterval = null;
    }
  }

  // Synthesizer that generates pleasing harmonic chords and beats for local tracks
  private startSynthesizerTrack(duration: number) {
    this.initAudioContext();
    if (!this.audioContext || !this.synthGainNode) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.isSynthPlaying = true;
    this.synthDuration = duration || 180;
    this.synthStartTime = this.audioContext.currentTime;
    this.isPlaying = true;
    this.callbacks.onStateChange(true);

    if (this.synthInterval) clearInterval(this.synthInterval);

    // Play generative harmonic notes in a soothing pentatonic sequence
    const notes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25];
    let noteIndex = 0;

    const playPulse = () => {
      if (!this.isSynthPlaying || !this.audioContext || !this.synthGainNode) return;
      try {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex++;

        osc.type = noteIndex % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(noteGain);
        noteGain.connect(this.synthGainNode);

        osc.start(now);
        osc.stop(now + 0.65);
      } catch (err) {
        // Safe synth handle
      }
    };

    playPulse();
    this.synthInterval = setInterval(() => {
      if (!this.isSynthPlaying) return;
      playPulse();
      const elapsed = (this.audioContext?.currentTime || 0) - this.synthStartTime;
      this.callbacks.onTimeUpdate(elapsed % this.synthDuration, this.synthDuration);
      if (elapsed >= this.synthDuration) {
        this.stopSynthesizer();
        this.callbacks.onTrackEnd();
      }
    }, 600);
  }

  private stopSynthesizer() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public playTrack(track: {
    source: 'local' | 'youtube';
    audioUrl?: string;
    youtubeId?: string;
    duration: number;
  }) {
    this.currentSource = track.source;
    this.stopSynthesizer();

    if (track.source === 'youtube') {
      if (this.audioElement) {
        this.audioElement.pause();
      }

      if (this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
        const vid = track.youtubeId || 'jfKfPfyJRdk';
        this.ytPlayer.loadVideoById(vid);
        this.ytPlayer.playVideo();
      } else {
        // Fallback to synth if YT iframe not yet bound
        this.startSynthesizerTrack(track.duration);
      }
    } else {
      // Local source
      if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
      }
      this.stopYouTubeProgressTracker();

      if (track.audioUrl && this.audioElement) {
        this.audioElement.src = track.audioUrl;
        this.audioElement.play().catch(() => {
          this.startSynthesizerTrack(track.duration);
        });
      } else {
        this.startSynthesizerTrack(track.duration);
      }
    }
  }

  public play() {
    if (this.currentSource === 'youtube') {
      if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.playVideo();
      } else {
        this.startSynthesizerTrack(180);
      }
    } else {
      if (this.audioElement && this.audioElement.src && !this.isSynthPlaying) {
        this.audioElement.play().catch(() => {
          this.startSynthesizerTrack(180);
        });
      } else {
        this.startSynthesizerTrack(180);
      }
    }
  }

  public pause() {
    if (this.currentSource === 'youtube') {
      if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
      }
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthesizer();
    this.isPlaying = false;
    this.callbacks.onStateChange(false);
  }

  public seek(seconds: number) {
    if (this.currentSource === 'youtube') {
      if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        this.ytPlayer.seekTo(seconds, true);
      }
    } else {
      if (this.audioElement && this.audioElement.src && !this.isSynthPlaying) {
        this.audioElement.currentTime = seconds;
      }
    }
  }

  public setVolume(volPercent: number) {
    this.currentVolume = Math.max(0, Math.min(100, volPercent));
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume / 100;
    }
    if (this.synthGainNode && this.audioContext) {
      this.synthGainNode.gain.setValueAtTime(this.currentVolume / 100, this.audioContext.currentTime);
    }
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      this.ytPlayer.setVolume(this.currentVolume);
    }
  }

  public getVisualizerData(): number[] {
    if (this.analyser) {
      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(buffer);
      // Return 16 normalized values (0 to 1)
      const step = Math.floor(buffer.length / 16) || 1;
      const res: number[] = [];
      for (let i = 0; i < 16; i++) {
        res.push((buffer[i * step] || 0) / 255);
      }
      return res;
    }

    // Dynamic simulated wave if direct analyser not active
    if (!this.isPlaying) {
      return new Array(16).fill(0.08);
    }
    const t = Date.now() / 300;
    return Array.from({ length: 16 }, (_, i) => {
      const wave = Math.sin(t + i * 0.45) * 0.4 + 0.5;
      return Math.max(0.1, Math.min(1, wave));
    });
  }
}

export const audioEngine = new AudioEngine();
