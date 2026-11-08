import { useState } from 'react';
import { ShieldCheck, Copy, Check, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { Modal } from '../common/Modal.tsx';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface ScamReportActionsBarProps {
  result: ScamAnalysisResult;
  onClear: () => void;
}

export function ScamReportActionsBar({ result, onClear }: ScamReportActionsBarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopySummary = () => {
    const summary = `[CYBER CHAKRAVYUH COGNITIVE SCAM DOSSIER]
Dossier ID: ${result.analysisId}
Analyzed At: ${result.analyzedAt}
Risk Classification: ${result.riskClassification}
Scam Likelihood Score: ${result.riskScore}/100
Confidence: ${result.confidenceScore}%
Threat Category: ${result.scamCategory}
Urgency Score: ${result.urgencyAndManipulation.urgencyScore}% (Legitimate: ${result.urgencyAndManipulation.isUrgencyLegitimate ? 'YES' : 'NO'})
Impersonation: ${result.impersonation.isImpersonationDetected ? `YES (${result.impersonation.impersonatedEntity})` : 'NO'}
Payment Rails: ${result.paymentIndicators.map((p) => p.method).join(', ') || 'None'}
Extracted URLs: ${result.extractedUrls.length}
Extracted Emails: ${result.extractedEmails.length}
Extracted Phone Numbers: ${result.extractedPhones.length}
Model: ${result.dataSourceLabel}`;

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportReport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chakravyuha-scam-audit-${result.analysisId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/25 dark:border-[#C47A52]/30 text-[#A95636] dark:text-[#C47A52]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <span>Cognitive Forensic Dossier:</span>
              <span className="text-[#A95636] dark:text-[#C47A52]">#{result.analysisId}</span>
            </h4>
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
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
            leftIcon={isCopied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {isCopied ? 'Analysis Copied!' : 'Copy Analysis'}
          </Button>

          {/* Export Report JSON */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="flex-1 sm:flex-none font-mono text-xs border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52] hover:bg-[#A95636]/10"
            leftIcon={downloadSuccess ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Download className="w-4 h-4" />}
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
            className="font-mono text-xs text-[#647477] dark:text-[#A6B3AE] hover:text-rose-600 dark:hover:text-rose-400"
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
            <div className="p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">CLASSIFICATION</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{result.riskClassification}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">THREAT SCORE</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">{result.riskScore}/100</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">URGENCY RATING</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{result.urgencyAndManipulation.urgencyScore}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">PAYLOAD LEN</span>
              <span className="text-[#356D68] dark:text-[#79A99C] font-bold">{result.contentLength} chars</span>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] overflow-x-auto max-h-96">
            <pre className="text-[11px] leading-relaxed text-[#182629] dark:text-[#E8E6DC]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </Modal>
    </>
  );
}
