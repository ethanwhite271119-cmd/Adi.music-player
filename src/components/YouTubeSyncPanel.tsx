import React, { useState } from 'react';
import { 
  Tv, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  Plus, 
  Music2, 
  Play,
  ExternalLink,
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';
import { Track, YouTubeSyncState } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  syncState: YouTubeSyncState;
  onUpdateSyncState: (state: Partial<YouTubeSyncState>) => void;
  tracks: Track[];
  onAddTrack: (track: Track) => void;
  onPlayTrack: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
}

export const YouTubeSyncPanel: React.FC<Props> = ({
  syncState,
  onUpdateSyncState,
  tracks,
  onAddTrack,
  onPlayTrack,
  currentTrackId,
  isPlaying,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const ytTracks = tracks.filter((t) => t.source === 'youtube');

  const filteredTracks = ytTracks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.genre && t.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdateSyncState({
        isConnected: true,
        lastSyncTime: Date.now(),
        syncedTrackCount: ytTracks.length + 2,
        syncedPlaylistsCount: syncState.syncedPlaylistsCount + 1,
      });

      const newTrack: Track = {
        id: `yt-sync-${Date.now()}`,
        title: 'Sunset Neon Highway (YT Music Trending)',
        artist: 'The Midnight & Timecop',
        album: 'YouTube Music / Top Electronic',
        duration: 228,
        source: 'youtube',
        youtubeId: 'WPni755-Krg',
        coverGradient: 'from-fuchsia-600 via-rose-600 to-amber-500',
        genre: 'Synthwave / Pop',
        lyrics: [
          'Driving into the purple twilight',
          'Dashboard glowing steady and clear',
          'Radio static fading into the beat',
          'Every dream that you hold so near'
        ],
        addedAt: Date.now(),
      };
      onAddTrack(newTrack);
    }, 1200);
  };

  const handleImportUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;

    let videoId = 'jfKfPfyJRdk';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = importUrl.match(regExp);

    if (match && match[2].length === 11) {
      videoId = match[2];
    } else if (importUrl.trim().length === 11) {
      videoId = importUrl.trim();
    }

    const titleGuess = importUrl.includes('music.youtube.com') 
      ? 'YouTube Music Stream' 
      : 'Imported YouTube Track';

    const newTrack: Track = {
      id: `yt-custom-${Date.now()}`,
      title: titleGuess,
      artist: 'YouTube Music Sync',
      album: 'Synced from YouTube URL',
      duration: 210,
      source: 'youtube',
      youtubeId: videoId,
      coverGradient: 'from-rose-600 via-red-600 to-indigo-900',
      genre: 'YouTube Music Stream',
      lyrics: ['[Imported directly via YouTube URL / ID]'],
      addedAt: Date.now(),
    };

    onAddTrack(newTrack);
    setImportStatus(`Successfully synced track (ID: ${videoId})!`);
    setImportUrl('');
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header card with YouTube Music Sync Status */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#181818]/90 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-lg shadow-[#ff0000]/30 shrink-0">
              <Tv size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  YouTube Music Cloud Sync
                </h2>
                <span className="text-[11px] text-[#ff0033] font-bold bg-[#ff0000]/15 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full uppercase font-mono">
                  Connected
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Stream trending tracks, live radio, and import playlists from YouTube Music into your app.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <DynamicGlassButton
              variant="primary"
              size="md"
              onClick={handleSyncNow}
              disabled={isSyncing}
              icon={<RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />}
            >
              {isSyncing ? 'Syncing...' : 'Sync with YT Music'}
            </DynamicGlassButton>
          </div>
        </div>

        {/* Sync Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Status</span>
            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 size={14} />
              Active Stream
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Synced Songs</span>
            <span className="text-sm font-semibold text-white font-mono tabular-nums mt-0.5 block">
              {ytTracks.length} Tracks
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Last Synced</span>
            <span className="text-sm font-semibold text-zinc-300 font-mono tabular-nums mt-0.5 block">
              {syncState.lastSyncTime ? new Date(syncState.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Bitrate</span>
            <span className="text-sm font-semibold text-white mt-0.5 block">
              {syncState.streamQuality}
            </span>
          </div>
        </div>
      </div>

      {/* Import Custom Track / URL with Dynamic Button */}
      <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Plus size={16} className="text-[#ff0033]" />
            <span>Import YouTube Video ID or URL</span>
          </h3>
          <span className="text-xs text-zinc-400 font-mono">music.youtube.com</span>
        </div>

        <form onSubmit={handleImportUrl} className="flex gap-2.5">
          <input
            type="text"
            placeholder="Paste YouTube Music link (e.g. https://music.youtube.com/watch?v=WPni755-Krg)"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-black/70 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033] font-mono shadow-inner"
          />
          <DynamicGlassButton
            type="submit"
            variant="glass"
            size="md"
            icon={<Plus size={16} className="text-[#ff0033]" />}
          >
            Add to Library
          </DynamicGlassButton>
        </form>

        {importStatus && (
          <p className="text-xs text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 size={13} />
            {importStatus}
          </p>
        )}
      </div>

      {/* Synced Tracks Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Music2 size={18} className="text-[#ff0033]" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              YouTube Music Streams ({filteredTracks.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter synced library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#181818] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTracks.map((track) => {
            const isCurrent = currentTrackId === track.id;
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#2b2b2b] border-[#ff0033]/60 shadow-md'
                    : 'bg-[#181818]/60 hover:bg-[#252525] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${track.coverGradient} shrink-0 flex items-center justify-center relative overflow-hidden group shadow-md shadow-black/50`}
                  >
                    {isCurrent && isPlaying ? (
                      <div className="w-4 h-4 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow">
                        <Play size={10} fill="white" className="ml-0.5" />
                      </div>
                    ) : (
                      <Play size={18} fill="white" className="text-white ml-0.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ff0033]' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                      <span className="text-[#ff0033] font-semibold">YT: {track.youtubeId}</span>
                      <span>·</span>
                      <span>{track.genre}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-zinc-400 tabular-nums">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
