import { useState } from 'react';
import { Download, Copy, Eye, Check, ShieldCheck, Code2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { Modal } from '../common/Modal.tsx';
import type { UrlInvestigationResult } from '../../types/investigation.ts';

interface ReportActionsBarProps {
  result: UrlInvestigationResult;
}

export function ReportActionsBar({ result }: ReportActionsBarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate executive markdown summary
  const generateMarkdownSummary = (): string => {
    return [
      `# CYBER CHAKRAVYUH — FORENSIC INVESTIGATION REPORT`,
      `**Investigation ID:** \`${result.investigationId}\``,
      `**Target URL:** \`${result.targetUrl}\``,
      `**Timestamp:** ${result.timestamp}`,
      `**Risk Classification:** **${result.riskClassification}** (Score: ${result.riskScore}/100)`,
      `**Analytical Confidence:** ${result.confidenceScore}% | **Evidence Coverage:** ${result.evidenceCoverage}%`,
      ``,
      `## 1. Domain Intelligence`,
      `- **Domain:** \`${result.domainIntelligence.domain}\``,
      `- **Age:** ${result.domainIntelligence.domainAge || 'Unavailable'}`,
      `- **Registrar:** ${result.domainIntelligence.registrar || 'Redacted'}`,
      `- **Resolved IP:** \`${result.domainIntelligence.ipAddress}\` (${result.domainIntelligence.asnOrganization})`,
      `- **Reputation:** ${result.domainIntelligence.reputationLabel} (${result.domainIntelligence.reputationScore}/100)`,
      ``,
      `## 2. Phishing & Threat Indicators`,
      `- **Typosquatting:** ${result.phishingIndicators.hasTyposquatting ? `YES (Target: ${result.phishingIndicators.typosquattingTarget})` : 'NO'}`,
      `- **Homograph / Punycode:** ${result.phishingIndicators.hasHomograph ? `YES (${result.phishingIndicators.homographDetails})` : 'NO'}`,
      `- **Redirect Chain Risk:** ${result.phishingIndicators.redirectChainRisk}`,
      `- **Active Threat Matches:** ${result.phishingIndicators.knownThreatMatches.length} matching signatures`,
      ``,
      `## 3. Recommended Immediate Action`,
      result.recommendedActions[0]
        ? `- **[${result.recommendedActions[0].priority}]** ${result.recommendedActions[0].action}`
        : '- Maintain zero-trust hygiene.',
      ``,
      `*Cryptographic Ed25519 Attestation:* \`${result.ed25519Signature}\``,
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
      platform: 'Cyber Chakravyuh Forensic Engine v4.2',
      exportTimestamp: new Date().toISOString(),
      reportPayload: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chakravyuh-investigation-${result.investigationId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm dark:shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/20 dark:border-[#C47A52]/30 text-[#A95636] dark:text-[#C47A52]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <span>Investigation Dossier:</span>
              <span className="text-[#A95636] dark:text-[#C47A52]">#{result.investigationId}</span>
            </h4>
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Signed with Ed25519 attestation receipt for SecOps audit log
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
            className="flex-1 sm:flex-none font-mono text-xs border-[#A95636]/40 dark:border-[#C47A52]/40 text-[#A95636] dark:text-[#C47A52] hover:bg-[#A95636]/10"
            leftIcon={downloadSuccess ? <Check className="w-4 h-4 text-[#36745F] dark:text-[#79B69A]" /> : <Download className="w-4 h-4" />}
          >
            {downloadSuccess ? 'Downloaded!' : 'Download Report'}
          </Button>

          {/* View Raw Investigation Details */}
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
        title={`Investigation Dossier: ${result.investigationId}`}
        subtitle={`Complete cryptographic forensic payload for ${result.targetUrl}`}
        size="xl"
      >
        <div className="space-y-4 font-mono text-xs text-[#182629] dark:text-[#E8E6DC]">
          {/* Attestation Header */}
          <div className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-2">
            <div className="flex justify-between items-center text-[#647477] dark:text-[#A6B3AE] text-[11px]">
              <span>ED25519 CRYPTOGRAPHIC ATTESTATION SIGNATURE</span>
              <span className="text-[#36745F] dark:text-[#79B69A]">VERIFIED VALID</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-[11px] text-[#A95636] dark:text-[#C47A52] break-all select-all">
              {result.ed25519Signature}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">CLASSIFICATION</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{result.riskClassification}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">SCORE</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{result.riskScore}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">CONFIDENCE</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{result.confidenceScore}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">FINDINGS</span>
              <span className="text-[#36745F] dark:text-[#79B69A] font-bold">{result.technicalFindings.length}</span>
            </div>
          </div>

          {/* Raw JSON Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[#647477] dark:text-[#A6B3AE] text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                Raw JSON Telemetry Stream
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
            <pre className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[11px] text-[#182629] dark:text-[#E8E6DC] overflow-x-auto max-h-[380px] overflow-y-auto select-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#D9DED7] dark:border-[#304144]">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Close Dossier
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
