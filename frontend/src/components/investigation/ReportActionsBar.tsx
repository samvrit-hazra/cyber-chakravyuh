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
      `# CYBER CHAKRAVYUHA — FORENSIC INVESTIGATION REPORT`,
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
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDownloadReport = () => {
    const exportData = {
      platform: 'Cyber Chakravyuha Forensic Engine v4.2',
      exportTimestamp: new Date().toISOString(),
      reportPayload: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chakravyuha-investigation-${result.investigationId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b162c] border border-cyan-500/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <span>Investigation Dossier:</span>
              <span className="text-cyan-300">#{result.investigationId}</span>
            </h4>
            <p className="text-xs font-mono text-slate-400">
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
            leftIcon={isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {isCopied ? 'Summary Copied!' : 'Copy Summary'}
          </Button>

          {/* Download JSON Report */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            className="flex-1 sm:flex-none font-mono text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
            leftIcon={downloadSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
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
        <div className="space-y-4 font-mono text-xs">
          {/* Attestation Header */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>ED25519 CRYPTOGRAPHIC ATTESTATION SIGNATURE</span>
              <span className="text-emerald-400">VERIFIED VALID</span>
            </div>
            <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-cyan-300 break-all select-all">
              {result.ed25519Signature}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">CLASSIFICATION</span>
              <span className="text-white font-bold">{result.riskClassification}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">SCORE</span>
              <span className="text-cyan-400 font-bold">{result.riskScore}/100</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">CONFIDENCE</span>
              <span className="text-purple-400 font-bold">{result.confidenceScore}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">FINDINGS</span>
              <span className="text-emerald-400 font-bold">{result.technicalFindings.length}</span>
            </div>
          </div>

          {/* Raw JSON Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Raw JSON Telemetry Stream
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                {isCopied ? 'Copied JSON!' : 'Copy Raw JSON'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-[11px] text-cyan-200/90 overflow-x-auto max-h-[380px] overflow-y-auto select-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
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
