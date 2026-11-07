import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card } from '../common/index.ts';
import type { StatMetric } from '../../types/dashboard.ts';

interface StatCardProps {
  stat: StatMetric;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ stat, icon, className }: StatCardProps) {
  const variantStyles = {
    cyan: {
      border: 'border-cyan-500/25',
      glow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)] hover:border-cyan-400/50',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      accentBar: 'bg-cyan-400',
    },
    rose: {
      border: 'border-rose-500/30',
      glow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.22)] hover:border-rose-400/60',
      text: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      accentBar: 'bg-rose-500',
    },
    purple: {
      border: 'border-purple-500/25',
      glow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.18)] hover:border-purple-400/50',
      text: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      accentBar: 'bg-purple-500',
    },
    emerald: {
      border: 'border-emerald-500/25',
      glow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)] hover:border-emerald-400/50',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      accentBar: 'bg-emerald-400',
    },
  };

  const current = variantStyles[stat.variant] || variantStyles.cyan;

  return (
    <Card
      variant="interactive"
      className={`p-5 relative overflow-hidden bg-[#0b152d]/80 backdrop-blur-xl ${current.border} ${current.glow} ${className || ''}`}
    >
      {/* Top fine accent indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${current.accentBar}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
            {stat.title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white mt-1">
            {stat.value}
          </p>
        </div>

        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 shadow-inner">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {stat.trend === 'up' && (
            <span className="flex items-center text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {stat.change}
            </span>
          )}
          {stat.trend === 'down' && (
            <span className="flex items-center text-rose-400 font-bold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {stat.change}
            </span>
          )}
          {stat.trend === 'neutral' && (
            <span className="flex items-center text-slate-400 font-bold">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              {stat.change}
            </span>
          )}
          <span className="text-[11px] text-slate-500">vs prev cycle</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-500" title={stat.caption}>
          <Info className="w-3 h-3 text-slate-500" />
          <span className="truncate max-w-[120px]">{stat.caption}</span>
        </div>
      </div>
    </Card>
  );
}

