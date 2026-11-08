import { ShieldAlert, AlertTriangle, KeyRound, Network } from 'lucide-react';
import type { TlsInvestigationResult } from '../../types/tls.ts';

interface TlsImportantWarningsBannerProps {
  warnings: TlsInvestigationResult['importantWarnings'];
}

export function TlsImportantWarningsBanner({ warnings }: TlsImportantWarningsBannerProps) {
  return (
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#A87532]/30 dark:border-[#D7AA61]/30 p-5 md:p-6 space-y-4 shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#D9DED7] dark:border-[#304144] pb-3 text-[#A87532] dark:text-[#D7AA61] font-mono">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#182629] dark:text-[#E8E6DC]">
          MANDATORY PKI FORENSIC DIRECTIVES & ZERO-TRUST BOUNDARIES
        </h3>
      </div>

      {/* 4 Warning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Warning 1: HTTPS != Legitimate */}
        <div className="p-3.5 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
          <div className="flex items-center gap-2 text-[#A87532] dark:text-[#D7AA61] font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#A87532] dark:text-[#D7AA61]" />
            <span>HTTPS $\neq$ Legitimate Entity</span>
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-[11px]">
            {warnings.httpsNotLegitimateNotice}
          </p>
        </div>

        {/* Warning 2: Valid TLS != Safe */}
        <div className="p-3.5 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
          <div className="flex items-center gap-2 text-[#B64B46] dark:text-[#E17B70] font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#B64B46] dark:text-[#E17B70]" />
            <span>Valid TLS $\neq$ Safe Content</span>
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-[11px]">
            {warnings.validTlsNotSafeNotice}
          </p>
        </div>

        {/* Warning 3: Internal CA Key-Gen Limitation */}
        <div className="p-3.5 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
          <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C] font-bold">
            <KeyRound className="w-4 h-4 shrink-0 text-[#356D68] dark:text-[#79A99C]" />
            <span>Root CA Key-Gen Telemetry Boundary</span>
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-[11px]">
            {warnings.caKeyGenLimitationNotice}
          </p>
        </div>

        {/* Warning 4: Config Problem vs Compromised Trust */}
        <div className="p-3.5 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
          <div className="flex items-center gap-2 text-[#A95636] dark:text-[#C47A52] font-bold">
            <Network className="w-4 h-4 shrink-0 text-[#A95636] dark:text-[#C47A52]" />
            <span>Misconfiguration vs. Compromised Trust</span>
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-[11px]">
            {warnings.configurationVsCompromiseNotice}
          </p>
        </div>
      </div>
    </div>
  );
}
