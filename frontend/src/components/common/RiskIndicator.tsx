import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn.ts';
import { getRiskLevel, type RiskLevel } from '../../utils/threat.ts';

export type { RiskLevel };

export interface RiskIndicatorProps {
  score: number; // 0 - 100
  trend?: 'increasing' | 'decreasing' | 'stable';
  confidence?: number; // 0 - 100 percentage
  mode?: 'detailed' | 'compact' | 'segmented';
  className?: string;
}

export function RiskIndicator({
  score,
  trend,
  confidence,
  mode = 'detailed',
  className,
}: RiskIndicatorProps) {
  const level = getRiskLevel(score);

  const levelConfig = {
    low: {
      label: 'LOW RISK',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tagColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30',
    },
    medium: {
      label: 'GUARDED',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      tagColor: 'text-amber-300 bg-amber-500/20 border-amber-400/30',
    },
    high: {
      label: 'HIGH THREAT',
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      tagColor: 'text-orange-300 bg-orange-500/20 border-orange-400/30',
    },
    critical: {
      label: 'CRITICAL ALERT',
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/15',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />,
      tagColor: 'text-rose-300 bg-rose-500/20 border-rose-400/40',
    },
  };

  const current = levelConfig[level];

  // Segmented multi-bar meter
  if (mode === 'segmented') {
    const segments = [
      { id: 'low', max: 25, activeColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]' },
      { id: 'med', max: 50, activeColor: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]' },
      { id: 'high', max: 75, activeColor: 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.7)]' },
      { id: 'crit', max: 100, activeColor: 'bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' },
    ];

    return (
      <div className={cn('space-y-1.5 w-full', className)}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className={cn('font-mono font-bold', current.color)}>{current.label}</span>
          </div>
          <span className="font-mono text-slate-300 font-semibold">{score} / 100</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-2">
          {segments.map((seg, idx) => {
            const isFilled = score > (idx === 0 ? 0 : segments[idx - 1].max);
            return (
              <div
                key={seg.id}
                className={cn(
                  'h-full rounded-sm transition-all duration-300',
                  isFilled ? seg.activeColor : 'bg-slate-800/80 border border-white/[0.06]'
                )}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Compact badge mode
  if (mode === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-2.5 py-1 rounded-md border font-mono select-none',
          current.bg,
          current.border,
          current.glow,
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-current" style={{ color: current.color }} />
        <span className={cn('text-xs font-bold', current.color)}>{current.label}</span>
        <span className="text-xs text-slate-300 font-semibold">({score})</span>
      </div>
    );
  }

  // Detailed Card mode
  return (
    <div
      className={cn(
        'p-4 rounded-xl border bg-white dark:bg-[#19272A] border-[#D9DED7] dark:border-[#304144] shadow-sm relative overflow-hidden transition-all duration-300',
        current.border,
        current.glow,
        className
      )}
    >
      {/* Top indicator stripe */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', current.bg)} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg border', current.bg, current.border)}>
            {current.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-mono font-bold tracking-wider', current.color)}>
                {current.label}
              </span>
              <span className={cn('text-[10px] px-1.5 py-0.2 rounded border font-mono', current.tagColor)}>
                SCORE {score}
              </span>
            </div>
            <p className="text-xs text-[#647477] dark:text-[#A6B3AE] mt-0.5">Calculated Threat Index</p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-1">
            {trend === 'increasing' && (
              <span className="flex items-center text-rose-400 text-xs font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +Trend
              </span>
            )}
            {trend === 'decreasing' && (
              <span className="flex items-center text-emerald-400 text-xs font-mono">
                <ArrowDownRight className="w-3.5 h-3.5" /> -Trend
              </span>
            )}
            {trend === 'stable' && (
              <span className="flex items-center text-[#647477] dark:text-[#A6B3AE] text-xs font-mono">
                <Minus className="w-3.5 h-3.5" /> Stable
              </span>
            )}
          </div>
          {confidence !== undefined && (
            <span className="text-[10px] text-cyan-400 font-mono mt-0.5">
              AI Conf: {confidence}%
            </span>
          )}
        </div>
      </div>

      {/* Mini score meter bar */}
      <div className="mt-3 w-full bg-[#EAECE6] dark:bg-[#223336] rounded-full h-1.5 overflow-hidden border border-[#D9DED7] dark:border-[#304144]">
        <div
          className={cn('h-full rounded-full transition-all duration-500', current.bg.replace('/10', '').replace('/15', ''))}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
}
