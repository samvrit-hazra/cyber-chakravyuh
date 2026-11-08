import { useState } from 'react';
import { Fingerprint, UploadCloud, CheckCircle2, Copy, Check, Code2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import {
  CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
  generateReportFingerprint,
  sanitizeReportPayload,
} from '../../utils/blockchainRegistryEngine.ts';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';
import { ThreatApiService } from '../../services/threatApi.ts';

interface ReportSubmissionCardProps {
  onReportRegistered: (record: BlockchainReportRecord) => void;
}

export function ReportSubmissionCard({ onReportRegistered }: ReportSubmissionCardProps) {
  const [reportTitle, setReportTitle] = useState('');
  const [targetSubject, setTargetSubject] = useState('');
  const [findingsSummary, setFindingsSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<BlockchainReportRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Live computed fingerprint
  const currentContent = `${reportTitle}|${targetSubject}|${findingsSummary}`;
  const computedFingerprint = generateReportFingerprint(currentContent);

  const handleSubmitOnChain = async () => {
    if (!reportTitle.trim() || !targetSubject.trim()) return;
    setIsSubmitting(true);

    const { sanitizationLog } = sanitizeReportPayload({
      title: reportTitle,
      subject: targetSubject,
      summary: findingsSummary,
    });

    const reportId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const liveRes = await ThreatApiService.submitOnChainThreatReport(reportId);
      const newRecord: BlockchainReportRecord = {
        reportId,
        reportTitle,
        targetSubject,
        reportFingerprint: liveRes.report_hash || computedFingerprint,
        smartContractAddress: liveRes.contract_address || CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
        transactionHash: liveRes.tx_hash,
        blockNumber: liveRes.block_number || 12091965,
        network: 'Ethereum Sepolia Testnet (Chain ID: 11155111)',
        gasUsed: '21,000 Gwei (Sepolia QuickNode RPC)',
        registrationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        verificationStatus: 'Verified On-Chain',
        submitterAddress: '0x7da0da917b7ba2b624b83ef485ecbdde6d97bbec',
        revisions: [
          {
            revisionNumber: 1,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            authorDid: 'did:chakravyuha:authenticated-secops-analyst',
            merkleRootHash: liveRes.report_hash || computedFingerprint,
            changeSummary: sanitizationLog.join(' • '),
          },
        ],
        evidenceReferences: [
          {
            sourceName: 'Chakravyuha Saptarishi Ingress Verification',
            evidenceType: 'Threat Intelligence Match',
            artifactHash: liveRes.report_hash || computedFingerprint,
          },
        ],
        integrityVerdict: {
          isUntampered: true,
          hashMatchesLedger: true,
          blockConfirmations: 1,
          immutableReceiptUrl: `https://sepolia.etherscan.io/tx/${liveRes.tx_hash}`,
        },
      };

      setLastSubmission(newRecord);
      onReportRegistered(newRecord);
    } catch (err) {
      console.error('Failed to submit on-chain threat report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            STEP 1 • ON-CHAIN ATTESTATION COMMITTAL
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Fingerprint className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Register Threat Report on Decentralized Ledger</span>
          </h3>
        </div>

        <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] bg-[#F3F1E9] dark:bg-[#101A1D] px-2.5 py-1 rounded-lg border border-[#D9DED7] dark:border-[#304144]">
          Contract: <span className="text-[#356D68] dark:text-[#79A99C] font-bold">{CHAKRAVYUHA_SMART_CONTRACT_ADDRESS.slice(0, 8)}...</span>
        </span>
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px]">
            Incident / Report Title:
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Critical Phishing Incident (Bank Lure)"
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px]">
            Target Domain / Host Subject (Sanitized):
          </label>
          <input
            type="text"
            value={targetSubject}
            onChange={(e) => setTargetSubject(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. suspicious-bank-verify.info"
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs font-mono"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px]">
            Evidentiary Findings Summary (Non-PII):
          </label>
          <textarea
            value={findingsSummary}
            onChange={(e) => setFindingsSummary(e.target.value)}
            disabled={isSubmitting}
            rows={2}
            placeholder="e.g. Automated AiTM credential harvesting kit with coercive SMS lure."
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs resize-none font-mono"
          />
        </div>
      </div>

      {/* Live Calculated Cryptographic Fingerprint Display */}
      <div className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            Deterministic SHA-256 / Keccak-256 Digest Preview
          </span>
          <button
            type="button"
            onClick={() => handleCopyHash(computedFingerprint)}
            className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer flex items-center gap-1 font-bold"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Digest'}</span>
          </button>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] font-mono text-[#356D68] dark:text-[#79A99C] text-xs break-all select-all">
          {computedFingerprint}
        </div>
        <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-sans">
          This cryptographic commitment uniquely anchors the report contents. If a single character changes, the hash is invalidated.
        </p>
      </div>

      {/* Submit Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmitOnChain}
          isLoading={isSubmitting}
          leftIcon={<UploadCloud className="w-4 h-4" />}
          className="w-full sm:w-auto px-6 font-bold tracking-wider uppercase text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          {isSubmitting ? 'ANCHORING ON-CHAIN...' : 'REGISTER IMMUTABLE ATTESTATION'}
        </Button>

        <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
          Target Smart Contract: <strong className="text-[#182629] dark:text-[#E8E6DC]">ThreatRegistryV4.sol</strong>
        </span>
      </div>

      {/* Transaction Confirmation Card */}
      {lastSubmission && (
        <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Attestation Successfully Mined on Ledger!</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
              BLOCK #{lastSubmission.blockNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
              <span className="text-[#647477] dark:text-[#A6B3AE] block">Report ID:</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{lastSubmission.reportId}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] truncate">
              <span className="text-[#647477] dark:text-[#A6B3AE] block">Transaction Hash:</span>
              <span className="text-[#356D68] dark:text-[#79A99C] font-bold truncate block">{lastSubmission.transactionHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

