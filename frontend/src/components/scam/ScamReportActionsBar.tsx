import { useState } from 'react';
import { Download, Copy, Eye, Check, ShieldCheck, Code2, Trash2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { Modal } from '../common/Modal.tsx';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface ScamReportActionsBarProps {
  result: ScamAnalysisResult;
  onClear: () => void;
}

export function ScamReportActionsBar({ result, onClear }: ScamReportActionsBarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate Executive Markdown Briefing
  const generateMarkdownSummary = (): string => {
    return [
      `# CYBER CHAKRAVYUHA — SCAM & MESSAGE ANALYSIS REPORT`,
      `**Dossier Reference:** \`${result.analysisId}\``,
      `**Analyzed Timestamp:** ${result.analyzedAt}`,
      `**Classification:** **${result.riskClassification}** (Score: ${result.riskScore}/100)`,
      `**Threat Category:** ${result.scamCategory}`,
      `**Cognitive Confidence:** ${result.confidenceScore}%`,
      ``,
      `## 1. Executive Summary Rationale`,
      result.aiExplanation.summaryRationale,
      ``,
      `## 2. Key Manipulation Signals`,
      `- **Urgency Level:** ${result.urgencyAndManipulation.urgencyScore}% (${result.urgencyAndManipulation.isUrgencyLegitimate ? 'Legitimate' : 'Deceptive Coercion'})`,
      `- **Impersonation:** ${result.impersonation.isImpersonationDetected ? `YES (${result.impersonation.impersonatedEntity})` : 'NO'}`,
      `- **Payment Rails:** ${result.paymentIndicators.map((p) => p.method).join(', ')}`,
      ``,
      `## 3. Extracted Artifacts`,
      `- **Extracted URLs:** ${result.extractedUrls.length} links`,
      `- **Extracted Emails:** ${result.extractedEmails.length} addresses`,
      `- **Extracted Phones:** ${result.extractedPhones.length} phone numbers`,
      `- **Suspicious Entities:** ${result.suspiciousEntities.length} tokens/wallets`,
      ``,
      `## 4. Priority Security Directives`,
      result.recommendedPrecautions.map((p) => `- **[${p.priority}]** ${p.instruction}`).join('\n'),
      ``,
      `*Notice:* ${result.securityDisclosureNotice}`,
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

  const handleExportReport = () => {
    const exportData = {
      engine: 'Cyber Chakravyuha Layer 7 Cognitive NLP Core',
      exportTimestamp: new Date().toISOString(),
      reportPayload: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chakravyuha-scam-report-${result.analysisId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b1228] border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <span>Cognitive Forensic Dossier:</span>
              <span className="text-purple-300">#{result.analysisId}</span>
            </h4>
            <p className="text-xs font-mono text-slate-400">
              Audit-ready NLP scam and manipulation signature record
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Copy Analysis */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="flex-1 sm:flex-none font-mono text-xs"
            leftIcon={isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {isCopied ? 'Analysis Copied!' : 'Copy Analysis'}
          </Button>

          {/* Export Report JSON */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="flex-1 sm:flex-none font-mono text-xs border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
            leftIcon={downloadSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          >
            {downloadSuccess ? 'Exported!' : 'Export Report'}
          </Button>

          {/* View Raw Indicators Modal */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none font-mono text-xs"
            leftIcon={<Eye className="w-4 h-4" />}
          >
            View Indicators
          </Button>

          {/* Clear Analysis */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="font-mono text-xs text-slate-400 hover:text-rose-300"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Raw Extracted Indicators Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Extracted Telemetry: ${result.analysisId}`}
        subtitle={`Audit stream for ${result.scamCategory}`}
        size="xl"
      >
        <div className="space-y-4 font-mono text-xs">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">CLASSIFICATION</span>
              <span className="text-white font-bold">{result.riskClassification}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">THREAT SCORE</span>
              <span className="text-rose-400 font-bold">{result.riskScore}/100</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">URGENCY RATING</span>
              <span className="text-amber-400 font-bold">{result.urgencyAndManipulation.urgencyScore}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">INDICATORS</span>
              <span className="text-purple-400 font-bold">
                {result.extractedUrls.length +
                  result.extractedEmails.length +
                  result.extractedPhones.length +
                  result.suspiciousEntities.length}
              </span>
            </div>
          </div>

          {/* Raw JSON Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                Raw Cognitive NLP Output Stream
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="text-purple-400 hover:underline cursor-pointer"
              >
                {isCopied ? 'Copied JSON!' : 'Copy Raw JSON'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-[11px] text-purple-200/90 overflow-x-auto max-h-[380px] overflow-y-auto select-all">
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
              onClick={handleExportReport}
              leftIcon={<Download className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-500"
            >
              Export JSON File
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

