import React, { useState } from 'react';
import { 
  Moon, 
  X, 
  Disc, 
  Plus, 
  Trash2, 
  Sparkles,
  Clock
} from 'lucide-react';
import { SleepTimerState } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sleepTimer: SleepTimerState;
  onSetTimer: (minutes: number, endOfTrack?: boolean) => void;
  onCancelTimer: () => void;
  onAddMinutes: (minutes: number) => void;
}

export const SleepTimerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sleepTimer,
  onSetTimer,
  onCancelTimer,
  onAddMinutes,
}) => {
  const [customMinutes, setCustomMinutes] = useState('20');

  if (!isOpen) return null;

  const presets = [
    { label: '5 min', minutes: 5, desc: 'Quick rest' },
    { label: '15 min', minutes: 15, desc: 'Wind down' },
    { label: '30 min', minutes: 30, desc: 'Recommended' },
    { label: '45 min', minutes: 45, desc: 'Deep rest' },
    { label: '60 min', minutes: 60, desc: 'Full album' },
  ];

  const formatRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0 && val <= 240) {
      onSetTimer(val);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#181818] border border-white/10 shadow-2xl p-6 relative overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* YouTube Red Ambient Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#ff0000]/12 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#ff0000]/15 border border-[#ff0000]/30 flex items-center justify-center text-[#ff0033]">
              <Moon size={19} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sleep Timer</h3>
              <p className="text-[11px] text-zinc-400">
                Auto-pauses playback when timer ends
              </p>
            </div>
          </div>

          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            onClick={onClose}
            icon={<X size={16} />}
          />
        </div>

        {/* Active Countdown Card */}
        {sleepTimer.isActive ? (
          <div className="my-5 p-4 rounded-2xl bg-black/50 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 font-medium block">
                  {sleepTimer.stopAtEndOfTrack ? 'Stopping at end of current track' : 'Audio will stop in'}
                </span>
                <span className="text-2xl font-black text-white font-mono tabular-nums tracking-tight mt-0.5 block">
                  {sleepTimer.stopAtEndOfTrack ? 'End of Track' : formatRemaining(sleepTimer.remainingSeconds)}
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#ff0000]/20 border border-[#ff0000]/40 flex items-center justify-center text-[#ff0033] animate-pulse">
                <Moon size={20} />
              </div>
            </div>

            {/* Micro Progress Line */}
            {!sleepTimer.stopAtEndOfTrack && sleepTimer.totalSeconds > 0 && (
              <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-[#ff0000] rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (sleepTimer.remainingSeconds / sleepTimer.totalSeconds) * 100)}%`
                  }}
                />
              </div>
            )}

            {/* Quick Extension Buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <DynamicGlassButton
                  variant="chip"
                  size="xs"
                  onClick={() => onAddMinutes(5)}
                  icon={<Plus size={11} />}
                >
                  5m
                </DynamicGlassButton>
                <DynamicGlassButton
                  variant="chip"
                  size="xs"
                  onClick={() => onAddMinutes(15)}
                  icon={<Plus size={11} />}
                >
                  15m
                </DynamicGlassButton>
              </div>

              <DynamicGlassButton
                variant="danger"
                size="xs"
                onClick={onCancelTimer}
                icon={<Trash2 size={12} />}
              >
                Cancel
              </DynamicGlassButton>
            </div>
          </div>
        ) : null}

        {/* Presets Grid */}
        <div className="space-y-3 mt-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            {sleepTimer.isActive ? 'Adjust Duration' : 'Set Timer'}
          </span>

          <div className="grid grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.minutes}
                onClick={() => {
                  onSetTimer(p.minutes);
                  onClose();
                }}
                className="ytm-dynamic-btn p-2.5 rounded-2xl bg-black/40 border border-white/[0.08] hover:border-[#ff0033] hover:bg-white/[0.06] transition-all text-center group"
              >
                <span className="text-xs font-bold text-white group-hover:text-[#ff0033] block">
                  {p.label}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">
                  {p.desc}
                </span>
              </button>
            ))}

            {/* End of Current Track Button */}
            <button
              onClick={() => {
                onSetTimer(0, true);
                onClose();
              }}
              className="ytm-dynamic-btn p-2.5 rounded-2xl bg-black/40 border border-white/[0.08] hover:border-[#ff0033] hover:bg-white/[0.06] transition-all text-center group col-span-3 flex items-center justify-center gap-2"
            >
              <Disc size={16} className="text-[#ff0033]" />
              <div className="text-left">
                <span className="text-xs font-bold text-white group-hover:text-[#ff0033] block">
                  When Song Ends
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  Stop audio playback when track completes
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Duration Input */}
        <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-white/[0.08] flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              max="240"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              placeholder="Custom mins"
              className="w-full pl-3 pr-10 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033] font-mono shadow-inner"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-500 font-mono">
              min
            </span>
          </div>

          <DynamicGlassButton
            type="submit"
            variant="primary"
            size="sm"
          >
            Start
          </DynamicGlassButton>
        </form>
      </div>
    </div>
  );
};
