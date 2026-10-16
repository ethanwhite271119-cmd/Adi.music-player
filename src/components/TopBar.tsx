import React from 'react';
import { 
  User, 
  Shield, 
  Cast, 
  Home, 
  Radio, 
  HardDrive, 
  Sparkles, 
  Settings as SettingsIcon,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { ActiveTab, ApkConfig, LiquidGlassIconConfig, UserProfile, YouTubeSyncState } from '../types';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  apkConfig: ApkConfig;
  iconConfig: LiquidGlassIconConfig;
  userProfile: UserProfile;
  ytSync: YouTubeSyncState;
  onOpenProfileModal: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  apkConfig,
  userProfile,
  onOpenProfileModal,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#030303]/95 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: YouTube Music Logo + Dynamic Liquid Glass Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
        >
          {/* YouTube Music Red Concentric Play Ring */}
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center shadow-lg shadow-[#ff0000]/35 transition-transform group-hover:scale-105">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tighter text-white uppercase group-hover:text-[#ff0033] transition-colors">
                {apkConfig.name}
              </span>
              <span className="text-[10px] font-bold text-[#ff0033] uppercase tracking-wider bg-[#ff0000]/15 px-2 py-0.5 rounded-full font-mono border border-[#ff0000]/25">
                Music
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links with Dynamic Liquid Glass Buttons */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
          <DynamicGlassButton
            variant="chip"
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            size="sm"
            icon={<Home size={14} className={activeTab === 'home' ? 'text-black' : 'text-zinc-400'} />}
          >
            Home
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            isActive={activeTab === 'suggestions'}
            onClick={() => setActiveTab('suggestions')}
            size="sm"
            icon={<Radio size={14} className={activeTab === 'suggestions' ? 'text-black' : 'text-[#ff0033]'} />}
          >
            Explore &amp; Radio
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            isActive={activeTab === 'local'}
            onClick={() => setActiveTab('local')}
            size="sm"
            icon={<HardDrive size={14} className={activeTab === 'local' ? 'text-black' : 'text-zinc-400'} />}
          >
            Library Files
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            isActive={activeTab === 'icons'}
            onClick={() => setActiveTab('icons')}
            size="sm"
            icon={<Sparkles size={14} className={activeTab === 'icons' ? 'text-black' : 'text-amber-400'} />}
          >
            Liquid Icons
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            isActive={activeTab === 'artifacts'}
            onClick={() => setActiveTab('artifacts')}
            size="sm"
            icon={<BookOpen size={14} className={activeTab === 'artifacts' ? 'text-black' : 'text-[#ff0033]'} />}
          >
            Artifacts
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="chip"
            isActive={false}
            onClick={onOpenSettings}
            size="sm"
            icon={<SettingsIcon size={14} className="text-zinc-400" />}
          >
            Settings
          </DynamicGlassButton>
        </nav>

        {/* Zone 3: Cast, Settings & Guest User Profile with Dynamic Liquid Glass */}
        <div className="flex items-center gap-2.5 shrink-0">
          <DynamicGlassButton
            variant="icon-only"
            size="sm"
            icon={<Cast size={15} />}
            title="Cast to Device / Smart TV"
          />

          <DynamicGlassButton
            variant="glass"
            size="sm"
            onClick={onOpenSettings}
            icon={<SlidersHorizontal size={14} className="text-zinc-300" />}
            title="Settings & YouTube Sync"
            className="hidden sm:inline-flex"
          >
            Settings
          </DynamicGlassButton>

          <DynamicGlassButton
            variant="glass"
            size="sm"
            onClick={onOpenProfileModal}
            icon={
              userProfile.type === 'guest' ? (
                <Shield size={14} className="text-[#ff0033]" />
              ) : (
                <User size={14} className="text-emerald-400" />
              )
            }
            className="border-white/10"
          >
            <div className="text-left flex items-center gap-2">
              <span className="font-bold text-white text-xs leading-none">
                {userProfile.displayName}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono bg-white/10 px-1.5 py-0.5 rounded-full">
                {userProfile.type === 'guest' ? userProfile.guestTag : 'Member'}
              </span>
            </div>
          </DynamicGlassButton>
        </div>
      </div>
    </header>
  );
};
