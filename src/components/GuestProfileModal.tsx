import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Clock, 
  Trash2, 
  RefreshCw, 
  Check, 
  Heart, 
  EyeOff, 
  User 
} from 'lucide-react';
import { UserProfile } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export const GuestProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [tempName, setTempName] = useState(userProfile.displayName);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleProfileType = () => {
    const isNowGuest = userProfile.type !== 'guest';
    const newProfile: UserProfile = {
      ...userProfile,
      type: isNowGuest ? 'guest' : 'member',
      displayName: isNowGuest ? 'Guest Listener' : 'YouTube Music Member',
      incognitoHistory: isNowGuest,
    };
    setTempName(newProfile.displayName);
    onUpdateProfile(newProfile);
    setStatusMsg(`Switched to ${isNowGuest ? 'Guest Incognito Mode' : 'YouTube Music Account Profile'}!`);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleGenerateGuestTag = () => {
    const randomTag = '#' + Math.floor(1000 + Math.random() * 9000);
    const newProfile: UserProfile = {
      ...userProfile,
      guestTag: randomTag,
    };
    onUpdateProfile(newProfile);
    setStatusMsg(`Generated Guest ID: ${randomTag}`);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleClearGuestHistory = () => {
    const newProfile: UserProfile = {
      ...userProfile,
      sessionMinutes: 0,
      listeningHistory: [],
      favoriteTrackIds: [],
    };
    onUpdateProfile(newProfile);
    setStatusMsg('Cleared all temporary guest session data.');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    onUpdateProfile({
      ...userProfile,
      displayName: tempName.trim(),
    });
    setStatusMsg('Profile name updated!');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#181818] border border-white/10 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-zinc-100">
        {/* YouTube Red Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff0000]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-md shadow-[#ff0000]/25">
              {userProfile.type === 'guest' ? <Shield size={18} /> : <User size={18} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {userProfile.type === 'guest' ? 'Guest Profile' : 'YouTube Music Account'}
              </h3>
              <p className="text-xs text-zinc-400">
                {userProfile.type === 'guest' ? 'Private incognito listening' : 'Synced YouTube Google Account'}
              </p>
            </div>
          </div>

          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            onClick={onClose}
            icon={<X size={18} />}
          />
        </div>

        {statusMsg && (
          <div className="mt-4 p-2.5 rounded-2xl bg-[#ff0000]/10 border border-[#ff0000]/25 text-white text-xs flex items-center gap-2 animate-in fade-in">
            <Check size={14} className="text-[#ff0033]" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Guest Banner */}
        <div className="my-5 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-sm text-[#ff0033] font-mono shadow-sm">
              {userProfile.type === 'guest' ? userProfile.guestTag : 'YT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{userProfile.displayName}</span>
                {userProfile.type === 'guest' && (
                  <span className="text-[10px] bg-[#ff0000]/15 text-[#ff0033] border border-[#ff0000]/30 px-2 py-0.5 rounded-full font-semibold">
                    Incognito
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {userProfile.type === 'guest'
                  ? 'Zero telemetry · History is not logged or shared'
                  : 'Library synced and persistent across sessions'}
              </p>
            </div>
          </div>

          <DynamicGlassButton
            variant="glass"
            size="xs"
            onClick={handleToggleProfileType}
          >
            {userProfile.type === 'guest' ? 'Switch to Member' : 'Switch to Guest'}
          </DynamicGlassButton>
        </div>

        {/* Guest Controls */}
        <div className="space-y-4">
          <form onSubmit={handleSaveName} className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Display name..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033] font-medium"
            />
            <DynamicGlassButton
              type="submit"
              variant="primary"
              size="sm"
            >
              Update
            </DynamicGlassButton>
          </form>

          {/* Incognito History Shield Toggle */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <EyeOff size={16} className="text-[#ff0033]" />
              <div>
                <span className="text-xs font-semibold text-white block">Private Incognito Listening</span>
                <span className="text-[11px] text-zinc-400">Do not log played tracks to device history</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateProfile({
                ...userProfile,
                incognitoHistory: !userProfile.incognitoHistory
              })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                userProfile.incognitoHistory ? 'bg-[#ff0000]' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  userProfile.incognitoHistory ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Guest Stats */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-left">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                <Clock size={12} />
                Session Time
              </span>
              <span className="text-sm font-bold text-white mt-1 block font-mono">
                {userProfile.sessionMinutes || 18} mins
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-left">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                <Heart size={12} />
                Liked Tracks
              </span>
              <span className="text-sm font-bold text-white mt-1 block font-mono">
                {userProfile.favoriteTrackIds.length} Songs
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            {userProfile.type === 'guest' ? (
              <DynamicGlassButton
                variant="glass"
                size="xs"
                onClick={handleGenerateGuestTag}
                icon={<RefreshCw size={13} />}
              >
                Roll New Guest ID
              </DynamicGlassButton>
            ) : <div />}

            <DynamicGlassButton
              variant="danger"
              size="xs"
              onClick={handleClearGuestHistory}
              icon={<Trash2 size={13} />}
            >
              Clear Session Cache
            </DynamicGlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};
