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
      return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
    }
    if (code >= 300 && code < 400) {
      return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
    }
    return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SECTION 4 • REDIRECT TRACE & TRAFFIC ARBITRATION
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <GitCommit className="w-5 h-5 text-cyan-400" />
            <span>Multi-Hop Traversal Chain</span>
            <span className="text-xs font-mono text-slate-400 font-normal">({totalHops} Total Hops)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Chain Status:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              isCloaked
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                : totalHops > 1
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isCloaked ? 'CLOAKING / EVASION DETECTED' : statusText}
          </span>
        </div>
      </div>

      {/* Cloaking Warning Alert */}
      {isCloaked && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-mono">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-300">Arbitration Cloaking Warning</p>
            <p className="text-[11px] text-rose-300/80">
              The target endpoint redirected based on browser fingerprinting, crawler signatures, or geolocation gating. Real human victims may be routed to credential harvesting kits while scanners receive benign responses.
            </p>
          </div>
        </div>
      )}

      {/* Original vs Final Summary Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingress Destination */}
        <div className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>INITIAL SUBMITTED INGRESS</span>
            <span className="text-cyan-400 font-semibold">Hop #1</span>
          </div>
          <div className="text-slate-100 font-bold break-all select-all">{originalUrl}</div>
        </div>

        {/* Egress Final Destination */}
        <div className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>TERMINAL RESOLVED EGRESS</span>
            <span
              className={`font-semibold ${
                originalUrl === finalDestination ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {originalUrl === finalDestination ? 'Direct (No Redirection)' : `Final (Hop #${totalHops})`}
            </span>
          </div>
          <div className="text-cyan-300 font-bold break-all select-all">{finalDestination}</div>
        </div>
      </div>

      {/* Step-by-Step Hop Timeline */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Hop-by-Hop HTTP Execution Trace
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:to-emerald-500">
          {intermediateHops.map((hop) => (
            <div key={hop.hopNumber} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_#22d3ee]" />

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 hover:border-cyan-500/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">HOP #{hop.hopNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(
                        hop.statusCode
                      )}`}
                    >
                      {hop.statusCode} {hop.statusText}
                    </span>
                    {hop.isSsl ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <Lock className="w-3 h-3" /> TLS Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                        <ShieldAlert className="w-3 h-3" /> Insecure HTTP
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{hop.latencyMs} ms latency</span>
                </div>

                <div className="text-xs font-mono text-slate-200 break-all select-all bg-black/40 p-2 rounded border border-white/5">
                  {hop.url}
                </div>

                {hop.note && (
                  <p className="text-[11px] font-mono text-slate-400 italic flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
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
