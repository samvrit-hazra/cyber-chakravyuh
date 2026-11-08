import { useState } from 'react';
import { Download, Copy, Eye, Check, ShieldCheck, Code2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { Modal } from '../common/Modal.tsx';
import type { WebsiteSecurityAssessmentResult } from '../../types/websiteSecurity.ts';

interface SecurityReportActionsBarProps {
  result: WebsiteSecurityAssessmentResult;
}

export function SecurityReportActionsBar({ result }: SecurityReportActionsBarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const generateMarkdownSummary = (): string => {
    return [
      `# CYBER CHAKRAVYUHA — WEBSITE SECURITY ASSESSMENT REPORT`,
      `**Target URL:** \`${result.targetUrl}\``,
      `**Canonical Host:** \`${result.canonicalHost}\``,
      `**Assessment ID:** \`${result.assessmentId}\``,
      `**Timestamp:** ${result.assessedAt}`,
      `**Overall Posture Grade:** **${result.securityGrade}** (Score: ${result.securityScore}/100)`,
      ``,
      `## 1. Executive Summary`,
      result.summaryVerdict,
      ``,
      `## 2. Category Benchmark Scores`,
      result.categoryScores
        .map((c) => `- **${c.category}:** ${c.score}% (${c.status}) — ${c.issueCount} Issues / ${c.passedCount} Passed`)
        .join('\n'),
      ``,
      `## 3. High-Priority Findings (${result.findings.length})`,
      result.findings
        .map(
          (f) =>
            `- **[${f.severity.toUpperCase()}]** ${f.issueName} (${f.category})\n  *Impact:* ${f.potentialImpact}\n  *Remediation:* ${f.recommendedRemediation}`
        )
        .join('\n\n'),
      ``,
      `*Safety Policy:* ${result.passiveSafetyNotice}`,
    ].join('\n');
  };

  const handleCopySummary = async () => {
    const summary = generateMarkdownSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDownloadReport = () => {
    const exportData = {
      engine: 'Cyber Chakravyuh Layer 4 Endpoint & Posture Inspector',
      exportTimestamp: new Date().toISOString(),
      reportPayload: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chakravyuh-security-assessment-${result.canonicalHost}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/25 dark:border-[#79A99C]/30 text-[#356D68] dark:text-[#79A99C]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <span>Security Posture Dossier:</span>
              <span className="text-[#A95636] dark:text-[#C47A52]">#{result.assessmentId}</span>
            </h4>
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Passive defense-in-depth security hygiene and endpoint audit
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Copy Summary */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="flex-1 sm:flex-none font-mono text-xs"
            leftIcon={isCopied ? <Check className="w-4 h-4 text-[#36745F] dark:text-[#79B69A]" /> : <Copy className="w-4 h-4" />}
          >
            {isCopied ? 'Summary Copied!' : 'Copy Summary'}
          </Button>

          {/* Download JSON Report */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            className="flex-1 sm:flex-none font-mono text-xs"
            leftIcon={downloadSuccess ? <Check className="w-4 h-4 text-[#36745F] dark:text-[#79B69A]" /> : <Download className="w-4 h-4" />}
          >
            {downloadSuccess ? 'Downloaded!' : 'Export JSON'}
          </Button>

          {/* View Raw Telemetry */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none font-mono text-xs"
            leftIcon={<Eye className="w-4 h-4" />}
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Raw Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Posture Telemetry: ${result.canonicalHost}`}
        subtitle={`Complete passive security posture audit stream for ${result.targetUrl}`}
        size="xl"
      >
        <div className="space-y-4 font-mono text-xs">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">GRADE</span>
              <span className="text-[#36745F] dark:text-[#79B69A] font-bold">Grade {result.securityGrade}</span>
            </div>
            <div className="p-2.5 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">SECURITY SCORE</span>
              <span className="text-[#356D68] dark:text-[#79A99C] font-bold">{result.securityScore} / 100</span>
            </div>
            <div className="p-2.5 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">CATEGORIES</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-bold">7 Evaluated</span>
            </div>
            <div className="p-2.5 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">FINDINGS</span>
              <span className="text-[#A87532] dark:text-[#D7AA61] font-bold">{result.findings.length} Artifacts</span>
            </div>
          </div>

          {/* Raw JSON Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[#647477] dark:text-[#A6B3AE] text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
                Raw Assessment JSON Payload
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer"
              >
                {isCopied ? 'Copied JSON!' : 'Copy Raw JSON'}
              </button>
            </div>
            <pre className="p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[11px] text-[#182629] dark:text-[#E8E6DC] overflow-x-auto max-h-[380px] overflow-y-auto select-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#D9DED7] dark:border-[#304144]">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadReport}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export JSON File
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
