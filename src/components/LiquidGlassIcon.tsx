import React, { useState } from 'react';
import { 
  Music, 
  Disc, 
  Radio, 
  Headphones, 
  CassetteTape, 
  Sparkles, 
  Activity 
} from 'lucide-react';
import { LiquidGlassIconConfig, GlassTheme, IconGlyph } from '../types';
import { THEME_GRADIENTS } from '../utils/iconGenerator';

interface Props {
  config: LiquidGlassIconConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'squircle' | 'circle' | 'rounded' | 'teardrop';
  interactive?: boolean;
  className?: string;
}

export const LiquidGlassIcon: React.FC<Props> = ({
  config,
  size = 'md',
  shape = 'squircle',
  interactive = true,
  className = '',
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const themeData = THEME_GRADIENTS[config.theme] || THEME_GRADIENTS['frost-aqua'];

  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-28 h-28 text-2xl',
  };

  const iconSizes = {
    xs: 14,
    sm: 18,
    md: 26,
    lg: 36,
    xl: 52,
  };

  const shapeRadius = {
    squircle: 'rounded-[26%]',
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    teardrop: 'rounded-2xl rounded-br-none',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y * 0.25);
    setRotateY(x * 0.25);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const renderGlyph = () => {
    const iconSize = iconSizes[size];
    switch (config.glyph) {
      case 'note':
        return <Music size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      case 'vinyl':
        return <Disc size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      case 'wave':
        return <Radio size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      case 'headphones':
        return <Headphones size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      case 'cassette':
        return <CassetteTape size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      case 'aura':
        return <Sparkles size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      case 'equalizer':
        return <Activity size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
      default:
        return <Music size={iconSize} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />;
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '600px',
      }}
      className={`relative select-none shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {/* Outer ambient liquid aura glow */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl transition-all duration-300 opacity-75"
        style={{
          background: `radial-gradient(circle, ${themeData.glow} 0%, transparent 70%)`,
          transform: 'scale(1.25)',
        }}
      />

      {/* 3D Glass Chassis */}
      <div
        className={`relative w-full h-full ${shapeRadius[shape]} overflow-hidden transition-transform duration-200 ease-out flex items-center justify-center`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${interactive && (rotateX !== 0 || rotateY !== 0) ? 1.05 : 1})`,
          boxShadow: `0 12px 28px -6px rgba(0,0,0,0.6), inset 0 1px 1px 0 ${themeData.rimColor}, inset 0 -2px 6px 0 rgba(0,0,0,0.4)`,
          background: `linear-gradient(135deg, ${themeData.primary} 0%, ${themeData.secondary} 55%, ${themeData.tertiary} 100%)`,
        }}
      >
        {/* Animated Liquid Wave Refraction Mesh */}
        {config.animatedRipples && (
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none animate-pulse"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${themeData.accent} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${themeData.tertiary} 0%, transparent 60%)`,
              animationDuration: `${Math.max(1, 3.5 / config.liquidFluidity)}s`,
            }}
          />
        )}

        {/* Liquid Frosted Glass Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${config.blurStrength}px)`,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.18) 100%)',
          }}
        />

        {/* Specular Curved Light Arc (The signature Liquid Glass reflection) */}
        <div
          className="absolute -top-[20%] left-[-15%] w-[130%] h-[60%] rounded-[100%] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 80%, transparent 100%)',
            transform: 'rotate(-12deg)',
            opacity: config.specularGlow,
          }}
        />

        {/* Center Glyph with light reflection */}
        <div className="relative z-10 text-white flex items-center justify-center transform transition-transform duration-200">
          {renderGlyph()}
        </div>

        {/* Glass Rim Border Gleam */}
        {config.borderGleam && (
          <div
            className={`absolute inset-0 ${shapeRadius[shape]} pointer-events-none`}
            style={{
              border: `1.5px solid ${themeData.rimColor}`,
              maskImage: 'linear-gradient(135deg, black 40%, transparent 80%, black 100%)',
              WebkitMaskImage: 'linear-gradient(135deg, black 40%, transparent 80%, black 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
};
