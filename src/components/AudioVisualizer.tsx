import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface Props {
  isPlaying: boolean;
  barColor?: string;
  glowColor?: string;
  barsCount?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<Props> = ({
  isPlaying,
  barColor = 'from-cyan-400 to-indigo-500',
  glowColor = 'rgba(6, 182, 212, 0.4)',
  barsCount = 14,
  className = '',
}) => {
  const [data, setData] = useState<number[]>(new Array(barsCount).fill(0.1));
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const raw = audioEngine.getVisualizerData();
      // Interpolate or slice to barsCount
      const sliced = raw.slice(0, barsCount);
      setData(sliced);
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [barsCount]);

  return (
    <div className={`flex items-end gap-1 h-8 px-2 ${className}`}>
      {data.map((val, idx) => {
        const heightPercent = isPlaying ? Math.max(12, Math.min(100, val * 100)) : 10;
        return (
          <div
            key={idx}
            className="flex-1 min-w-[3px] max-w-[6px] rounded-full bg-gradient-to-t transition-all duration-100 ease-out"
            style={{
              height: `${heightPercent}%`,
              backgroundImage: `linear-gradient(to top, var(--tw-gradient-stops))`,
              boxShadow: isPlaying ? `0 0 8px ${glowColor}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
