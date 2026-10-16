export type AudioSourceType = 'local' | 'youtube';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  source: AudioSourceType;
  coverGradient: string;
  coverImage?: string;
  audioUrl?: string; // For local files or demo audio
  youtubeId?: string; // Real YouTube Video ID for YT Music sync
  format?: string; // MP3, FLAC, WAV, AAC
  fileSize?: string;
  genre?: string;
  lyrics?: string[];
  addedAt: number;
}

export type GlassTheme = 
  | 'frost-aqua' 
  | 'amethyst-violet' 
  | 'solar-amber' 
  | 'emerald-aurora' 
  | 'obsidian-prism' 
  | 'rose-quartz' 
  | 'cyber-neon';

export type IconGlyph = 
  | 'note' 
  | 'vinyl' 
  | 'wave' 
  | 'headphones' 
  | 'cassette' 
  | 'aura' 
  | 'equalizer';

export interface LiquidGlassIconConfig {
  theme: GlassTheme;
  glyph: IconGlyph;
  blurStrength: number; // 8 to 40
  refractionIndex: number; // 1.0 to 2.5
  liquidFluidity: number; // 0.2 to 2.0
  specularGlow: number; // 0.2 to 1.0
  borderGleam: boolean;
  animatedRipples: boolean;
}

export interface ApkConfig {
  name: string;
  packageName: string;
  version: string;
  buildType: 'Release' | 'Preview' | 'Liquid MOD';
  showApkBadgeOnHome: boolean;
  launcherIconShape: 'squircle' | 'circle' | 'rounded' | 'teardrop';
  lastModified: number;
}

export interface UserProfile {
  id: string;
  type: 'guest' | 'member';
  displayName: string;
  guestTag: string; // e.g. #7402
  avatarSeed: string;
  incognitoHistory: boolean;
  sessionMinutes: number;
  favoriteTrackIds: string[];
  listeningHistory: { trackId: string; playedAt: number }[];
  createdAt: number;
}

export interface YouTubeSyncState {
  isConnected: boolean;
  accountName: string;
  channelId: string;
  syncedPlaylistsCount: number;
  lastSyncTime: number | null;
  autoSync: boolean;
  streamQuality: 'High (320kbps)' | 'Balanced (256kbps)' | 'Data Saver (128kbps)';
  syncedTrackCount: number;
}

export interface SleepTimerState {
  isActive: boolean;
  totalSeconds: number;
  remainingSeconds: number;
  stopAtEndOfTrack: boolean;
}

export type SuggestionMood = 'all' | 'chill' | 'energy' | 'focus' | 'drive' | 'acoustic';

export interface SuggestedTrack extends Track {
  reason: string;
  matchScore: number; // e.g. 98% match
  mood: SuggestionMood;
}

export type ActiveTab = 'home' | 'suggestions' | 'youtube' | 'local' | 'icons' | 'apk' | 'artifacts' | 'settings' | 'profile';
