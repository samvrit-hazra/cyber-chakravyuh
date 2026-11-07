import React, { useState } from 'react';
import { cn } from '../../utils/cn.ts';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  position = 'top',
  children,
  delayMs = 150,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const t = setTimeout(() => setIsVisible(true), delayMs);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap px-2.5 py-1 text-xs font-mono font-medium text-slate-100',
            'bg-[#060d1f]/95 border border-cyan-500/30 rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md',
            'pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
