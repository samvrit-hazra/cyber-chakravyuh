import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertBannerProps {
  variant?: AlertBannerVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function AlertBanner({
  variant = 'info',
  title,
  description,
  action,
  onDismiss,
  className,
}: AlertBannerProps) {
  const variantStyles = {
    info: {
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-200',
      titleColor: 'text-cyan-300',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.18)]',
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
      accentBar: 'bg-cyan-400',
    },
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-200',
      titleColor: 'text-emerald-300',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.18)]',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      accentBar: 'bg-emerald-400',
    },
    warning: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/40',
      text: 'text-amber-200',
      titleColor: 'text-amber-300',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.18)]',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      accentBar: 'bg-amber-400',
    },
    danger: {
      border: 'border-rose-500/50',
      bg: 'bg-rose-950/40',
      text: 'text-rose-200',
      titleColor: 'text-rose-300',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.22)]',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />,
      accentBar: 'bg-rose-500',
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md overflow-hidden',
        current.bg,
        current.border,
        current.glow,
        className
      )}
    >
      {/* Left Accent indicator line */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1', current.accentBar)} />

      {current.icon}

      <div className="flex-1 space-y-1 pr-6">
        <h4 className={cn('text-sm font-semibold tracking-wide flex items-center gap-2', current.titleColor)}>
          {title}
        </h4>
        {description && <p className={cn('text-xs leading-relaxed opacity-90', current.text)}>{description}</p>}
        {action && <div className="pt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

