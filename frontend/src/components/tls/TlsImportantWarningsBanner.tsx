import { ShieldAlert, AlertTriangle, KeyRound, Network } from 'lucide-react';
import type { TlsInvestigationResult } from '../../types/tls.ts';

interface TlsImportantWarningsBannerProps {
  warnings: TlsInvestigationResult['importantWarnings'];
}

export function TlsImportantWarningsBanner({ warnings }: TlsImportantWarningsBannerProps) {
  return (
    <div className="rounded-2xl bg-[#091224] border border-amber-500/30 p-5 md:p-6 space-y-4 shadow-xl relative overflow-hidden">
      {/* Background warning tint */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/[0.04] rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-3 text-amber-400 font-mono">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-100">
          MANDATORY PKI FORENSIC DIRECTIVES & ZERO-TRUST BOUNDARIES
        </h3>
      </div>

      {/* 4 Warning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Warning 1: HTTPS != Legitimate */}
        <div className="p-3.5 rounded-xl bg-[#060b17] border border-amber-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>HTTPS $\neq$ Legitimate Entity</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
            {warnings.httpsNotLegitimateNotice}
          </p>
        </div>

        {/* Warning 2: Valid TLS != Safe */}
        <div className="p-3.5 rounded-xl bg-[#060b17] border border-amber-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-rose-300 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Valid TLS $\neq$ Safe Content</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
            {warnings.validTlsNotSafeNotice}
          </p>
        </div>

        {/* Warning 3: Internal CA Key-Gen Limitation */}
        <div className="p-3.5 rounded-xl bg-[#060b17] border border-cyan-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <KeyRound className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>Root CA Key-Gen Telemetry Boundary</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
            {warnings.caKeyGenLimitationNotice}
          </p>
        </div>

        {/* Warning 4: Config Problem vs Compromised Trust */}
        <div className="p-3.5 rounded-xl bg-[#060b17] border border-purple-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <Network className="w-4 h-4 shrink-0 text-purple-400" />
            <span>Misconfiguration vs. Compromised Trust</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
            {warnings.configurationVsCompromiseNotice}
          </p>
        </div>
      </div>
    </div>
  );
}

