import { cn } from '../../utils/cn.ts';

export type ProgressVariant = 'cyan' | 'emerald' | 'purple' | 'threat' | 'rose' | 'amber';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: ProgressVariant;
  size?: ProgressSize;
  isAnimated?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'cyan',
  size = 'md',
  isAnimated = true,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Determine dynamic color if variant is 'threat'
  const resolvedVariant =
    variant === 'threat'
      ? percentage > 75
        ? 'rose'
        : percentage > 45
        ? 'amber'
        : 'emerald'
      : variant;

  const barColors: Record<string, string> = {
    cyan: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]',
    emerald: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]',
    purple: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
    rose: 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]',
    amber: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]',
  };

  const heightStyles: Record<ProgressSize, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-300 uppercase tracking-wider">{label}</span>}
          {showValue && <span className="font-mono text-cyan-400 font-semibold">{Math.round(percentage)}%</span>}
        </div>
      )}

      <div
        className={cn(
          'w-full rounded-full bg-[#070d1e] border border-white/10 overflow-hidden relative p-0.5',
          heightStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out relative',
            barColors[resolvedVariant] || barColors.cyan,
            isAnimated && 'after:absolute after:inset-0 after:bg-white/20 after:animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export interface RadialProgressProps {
  value: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: ProgressVariant;
  className?: string;
}

export function RadialProgress({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  variant = 'cyan',
  className,
}: RadialProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColors: Record<ProgressVariant, string> = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    purple: '#a855f7',
    rose: '#ef4444',
    amber: '#f59e0b',
    threat: percentage > 75 ? '#ef4444' : percentage > 45 ? '#f59e0b' : '#10b981',
  };

  const currentColor = strokeColors[variant];

  return (
    <div className={cn('inline-flex flex-col items-center justify-center relative select-none', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Value circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${currentColor})` }}
        />
      </svg>

      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-xl font-bold font-mono tracking-tight text-white">{Math.round(percentage)}%</span>
        {label && <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-0.5">{label}</span>}
      </div>

      {sublabel && (
        <span className="text-xs text-slate-400 font-mono mt-2 tracking-wide">{sublabel}</span>
      )}
    </div>
  );
}
