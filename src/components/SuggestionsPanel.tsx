import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  Play, 
  Plus, 
  RefreshCw, 
  Check, 
  Heart, 
  Tv, 
  HardDrive, 
  Flame, 
  Zap, 
  Coffee, 
  Car, 
  Headphones,
  Compass
} from 'lucide-react';
import { SuggestedTrack, SuggestionMood, Track, UserProfile } from '../types';
import { getSuggestionsForCurrentTrack } from '../data/mockSuggestions';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  currentTrack: Track | null;
  isPlaying: boolean;
  userProfile: UserProfile;
  onPlayTrack: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onPlayAllSuggestions: (suggestions: Track[]) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const SuggestionsPanel: React.FC<Props> = ({
  currentTrack,
  isPlaying,
  userProfile,
  onPlayTrack,
  onAddToQueue,
  onPlayAllSuggestions,
  onToggleFavorite,
}) => {
  const [selectedMood, setSelectedMood] = useState<SuggestionMood>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);

  const baseSuggestions = getSuggestionsForCurrentTrack(currentTrack);

  const filtered = baseSuggestions.filter((item) => {
    if (selectedMood === 'all') return true;
    return item.mood === selectedMood;
  });

  const moods: { id: SuggestionMood; label: string; icon: any }[] = [
    { id: 'all', label: 'All Stations', icon: Sparkles },
    { id: 'chill', label: 'Chill & Relax', icon: Coffee },
    { id: 'energy', label: 'Workout & Energy', icon: Zap },
    { id: 'focus', label: 'Focus & Study', icon: Headphones },
    { id: 'drive', label: 'Drive & Commute', icon: Car },
    { id: 'acoustic', label: 'Acoustic Sessions', icon: Flame },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleQueueTrack = (track: SuggestedTrack) => {
    onAddToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => setAddedTrackId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* YouTube Music Radio Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#181818]/90 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-lg shadow-[#ff0000]/30 shrink-0">
              <Radio size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  YouTube Music Radio &amp; Explore
                </h2>
                <span className="text-[11px] text-[#ff0033] font-bold bg-[#ff0000]/15 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full uppercase font-mono">
                  Live Station
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                {currentTrack ? (
                  <>
                    Endless radio tuned to{' '}
                    <strong className="text-white">{currentTrack.title}</strong> by{' '}
                    <strong className="text-white">{currentTrack.artist}</strong>.
                  </>
                ) : (
                  'Select any song or station to tune your personalized continuous YouTube Music radio mix.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <DynamicGlassButton
              variant="glass"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              icon={<RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />}
            >
              Refresh
            </DynamicGlassButton>

            <DynamicGlassButton
              variant="primary"
              size="md"
              onClick={() => onPlayAllSuggestions(filtered)}
              icon={<Play size={16} fill="white" />}
            >
              Play Radio Mix
            </DynamicGlassButton>
          </div>
        </div>
      </div>

      {/* Mood Filters using Dynamic Liquid Glass Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        {moods.map((m) => {
          const Icon = m.icon;
          const isActive = selectedMood === m.id;
          return (
            <DynamicGlassButton
              key={m.id}
              variant="chip"
              size="sm"
              isActive={isActive}
              onClick={() => setSelectedMood(m.id)}
              icon={<Icon size={14} className={isActive ? 'text-black' : 'text-[#ff0033]'} />}
            >
              {m.label}
            </DynamicGlassButton>
          );
        })}
      </div>

      {/* Suggestions Track List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Recommended Radio Queue ({filtered.length} Tracks)
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            {selectedMood === 'all' ? 'All Moods' : selectedMood.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2">
          {filtered.map((item) => {
            const isFav = userProfile.favoriteTrackIds.includes(item.id);
            const isCurrent = currentTrack?.id === item.id;
            const isJustAdded = addedTrackId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onPlayTrack(item)}
                className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                  isCurrent
                    ? 'bg-[#2b2b2b] border-[#ff0033]/50 shadow-lg'
                    : 'bg-[#181818]/80 hover:bg-[#252525] border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.coverGradient} shrink-0 flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/25" />
                    {isCurrent && isPlaying ? (
                      <div className="w-7 h-7 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow">
                        <Play size={14} fill="white" className="ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ff0033]' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-bold text-[#ff0033] bg-[#ff0000]/15 px-1.5 py-0.2 rounded font-mono shrink-0">
                        {item.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {item.artist} · <span className="text-zinc-500">{item.album}</span>
                    </p>

                    <p className="text-[11px] text-zinc-500 truncate mt-1">
                      {item.reason}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <DynamicGlassButton
                    variant="icon-only"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQueueTrack(item);
                    }}
                    title="Add to Up Next"
                    icon={isJustAdded ? <Check size={14} className="text-emerald-400" /> : <Plus size={14} />}
                  />

                  <DynamicGlassButton
                    variant="icon-only"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    title={isFav ? 'Remove like' : 'Like'}
                    icon={<Heart size={14} fill={isFav ? '#ff0033' : 'none'} className={isFav ? 'text-[#ff0033]' : 'text-zinc-400'} />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
