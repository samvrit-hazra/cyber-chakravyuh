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
        return 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/40 text-rose-700 dark:text-rose-300 animate-pulse';
      case 'Important':
        return 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/40 text-amber-700 dark:text-amber-300';
      case 'Advisory':
      default:
        return 'bg-[#356D68]/10 dark:bg-[#79A99C]/20 border-[#356D68]/40 text-[#356D68] dark:text-[#79A99C]';
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
          SECTION 10 • RECOMMENDED PRECAUTIONS & MITIGATION DIRECTIVES
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
          <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Protective Safety Measures</span>
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
            ({recommendedPrecautions.length} Guidelines)
          </span>
        </h3>
      </div>

      {/* Precautions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedPrecautions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 hover:border-[#A95636]/40 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase ${getPriorityBadge(
                  item.priority
                )}`}
              >
                {item.priority} Priority
              </span>
              <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">ID: {item.id}</span>
            </div>

            <div className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC] flex items-start gap-2 pt-1">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{item.instruction}</span>
            </div>

            <div className="pl-6 text-xs font-sans text-[#647477] dark:text-[#A6B3AE] leading-relaxed bg-white dark:bg-[#19272A] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
              <span className="font-semibold text-[#182629] dark:text-[#E8E6DC]">Security Rationale: </span>
              {item.rationale}
            </div>
          </div>
        ))}
      </div>

      {/* Reporting Resources & Disclosures */}
      <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-[#182629] dark:text-[#E8E6DC]">
          <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            Official Incident Reporting Gateways
          </span>
          <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">Government & Anti-Abuse Portals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40 text-[#182629] dark:text-[#E8E6DC] flex items-center justify-between transition-colors"
          >
            <span>FTC Report Fraud (US)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE]" />
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40 text-[#182629] dark:text-[#E8E6DC] flex items-center justify-between transition-colors"
          >
            <span>FBI IC3 Cybercrime</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE]" />
          </a>
          <a
            href="https://apwg.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40 text-[#182629] dark:text-[#E8E6DC] flex items-center justify-between transition-colors"
          >
            <span>Anti-Phishing Working Group</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE]" />
          </a>
        </div>

        <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] pt-1 border-t border-[#D9DED7] dark:border-[#304144]">
          {securityDisclosureNotice}
        </p>
      </div>
    </div>
  );
}
