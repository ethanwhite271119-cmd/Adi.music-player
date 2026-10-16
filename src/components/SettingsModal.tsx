import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Tv, 
  RefreshCw, 
  Sliders, 
  Package, 
  Check, 
  Shield, 
  Music, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  SlidersHorizontal,
  Volume2,
  Trash2,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { ApkConfig, YouTubeSyncState, UserProfile, Track } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  syncState: YouTubeSyncState;
  onUpdateSyncState: (state: Partial<YouTubeSyncState>) => void;
  onAddTrack: (track: Track) => void;
  apkConfig: ApkConfig;
  onChangeApkConfig: (config: ApkConfig) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  crossfadeEnabled: boolean;
  onToggleCrossfade: (enabled: boolean) => void;
  crossfadeDuration: number;
  onChangeCrossfadeDuration: (sec: number) => void;
  onOpenIconStudio: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  syncState,
  onUpdateSyncState,
  onAddTrack,
  apkConfig,
  onChangeApkConfig,
  userProfile,
  onUpdateProfile,
  crossfadeEnabled,
  onToggleCrossfade,
  crossfadeDuration,
  onChangeCrossfadeDuration,
  onOpenIconStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'playback' | 'apk' | 'privacy'>('youtube');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [customYtUrl, setCustomYtUrl] = useState('');
  const [apkNameInput, setApkNameInput] = useState(apkConfig.name);
  const [isSavedApk, setIsSavedApk] = useState(false);

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdateSyncState({
        isConnected: true,
        lastSyncTime: Date.now(),
        syncedTrackCount: syncState.syncedTrackCount + 2,
        syncedPlaylistsCount: syncState.syncedPlaylistsCount + 1,
      });

      const newTrack: Track = {
        id: `yt-sync-${Date.now()}`,
        title: 'Starfall Horizon (YT Music Live Stream)',
        artist: 'Celestial Echoes',
        album: 'YouTube Music / Featured Chill',
        duration: 215,
        source: 'youtube',
        youtubeId: 'WPni755-Krg',
        coverGradient: 'from-red-600 via-rose-600 to-amber-600',
        genre: 'Ambient / Lo-Fi',
        lyrics: [
          'Floating in the digital stream',
          'Synchronized soundwaves carry the night',
          'YouTube Music pulses softly',
          'Underneath the liquid neon light'
        ],
        addedAt: Date.now(),
      };
      onAddTrack(newTrack);
      setSyncSuccessMsg('Successfully synced with YouTube Music library!');
      setTimeout(() => setSyncSuccessMsg(null), 3500);
    }, 1200);
  };

  const handleImportYtTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customYtUrl.trim()) return;

    let videoId = 'jfKfPfyJRdk';
    if (customYtUrl.includes('v=')) {
      videoId = customYtUrl.split('v=')[1]?.split('&')[0] || videoId;
    } else if (customYtUrl.includes('youtu.be/')) {
      videoId = customYtUrl.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }

    const imported: Track = {
      id: `yt-manual-${Date.now()}`,
      title: customYtUrl.length > 25 ? `Synced Track (${videoId})` : customYtUrl,
      artist: 'YouTube Music Stream',
      album: 'Imported Web Sync',
      duration: 195,
      source: 'youtube',
      youtubeId: videoId,
      coverGradient: 'from-red-700 via-purple-700 to-zinc-900',
      genre: 'Streaming',
      addedAt: Date.now(),
    };

    onAddTrack(imported);
    setCustomYtUrl('');
    setSyncSuccessMsg(`Imported YouTube Music track (${videoId})`);
    setTimeout(() => setSyncSuccessMsg(null), 3500);
  };

  const handleSaveApk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkNameInput.trim()) return;
    onChangeApkConfig({
      ...apkConfig,
      name: apkNameInput.trim(),
      lastModified: Date.now(),
    });
    setIsSavedApk(true);
    setTimeout(() => setIsSavedApk(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#181818]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff0000]/15 border border-[#ff0000]/30 flex items-center justify-center text-[#ff0033]">
              <SettingsIcon size={20} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Application Settings</span>
                <span className="text-[10px] font-bold text-[#ff0033] uppercase bg-[#ff0000]/15 px-2 py-0.5 rounded-full font-mono border border-[#ff0000]/25">
                  YouTube Music
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Manage YouTube Sync, Crossfade playback, and APK customization
              </p>
            </div>
          </div>

          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            onClick={onClose}
            icon={<X size={18} />}
            title="Close Settings"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-white/5 bg-[#181818]/50 overflow-x-auto scrollbar-none">
          <DynamicGlassButton
            variant="chip"
            size="sm"
            isActive={activeTab === 'youtube'}
            onClick={() => setActiveTab('youtube')}
            icon={<Tv size={14} className={activeTab === 'youtube' ? 'text-black' : 'text-[#ff0033]'} />}
          >
            YouTube Sync
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            size="sm"
            isActive={activeTab === 'playback'}
            onClick={() => setActiveTab('playback')}
            icon={<Sliders size={14} className={activeTab === 'playback' ? 'text-black' : 'text-emerald-400'} />}
          >
            Crossfade &amp; Sound
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            size="sm"
            isActive={activeTab === 'apk'}
            onClick={() => setActiveTab('apk')}
            icon={<Package size={14} className={activeTab === 'apk' ? 'text-black' : 'text-amber-400'} />}
          >
            APK Branding
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            size="sm"
            isActive={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
            icon={<Shield size={14} className={activeTab === 'privacy' ? 'text-black' : 'text-sky-400'} />}
          >
            Privacy &amp; Data
          </DynamicGlassButton>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* TAB 1: YOUTUBE MUSIC SYNC */}
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              {/* Account Status Card */}
              <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff0000]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-lg shadow-[#ff0000]/30">
                      <Tv size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">
                          {syncState.accountName}
                        </h4>
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Connected
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                        Channel ID: {syncState.channelId}
                      </p>
                    </div>
                  </div>

                  {/* Sync Trigger Button */}
                  <DynamicGlassButton
                    variant="primary"
                    size="md"
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    icon={<RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />}
                  >
                    {isSyncing ? 'Syncing Library...' : 'Sync YouTube Music'}
                  </DynamicGlassButton>
                </div>

                {/* Sync Success Feedback */}
                {syncSuccessMsg && (
                  <div className="mt-3.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 size={15} />
                    <span>{syncSuccessMsg}</span>
                  </div>
                )}

                {/* Metrics */}
                <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-black/40">
                    <span className="text-xs text-zinc-400 block">Synced Tracks</span>
                    <span className="text-lg font-black text-white font-mono">{syncState.syncedTrackCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40">
                    <span className="text-xs text-zinc-400 block">Playlists</span>
                    <span className="text-lg font-black text-[#ff0033] font-mono">{syncState.syncedPlaylistsCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40">
                    <span className="text-xs text-zinc-400 block">Audio Bitrate</span>
                    <span className="text-xs font-bold text-white font-mono mt-1 block">320 kbps</span>
                  </div>
                </div>
              </div>

              {/* YouTube Sync Preferences */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Sync &amp; Stream Quality Options
                </h5>

                <div className="space-y-3">
                  {/* Auto-Sync Toggle */}
                  <div className="p-4 rounded-2xl bg-[#181818] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Auto-Sync Library</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Keep YouTube Music playlists, history, and likes in sync
                      </p>
                    </div>
                    <button
                      onClick={() => onUpdateSyncState({ autoSync: !syncState.autoSync })}
                      className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                        syncState.autoSync ? 'bg-[#ff0033]' : 'bg-zinc-700'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                          syncState.autoSync ? 'translate-x-5' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Audio Stream Quality */}
                  <div className="p-4 rounded-2xl bg-[#181818] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">Streaming Bitrate</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Select audio fidelity for YouTube Music playback
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['High (320kbps)', 'Balanced (256kbps)', 'Data Saver (128kbps)'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => onUpdateSyncState({ streamQuality: q })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            syncState.streamQuality === q 
                              ? 'bg-[#ff0033] text-white shadow-md shadow-[#ff0000]/25' 
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {q.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Import YouTube URL or Playlist */}
                  <div className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
                    <div>
                      <p className="font-bold text-white">Import Single Video / Track URL</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Paste a YouTube video URL to import into your synced library
                      </p>
                    </div>

                    <form onSubmit={handleImportYtTrack} className="flex gap-2">
                      <input
                        type="text"
                        value={customYtUrl}
                        onChange={(e) => setCustomYtUrl(e.target.value)}
                        placeholder="https://music.youtube.com/watch?v=..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#ff0033]"
                      />
                      <DynamicGlassButton
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={!customYtUrl.trim()}
                        icon={<Check size={14} />}
                      >
                        Import
                      </DynamicGlassButton>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROSSFADE & PLAYBACK */}
          {activeTab === 'playback' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Sliders size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Seamless Crossfade</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Gradually blend songs together with no silence between tracks
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleCrossfade(!crossfadeEnabled)}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                      crossfadeEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                    }`}
                  >
                    <div 
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        crossfadeEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>

                {crossfadeEnabled && (
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Crossfade Duration:</span>
                      <span className="text-white font-mono font-bold">{crossfadeDuration} seconds</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={1}
                      value={crossfadeDuration}
                      onChange={(e) => onChangeCrossfadeDuration(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>1s (Short)</span>
                      <span>4s (Default)</span>
                      <span>12s (Smooth Club)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sound Engine Characteristics */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <Volume2 size={18} className="text-[#ff0033]" />
                  <span className="font-bold text-white">Audio Normalization</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Standardizes gain level between local files and YouTube Music streams to prevent sudden volume spikes.
                </p>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-zinc-300 font-mono border border-white/10">
                  LUFS Target: -14 LUFS (YouTube Music Standard)
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APK BRANDING */}
          {activeTab === 'apk' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">APK Application Name</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Configure how this app identifies on your device
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveApk} className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Display App Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={apkNameInput}
                        onChange={(e) => setApkNameInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-[#ff0033]"
                      />
                      <DynamicGlassButton
                        variant="primary"
                        size="sm"
                        type="submit"
                        icon={<Check size={14} />}
                      >
                        {isSavedApk ? 'Saved!' : 'Save'}
                      </DynamicGlassButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-zinc-500 block">Package:</span>
                      <span className="text-zinc-300 font-mono text-[11px] truncate block mt-0.5">
                        {apkConfig.packageName}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-zinc-500 block">Version:</span>
                      <span className="text-zinc-300 font-mono text-[11px] block mt-0.5">
                        {apkConfig.version} ({apkConfig.buildType})
                      </span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Launcher Icon Link */}
              <div 
                onClick={() => {
                  onClose();
                  onOpenIconStudio();
                }}
                className="p-4 rounded-2xl bg-[#181818] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white group-hover:text-[#ff0033] transition-colors">
                      Customize 3D Liquid Glass App Icon
                    </h5>
                    <p className="text-xs text-zinc-400">
                      Configure shader glow, fluid physics, and generate launcher icons
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & DATA */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Incognito Listening Mode</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Listen without saving track plays to local search history
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-zinc-300">Privacy Shield Protection</span>
                  <button
                    onClick={() => onUpdateProfile({ ...userProfile, incognitoHistory: !userProfile.incognitoHistory })}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                      userProfile.incognitoHistory ? 'bg-sky-500' : 'bg-zinc-700'
                    }`}
                  >
                    <div 
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        userProfile.incognitoHistory ? 'translate-x-5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* Clear Local Cache */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white">Reset Local App Cache</h5>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Clear cached temporary audio waveforms and playback states
                  </p>
                </div>
                <DynamicGlassButton
                  variant="glass"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('aurasound_playback_state');
                    alert('Temporary cache cleared.');
                  }}
                  icon={<Trash2 size={14} className="text-red-400" />}
                >
                  Clear Cache
                </DynamicGlassButton>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#181818]/90 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Settings synced in real-time</span>
          </div>
          <DynamicGlassButton
            variant="glass"
            size="sm"
            onClick={onClose}
          >
            Done
          </DynamicGlassButton>
        </div>

      </div>
    </div>
  );
};
