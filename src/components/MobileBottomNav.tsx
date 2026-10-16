import React from 'react';
import { Home, Compass, HardDrive, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { ActiveTab } from '../types';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasPlayerBar: boolean;
  onOpenSettings: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  hasPlayerBar,
  onOpenSettings,
}) => {
  const tabs: { id: ActiveTab | 'settings'; label: string; icon: any; isAction?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'suggestions', label: 'Explore', icon: Compass },
    { id: 'local', label: 'Library', icon: HardDrive },
    { id: 'icons', label: 'Icons', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, isAction: true },
  ];

  return (
    <nav 
      className={`fixed left-0 right-0 z-20 md:hidden bg-[#181818]/95 backdrop-blur-2xl border-t border-white/[0.08] transition-all ${
        hasPlayerBar ? 'bottom-[72px]' : 'bottom-0'
      }`}
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isAction) {
                  onOpenSettings();
                } else {
                  setActiveTab(tab.id as ActiveTab);
                }
              }}
              className={`ytm-dynamic-btn relative flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all duration-200 select-none ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {/* Dynamic liquid highlight on active tab */}
              {isActive && (
                <div 
                  className="absolute inset-x-2 inset-y-1 rounded-xl pointer-events-none opacity-20"
                  style={{
                    background: 'radial-gradient(ellipse at center, #ff0033 0%, transparent 80%)',
                  }}
                />
              )}

              <div className="relative z-10 flex items-center justify-center">
                <IconComponent 
                  size={19} 
                  className={`transition-transform duration-200 ${
                    isActive ? 'text-[#ff0033] scale-110 drop-shadow-[0_0_8px_rgba(255,0,51,0.6)]' : 'text-zinc-400'
                  }`} 
                />
              </div>

              <span className={`relative z-10 text-[10px] mt-0.5 font-bold tracking-tight ${
                isActive ? 'text-white' : 'text-zinc-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
