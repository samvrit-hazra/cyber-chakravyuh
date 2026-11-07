import { useState } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, Info, CheckCircle2, Copy, Check } from 'lucide-react';
import type { TechnicalFinding, EvidenceSeverity } from '../../types/investigation.ts';

interface TechnicalEvidenceSectionProps {
  findings: TechnicalFinding[];
}

export function TechnicalEvidenceSection({ findings }: TechnicalEvidenceSectionProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getSeverityBadge = (severity: EvidenceSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          pill: 'bg-[#B64B46]/10 dark:bg-[#E17B70]/20 border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]',
          icon: ShieldAlert,
          border: 'border-l-[#B64B46] dark:border-l-[#E17B70]',
        };
      case 'high':
        return {
          pill: 'bg-[#A87532]/10 dark:bg-[#D7AA61]/20 border-[#A87532]/30 dark:border-[#D7AA61]/40 text-[#A87532] dark:text-[#D7AA61]',
          icon: AlertTriangle,
          border: 'border-l-[#A87532] dark:border-l-[#D7AA61]',
        };
      case 'medium':
        return {
          pill: 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 border-[#A95636]/30 dark:border-[#C47A52]/40 text-[#A95636] dark:text-[#C47A52]',
          icon: AlertTriangle,
          border: 'border-l-[#A95636] dark:border-l-[#C47A52]',
        };
      case 'low':
        return {
          pill: 'bg-[#36745F]/10 dark:bg-[#79B69A]/20 border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A]',
          icon: Info,
          border: 'border-l-[#36745F] dark:border-l-[#79B69A]',
        };
      case 'info':
      default:
        return {
          pill: 'bg-slate-500/10 border-slate-500/30 text-[#647477] dark:text-[#A6B3AE]',
          icon: CheckCircle2,
          border: 'border-l-[#A95636] dark:border-l-[#C47A52]',
        };
    }
  };

  const filteredFindings =
    severityFilter === 'all'
      ? findings
      : findings.filter((f) => f.severity === severityFilter);

  const handleCopyEvidence = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm dark:shadow-2xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            SECTION 5 • TECHNICAL EVIDENCE & FORENSIC ATTESTATIONS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Terminal className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Corroborated Telemetry Findings</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">({findings.length} Artifacts)</span>
          </h3>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#EAECE6] dark:bg-[#223336] p-1 rounded-xl border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
          {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSeverityFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer text-[11px] ${
                severityFilter === lvl
                  ? 'bg-white dark:bg-[#293A3C] text-[#A95636] dark:text-[#C47A52] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-sm'
                  : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
          No findings matching the selected filter ({severityFilter}).
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFindings.map((finding) => {
            const meta = getSeverityBadge(finding.severity);
            const Icon = meta.icon;

            return (
              <div
                key={finding.id}
                className={`p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] border-l-4 ${meta.border} space-y-3 hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors`}
              >
                {/* Title & Metadata Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${meta.pill}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {finding.severity}
                    </span>
                    <h4 className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC]">{finding.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                    <span>Source:</span>
                    <span className="text-[#A95636] dark:text-[#C47A52] font-medium">{finding.source}</span>
                    {finding.ruleId && (
                      <span className="px-1.5 py-0.5 rounded bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144]">
                        {finding.ruleId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm font-sans text-[#647477] dark:text-[#A6B3AE]">{finding.description}</p>

                {/* Evidence Snippet Code Block */}
                <div className="relative group">
                  <div className="flex items-center justify-between bg-[#EAECE6] dark:bg-[#223336] px-3 py-1.5 rounded-t-lg border-t border-x border-[#D9DED7] dark:border-[#304144] text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                    <span className="uppercase tracking-wider">RAW FORENSIC EVIDENCE ARTIFACT</span>
                    <button
                      type="button"
                      onClick={() => handleCopyEvidence(finding.id, finding.evidence)}
                      className="inline-flex items-center gap-1 text-[#647477] dark:text-[#A6B3AE] hover:text-[#A95636] dark:hover:text-[#C47A52] transition-colors cursor-pointer"
                    >
                      {copiedId === finding.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#36745F] dark:text-[#79B69A]" />
                          <span className="text-[#36745F] dark:text-[#79B69A]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Evidence</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-white dark:bg-[#19272A] rounded-b-lg border-b border-x border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#182629] dark:text-[#E8E6DC] overflow-x-auto whitespace-pre-wrap select-all">
                    {finding.evidence}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
