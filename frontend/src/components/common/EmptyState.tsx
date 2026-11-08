import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-[#D9DED7] dark:border-[#304144]',
        'bg-white dark:bg-[#19272A] shadow-sm relative overflow-hidden',
        className
      )}
    >
      {/* Concentric radar rings background effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-64 h-64 rounded-full border border-cyan-500/30" />
        <div className="absolute w-44 h-44 rounded-full border border-cyan-500/40" />
        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/50" />
      </div>

      {/* Center Icon badge */}
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-center text-[#A95636] dark:text-[#C47A52]">
          {icon || <ShieldCheck className="w-7 h-7 text-cyan-400" />}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base font-semibold text-[#182629] dark:text-[#E8E6DC] tracking-wide mb-1.5">{title}</h3>
      <p className="text-xs text-[#647477] dark:text-[#A6B3AE] max-w-sm leading-relaxed mb-6">{description}</p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

