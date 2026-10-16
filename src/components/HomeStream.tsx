import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Radio, 
  Compass, 
  Heart, 
  ChevronRight,
  Zap,
  Coffee,
  Headphones,
  Car,
  HardDrive,
  Flame,
  Music2,
  BookOpen
} from 'lucide-react';
import { ApkConfig, LiquidGlassIconConfig, Track, UserProfile, YouTubeSyncState, ActiveTab } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';
import { getSuggestionsForCurrentTrack } from '../data/mockSuggestions';

interface Props {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  apkConfig: ApkConfig;
  iconConfig: LiquidGlassIconConfig;
  userProfile: UserProfile;
  ytSync: YouTubeSyncState;
  onChangeApkConfig: (config: ApkConfig) => void;
  onPlayTrack: (track: Track) => void;
  onOpenExpandedPlayer: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const HomeStream: React.FC<Props> = ({
  tracks,
  currentTrack,
  isPlaying,
  userProfile,
  onPlayTrack,
  setActiveTab,
  onToggleFavorite,
}) => {
  const [filter, setFilter] = useState<'all' | 'local' | 'favorites'>('all');
  const [activeMoodChip, setActiveMoodChip] = useState<string>('all');

  const filteredTracks = tracks.filter((t) => {
    if (filter === 'local') return t.source === 'local';
    if (filter === 'favorites') return userProfile.favoriteTrackIds.includes(t.id);
    return true;
  });

  const localTracks = tracks.filter((t) => t.source === 'local');

  // YouTube Music Quick Picks (Top 8 tracks)
  const quickPicks = filteredTracks.slice(0, 8);
  const listenAgain = filteredTracks.slice(0, 12);
  const forgottenFavorites = filteredTracks.slice(4, 10);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* 1. YouTube Music Signature Mood / Activity Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={activeMoodChip === 'all' && filter === 'all'}
          onClick={() => {
            setActiveMoodChip('all');
            setFilter('all');
          }}
          icon={<Sparkles size={14} className="text-[#ff0033]" />}
        >
          All
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={activeMoodChip === 'energize'}
          onClick={() => {
            setActiveMoodChip('energize');
            setFilter('all');
          }}
          icon={<Zap size={14} className="text-amber-400" />}
        >
          Energize
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={activeMoodChip === 'relax'}
          onClick={() => {
            setActiveMoodChip('relax');
            setFilter('all');
          }}
          icon={<Coffee size={14} className="text-emerald-400" />}
        >
          Relax
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={activeMoodChip === 'workout'}
          onClick={() => {
            setActiveMoodChip('workout');
            setFilter('all');
          }}
          icon={<Flame size={14} className="text-[#ff0033]" />}
        >
          Workout
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={activeMoodChip === 'focus'}
          onClick={() => {
            setActiveMoodChip('focus');
            setFilter('all');
          }}
          icon={<Headphones size={14} className="text-sky-400" />}
        >
          Focus
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={activeMoodChip === 'commute'}
          onClick={() => {
            setActiveMoodChip('commute');
            setFilter('all');
          }}
          icon={<Car size={14} className="text-purple-400" />}
        >
          Commute
        </DynamicGlassButton>

        <div className="w-[1px] h-6 bg-white/10 shrink-0 mx-1" />

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={filter === 'favorites'}
          onClick={() => {
            setFilter('favorites');
            setActiveMoodChip('favorites');
          }}
          icon={<Heart size={14} className="text-[#ff0033]" fill={filter === 'favorites' ? '#ff0033' : 'none'} />}
        >
          Liked ({userProfile.favoriteTrackIds.length})
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={filter === 'local'}
          onClick={() => {
            setFilter('local');
            setActiveMoodChip('local');
          }}
          icon={<HardDrive size={14} className="text-zinc-400" />}
        >
          Device Files ({localTracks.length})
        </DynamicGlassButton>

        <DynamicGlassButton
          variant="chip"
          size="sm"
          isActive={false}
          onClick={() => setActiveTab('artifacts')}
          icon={<BookOpen size={14} className="text-[#ff0033]" />}
        >
          Artifacts &amp; Specs
        </DynamicGlassButton>
      </div>

      {/* 2. YouTube Music Dashboard Starts Directly with "Quick picks" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
              START RADIO FROM A SONG
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Quick picks
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <DynamicGlassButton
              variant="glass"
              size="sm"
              onClick={() => onPlayTrack(quickPicks[0] || tracks[0])}
              icon={<Play size={14} fill="currentColor" />}
            >
              Play all
            </DynamicGlassButton>

            <DynamicGlassButton
              variant="icon-only"
              size="sm"
              onClick={() => setActiveTab('suggestions')}
              title="Explore more"
              icon={<ChevronRight size={18} />}
            />
          </div>
        </div>

        {/* YouTube Music 4-column responsive quick picks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickPicks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFav = userProfile.favoriteTrackIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group ${
                  isCurrent 
                    ? 'bg-[#2b2b2b] border border-[#ff0033]/40 shadow-lg shadow-[#ff0000]/15' 
                    : 'bg-[#212121]/60 hover:bg-[#2b2b2b]/90 border border-white/[0.04] hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Square thumbnail with overlay play button */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${track.coverGradient} relative overflow-hidden shadow-md shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    {isCurrent && isPlaying ? (
                      <div className="relative z-10 w-6 h-6 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow">
                        <Pause size={12} fill="currentColor" />
                      </div>
                    ) : (
                      <div className="relative z-10 w-6 h-6 rounded-full bg-white/95 text-black flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-bold truncate leading-snug ${isCurrent ? 'text-[#ff0033]' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                      <span className={track.source === 'youtube' ? 'text-[#ff0033] font-semibold' : 'text-zinc-400'}>
                        {track.source === 'youtube' ? 'YouTube Music' : 'Device'}
                      </span>
                      <span>•</span>
                      <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <DynamicGlassButton
                    variant="icon-only"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(track.id);
                    }}
                    title={isFav ? 'Remove like' : 'Like'}
                    icon={<Heart size={13} fill={isFav ? '#ff0033' : 'none'} className={isFav ? 'text-[#ff0033]' : 'text-zinc-400'} />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. YouTube Music "Mixed for you & Radio Recommendations" */}
      {(() => {
        const topSuggestions = getSuggestionsForCurrentTrack(currentTrack).slice(0, 3);
        return (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                  RECOMMENDED FOR YOU
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Compass size={22} className="text-[#ff0033]" />
                  <span>Mixed for you</span>
                </h3>
              </div>

              <DynamicGlassButton
                variant="glass"
                size="sm"
                onClick={() => setActiveTab('suggestions')}
                icon={<ChevronRight size={15} />}
              >
                Explore Radio
              </DynamicGlassButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onPlayTrack(item)}
                  className="p-4 rounded-3xl bg-[#212121]/70 hover:bg-[#2b2b2b] border border-white/[0.06] hover:border-white/20 cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.coverGradient} shrink-0 flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-lg relative z-10">
                        <Play size={14} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate group-hover:text-[#ff0033] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {item.artist}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#ff0033] font-semibold mt-1">
                        <span>{item.matchScore}% Match</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-400 uppercase text-[10px] font-mono">{item.mood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="truncate max-w-[200px]">{item.reason}</span>
                    <span className="font-mono">{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* 4. YouTube Music "Listen again" (Grid cards with big square album art) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
              RECENT &amp; FAVORITES
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Listen again
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <DynamicGlassButton
              variant="chip"
              size="xs"
              isActive={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All ({tracks.length})
            </DynamicGlassButton>
            <DynamicGlassButton
              variant="chip"
              size="xs"
              isActive={filter === 'local'}
              onClick={() => setFilter('local')}
              icon={<HardDrive size={11} />}
            >
              Device ({localTracks.length})
            </DynamicGlassButton>
          </div>
        </div>

        {/* YouTube Music Standard 6-Column Album Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {listenAgain.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFav = userProfile.favoriteTrackIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="group cursor-pointer select-none"
              >
                {/* Square Album Cover with Hover Play Badge */}
                <div 
                  className={`aspect-square w-full rounded-2xl bg-gradient-to-tr ${track.coverGradient} relative overflow-hidden shadow-xl shadow-black/70 border border-white/10 transition-transform duration-300 group-hover:scale-[1.03] flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* YouTube Red Play badge */}
                  {isCurrent && isPlaying ? (
                    <div className="w-12 h-12 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-lg shadow-[#ff0000]/50 scale-100 transition-transform">
                      <Pause size={20} fill="currentColor" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-200">
                      <Play size={20} fill="currentColor" className="ml-1 text-black" />
                    </div>
                  )}

                  {/* Top corner tag */}
                  <div className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {track.source === 'youtube' ? 'YT' : 'LOCAL'}
                  </div>

                  {/* Favorite button in corner */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(track.id);
                    }}
                    className="absolute top-2 right-2"
                  >
                    <DynamicGlassButton
                      variant="icon-only"
                      size="xs"
                      title={isFav ? 'Remove like' : 'Like'}
                      icon={<Heart size={13} fill={isFav ? '#ff0033' : 'none'} className={isFav ? 'text-[#ff0033]' : 'text-white'} />}
                      className={isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    />
                  </div>
                </div>

                {/* 2-line YouTube Music typography */}
                <div className="mt-2.5">
                  <h4 className={`text-sm font-bold truncate leading-tight ${isCurrent ? 'text-[#ff0033]' : 'text-white group-hover:text-zinc-200'}`}>
                    {track.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate mt-1">
                    {track.artist}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1 font-mono">
                    <span>{track.source === 'youtube' ? 'YouTube Music' : (track.format || 'Local')}</span>
                    <span>•</span>
                    <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. YouTube Music "Forgotten favorites & Community Playlists" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
              SIMILAR TO YOUR FAVORITES
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Radio size={22} className="text-[#ff0033]" />
              <span>Forgotten favorites</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {forgottenFavorites.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-3 rounded-2xl bg-[#1c1c1c]/80 hover:bg-[#252525] border border-white/[0.06] transition-all cursor-pointer flex items-center gap-3.5 group ${
                  isCurrent ? 'border-[#ff0033]/50 bg-[#252525]' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${track.coverGradient} shrink-0 relative overflow-hidden flex items-center justify-center shadow-md`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <Play size={16} fill="currentColor" className="text-white relative z-10" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ff0033]' : 'text-white'}`}>
                    {track.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {track.artist} · {track.album}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {track.source === 'youtube' ? 'YouTube Music Stream' : 'Local Storage Audio'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
