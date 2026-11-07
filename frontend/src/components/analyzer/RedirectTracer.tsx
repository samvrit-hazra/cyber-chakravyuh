import { AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import type { RedirectAnalysis } from '../../types/investigation.ts';

interface RedirectTracerProps {
  analysis: RedirectAnalysis;
}

export function RedirectTracer({ analysis }: RedirectTracerProps) {
  if (!analysis) return null;

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h4 className="text-xs uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] font-semibold">
          Redirect Chain Analysis ({analysis.totalHops} Hops)
        </h4>
        {analysis.isCloaked && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-[#B64B46]/10 dark:bg-[#E17B70]/15 border border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]">
            <AlertTriangle className="w-3 h-3" />
            <span>Adversary Cloaking Detected</span>
          </span>
        )}
      </div>

      <div className="p-4 rounded-md bg-[#EAECE6]/50 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3 text-xs">
        <div className="space-y-2.5">
          {/* Ingress URL */}
          <div className="flex items-start gap-2.5 text-[#647477] dark:text-[#A6B3AE]">
            <span className="w-5 h-5 rounded bg-[#D9DED7] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
              1
            </span>
            <div className="flex-1 truncate">
              <span className="text-[#647477] dark:text-[#A6B3AE] mr-2">INGRESS:</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-medium break-all select-all">{analysis.originalUrl}</span>
            </div>
          </div>

          {/* Intermediate Hops */}
          {analysis.intermediateHops?.map((hop) => (
            <div
              key={hop.hopNumber}
              className="flex items-start gap-2.5 pl-5 border-l-2 border-[#D9DED7] dark:border-[#304144] ml-2.5 py-1 text-[#647477] dark:text-[#A6B3AE]"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#A87532]/10 dark:bg-[#D7AA61]/20 text-[#A87532] dark:text-[#D7AA61] border border-[#A87532]/20 dark:border-[#D7AA61]/30">
                    HTTP {hop.statusCode} {hop.statusText}
                  </span>
                  {hop.isSsl && (
                    <span className="flex items-center gap-1 text-[10px] text-[#36745F] dark:text-[#79B69A]">
                      <Lock className="w-3 h-3" /> SSL
                    </span>
                  )}
                  <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">{hop.latencyMs}ms</span>
                </div>
                <div className="text-[#182629] dark:text-[#E8E6DC] break-all select-all">{hop.url}</div>
                {hop.note && <div className="text-[11px] text-[#A87532] dark:text-[#D7AA61] italic">{hop.note}</div>}
              </div>
            </div>
          ))}

          {/* Final Landed Host */}
          <div className="flex items-start gap-2.5 text-[#647477] dark:text-[#A6B3AE] pt-2 border-t border-[#D9DED7] dark:border-[#304144]">
            <CheckCircle2 className="w-5 h-5 text-[#36745F] dark:text-[#79B69A] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] mr-2">FINAL DESTINATION:</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold break-all select-all">{analysis.finalDestination}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
