import { GitCommit, ArrowRight, ShieldAlert, Lock, AlertOctagon } from 'lucide-react';
import type { RedirectAnalysis } from '../../types/investigation.ts';

interface RedirectAnalysisSectionProps {
  redirectAnalysis: RedirectAnalysis;
}

export function RedirectAnalysisSection({ redirectAnalysis }: RedirectAnalysisSectionProps) {
  const { originalUrl, intermediateHops, finalDestination, totalHops, statusText, isCloaked } =
    redirectAnalysis;

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) {
      return 'bg-[#36745F]/10 border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]';
    }
    if (code >= 300 && code < 400) {
      return 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]';
    }
    return 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]';
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm dark:shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            SECTION 4 • REDIRECT TRACE & TRAFFIC ARBITRATION
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <GitCommit className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Multi-Hop Traversal Chain</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">({totalHops} Total Hops)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Chain Status:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              isCloaked
                ? 'bg-[#B64B46]/20 border-[#B64B46]/40 text-[#B64B46] dark:text-[#E17B70] animate-pulse'
                : totalHops > 1
                ? 'bg-[#A87532]/15 border-[#A87532]/40 text-[#A87532] dark:text-[#D7AA61]'
                : 'bg-[#36745F]/15 border-[#36745F]/40 text-[#36745F] dark:text-[#79B69A]'
            }`}
          >
            {isCloaked ? 'CLOAKING / EVASION DETECTED' : statusText}
          </span>
        </div>
      </div>

      {/* Cloaking Warning Alert */}
      {isCloaked && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#B64B46]/10 border border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70] text-xs font-mono">
          <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Arbitration Cloaking Warning</p>
            <p className="text-[11px] opacity-80">
              The target endpoint redirected based on browser fingerprinting, crawler signatures, or geolocation gating. Real human victims may be routed to credential harvesting kits while scanners receive benign responses.
            </p>
          </div>
        </div>
      )}

      {/* Original vs Final Summary Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingress Destination */}
        <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[#647477] dark:text-[#A6B3AE] text-[11px]">
            <span>INITIAL SUBMITTED INGRESS</span>
            <span className="text-[#A95636] dark:text-[#C47A52] font-semibold">Hop #1</span>
          </div>
          <div className="text-[#182629] dark:text-[#E8E6DC] font-bold break-all select-all">{originalUrl}</div>
        </div>

        {/* Egress Final Destination */}
        <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[#647477] dark:text-[#A6B3AE] text-[11px]">
            <span>TERMINAL RESOLVED EGRESS</span>
            <span
              className={`font-semibold ${
                originalUrl === finalDestination ? 'text-[#36745F] dark:text-[#79B69A]' : 'text-[#A87532] dark:text-[#D7AA61]'
              }`}
            >
              {originalUrl === finalDestination ? 'Direct (No Redirection)' : `Final (Hop #${totalHops})`}
            </span>
          </div>
          <div className="text-[#A95636] dark:text-[#C47A52] font-bold break-all select-all">{finalDestination}</div>
        </div>
      </div>

      {/* Step-by-Step Hop Timeline */}
      <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
          Hop-by-Hop HTTP Execution Trace
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#A95636] before:via-[#C47A52] before:to-[#36745F]">
          {intermediateHops.map((hop) => (
            <div key={hop.hopNumber} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-[#101A1D] border-2 border-[#A95636] dark:border-[#C47A52] group-hover:scale-125 transition-transform" />

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-2 hover:border-[#A95636] dark:hover:border-[#C47A52] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#A95636] dark:text-[#C47A52]">HOP #{hop.hopNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(
                        hop.statusCode
                      )}`}
                    >
                      {hop.statusCode} {hop.statusText}
                    </span>
                    {hop.isSsl ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#36745F] dark:text-[#79B69A]">
                        <Lock className="w-3 h-3" /> TLS Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#B64B46] dark:text-[#E17B70]">
                        <ShieldAlert className="w-3 h-3" /> Insecure HTTP
                      </span>
                    )}
                  </div>
                  <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px]">{hop.latencyMs} ms latency</span>
                </div>

                <div className="text-xs font-mono text-[#182629] dark:text-[#E8E6DC] break-all select-all bg-[#F3F1E9] dark:bg-[#101A1D] p-2 rounded border border-[#D9DED7] dark:border-[#304144]">
                  {hop.url}
                </div>

                {hop.note && (
                  <p className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] italic flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-[#A95636] dark:text-[#C47A52] shrink-0" />
                    {hop.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
