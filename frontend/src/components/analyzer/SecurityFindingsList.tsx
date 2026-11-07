import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { TechnicalFinding, EvidenceSeverity } from '../../types/investigation.ts';

interface SecurityFindingsListProps {
  findings: TechnicalFinding[];
}

export function SecurityFindingsList({ findings }: SecurityFindingsListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const getSeverityBadge = (severity: EvidenceSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-[#B64B46]/12 dark:bg-[#E17B70]/15 border-[#B64B46]/35 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]';
      case 'high':
        return 'bg-[#B64B46]/10 dark:bg-[#E17B70]/12 border-[#B64B46]/25 dark:border-[#E17B70]/30 text-[#B64B46] dark:text-[#E17B70]';
      case 'medium':
        return 'bg-[#A87532]/10 dark:bg-[#D7AA61]/12 border-[#A87532]/30 dark:border-[#D7AA61]/35 text-[#A87532] dark:text-[#D7AA61]';
      case 'low':
        return 'bg-[#356D68]/10 dark:bg-[#79A99C]/15 border-[#356D68]/30 dark:border-[#79A99C]/35 text-[#356D68] dark:text-[#79A99C]';
      case 'info':
      default:
        return 'bg-[#647477]/10 dark:bg-[#A6B3AE]/12 border-[#647477]/30 dark:border-[#A6B3AE]/35 text-[#647477] dark:text-[#A6B3AE]';
    }
  };

  const handleCopyEvidence = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!findings || findings.length === 0) {
    return (
      <div className="p-6 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-center text-xs text-[#647477] dark:text-[#A6B3AE] font-mono">
        No suspicious or anomalous findings detected for this host.
      </div>
    );
  }

  const displayedFindings = expanded ? findings : findings.slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE]">
          Technical Evidence & Findings ({findings.length})
        </h4>
        {findings.length > 4 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Show Less' : `View All ${findings.length}`}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayedFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-3.5 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 transition-all hover:border-[#647477] dark:hover:border-[#79A99C]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(
                    finding.severity
                  )}`}
                >
                  {finding.severity}
                </span>
                <span className="text-xs font-mono font-semibold text-[#182629] dark:text-[#E8E6DC]">
                  {finding.source.toUpperCase()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyEvidence(finding.id, finding.evidence)}
                title="Copy technical evidence"
                className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedId === finding.id ? (
                  <>
                    <Check className="w-3 h-3 text-[#36745F] dark:text-[#79B69A]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#182629] dark:text-[#E8E6DC] font-sans font-medium">
              {finding.title}
            </p>

            <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] break-all select-all">
              {finding.evidence}
            </div>

            <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-sans">
              <span className="font-semibold text-[#182629] dark:text-[#E8E6DC]">Description: </span>
              {finding.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
