import { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  Terminal,
  Copy,
  Check,
  Shield,
  FileCode,
} from 'lucide-react';
import type { AssessmentFinding, AssessmentCategory, SecuritySeverity } from '../../types/websiteSecurity.ts';

interface AssessmentFindingsSectionProps {
  findings: AssessmentFinding[];
}

export function AssessmentFindingsSection({ findings }: AssessmentFindingsSectionProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFindings = findings.filter((f) => {
    if (selectedSeverity !== 'all' && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    return true;
  });

  const getSeverityMeta = (sev: SecuritySeverity) => {
    switch (sev) {
      case 'critical':
        return {
          pill: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
          border: 'border-l-rose-500',
          icon: Flame,
        };
      case 'high':
        return {
          pill: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          border: 'border-l-amber-500',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          pill: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
          border: 'border-l-purple-500',
          icon: AlertTriangle,
        };
      case 'low':
      case 'info':
      default:
        return {
          pill: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
          border: 'border-l-cyan-500',
          icon: Info,
        };
    }
  };

  const categories: AssessmentCategory[] = [
    'HTTP & HTTPS Configuration',
    'Security Headers',
    'TLS Configuration',
    'Mixed Content',
    'Suspicious Redirects',
    'Publicly Exposed Endpoints',
    'Software Version Information',
  ];

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            GRANULAR SECURITY FINDINGS & TECHNICAL EVIDENCE
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>Remediation Register</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({findings.length} Observed Points)
            </span>
          </h3>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-white/5 text-xs font-mono">
          {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer text-[11px] ${
                selectedSeverity === sev
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        <span className="text-slate-500 text-[11px] mr-1">Filter Domain:</span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
            selectedCategory === 'all'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Findings Cards List */}
      {filteredFindings.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#060b17] border border-white/5 font-mono text-xs text-slate-400">
          No security findings matching current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFindings.map((finding) => {
            const meta = getSeverityMeta(finding.severity);
            const Icon = meta.icon;
            const isExpanded = expandedIds[finding.id] ?? true; // expanded by default for full audit

            return (
              <div
                key={finding.id}
                className={`rounded-xl bg-[#060b17] border border-white/5 border-l-4 ${meta.border} overflow-hidden transition-colors font-mono text-xs`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(finding.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer hover:bg-[#080f22]"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${meta.pill}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {finding.severity}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{finding.issueName}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                      {finding.category}
                    </span>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white p-1"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Analysis */}
                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3.5 border-t border-white/[0.04]">
                    {/* Technical Evidence */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        TECHNICAL EVIDENCE
                      </span>
                      <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-cyan-200/90 text-xs overflow-x-auto select-all whitespace-pre-wrap">
                        {finding.technicalEvidence}
                      </pre>
                    </div>

                    {/* Potential Impact */}
                    <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                      <span className="text-[11px] text-rose-300 font-bold block uppercase">
                        Potential Threat Impact:
                      </span>
                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {finding.potentialImpact}
                      </p>
                    </div>

                    {/* Recommended Remediation */}
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                      <span className="text-[11px] text-emerald-300 font-bold block uppercase">
                        Recommended Remediation:
                      </span>
                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {finding.recommendedRemediation}
                      </p>
                    </div>

                    {/* Remediation Snippet if available */}
                    {finding.remediationSnippet && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-bold text-slate-300">
                            <FileCode className="w-3.5 h-3.5 text-purple-400" />
                            Suggested Web Server Directive (Nginx / Apache):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(finding.id, finding.remediationSnippet!)}
                            className="text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            {copiedId === finding.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Directive</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-black/80 border border-purple-500/30 text-purple-200 text-xs overflow-x-auto select-all">
                          {finding.remediationSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Assessment Limitations Notice */}
                    <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-1 font-mono">
                      <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-300">Assessment Limitation:</strong> {finding.assessmentLimitations}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
