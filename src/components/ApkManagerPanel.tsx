import React, { useState } from 'react';
import { 
  Package, 
  Check, 
  Edit3, 
  Sparkles, 
  ShieldCheck, 
  FileCode, 
  Tag,
  SlidersHorizontal
} from 'lucide-react';
import { ApkConfig, LiquidGlassIconConfig } from '../types';
import { LiquidGlassIcon } from './LiquidGlassIcon';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  apkConfig: ApkConfig;
  onChangeApkConfig: (newConfig: ApkConfig) => void;
  iconConfig: LiquidGlassIconConfig;
}

export const ApkManagerPanel: React.FC<Props> = ({
  apkConfig,
  onChangeApkConfig,
  iconConfig,
}) => {
  const [tempName, setTempName] = useState(apkConfig.name);
  const [tempPackage, setTempPackage] = useState(apkConfig.packageName);
  const [tempVersion, setTempVersion] = useState(apkConfig.version);
  const [saveAlert, setSaveAlert] = useState(false);

  const presets = [
    'YouTube Music Pro',
    'AuraSound Music',
    'VibeSync YT Music',
    'LiquidBeats APK',
    'PulseAudio Player',
    'AuraStream APK'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ApkConfig = {
      ...apkConfig,
      name: tempName.trim() || 'AuraSound Music',
      packageName: tempPackage.trim() || 'com.aurasound.music',
      version: tempVersion.trim() || 'v3.4.0',
      lastModified: Date.now(),
    };
    onChangeApkConfig(updated);
    document.title = `${updated.name} - YouTube Music`;
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleSelectPreset = (presetName: string) => {
    setTempName(presetName);
    const updated: ApkConfig = {
      ...apkConfig,
      name: presetName,
      lastModified: Date.now(),
    };
    onChangeApkConfig(updated);
    document.title = `${presetName} - YouTube Music`;
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#181818]/90 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/12 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-lg shadow-[#ff0000]/30 shrink-0">
              <Package size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  APK Identity &amp; Display Branding
                </h2>
                <span className="text-xs text-[#ff0033] font-bold bg-[#ff0000]/15 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full font-mono">
                  {apkConfig.version}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Customize the application title displayed across the YouTube Music Home page, notification bar, and launcher icon widgets.
              </p>
            </div>
          </div>
        </div>

        {saveAlert && (
          <p className="mt-4 text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
            <Check size={14} />
            Branding saved! Updated on Home page, top bar, and manifest.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Presets */}
          <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#ff0033]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Quick APK Name Presets
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <DynamicGlassButton
                  key={preset}
                  variant="chip"
                  size="sm"
                  isActive={apkConfig.name === preset}
                  onClick={() => handleSelectPreset(preset)}
                >
                  {preset}
                </DynamicGlassButton>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Edit3 size={14} className="text-[#ff0033]" />
                APK Application Name (Displayed on Home Page &amp; Launcher)
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. YouTube Music Pro"
                className="w-full px-4 py-2.5 rounded-2xl bg-black/70 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033] transition-colors font-semibold shadow-inner"
              />
              <span className="text-[11px] text-zinc-500 block">
                This exact title is rendered in YouTube Music Home header banner and window title.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <FileCode size={14} className="text-zinc-400" />
                  Package Identifier
                </label>
                <input
                  type="text"
                  value={tempPackage}
                  onChange={(e) => setTempPackage(e.target.value)}
                  placeholder="com.aurasound.music"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033] font-mono shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tag size={14} className="text-zinc-400" />
                  Version Tag
                </label>
                <input
                  type="text"
                  value={tempVersion}
                  onChange={(e) => setTempVersion(e.target.value)}
                  placeholder="v3.4.0"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff0033] font-mono shadow-inner"
                />
              </div>
            </div>

            {/* Shape selection */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <label className="text-xs font-semibold text-zinc-300 block">
                Launcher Mask Shape
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['squircle', 'circle', 'rounded', 'teardrop'] as const).map((shape) => (
                  <DynamicGlassButton
                    key={shape}
                    variant="chip"
                    size="sm"
                    isActive={apkConfig.launcherIconShape === shape}
                    onClick={() => onChangeApkConfig({ ...apkConfig, launcherIconShape: shape })}
                    className="capitalize text-center justify-center w-full"
                  >
                    {shape}
                  </DynamicGlassButton>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <DynamicGlassButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={<Check size={18} />}
              >
                Apply &amp; Save APK Identity
              </DynamicGlassButton>
            </div>
          </form>
        </div>

        {/* Right Preview: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Active APK Package Manifest
            </h3>

            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 font-mono text-xs space-y-2.5 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">app_name:</span>
                <span className="text-[#ff0033] font-bold truncate max-w-[180px]">{apkConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">package:</span>
                <span className="text-white truncate max-w-[180px]">{apkConfig.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">version_name:</span>
                <span className="text-emerald-400">{apkConfig.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">icon_theme:</span>
                <span className="text-zinc-300 capitalize">{iconConfig.theme.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">platform:</span>
                <span className="text-white">Android / Web APK</span>
              </div>
            </div>

            {/* Live Launcher preview */}
            <div className="p-4 rounded-2xl bg-[#212121] border border-white/10 flex items-center gap-4 shadow-lg shadow-black/50">
              <LiquidGlassIcon config={iconConfig} size="md" shape={apkConfig.launcherIconShape} interactive={false} />
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500">Android Launcher Preview</p>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                  {apkConfig.name}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {apkConfig.packageName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
