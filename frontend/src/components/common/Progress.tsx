import { cn } from '../../utils/cn.ts';

export type ProgressVariant = 'copper' | 'spruce' | 'cyan' | 'emerald' | 'purple' | 'threat' | 'rose' | 'amber';
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
  variant = 'copper',
  size = 'md',
  isAnimated = false,
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
    copper: 'bg-[#A95636] dark:bg-[#C47A52]',
    spruce: 'bg-[#356D68] dark:bg-[#79A99C]',
    cyan: 'bg-[#356D68] dark:bg-[#79A99C]',
    purple: 'bg-[#A95636] dark:bg-[#C47A52]',
    emerald: 'bg-[#36745F] dark:bg-[#79B69A]',
    rose: 'bg-[#B64B46] dark:bg-[#E17B70]',
    amber: 'bg-[#A87532] dark:bg-[#D7AA61]',
  };

  const heightStyles: Record<ProgressSize, string> = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full space-y-1.5 font-sans', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-[#647477] dark:text-[#A6B3AE] uppercase tracking-wider font-mono text-[11px]">{label}</span>}
          {showValue && <span className="font-mono text-[#182629] dark:text-[#E8E6DC] font-bold">{Math.round(percentage)}%</span>}
        </div>
      )}

      <div
        className={cn(
          'w-full rounded bg-[#EAECE6] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] overflow-hidden relative',
          heightStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded transition-all duration-300 ease-out relative',
            barColors[resolvedVariant] || barColors.copper,
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
  strokeWidth = 8,
  label,
  sublabel,
  variant = 'copper',
  className,
}: RadialProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColors: Record<ProgressVariant, string> = {
    copper: '#A95636',
    spruce: '#356D68',
    cyan: '#356D68',
    emerald: '#36745F',
    purple: '#A95636',
    rose: '#B64B46',
    amber: '#A87532',
    threat: percentage > 75 ? '#B64B46' : percentage > 45 ? '#A87532' : '#36745F',
  };

  const currentColor = strokeColors[variant] || '#A95636';

  return (
    <div className={cn('inline-flex flex-col items-center justify-center relative select-none font-mono', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-[#D9DED7] dark:text-[#304144]"
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
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-xl font-bold tracking-tight text-[#182629] dark:text-[#E8E6DC]">{Math.round(percentage)}%</span>
        {label && <span className="text-[10px] uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] mt-0.5">{label}</span>}
      </div>

      {sublabel && (
        <span className="text-xs text-[#647477] dark:text-[#A6B3AE] mt-2 tracking-wide font-sans">{sublabel}</span>
      )}
    </div>
  );
}
