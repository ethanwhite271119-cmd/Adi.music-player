import { LiquidGlassIconConfig, GlassTheme, IconGlyph } from '../types';

export const THEME_GRADIENTS: Record<GlassTheme, {
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
  glow: string;
  accent: string;
  rimColor: string;
}> = {
  'frost-aqua': {
    name: 'Frost Aqua Liquid',
    primary: '#06b6d4',
    secondary: '#3b82f6',
    tertiary: '#8b5cf6',
    glow: 'rgba(6, 182, 212, 0.45)',
    accent: '#67e8f9',
    rimColor: 'rgba(255, 255, 255, 0.6)',
  },
  'amethyst-violet': {
    name: 'Amethyst Violet Glass',
    primary: '#8b5cf6',
    secondary: '#d946ef',
    tertiary: '#4f46e5',
    glow: 'rgba(168, 85, 247, 0.45)',
    accent: '#e879f9',
    rimColor: 'rgba(255, 255, 255, 0.65)',
  },
  'solar-amber': {
    name: 'Solar Amber Sunset',
    primary: '#f59e0b',
    secondary: '#ef4444',
    tertiary: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.45)',
    accent: '#fde68a',
    rimColor: 'rgba(255, 255, 255, 0.6)',
  },
  'emerald-aurora': {
    name: 'Emerald Aurora Glass',
    primary: '#10b981',
    secondary: '#06b6d4',
    tertiary: '#047857',
    glow: 'rgba(16, 185, 129, 0.45)',
    accent: '#6ee7b7',
    rimColor: 'rgba(255, 255, 255, 0.55)',
  },
  'obsidian-prism': {
    name: 'Obsidian Prism Glass',
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    accent: '#cbd5e1',
    rimColor: 'rgba(255, 255, 255, 0.75)',
  },
  'rose-quartz': {
    name: 'Rose Quartz Crystal',
    primary: '#f43f5e',
    secondary: '#ec4899',
    tertiary: '#fda4af',
    glow: 'rgba(244, 63, 94, 0.4)',
    accent: '#fecdd3',
    rimColor: 'rgba(255, 255, 255, 0.7)',
  },
  'cyber-neon': {
    name: 'Cyber Neon Liquid',
    primary: '#06b6d4',
    secondary: '#ec4899',
    tertiary: '#84cc16',
    glow: 'rgba(236, 72, 153, 0.45)',
    accent: '#a3e635',
    rimColor: 'rgba(255, 255, 255, 0.8)',
  },
};

export function updateFaviconWithLiquidGlass(config: LiquidGlassIconConfig) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const themeData = THEME_GRADIENTS[config.theme] || THEME_GRADIENTS['frost-aqua'];

  // Base background with rounded corners
  const radius = 18;
  ctx.beginPath();
  ctx.roundRect(4, 4, 56, 56, radius);
  ctx.closePath();

  // Glass gradient fill
  const grad = ctx.createLinearGradient(4, 4, 60, 60);
  grad.addColorStop(0, themeData.primary);
  grad.addColorStop(0.5, themeData.secondary);
  grad.addColorStop(1, themeData.tertiary);
  ctx.fillStyle = grad;
  ctx.fill();

  // Specular top shine
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(32, 16, 24, 10, 0, 0, Math.PI * 2);
  const shineGrad = ctx.createLinearGradient(32, 6, 32, 26);
  shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
  shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
  ctx.fillStyle = shineGrad;
  ctx.fill();
  ctx.restore();

  // Border gleam
  ctx.lineWidth = 2;
  ctx.strokeStyle = themeData.rimColor;
  ctx.stroke();

  // Draw glyph symbol in crisp white
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (config.glyph === 'note') {
    ctx.beginPath();
    ctx.arc(26, 42, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(30, 22, 3, 20);
    ctx.fillRect(30, 22, 14, 4);
    ctx.fillRect(41, 22, 3, 16);
    ctx.beginPath();
    ctx.arc(37, 38, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (config.glyph === 'vinyl') {
    ctx.beginPath();
    ctx.arc(32, 32, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(32, 32, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (config.glyph === 'headphones') {
    ctx.beginPath();
    ctx.arc(32, 32, 12, Math.PI, 0);
    ctx.stroke();
    ctx.fillRect(18, 30, 4, 10);
    ctx.fillRect(42, 30, 4, 10);
  } else {
    // Waveform
    const heights = [10, 18, 28, 20, 12];
    const xs = [20, 26, 32, 38, 44];
    heights.forEach((h, i) => {
      ctx.beginPath();
      ctx.moveTo(xs[i], 32 - h / 2);
      ctx.lineTo(xs[i], 32 + h / 2);
      ctx.stroke();
    });
  }

  const dataUrl = canvas.toDataURL('image/png');
  const favicon = document.getElementById('dynamic-favicon') as HTMLLinkElement;
  if (favicon) {
    favicon.href = dataUrl;
  }
}
