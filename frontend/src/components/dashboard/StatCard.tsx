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
    copper: {
      border: 'border-[#A95636]/20 dark:border-[#C47A52]/30',
      glow: 'hover:border-[#A95636] dark:hover:border-[#C47A52]',
      text: 'text-[#A95636] dark:text-[#C47A52]',
      badge: 'bg-[#A95636]/10 text-[#A95636] dark:text-[#C47A52] border-[#A95636]/30',
      accentBar: 'bg-[#A95636] dark:bg-[#C47A52]',
    },
    spruce: {
      border: 'border-[#356D68]/20 dark:border-[#79A99C]/30',
      glow: 'hover:border-[#356D68] dark:hover:border-[#79A99C]',
      text: 'text-[#356D68] dark:text-[#79A99C]',
      badge: 'bg-[#356D68]/10 text-[#356D68] dark:text-[#79A99C] border-[#356D68]/30',
      accentBar: 'bg-[#356D68] dark:bg-[#79A99C]',
    },
    cyan: {
      border: 'border-[#356D68]/20 dark:border-[#79A99C]/30',
      glow: 'hover:border-[#356D68] dark:hover:border-[#79A99C]',
      text: 'text-[#356D68] dark:text-[#79A99C]',
      badge: 'bg-[#356D68]/10 text-[#356D68] dark:text-[#79A99C] border-[#356D68]/30',
      accentBar: 'bg-[#356D68] dark:bg-[#79A99C]',
    },
    rose: {
      border: 'border-[#B64B46]/20 dark:border-[#E17B70]/30',
      glow: 'hover:border-[#B64B46] dark:hover:border-[#E17B70]',
      text: 'text-[#B64B46] dark:text-[#E17B70]',
      badge: 'bg-[#B64B46]/10 text-[#B64B46] dark:text-[#E17B70] border-[#B64B46]/30',
      accentBar: 'bg-[#B64B46] dark:bg-[#E17B70]',
    },
    purple: {
      border: 'border-[#A95636]/20 dark:border-[#C47A52]/30',
      glow: 'hover:border-[#A95636] dark:hover:border-[#C47A52]',
      text: 'text-[#A95636] dark:text-[#C47A52]',
      badge: 'bg-[#A95636]/10 text-[#A95636] dark:text-[#C47A52] border-[#A95636]/30',
      accentBar: 'bg-[#A95636] dark:bg-[#C47A52]',
    },
    emerald: {
      border: 'border-[#36745F]/20 dark:border-[#79B69A]/30',
      glow: 'hover:border-[#36745F] dark:hover:border-[#79B69A]',
      text: 'text-[#36745F] dark:text-[#79B69A]',
      badge: 'bg-[#36745F]/10 text-[#36745F] dark:text-[#79B69A] border-[#36745F]/30',
      accentBar: 'bg-[#36745F] dark:bg-[#79B69A]',
    },
  };

  const current = variantStyles[stat.variant] || variantStyles.cyan;

  return (
    <Card
      variant="interactive"
      className={`p-5 relative overflow-hidden rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] ${current.glow} ${className || ''}`}
    >
      {/* Top fine accent indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${current.accentBar}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] font-medium">
            {stat.title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[#182629] dark:text-[#E8E6DC] mt-1">
            {stat.value}
          </p>
        </div>

        {icon && (
          <div className="p-2.5 rounded-md bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] shadow-sm">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#D9DED7] dark:border-[#304144] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {stat.trend === 'up' && (
            <span className="flex items-center text-[#36745F] dark:text-[#79B69A] font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {stat.change}
            </span>
          )}
          {stat.trend === 'down' && (
            <span className="flex items-center text-[#B64B46] dark:text-[#E17B70] font-bold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {stat.change}
            </span>
          )}
          {stat.trend === 'neutral' && (
            <span className="flex items-center text-[#647477] dark:text-[#A6B3AE] font-bold">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              {stat.change}
            </span>
          )}
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">vs prev cycle</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-[#647477] dark:text-[#A6B3AE]" title={stat.caption}>
          <Info className="w-3 h-3 text-[#647477] dark:text-[#A6B3AE]" />
          <span className="truncate max-w-[120px]">{stat.caption}</span>
        </div>
      </div>
    </Card>
  );
}
