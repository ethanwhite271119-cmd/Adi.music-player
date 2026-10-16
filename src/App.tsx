import React, { useState, useEffect, useRef } from 'react';
import { 
  ActiveTab, 
  ApkConfig, 
  LiquidGlassIconConfig, 
  Track, 
  UserProfile, 
  YouTubeSyncState,
  SleepTimerState
} from './types';
import { INITIAL_LOCAL_TRACKS, INITIAL_YOUTUBE_TRACKS } from './data/mockTracks';
import { audioEngine } from './utils/audioEngine';
import { updateFaviconWithLiquidGlass } from './utils/iconGenerator';
import { TopBar } from './components/TopBar';
import { MusicPlayerBar } from './components/MusicPlayerBar';
import { ExpandedPlayerModal } from './components/ExpandedPlayerModal';
import { HomeStream } from './components/HomeStream';
import { YouTubeSyncPanel } from './components/YouTubeSyncPanel';
import { LocalScannerPanel } from './components/LocalScannerPanel';
import { DynamicIconStudio } from './components/DynamicIconStudio';
import { ApkManagerPanel } from './components/ApkManagerPanel';
import { GuestProfileModal } from './components/GuestProfileModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SettingsModal } from './components/SettingsModal';
import { ArtifactsPanel } from './components/ArtifactsPanel';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSleepTimerModalOpen, setIsSleepTimerModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [sleepNotification, setSleepNotification] = useState<string | null>(null);

  // Playback Features
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(true);
  const [crossfadeDuration, setCrossfadeDuration] = useState(4);

  // Sleep Timer State
  const [sleepTimer, setSleepTimer] = useState<SleepTimerState>({
    isActive: false,
    totalSeconds: 0,
    remainingSeconds: 0,
    stopAtEndOfTrack: false,
  });

  // APK Branding Config (with default name displayed on Home page)
  const [apkConfig, setApkConfig] = useState<ApkConfig>(() => {
    try {
      const saved = localStorage.getItem('aurasound_apk_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'AuraSound APK',
      packageName: 'com.aurasound.musicplayer',
      version: 'v3.4.0',
      buildType: 'Release',
      showApkBadgeOnHome: true,
      launcherIconShape: 'squircle',
      lastModified: Date.now(),
    };
  });

  // Dynamic Liquid Glass Icon Config
  const [iconConfig, setIconConfig] = useState<LiquidGlassIconConfig>(() => {
    try {
      const saved = localStorage.getItem('aurasound_icon_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      theme: 'frost-aqua',
      glyph: 'note',
      blurStrength: 18,
      refractionIndex: 1.5,
      liquidFluidity: 1.0,
      specularGlow: 0.85,
      borderGleam: true,
      animatedRipples: true,
    };
  });

  // User Profile (Default: Guest User Profile)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('aurasound_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'guest-session-1',
      type: 'guest',
      displayName: 'Guest Listener',
      guestTag: '#7402',
      avatarSeed: 'aura-seed',
      incognitoHistory: true,
      sessionMinutes: 18,
      favoriteTrackIds: ['yt-1', 'local-1'],
      listeningHistory: [],
      createdAt: Date.now(),
    };
  });

  // YouTube Sync State
  const [ytSync, setYtSync] = useState<YouTubeSyncState>(() => {
    try {
      const saved = localStorage.getItem('aurasound_yt_sync');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isConnected: true,
      accountName: 'YouTube Music Live',
      channelId: 'UC_AuraMusic',
      syncedPlaylistsCount: 4,
      lastSyncTime: Date.now() - 3600000,
      autoSync: true,
      streamQuality: 'High (320kbps)',
      syncedTrackCount: INITIAL_YOUTUBE_TRACKS.length,
    };
  });

  // Tracks Library
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('aurasound_tracks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [...INITIAL_YOUTUBE_TRACKS, ...INITIAL_LOCAL_TRACKS];
  });

  // Playback State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(214);
  const [volume, setVolume] = useState(85);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [isShuffle, setIsShuffle] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aurasound_apk_config', JSON.stringify(apkConfig));
    } catch (e) {}
    document.title = `${apkConfig.name} - YouTube Music`;
  }, [apkConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('aurasound_icon_config', JSON.stringify(iconConfig));
      updateFaviconWithLiquidGlass(iconConfig);
    } catch (e) {}
  }, [iconConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('aurasound_user_profile', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('aurasound_yt_sync', JSON.stringify(ytSync));
    } catch (e) {}
  }, [ytSync]);

  useEffect(() => {
    try {
      // Don't persist object URLs
      const safe = tracks.map((t) => ({ ...t, audioUrl: undefined }));
      localStorage.setItem('aurasound_tracks', JSON.stringify(safe));
    } catch (e) {}
  }, [tracks]);

  // Session timer for Guest profile
  useEffect(() => {
    const timer = setInterval(() => {
      setUserProfile((prev) => ({
        ...prev,
        sessionMinutes: prev.sessionMinutes + 1,
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sleep Timer Countdown Interval
  useEffect(() => {
    if (!sleepTimer.isActive || sleepTimer.stopAtEndOfTrack) return;

    const interval = setInterval(() => {
      setSleepTimer((prev) => {
        if (!prev.isActive || prev.stopAtEndOfTrack) return prev;
        if (prev.remainingSeconds <= 1) {
          audioEngine.pause();
          setSleepNotification('Sleep timer ended · Playback paused');
          setTimeout(() => setSleepNotification(null), 4000);
          return {
            isActive: false,
            totalSeconds: 0,
            remainingSeconds: 0,
            stopAtEndOfTrack: false,
          };
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimer.isActive, sleepTimer.stopAtEndOfTrack]);

  // Audio Engine Event Wiring
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (cur, dur) => {
        setCurrentTime(cur);
        if (dur > 0) setDuration(dur);
      },
      onStateChange: (playing) => {
        setIsPlaying(playing);
      },
      onTrackEnd: () => {
        if (sleepTimer.isActive && sleepTimer.stopAtEndOfTrack) {
          audioEngine.pause();
          setSleepTimer({
            isActive: false,
            totalSeconds: 0,
            remainingSeconds: 0,
            stopAtEndOfTrack: false,
          });
          setSleepNotification('Song ended · Sleep timer paused playback');
          setTimeout(() => setSleepNotification(null), 4000);
          return;
        }
        handleNextTrack();
      },
      onError: (msg) => {
        console.warn('Audio playback notice:', msg);
      },
    });
  }, [currentTrack, tracks, repeatMode, isShuffle, sleepTimer]);

  const handleSetSleepTimer = (minutes: number, endOfTrack?: boolean) => {
    if (endOfTrack) {
      setSleepTimer({
        isActive: true,
        totalSeconds: 0,
        remainingSeconds: 0,
        stopAtEndOfTrack: true,
      });
      setSleepNotification('Sleep timer set: Stopping at end of current song');
      setTimeout(() => setSleepNotification(null), 3000);
    } else {
      const sec = minutes * 60;
      setSleepTimer({
        isActive: true,
        totalSeconds: sec,
        remainingSeconds: sec,
        stopAtEndOfTrack: false,
      });
      setSleepNotification(`Sleep timer set: ${minutes} minutes`);
      setTimeout(() => setSleepNotification(null), 3000);
    }
  };

  const handleCancelSleepTimer = () => {
    setSleepTimer({
      isActive: false,
      totalSeconds: 0,
      remainingSeconds: 0,
      stopAtEndOfTrack: false,
    });
    setSleepNotification('Sleep timer cancelled');
    setTimeout(() => setSleepNotification(null), 2500);
  };

  const handleAddSleepTimerMinutes = (extraMinutes: number) => {
    setSleepTimer((prev) => {
      if (!prev.isActive) return prev;
      const addSec = extraMinutes * 60;
      return {
        ...prev,
        totalSeconds: prev.totalSeconds + addSec,
        remainingSeconds: prev.remainingSeconds + addSec,
      };
    });
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration || 180);
    audioEngine.playTrack(track);

    // Record to history if not incognito
    if (!userProfile.incognitoHistory) {
      setUserProfile((prev) => ({
        ...prev,
        listeningHistory: [
          { trackId: track.id, playedAt: Date.now() },
          ...prev.listeningHistory.slice(0, 50),
        ],
      }));
    }
  };

  const handlePlayPause = () => {
    if (!currentTrack) {
      if (tracks.length > 0) handlePlayTrack(tracks[0]);
      return;
    }
    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
  };

  const handleNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;

    if (repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    if (isShuffle) {
      const remaining = tracks.filter((t) => t.id !== currentTrack.id);
      const next = remaining[Math.floor(Math.random() * remaining.length)] || tracks[0];
      handlePlayTrack(next);
      return;
    }

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handlePlayTrack(tracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    if (currentTime > 4) {
      audioEngine.seek(0);
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handlePlayTrack(tracks[prevIndex]);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  const handleToggleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(next);
  };

  const handleToggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleToggleFavorite = (trackId: string) => {
    setUserProfile((prev) => {
      const exists = prev.favoriteTrackIds.includes(trackId);
      return {
        ...prev,
        favoriteTrackIds: exists
          ? prev.favoriteTrackIds.filter((id) => id !== trackId)
          : [...prev.favoriteTrackIds, trackId],
      };
    });
  };

  const handleAddTrack = (newTrack: Track) => {
    setTracks((prev) => [newTrack, ...prev]);
  };

  const handleAddMultipleTracks = (newTracks: Track[]) => {
    setTracks((prev) => [...newTracks, ...prev]);
  };

  const handleRemoveTrack = (trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      audioEngine.pause();
      const remain = tracks.filter((t) => t.id !== trackId);
      setCurrentTrack(remain[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Hidden YouTube IFrame container host */}
      <div 
        id="yt-player-host" 
        className="fixed -left-[9999px] -top-[9999px] w-1 h-1 pointer-events-none opacity-0"
      />

      {/* Top Bar with Top Bar Contract compliance */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apkConfig={apkConfig}
        iconConfig={iconConfig}
        userProfile={userProfile}
        ytSync={ytSync}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-36">
        {activeTab === 'home' && (
          <HomeStream
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            apkConfig={apkConfig}
            iconConfig={iconConfig}
            userProfile={userProfile}
            ytSync={ytSync}
            onChangeApkConfig={setApkConfig}
            onPlayTrack={handlePlayTrack}
            onOpenExpandedPlayer={() => setIsExpandedPlayerOpen(true)}
            setActiveTab={setActiveTab}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'suggestions' && (
          <SuggestionsPanel
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            userProfile={userProfile}
            onPlayTrack={handlePlayTrack}
            onAddToQueue={(track) => {
              setTracks((prev) => {
                if (prev.some((p) => p.id === track.id)) return prev;
                return [...prev, track];
              });
              setSleepNotification(`Added "${track.title}" to queue`);
              setTimeout(() => setSleepNotification(null), 2500);
            }}
            onPlayAllSuggestions={(suggestions) => {
              if (suggestions.length > 0) {
                setTracks((prev) => {
                  const newTracks = suggestions.filter((s) => !prev.some((p) => p.id === s.id));
                  return [...newTracks, ...prev];
                });
                handlePlayTrack(suggestions[0]);
                setSleepNotification(`Playing ${suggestions.length} suggested tracks`);
                setTimeout(() => setSleepNotification(null), 3000);
              }
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'youtube' && (
          <YouTubeSyncPanel
            syncState={ytSync}
            onUpdateSyncState={(upd) => setYtSync((prev) => ({ ...prev, ...upd }))}
            tracks={tracks}
            onAddTrack={handleAddTrack}
            onPlayTrack={handlePlayTrack}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
          />
        )}

        {activeTab === 'local' && (
          <LocalScannerPanel
            tracks={tracks}
            onAddTracks={handleAddMultipleTracks}
            onRemoveTrack={handleRemoveTrack}
            onPlayTrack={handlePlayTrack}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
          />
        )}

        {activeTab === 'icons' && (
          <DynamicIconStudio
            config={iconConfig}
            onChangeConfig={setIconConfig}
            apkConfig={apkConfig}
          />
        )}

        {activeTab === 'apk' && (
          <ApkManagerPanel
            apkConfig={apkConfig}
            onChangeApkConfig={setApkConfig}
            iconConfig={iconConfig}
          />
        )}

        {activeTab === 'artifacts' && (
          <ArtifactsPanel />
        )}
      </main>

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasPlayerBar={Boolean(currentTrack)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Persistent Bottom Music Player Bar */}
      <MusicPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        sleepTimer={sleepTimer}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleRepeat={handleToggleRepeat}
        onToggleShuffle={handleToggleShuffle}
        onOpenExpandedPlayer={() => setIsExpandedPlayerOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerModalOpen(true)}
      />

      {/* Full-Screen Expanded Player Modal with Lyrics & Visualizer */}
      <ExpandedPlayerModal
        isOpen={isExpandedPlayerOpen}
        onClose={() => setIsExpandedPlayerOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        queue={tracks}
        userProfile={userProfile}
        sleepTimer={sleepTimer}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleRepeat={handleToggleRepeat}
        onToggleShuffle={handleToggleShuffle}
        onSelectTrack={handlePlayTrack}
        onToggleFavorite={handleToggleFavorite}
        onOpenSleepTimer={() => setIsSleepTimerModalOpen(true)}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerModalOpen}
        onClose={() => setIsSleepTimerModalOpen(false)}
        sleepTimer={sleepTimer}
        onSetTimer={handleSetSleepTimer}
        onCancelTimer={handleCancelSleepTimer}
        onAddMinutes={handleAddSleepTimerMinutes}
      />

      {/* Guest Profile Manager Modal */}
      <GuestProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
      />

      {/* Application Settings Modal (YouTube Sync Hub & Crossfade) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        syncState={ytSync}
        onUpdateSyncState={(upd) => setYtSync((prev) => ({ ...prev, ...upd }))}
        onAddTrack={handleAddTrack}
        apkConfig={apkConfig}
        onChangeApkConfig={setApkConfig}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        crossfadeEnabled={crossfadeEnabled}
        onToggleCrossfade={setCrossfadeEnabled}
        crossfadeDuration={crossfadeDuration}
        onChangeCrossfadeDuration={setCrossfadeDuration}
        onOpenIconStudio={() => setActiveTab('icons')}
      />

      {/* YouTube Music Notification Toast */}
      {sleepNotification && (
        <div className="fixed top-20 right-6 z-50 max-w-sm px-4 py-2.5 rounded-full bg-[#181818]/95 border border-[#ff0000]/40 shadow-2xl backdrop-blur-md text-xs font-semibold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="w-2 h-2 rounded-full bg-[#ff0000] animate-pulse" />
          <span>{sleepNotification}</span>
        </div>
      )}
    </div>
  );
}
