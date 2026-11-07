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
          pill: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
          icon: ShieldAlert,
          border: 'border-l-rose-500',
        };
      case 'high':
        return {
          pill: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
          icon: AlertTriangle,
          border: 'border-l-amber-500',
        };
      case 'medium':
        return {
          pill: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
          icon: AlertTriangle,
          border: 'border-l-purple-500',
        };
      case 'low':
        return {
          pill: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
          icon: Info,
          border: 'border-l-blue-500',
        };
      case 'info':
      default:
        return {
          pill: 'bg-slate-500/20 border-slate-500/50 text-slate-300',
          icon: CheckCircle2,
          border: 'border-l-cyan-500',
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
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SECTION 5 • TECHNICAL EVIDENCE & FORENSIC ATTESTATIONS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Corroborated Telemetry Findings</span>
            <span className="text-xs font-mono text-slate-400 font-normal">({findings.length} Artifacts)</span>
          </h3>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-white/5 text-xs font-mono">
          {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSeverityFilter(lvl)}
              className={`px-2 py-1 rounded capitalize transition-colors cursor-pointer text-[11px] ${
                severityFilter === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#060b17] border border-white/5 font-mono text-xs text-slate-400">
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
                className={`p-4 rounded-xl bg-[#060b17] border border-white/5 border-l-4 ${meta.border} space-y-3 hover:bg-[#070e1e] transition-colors`}
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
                    <h4 className="text-sm font-mono font-bold text-slate-100">{finding.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-cyan-400/90 font-medium">{finding.source}</span>
                    {finding.ruleId && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/5">
                        {finding.ruleId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm font-sans text-slate-300">{finding.description}</p>

                {/* Evidence Snippet Code Block */}
                <div className="relative group">
                  <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-t-lg border-t border-x border-white/10 text-[10px] font-mono text-slate-400">
                    <span className="uppercase tracking-wider">RAW FORENSIC EVIDENCE ARTIFACT</span>
                    <button
                      type="button"
                      onClick={() => handleCopyEvidence(finding.id, finding.evidence)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {copiedId === finding.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Evidence</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-black/40 rounded-b-lg border-b border-x border-white/10 font-mono text-xs text-cyan-200/90 overflow-x-auto whitespace-pre-wrap select-all">
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

