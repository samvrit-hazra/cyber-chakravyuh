import React from 'react';
import { cn } from '../../utils/cn.ts';

export type BadgeVariant = 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  hasDot?: boolean;
  pulseDot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'cyan',
  size = 'md',
  hasDot = false,
  pulseDot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string; glow: string }> = {
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-300',
      border: 'border-cyan-500/30',
      dot: 'bg-cyan-400',
      glow: 'shadow-[0_0_8px_rgba(6,182,212,0.3)]',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      border: 'border-purple-500/30',
      dot: 'bg-purple-400',
      glow: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
      glow: 'shadow-[0_0_8px_rgba(244,63,94,0.3)]',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.3)]',
    },
    neutral: {
      bg: 'bg-slate-800/60',
      text: 'text-slate-300',
      border: 'border-slate-700/60',
      dot: 'bg-slate-400',
      glow: '',
    },
  };

  const sizes: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 font-medium gap-1.5',
    md: 'text-xs px-2.5 py-1 font-semibold gap-2',
  };

  const current = variants[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide uppercase font-mono select-none backdrop-blur-sm',
        current.bg,
        current.text,
        current.border,
        current.glow,
        sizes[size],
        className
      )}
      {...props}
    >
      {hasDot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulseDot && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                current.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', current.dot)} />
        </span>
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

