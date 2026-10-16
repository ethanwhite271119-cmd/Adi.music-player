import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Sliders, 
  Download, 
  RefreshCw, 
  Smartphone, 
  Check, 
  Layers, 
  Flame, 
  Music, 
  Disc, 
  Radio, 
  Headphones, 
  CassetteTape, 
  Activity 
} from 'lucide-react';
import { LiquidGlassIconConfig, GlassTheme, IconGlyph, ApkConfig } from '../types';
import { THEME_GRADIENTS, updateFaviconWithLiquidGlass } from '../utils/iconGenerator';
import { LiquidGlassIcon } from './LiquidGlassIcon';
import { DynamicGlassButton } from './DynamicGlassButton';

interface Props {
  config: LiquidGlassIconConfig;
  onChangeConfig: (newConfig: LiquidGlassIconConfig) => void;
  apkConfig: ApkConfig;
}

export const DynamicIconStudio: React.FC<Props> = ({
  config,
  onChangeConfig,
  apkConfig,
}) => {
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const themeKeys: GlassTheme[] = [
    'frost-aqua',
    'amethyst-violet',
    'solar-amber',
    'emerald-aurora',
    'obsidian-prism',
    'rose-quartz',
    'cyber-neon',
  ];

  const glyphs: { id: IconGlyph; label: string; icon: any }[] = [
    { id: 'note', label: 'Music Note', icon: Music },
    { id: 'vinyl', label: 'Vinyl Disc', icon: Disc },
    { id: 'wave', label: 'Radio Wave', icon: Radio },
    { id: 'headphones', label: 'Headphones', icon: Headphones },
    { id: 'cassette', label: 'Cassette Tape', icon: CassetteTape },
    { id: 'aura', label: 'Liquid Aura', icon: Sparkles },
    { id: 'equalizer', label: 'Equalizer', icon: Activity },
  ];

  const handleApplyFavicon = () => {
    updateFaviconWithLiquidGlass(config);
    setCopiedNotification('Applied to browser tab favicon!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleDownloadIcon = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeData = THEME_GRADIENTS[config.theme];

    // Background squircle
    ctx.beginPath();
    ctx.roundRect(32, 32, 448, 448, 110);
    const grad = ctx.createLinearGradient(32, 32, 480, 480);
    grad.addColorStop(0, themeData.primary);
    grad.addColorStop(0.5, themeData.secondary);
    grad.addColorStop(1, themeData.tertiary);
    ctx.fillStyle = grad;
    ctx.fill();

    // Specular highlight
    ctx.beginPath();
    ctx.ellipse(256, 120, 180, 70, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    // Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = themeData.rimColor;
    ctx.stroke();

    // Glyph
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(200, 320, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(310, 290, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(235, 160, 24, 160);
    ctx.fillRect(340, 140, 24, 150);
    ctx.fillRect(235, 140, 130, 28);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${apkConfig.name.replace(/\s+/g, '_').toLowerCase()}_liquid_icon.png`;
    a.click();

    setCopiedNotification('Exported 512x512 PNG app icon!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Studio Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#181818]/90 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff0000]/12 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#cc0000] to-[#ff0033] flex items-center justify-center text-white shadow-lg shadow-[#ff0000]/30 shrink-0">
              <Sparkles size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Dynamic Liquid Glass Icon Studio
                </h2>
                <span className="text-[11px] text-[#ff0033] font-bold bg-[#ff0000]/15 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full uppercase font-mono">
                  3D Shaders
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Personalize the live app icon and browser tab favicon with refractive liquid glass, specular curved highlights, and Android launcher masks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <DynamicGlassButton
              variant="primary"
              size="md"
              onClick={handleApplyFavicon}
              icon={<RefreshCw size={15} />}
            >
              Apply Tab Favicon
            </DynamicGlassButton>

            <DynamicGlassButton
              variant="glass"
              size="md"
              onClick={handleDownloadIcon}
              icon={<Download size={15} className="text-zinc-300" />}
            >
              Export PNG
            </DynamicGlassButton>
          </div>
        </div>

        {copiedNotification && (
          <p className="mt-4 text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
            <Check size={14} />
            {copiedNotification}
          </p>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Config Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Theme Selection */}
          <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-[#ff0033]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Liquid Glass Color Themes
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {themeKeys.map((theme) => {
                const item = THEME_GRADIENTS[theme];
                const isActive = config.theme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => {
                      const updated = { ...config, theme };
                      onChangeConfig(updated);
                      updateFaviconWithLiquidGlass(updated);
                    }}
                    className={`ytm-dynamic-btn p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isActive
                        ? 'border-[#ff0033] bg-[#2b2b2b] shadow-md ring-1 ring-[#ff0033]'
                        : 'border-white/10 bg-[#212121]/60 hover:border-white/20 hover:bg-[#252525]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${item.primary}, ${item.secondary})`
                        }}
                      />
                      <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                        {item.name.replace(' Liquid', '').replace(' Glass', '')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Glyph Selection */}
          <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#ff0033]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Center Glyph Symbol
              </h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {glyphs.map((g) => {
                const IconComponent = g.icon;
                const isActive = config.glyph === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      const updated = { ...config, glyph: g.id };
                      onChangeConfig(updated);
                      updateFaviconWithLiquidGlass(updated);
                    }}
                    className={`ytm-dynamic-btn p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      isActive
                        ? 'border-[#ff0033] bg-[#ff0000]/15 text-white shadow-sm'
                        : 'border-white/10 bg-[#212121]/60 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <IconComponent size={18} className={isActive ? 'text-[#ff0033]' : ''} />
                    <span className="text-[11px] font-medium">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Physical Shaders & Fluid Controls */}
          <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#ff0033]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Liquid Glass Physics Shaders
              </h3>
            </div>

            {/* Blur Strength */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Glass Blur Depth</span>
                <span className="text-white font-mono tabular-nums">{config.blurStrength}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="36"
                value={config.blurStrength}
                onChange={(e) => onChangeConfig({ ...config, blurStrength: Number(e.target.value) })}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ff0000]"
              />
            </div>

            {/* Specular Glow */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Specular Curved Arc Reflection</span>
                <span className="text-white font-mono tabular-nums">{Math.round(config.specularGlow * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={config.specularGlow}
                onChange={(e) => onChangeConfig({ ...config, specularGlow: Number(e.target.value) })}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ff0000]"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Glass Chamfer Rim Gleam</span>
                <span className="text-[11px] text-zinc-400">Reflective perimeter bezel</span>
              </div>
              <button
                onClick={() => onChangeConfig({ ...config, borderGleam: !config.borderGleam })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  config.borderGleam ? 'bg-[#ff0000]' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    config.borderGleam ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Animated Fluid Waves</span>
                <span className="text-[11px] text-zinc-400">Subtle liquid pulse</span>
              </div>
              <button
                onClick={() => onChangeConfig({ ...config, animatedRipples: !config.animatedRipples })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  config.animatedRipples ? 'bg-[#ff0000]' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    config.animatedRipples ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Showcase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-8 bg-[#181818]/70 border border-white/[0.08] backdrop-blur-xl flex flex-col items-center text-center">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
              Interactive 3D Glass Preview (Hover to Tilt)
            </span>

            <div className="my-4">
              <LiquidGlassIcon 
                config={config} 
                size="xl" 
                shape={apkConfig.launcherIconShape}
                interactive={true} 
              />
            </div>

            <h4 className="text-base font-bold text-white mt-4">
              {apkConfig.name}
            </h4>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {THEME_GRADIENTS[config.theme].name} · {config.glyph.toUpperCase()}
            </p>
          </div>

          {/* Launcher Screen Mockup */}
          <div className="rounded-3xl p-6 bg-[#181818]/70 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={16} className="text-[#ff0033]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Android Launcher Home Screen Mockup
              </h4>
            </div>

            <div className="w-full bg-black rounded-2xl border border-white/10 p-4 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-center text-[10px] text-zinc-400 font-mono mb-4 px-1">
                <span>09:41</span>
                <span>5G · 100%</span>
              </div>

              <div className="relative z-10 grid grid-cols-4 gap-3 text-center my-2">
                <div className="flex flex-col items-center">
                  <div className="p-1 rounded-2xl bg-[#ff0000]/15 ring-2 ring-[#ff0000]/60">
                    <LiquidGlassIcon 
                      config={config} 
                      size="sm" 
                      shape={apkConfig.launcherIconShape} 
                      interactive={false} 
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-white mt-1.5 truncate max-w-[64px]">
                    {apkConfig.name}
                  </span>
                </div>

                <div className="flex flex-col items-center opacity-50">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <Smartphone size={18} />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1.5">Phone</span>
                </div>

                <div className="flex flex-col items-center opacity-50">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <Radio size={18} />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1.5">Radio</span>
                </div>

                <div className="flex flex-col items-center opacity-50">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <Flame size={18} />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1.5">News</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
