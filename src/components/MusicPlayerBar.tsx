import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Maximize2, 
  Tv, 
  HardDrive,
  Moon,
  ThumbsUp,
  ThumbsDown,
  ListMusic
} from 'lucide-react';
import { Track, SleepTimerState } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: 'off' | 'all' | 'one';
  isShuffle: boolean;
  sleepTimer: SleepTimerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onOpenExpandedPlayer: () => void;
  onOpenSleepTimer: () => void;
}

export const MusicPlayerBar: React.FC<Props> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  repeatMode,
  isShuffle,
  sleepTimer,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onOpenExpandedPlayer,
  onOpenSleepTimer,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDisliked, setIsDisliked] = React.useState(false);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#212121]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.8)]">
      {/* YouTube Music Red Scrub line */}
      <div 
        className="relative w-full h-[3px] bg-white/[0.08] cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          onSeek(percent * duration);
        }}
      >
        <div 
          className="h-full bg-[#ff0000] relative transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff0000] shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Track Information with YouTube Music Thumbs */}
        <div className="flex items-center gap-3.5 min-w-0 max-w-[280px] sm:max-w-xs">
          <div 
            onClick={onOpenExpandedPlayer}
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentTrack.coverGradient} shadow-md shadow-black/60 shrink-0 flex items-center justify-center cursor-pointer group relative overflow-hidden transition-transform active:scale-95`}
          >
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/35 transition-colors" />
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5 relative z-10" />
            <Maximize2 size={16} className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity z-20" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 
              onClick={onOpenExpandedPlayer}
              className="text-sm font-bold text-white truncate cursor-pointer hover:underline tracking-tight"
            >
              {currentTrack.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5">
              <span className="truncate">{currentTrack.artist}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                {currentTrack.source === 'youtube' ? (
                  <>
                    <Tv size={11} className="text-[#ff0033]" />
                    <span>YouTube Music</span>
                  </>
                ) : (
                  <>
                    <HardDrive size={11} className="text-zinc-400" />
                    <span>{currentTrack.format || 'Local'}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* YouTube Music Thumbs Up / Down with Dynamic Glass Buttons */}
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <DynamicGlassButton
              variant="icon-only"
              size="xs"
              onClick={() => {
                setIsDisliked(!isDisliked);
                if (isLiked) setIsLiked(false);
              }}
              isActive={isDisliked}
              title="Dislike"
              icon={<ThumbsDown size={14} fill={isDisliked ? 'currentColor' : 'none'} />}
            />
            <DynamicGlassButton
              variant="icon-only"
              size="xs"
              onClick={() => {
                setIsLiked(!isLiked);
                if (isDisliked) setIsDisliked(false);
              }}
              isActive={isLiked}
              title="Like"
              icon={<ThumbsUp size={14} fill={isLiked ? 'currentColor' : 'none'} />}
            />
          </div>
        </div>

        {/* Center: Dynamic Liquid Glass Playback Controls */}
        <div className="flex-1 max-w-lg hidden md:flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <DynamicGlassButton
              variant="icon-only"
              size="xs"
              onClick={onToggleShuffle}
              isActive={isShuffle}
              title="Shuffle"
              icon={<Shuffle size={14} />}
            />

            <DynamicGlassButton
              variant="icon-only"
              size="sm"
              onClick={onPrev}
              icon={<SkipBack size={18} fill="currentColor" />}
              title="Previous"
            />

            {/* Central Dynamic Liquid Glass Play/Pause Orb */}
            <DynamicGlassButton
              variant="primary"
              size="md"
              onClick={onPlayPause}
              icon={
                isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )
              }
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-11 h-11 shadow-lg shadow-[#ff0000]/40"
            />

            <DynamicGlassButton
              variant="icon-only"
              size="sm"
              onClick={onNext}
              icon={<SkipForward size={18} fill="currentColor" />}
              title="Next"
            />

            <DynamicGlassButton
              variant="icon-only"
              size="xs"
              onClick={onToggleRepeat}
              isActive={repeatMode !== 'off'}
              title={`Repeat: ${repeatMode}`}
              icon={repeatMode === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
            />
          </div>

          <div className="w-full flex items-center gap-3 text-[11px] text-zinc-400 font-mono tabular-nums">
            <span className="w-9 text-right">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-1 bg-white/[0.08] rounded-full cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                onSeek(pct * duration);
              }}
            >
              <div 
                className="h-full bg-zinc-300 rounded-full relative group-hover:bg-[#ff0000] transition-colors"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Mobile Mini Play Button with Dynamic Glass Icon */}
        <div className="flex md:hidden items-center gap-2">
          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            onClick={onOpenSleepTimer}
            isActive={sleepTimer.isActive}
            icon={<Moon size={16} />}
            title="Sleep Timer"
          />

          <DynamicGlassButton
            variant="primary"
            size="sm"
            onClick={onPlayPause}
            icon={isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="ml-0.5" />}
          />

          <button
            onClick={onOpenExpandedPlayer}
            className="p-1.5 text-zinc-400 hover:text-white"
          >
            <Maximize2 size={17} />
          </button>
        </div>

        {/* Right: Audio Visualizer, Volume, Dynamic Sleep Timer Button, Expand */}
        <div className="hidden lg:flex items-center gap-3.5">
          <AudioVisualizer isPlaying={isPlaying} barsCount={8} barColor="from-[#ff0033] to-[#ff4d4d]" glowColor="rgba(255, 0, 51, 0.4)" className="w-16" />

          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-18 h-[3px] bg-white/[0.12] rounded-lg appearance-none cursor-pointer accent-[#ff0000]"
            />
            <Volume2 size={16} className="text-zinc-400" />
          </div>

          {/* Dynamic Liquid Glass Sleep Timer Button */}
          <DynamicGlassButton
            variant="chip"
            size="sm"
            isActive={sleepTimer.isActive}
            onClick={onOpenSleepTimer}
            icon={<Moon size={13} className={sleepTimer.isActive ? 'text-[#ff0033]' : ''} />}
            title="Set Sleep Timer"
          >
            <span className="font-mono text-[11px]">
              {sleepTimer.isActive 
                ? (sleepTimer.stopAtEndOfTrack ? 'Song End' : `${Math.ceil(sleepTimer.remainingSeconds / 60)}m`) 
                : 'Sleep'}
            </span>
          </DynamicGlassButton>

          {/* Expanded Player Trigger */}
          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            onClick={onOpenExpandedPlayer}
            icon={<ListMusic size={16} />}
            title="Up Next, Lyrics &amp; Video"
          />
        </div>
      </div>
    </div>
  );
};
