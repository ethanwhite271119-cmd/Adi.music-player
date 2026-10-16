import React, { useState } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Volume, 
  Volume2, 
  VolumeX, 
  Tv, 
  HardDrive, 
  MessageSquareQuote, 
  ListMusic, 
  Heart, 
  Share2, 
  Moon, 
  Sparkles, 
  Cast,
  ThumbsUp,
  ThumbsDown,
  Video,
  Music2,
  MoreVertical
} from 'lucide-react';
import { Track, UserProfile, SleepTimerState } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { DynamicGlassButton } from './DynamicGlassButton';
import { getSuggestionsForCurrentTrack } from '../data/mockSuggestions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: 'off' | 'all' | 'one';
  isShuffle: boolean;
  queue: Track[];
  userProfile: UserProfile;
  sleepTimer: SleepTimerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onSelectTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onOpenSleepTimer: () => void;
}

export const ExpandedPlayerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  repeatMode,
  isShuffle,
  queue,
  userProfile,
  sleepTimer,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onSelectTrack,
  onToggleFavorite,
  onOpenSleepTimer,
}) => {
  const [activeBottomTab, setActiveBottomTab] = useState<'player' | 'upnext' | 'lyrics' | 'related'>('player');
  const [mediaMode, setMediaMode] = useState<'song' | 'video'>('song');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !currentTrack) return null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFavorite = userProfile.favoriteTrackIds.includes(currentTrack.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Listening to ${currentTrack.title} by ${currentTrack.artist} on YouTube Music!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* YouTube Music Ambient Backlight Glow */}
      <div 
        className={`fixed inset-0 bg-gradient-to-tr ${currentTrack.coverGradient} opacity-25 blur-[130px] pointer-events-none scale-125 transition-all duration-1000`}
      />
      <div className="fixed inset-0 bg-radial from-transparent via-[#030303]/70 to-[#030303] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-5 pb-2 flex items-center justify-between">
        <DynamicGlassButton
          variant="icon-only"
          size="md"
          onClick={onClose}
          icon={<ChevronDown size={22} />}
          title="Minimize player"
        />

        {/* YouTube Music Song / Video Switcher Pill */}
        <div className="flex items-center p-0.5 bg-[#212121]/90 rounded-full border border-white/10 select-none shadow-md">
          <button
            onClick={() => setMediaMode('song')}
            className={`px-4 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mediaMode === 'song'
                ? 'bg-white text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Music2 size={13} />
            <span>Song</span>
          </button>
          <button
            onClick={() => setMediaMode('video')}
            className={`px-4 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mediaMode === 'video'
                ? 'bg-[#ff0000] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video size={13} />
            <span>Video</span>
          </button>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            icon={<Cast size={16} />}
            title="Cast audio"
          />

          <DynamicGlassButton
            variant="chip"
            size="sm"
            isActive={sleepTimer.isActive}
            onClick={onOpenSleepTimer}
            icon={<Moon size={14} className={sleepTimer.isActive ? 'text-[#ff0033]' : ''} />}
            title="Sleep Timer"
          >
            <span className="font-mono text-[11px] hidden sm:inline">
              {sleepTimer.isActive
                ? (sleepTimer.stopAtEndOfTrack ? 'Song End' : `${Math.ceil(sleepTimer.remainingSeconds / 60)}m`)
                : 'Timer'}
            </span>
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            onClick={handleShare}
            icon={<Share2 size={16} />}
            title="Share track"
          />
        </div>
      </div>

      {/* Main Center Content Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 py-4 flex-1 flex flex-col items-center justify-center">
        {activeBottomTab === 'player' && (
          <div className="flex flex-col items-center text-center max-w-md w-full">
            {/* YouTube Music Album Art with Red Ambient Caustics */}
            <div 
              className={`w-72 h-72 sm:w-84 sm:h-84 rounded-3xl bg-gradient-to-tr ${currentTrack.coverGradient} shadow-[0_24px_60px_rgba(0,0,0,0.9)] border border-white/10 relative flex items-center justify-center overflow-hidden my-3 group transition-transform duration-500`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {mediaMode === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                  <div className="w-16 h-16 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-xl mb-3">
                    <Video size={28} />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/10">
                    Official YouTube Video Stream
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-2 font-mono">
                    ID: {currentTrack.youtubeId || 'yt-live-stream'}
                  </p>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#ff0000]/90 text-white flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <Play size={28} fill="white" className="ml-1" />
                </div>
              )}

              {/* Source badge in corner */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                {currentTrack.source === 'youtube' ? (
                  <>
                    <Tv size={13} className="text-[#ff0033]" />
                    <span>YouTube Music</span>
                  </>
                ) : (
                  <>
                    <HardDrive size={13} className="text-zinc-400" />
                    <span>{currentTrack.format || 'Local Device'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Live Audio Visualizer */}
            <div className="w-full flex justify-center py-1">
              <AudioVisualizer isPlaying={isPlaying} barsCount={24} barColor="from-[#ff0033] to-[#ff6666]" glowColor="rgba(255, 0, 51, 0.45)" className="h-7 w-64" />
            </div>

            {/* Track Info with YouTube Music Thumbs Down / Up */}
            <div className="w-full mt-2 flex items-center justify-between gap-4">
              <DynamicGlassButton
                variant="icon-only"
                size="md"
                onClick={() => {
                  setIsDisliked(!isDisliked);
                  if (isLiked) setIsLiked(false);
                }}
                isActive={isDisliked}
                title="Dislike"
                icon={<ThumbsDown size={18} fill={isDisliked ? 'currentColor' : 'none'} />}
              />

              <div className="min-w-0 flex-1 text-center">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5 truncate font-medium">
                  {currentTrack.artist}
                </p>
              </div>

              <DynamicGlassButton
                variant="icon-only"
                size="md"
                onClick={() => {
                  setIsLiked(!isLiked);
                  if (isDisliked) setIsDisliked(false);
                }}
                isActive={isLiked}
                title="Like"
                icon={<ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />}
              />
            </div>
          </div>
        )}

        {/* Up Next Tab */}
        {activeBottomTab === 'upnext' && (
          <div className="w-full max-w-lg h-96 overflow-y-auto px-2 py-4 space-y-2 scrollbar-thin">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs uppercase tracking-widest text-[#ff0033] font-bold">
                Playing Next ({queue.length} Tracks)
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">Autoplay Active</span>
            </div>
            {queue.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => onSelectTrack(t)}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                  t.id === currentTrack.id
                    ? 'bg-[#2b2b2b] border border-[#ff0033]/40 text-white font-bold'
                    : 'bg-[#1e1e1e]/60 hover:bg-[#282828] text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-zinc-500 w-5 text-right tabular-nums">
                    {idx + 1}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.coverGradient} shrink-0 shadow-sm`} />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{t.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{t.artist}</p>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono tabular-nums">
                  {formatTime(t.duration)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lyrics Tab */}
        {activeBottomTab === 'lyrics' && (
          <div className="w-full max-w-lg h-96 overflow-y-auto px-4 py-6 text-left space-y-6 scrollbar-thin">
            <span className="text-xs uppercase tracking-widest text-[#ff0033] font-bold block mb-2">
              YouTube Music Synchronized Lyrics
            </span>
            {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
              currentTrack.lyrics.map((line, idx) => {
                const isActiveLine = idx === 1;
                return (
                  <p 
                    key={idx}
                    className={`text-xl sm:text-2xl font-black tracking-tight transition-all duration-300 select-none cursor-pointer ${
                      isActiveLine
                        ? 'text-white scale-100 drop-shadow-[0_2px_18px_rgba(255,0,51,0.5)]'
                        : 'text-white/35 hover:text-white/70'
                    }`}
                  >
                    {line}
                  </p>
                );
              })
            ) : (
              <p className="text-sm text-zinc-500 italic py-16">
                No lyrics available for this track.
              </p>
            )}
          </div>
        )}

        {/* Related Suggestions Tab */}
        {activeBottomTab === 'related' && (
          <div className="w-full max-w-lg h-96 overflow-y-auto px-2 py-4 space-y-2.5 scrollbar-thin">
            <div className="px-3 pb-1 flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest text-[#ff0033] font-bold">
                Related YouTube Music Tracks
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">
                {currentTrack.genre}
              </span>
            </div>

            {getSuggestionsForCurrentTrack(currentTrack).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectTrack(item)}
                className="p-3 rounded-2xl bg-[#1e1e1e]/70 hover:bg-[#282828] border border-white/[0.06] hover:border-[#ff0033]/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.coverGradient} shrink-0 flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform`}>
                    <Play size={15} fill="white" className="text-white ml-0.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-[#ff0033] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {item.artist} · <span className="text-zinc-300">{item.reason}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono font-semibold text-[#ff0033] bg-[#ff0000]/10 border border-[#ff0000]/25 px-2 py-0.5 rounded-full">
                    {item.matchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YouTube Music Bottom Playback Controls & Scrubber */}
      <div className="relative z-10 max-w-xl w-full mx-auto px-6 pb-6 pt-1 space-y-4">
        {/* Red Scrubber */}
        <div className="space-y-1.5">
          <div 
            className="w-full h-1.5 bg-white/[0.12] rounded-full cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              onSeek(pct * duration);
            }}
          >
            <div 
              className="h-full bg-[#ff0000] rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#ff0000] shadow-md shadow-black/60 scale-100" />
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-zinc-400 font-mono tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Controls with Dynamic Liquid Glass Buttons */}
        <div className="flex items-center justify-between px-2">
          <DynamicGlassButton
            variant="icon-only"
            size="md"
            onClick={onToggleShuffle}
            isActive={isShuffle}
            title="Shuffle"
            icon={<Shuffle size={18} />}
          />

          <DynamicGlassButton
            variant="icon-only"
            size="lg"
            onClick={onPrev}
            title="Previous"
            icon={<SkipBack size={24} fill="currentColor" />}
          />

          {/* Big YouTube Music Signature Liquid Glass Play/Pause Orb */}
          <DynamicGlassButton
            variant="primary"
            size="xl"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            icon={
              isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )
            }
            className="w-16 h-16 shadow-2xl shadow-[#ff0000]/50"
          />

          <DynamicGlassButton
            variant="icon-only"
            size="lg"
            onClick={onNext}
            title="Next"
            icon={<SkipForward size={24} fill="currentColor" />}
          />

          <DynamicGlassButton
            variant="icon-only"
            size="md"
            onClick={onToggleRepeat}
            isActive={repeatMode !== 'off'}
            title={`Repeat: ${repeatMode}`}
            icon={repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          />
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 pt-1 max-w-xs mx-auto">
          <button
            onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
            className="text-zinc-400 hover:text-white"
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ff0000]"
          />
          <Volume2 size={16} className="text-zinc-400" />
        </div>

        {/* YouTube Music Bottom 3 Navigation Tabs: UP NEXT | LYRICS | RELATED */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/[0.08]">
          <button
            onClick={() => setActiveBottomTab(activeBottomTab === 'upnext' ? 'player' : 'upnext')}
            className={`text-xs font-black uppercase tracking-wider py-1.5 transition-colors ${
              activeBottomTab === 'upnext' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            UP NEXT
          </button>
          <button
            onClick={() => setActiveBottomTab(activeBottomTab === 'lyrics' ? 'player' : 'lyrics')}
            className={`text-xs font-black uppercase tracking-wider py-1.5 transition-colors ${
              activeBottomTab === 'lyrics' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            LYRICS
          </button>
          <button
            onClick={() => setActiveBottomTab(activeBottomTab === 'related' ? 'player' : 'related')}
            className={`text-xs font-black uppercase tracking-wider py-1.5 transition-colors ${
              activeBottomTab === 'related' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            RELATED
          </button>
        </div>
      </div>
    </div>
  );
};
