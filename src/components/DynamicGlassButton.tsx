import React, { useState } from 'react';
import { THEME_GRADIENTS } from '../utils/iconGenerator';
import { GlassTheme } from '../types';

export interface DynamicGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'chip' | 'icon-only' | 'danger' | 'subtle' | 'pill';
  theme?: GlassTheme;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isActive?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glowColor?: string;
  badge?: string | number;
  className?: string;
}

export const DynamicGlassButton: React.FC<DynamicGlassButtonProps> = ({
  variant = 'glass',
  theme = 'frost-aqua',
  icon,
  children,
  isActive = false,
  size = 'md',
  glowColor,
  badge,
  className = '',
  onClick,
  disabled,
  title,
  type = 'button',
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const themeData = THEME_GRADIENTS[theme] || THEME_GRADIENTS['frost-aqua'];

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[11px] gap-1.5 min-h-[28px] rounded-full',
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[34px] rounded-full',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2 min-h-[40px] rounded-full',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 min-h-[46px] rounded-full',
    xl: 'px-6 py-3 text-base gap-3 min-h-[52px] rounded-full',
  };

  const iconOnlySizes = {
    xs: 'w-7 h-7 p-0 rounded-full',
    sm: 'w-8 h-8 p-0 rounded-full',
    md: 'w-10 h-10 p-0 rounded-full',
    lg: 'w-12 h-12 p-0 rounded-full',
    xl: 'w-14 h-14 p-0 rounded-full',
  };

  // 1. YouTube Music Primary Liquid Glass Red Orb Button
  if (variant === 'primary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        title={title}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`ytm-dynamic-btn group relative font-bold text-white flex items-center justify-center select-none cursor-pointer transition-all duration-200 active:scale-95 ${
          icon && !children ? iconOnlySizes[size] : sizeClasses[size]
        } disabled:opacity-50 disabled:pointer-events-none ${className}`}
        style={{
          background: 'linear-gradient(135deg, #ff0033 0%, #cc0000 50%, #990000 100%)',
          boxShadow: isHovered
            ? '0 10px 28px -2px rgba(255, 0, 51, 0.55), inset 0 1px 2px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 6px 0 rgba(0, 0, 0, 0.4)'
            : '0 4px 16px 0 rgba(255, 0, 51, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.45)',
          transform: isPressed ? 'scale(0.94)' : isHovered ? 'translateY(-1px)' : 'none',
        }}
        {...rest}
      >
        {/* Specular curved liquid gleam */}
        <div
          className="absolute -top-[35%] -left-[20%] w-[140%] h-[70%] rounded-[100%] pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.1) 70%, transparent 100%)',
            transform: 'rotate(-8deg)',
            opacity: isHovered ? 0.9 : 0.65,
          }}
        />

        {/* Ambient bottom liquid reflection */}
        <div 
          className="absolute bottom-0 inset-x-2 h-[40%] rounded-b-full pointer-events-none opacity-30 blur-[2px]"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(255, 120, 150, 0.8) 0%, transparent 70%)',
          }}
        />

        {/* Dynamic Icon with gleam & micro-animation */}
        {icon && (
          <span className="relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {icon}
          </span>
        )}
        {children && <span className="relative z-10 whitespace-nowrap tracking-tight">{children}</span>}
        {badge !== undefined && (
          <span className="relative z-10 text-[10px] bg-black/40 text-white font-mono px-1.5 py-0.5 rounded-full ml-1 border border-white/20">
            {badge}
          </span>
        )}
      </button>
    );
  }

  // 2. YouTube Music Chip / Mood Pill (e.g. "Energize", "Relax", "Workout", "Focus")
  if (variant === 'chip' || variant === 'pill') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        title={title}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`ytm-dynamic-btn group relative font-medium transition-all duration-200 select-none cursor-pointer flex items-center justify-center shrink-0 ${
          sizeClasses[size]
        } ${
          isActive
            ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
            : 'bg-[#212121]/90 text-zinc-300 hover:text-white border border-white/[0.08] hover:border-white/20 hover:bg-[#2b2b2b]'
        } disabled:opacity-50 disabled:pointer-events-none ${className}`}
        style={{
          transform: isPressed ? 'scale(0.95)' : isHovered ? 'translateY(-1px)' : 'none',
        }}
        {...rest}
      >
        {/* Dynamic liquid specular sweep */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: isActive 
              ? 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 70%, transparent 100%)',
            opacity: isHovered ? 1 : 0.6,
          }}
        />

        {/* Dynamic Icon */}
        {icon && (
          <span className={`relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
            isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'
          }`}>
            {icon}
          </span>
        )}
        {children && <span className="relative z-10 whitespace-nowrap">{children}</span>}
        {badge !== undefined && (
          <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ml-1 ${
            isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-zinc-300'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  }

  // 3. Dynamic Liquid Glass Orb (Icon-only with glass lens reflection)
  if (variant === 'icon-only') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        title={title}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`ytm-dynamic-btn group relative flex items-center justify-center select-none cursor-pointer transition-all duration-200 ${
          iconOnlySizes[size]
        } ${
          isActive
            ? 'text-white border border-[#ff0033]/60 shadow-[0_0_18px_rgba(255,0,51,0.45)]'
            : 'text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 bg-[#212121]/70 hover:bg-[#2e2e2e]'
        } disabled:opacity-50 disabled:pointer-events-none ${className}`}
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: isActive
            ? 'linear-gradient(135deg, rgba(255,0,51,0.35) 0%, rgba(204,0,0,0.2) 100%)'
            : undefined,
          transform: isPressed ? 'scale(0.92)' : isHovered ? 'scale(1.06)' : 'none',
        }}
        {...rest}
      >
        {/* Specular top rim highlight */}
        <div
          className="absolute top-0 inset-x-2 h-[1px] pointer-events-none"
          style={{
            background: isActive
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          }}
        />

        {/* Dynamic Lens refraction glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.22) 0%, transparent 60%)',
            opacity: isHovered ? 1 : 0.5,
          }}
        />

        <span className="relative z-10 transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          {icon}
        </span>
      </button>
    );
  }

  // 4. Danger Red Liquid Glass Button
  if (variant === 'danger') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        title={title}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`ytm-dynamic-btn group relative font-semibold text-rose-200 hover:text-white select-none cursor-pointer flex items-center justify-center border border-rose-500/30 hover:border-rose-500/60 transition-all ${
          icon && !children ? iconOnlySizes[size] : sizeClasses[size]
        } ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.25) 0%, rgba(159, 18, 57, 0.15) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: isHovered ? '0 4px 16px rgba(225, 29, 72, 0.3)' : 'none',
        }}
        {...rest}
      >
        <div
          className="absolute top-0 inset-x-2 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          }}
        />
        {icon && <span className="relative z-10 shrink-0 mr-1.5 transition-transform group-hover:scale-110">{icon}</span>}
        {children && <span className="relative z-10 whitespace-nowrap">{children}</span>}
      </button>
    );
  }

  // 5. Default Frosted Liquid Glass Button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`ytm-dynamic-btn group relative font-semibold select-none cursor-pointer flex items-center justify-center transition-all duration-200 ${
        icon && !children ? iconOnlySizes[size] : sizeClasses[size]
      } ${
        isActive
          ? 'bg-white/15 text-white border border-white/25 shadow-md shadow-black/40'
          : 'bg-[#212121]/80 hover:bg-[#2b2b2b] text-zinc-200 hover:text-white border border-white/[0.08] hover:border-white/20'
      } disabled:opacity-50 disabled:pointer-events-none ${className}`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transform: isPressed ? 'scale(0.95)' : isHovered ? 'translateY(-1px)' : 'none',
        boxShadow: isHovered 
          ? `0 6px 20px 0 ${glowColor || 'rgba(0,0,0,0.5)'}, inset 0 1px 1px 0 rgba(255,255,255,0.3)`
          : 'inset 0 1px 1px 0 rgba(255,255,255,0.15)',
      }}
      {...rest}
    >
      {/* Specular gleam arc */}
      <div
        className="absolute -top-[40%] -left-[20%] w-[140%] h-[70%] rounded-[100%] pointer-events-none transition-opacity duration-300"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)',
          transform: 'rotate(-8deg)',
          opacity: isHovered ? 0.8 : 0.4,
        }}
      />
      {icon && (
        <span className="relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {icon}
        </span>
      )}
      {children && <span className="relative z-10 whitespace-nowrap">{children}</span>}
      {badge !== undefined && (
        <span className="relative z-10 text-[10px] bg-white/10 text-zinc-300 font-mono px-1.5 py-0.2 rounded-full ml-1">
          {badge}
        </span>
      )}
    </button>
  );
};
