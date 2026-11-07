import { useState } from 'react';
import { Download, Copy, Eye, Check, ShieldCheck, Code2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { Modal } from '../common/Modal.tsx';
import type { TlsInvestigationResult } from '../../types/tls.ts';

interface TlsReportActionsBarProps {
  result: TlsInvestigationResult;
}

export function TlsReportActionsBar({ result }: TlsReportActionsBarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const generateMarkdownSummary = (): string => {
    return [
      `# CYBER CHAKRAVYUHA — TLS & DIGITAL TRUST INTELLIGENCE REPORT`,
      `**Target Domain:** \`${result.targetDomain}:${result.targetPort}\``,
      `**Investigation ID:** \`${result.investigationId}\``,
      `**Analyzed Timestamp:** ${result.analyzedAt}`,
      `**Certificate Status:** **${result.certificateStatus}** (Trust Grade: ${result.trustGrade}, Score: ${result.trustScore}/100)`,
      ``,
      `## 1. Subject & Issuer`,
      `- **Subject Common Name (CN):** \`${result.subject.commonName}\``,
      `- **Issuer CA:** ${result.issuer.commonName} (${result.issuer.organization})`,
      `- **Valid From:** ${result.validFrom}`,
      `- **Valid To:** ${result.validTo} (${result.daysRemaining} days remaining)`,
      `- **Signature Algorithm:** ${result.signatureAlgorithm}`,
      `- **Public Key:** ${result.publicKeyInfo.algorithm} ${result.publicKeyInfo.keySizeBits} bits`,
      ``,
      `## 2. Cryptographic Security Profile`,
      `- **Protocol Version:** ${result.protocolVersion}`,
      `- **Cipher Suite:** ${result.cipherSuite}`,
      `- **Forward Secrecy (PFS):** ${result.isPfsSupported ? 'Supported' : 'Disabled'}`,
      `- **OCSP Status:** ${result.ocspStapling.status}`,
      ``,
      `## 3. Security Findings (${result.securityFindings.length})`,
      result.securityFindings.map((f) => `- **[${f.severity.toUpperCase()}]** ${f.title} (${f.isCompromisedTrust ? 'Compromised Trust' : 'Configuration Issue'})`).join('\n'),
      ``,
      `## 4. Mandatory Zero-Trust PKI Notices`,
      `- ${result.importantWarnings.httpsNotLegitimateNotice}`,
      `- ${result.importantWarnings.validTlsNotSafeNotice}`,
      `- ${result.importantWarnings.caKeyGenLimitationNotice}`,
      `- ${result.importantWarnings.configurationVsCompromiseNotice}`,
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
      engine: 'Cyber Chakravyuha Layer 5 Application Shield & TLS PKI Inspector',
      exportTimestamp: new Date().toISOString(),
      reportPayload: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chakravyuha-tls-report-${result.targetDomain}.json`;
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
              <span>TLS Cryptographic Dossier:</span>
              <span className="text-cyan-300">#{result.investigationId}</span>
            </h4>
            <p className="text-xs font-mono text-slate-400">
              X.509 trust chain audit with Certificate Transparency verification
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
        title={`TLS Telemetry Stream: ${result.targetDomain}`}
        subtitle={`Complete X.509 PKI certificate payload for ${result.targetDomain}:443`}
        size="xl"
      >
        <div className="space-y-4 font-mono text-xs">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">STATUS</span>
              <span className="text-white font-bold">{result.certificateStatus}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">GRADE</span>
              <span className="text-cyan-400 font-bold">{result.trustGrade} ({result.trustScore}/100)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">PROTOCOL</span>
              <span className="text-purple-400 font-bold">{result.protocolVersion}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">FINDINGS</span>
              <span className="text-emerald-400 font-bold">{result.securityFindings.length}</span>
            </div>
          </div>

          {/* Raw JSON Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Raw X.509 JSON Telemetry Stream
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

