import { CheckSquare, Shield, AlertOctagon, ExternalLink } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface RecommendedPrecautionsSectionProps {
  recommendedPrecautions: ScamAnalysisResult['recommendedPrecautions'];
  securityDisclosureNotice: string;
}

export function RecommendedPrecautionsSection({
  recommendedPrecautions,
  securityDisclosureNotice,
}: RecommendedPrecautionsSectionProps) {
  const getPriorityBadge = (priority: 'Immediate' | 'Important' | 'Advisory') => {
    switch (priority) {
      case 'Immediate':
        return 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse';
      case 'Important':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
      case 'Advisory':
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
          SECTION 10 • RECOMMENDED PRECAUTIONS & MITIGATION DIRECTIVES
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <span>Protective Safety Measures</span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            ({recommendedPrecautions.length} Guidelines)
          </span>
        </h3>
      </div>

      {/* Precautions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedPrecautions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2.5 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase ${getPriorityBadge(
                  item.priority
                )}`}
              >
                {item.priority} Priority
              </span>
              <span className="text-[11px] text-slate-500">ID: {item.id}</span>
            </div>

            <div className="text-sm font-mono font-bold text-slate-100 flex items-start gap-2 pt-1">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item.instruction}</span>
            </div>

            <div className="pl-6 text-xs font-sans text-slate-300/90 leading-relaxed bg-white/[0.02] p-2.5 rounded border border-white/5">
              <span className="font-semibold text-slate-200">Security Rationale: </span>
              {item.rationale}
            </div>
          </div>
        ))}
      </div>

      {/* Reporting Resources & Disclosures */}
      <div className="rounded-xl bg-slate-900/80 border border-white/5 p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-purple-400" />
            Official Incident Reporting Gateways
          </span>
          <span className="text-[10px] text-slate-500">Government & Anti-Abuse Portals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-black/40 border border-white/5 hover:border-cyan-500/40 text-cyan-300 flex items-center justify-between transition-colors"
          >
            <span>FTC Report Fraud (US)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-black/40 border border-white/5 hover:border-cyan-500/40 text-cyan-300 flex items-center justify-between transition-colors"
          >
            <span>FBI IC3 Cybercrime</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://apwg.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-black/40 border border-white/5 hover:border-cyan-500/40 text-cyan-300 flex items-center justify-between transition-colors"
          >
            <span>Anti-Phishing Working Group</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
          {securityDisclosureNotice}
        </p>
      </div>
    </div>
  );
}

