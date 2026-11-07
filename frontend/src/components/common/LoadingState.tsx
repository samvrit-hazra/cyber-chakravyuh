import { Shield } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  isFullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  message = 'AUTHENTICATING TELEMETRY FEED...',
  submessage = 'Calibrating multi-layered Chakravyuha nodes',
  isFullScreen = false,
  className,
}: LoadingStateProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center space-y-4 select-none', className)}>
      {/* Radar scanning circular animation */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/40" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/60" />

        {/* Rotating sweep */}
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />

        {/* Center glowing logo */}
        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
          <Shield className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
          {message}
        </p>
        {submessage && (
          <p className="text-[11px] font-mono text-slate-400">{submessage}</p>
        )}
      </div>

      {/* Micro progress indicator */}
      <div className="w-32 h-1 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
        <div className="h-full bg-cyan-400 animate-[cyber-pulse_1.5s_infinite] w-full" />
      </div>
    </div>
  );

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/90 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center rounded-2xl border border-cyan-500/15 bg-[#0b152d]/60 backdrop-blur-md">
      {content}
    </div>
  );
}
