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
          pill: 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]',
          border: 'border-l-[#B64B46] dark:border-l-[#E17B70]',
          icon: Flame,
        };
      case 'high':
        return {
          pill: 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]',
          border: 'border-l-[#A87532] dark:border-l-[#D7AA61]',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          pill: 'bg-[#A95636]/10 border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52]',
          border: 'border-l-[#A95636] dark:border-l-[#C47A52]',
          icon: AlertTriangle,
        };
      case 'low':
      case 'info':
      default:
        return {
          pill: 'bg-[#356D68]/10 border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]',
          border: 'border-l-[#356D68] dark:border-l-[#79A99C]',
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
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            GRANULAR SECURITY FINDINGS & TECHNICAL EVIDENCE
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Remediation Register</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({findings.length} Observed Points)
            </span>
          </h3>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-[#EAECE6] dark:bg-[#223336] p-1 rounded border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
          {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer text-[11px] ${
                selectedSeverity === sev
                  ? 'bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-xs'
                  : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] mr-1">Filter Domain:</span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#356D68]/15 dark:bg-[#79A99C]/20 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/30 dark:border-[#79A99C]/30 font-bold'
              : 'bg-[#EAECE6]/60 dark:bg-[#223336]/60 text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
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
                ? 'bg-[#356D68]/15 dark:bg-[#79A99C]/20 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/30 dark:border-[#79A99C]/30 font-bold'
                : 'bg-[#EAECE6]/60 dark:bg-[#223336]/60 text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Findings Cards List */}
      {filteredFindings.length === 0 ? (
        <div className="p-8 text-center rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
          No security findings matching current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFindings.map((finding) => {
            const meta = getSeverityMeta(finding.severity);
            const Icon = meta.icon;
            const isExpanded = expandedIds[finding.id] ?? true;

            return (
              <div
                key={finding.id}
                className={`rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] border-l-4 ${meta.border} overflow-hidden transition-colors font-mono text-xs`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(finding.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer hover:bg-[#EAECE6]/60 dark:hover:bg-[#223336]/60"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${meta.pill}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {finding.severity}
                    </span>
                    <h4 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">{finding.issueName}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] bg-[#EAECE6] dark:bg-[#223336] px-2 py-0.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                      {finding.category}
                    </span>
                    <button
                      type="button"
                      className="text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] p-1 cursor-pointer"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Analysis */}
                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3.5 border-t border-[#D9DED7] dark:border-[#304144]">
                    {/* Technical Evidence */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] uppercase font-bold flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-[#356D68] dark:text-[#79A99C]" />
                        TECHNICAL EVIDENCE
                      </span>
                      <pre className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs overflow-x-auto select-all whitespace-pre-wrap">
                        {finding.technicalEvidence}
                      </pre>
                    </div>

                    {/* Potential Impact */}
                    <div className="p-3 rounded bg-[#B64B46]/10 dark:bg-[#E17B70]/10 border border-[#B64B46]/25 dark:border-[#E17B70]/25 space-y-1">
                      <span className="text-[11px] text-[#B64B46] dark:text-[#E17B70] font-bold block uppercase">
                        Potential Threat Impact:
                      </span>
                      <p className="text-[#182629] dark:text-[#E8E6DC] font-sans text-xs leading-relaxed">
                        {finding.potentialImpact}
                      </p>
                    </div>

                    {/* Recommended Remediation */}
                    <div className="p-3 rounded bg-[#36745F]/10 dark:bg-[#79B69A]/10 border border-[#36745F]/25 dark:border-[#79B69A]/25 space-y-1">
                      <span className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-bold block uppercase">
                        Recommended Remediation:
                      </span>
                      <p className="text-[#182629] dark:text-[#E8E6DC] font-sans text-xs leading-relaxed">
                        {finding.recommendedRemediation}
                      </p>
                    </div>

                    {/* Remediation Snippet if available */}
                    {finding.remediationSnippet && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                          <span className="flex items-center gap-1 font-bold text-[#182629] dark:text-[#E8E6DC]">
                            <FileCode className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                            Suggested Web Server Directive (Nginx / Apache):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(finding.id, finding.remediationSnippet!)}
                            className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            {copiedId === finding.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#36745F] dark:text-[#79B69A]" />
                                <span className="text-[#36745F] dark:text-[#79B69A]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Directive</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52] text-xs overflow-x-auto select-all">
                          {finding.remediationSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Assessment Limitations Notice */}
                    <div className="flex items-start gap-2 text-[11px] text-[#647477] dark:text-[#A6B3AE] pt-1 font-mono">
                      <Shield className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#182629] dark:text-[#E8E6DC]">Assessment Limitation:</strong> {finding.assessmentLimitations}
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
