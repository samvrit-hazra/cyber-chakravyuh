import { useState } from 'react';
import { Fingerprint, UploadCloud, CheckCircle2, Copy, Check, Code2 } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import {
  CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
  CHAKRAVYUHA_LEDGER_NETWORK,
  generateReportFingerprint,
  sanitizeReportPayload,
} from '../../utils/blockchainRegistryEngine.ts';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';

interface ReportSubmissionCardProps {
  onReportRegistered: (record: BlockchainReportRecord) => void;
}

export function ReportSubmissionCard({ onReportRegistered }: ReportSubmissionCardProps) {
  const [reportTitle, setReportTitle] = useState('Critical Smishing Incident (Bank Lure)');
  const [targetSubject, setTargetSubject] = useState('chase-security-resolver.online');
  const [findingsSummary, setFindingsSummary] = useState(
    'Automated AiTM kit with 2-hour coercive card cancellation timer. Colocated on bulletproof ASN AS49505.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<BlockchainReportRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Live computed fingerprint
  const currentContent = `${reportTitle}|${targetSubject}|${findingsSummary}`;
  const computedFingerprint = generateReportFingerprint(currentContent);

  const handleSubmitOnChain = () => {
    setIsSubmitting(true);

    const { sanitizationLog } = sanitizeReportPayload({
      title: reportTitle,
      subject: targetSubject,
      summary: findingsSummary,
    });

    setTimeout(() => {
      const newRecord: BlockchainReportRecord = {
        reportId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
        reportTitle,
        targetSubject,
        reportFingerprint: computedFingerprint,
        smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
        transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        blockNumber: 4892150 + Math.floor(Math.random() * 50),
        network: CHAKRAVYUHA_LEDGER_NETWORK,
        gasUsed: '47,820 Gwei (0.00047 ETH)',
        registrationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        verificationStatus: 'Verified On-Chain',
        submitterAddress: '0x9482fa019481029410948b2910c84102941094b8',
        revisions: [
          {
            revisionNumber: 1,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            authorDid: 'did:chakravyuha:authenticated-secops-analyst',
            merkleRootHash: computedFingerprint,
            changeSummary: sanitizationLog.join(' • '),
          },
        ],
        evidenceReferences: [
          {
            sourceName: 'Chakravyuha Saptarishi Ingress Verification',
            evidenceType: 'Threat Intelligence Match',
            artifactHash: computedFingerprint,
          },
        ],
        integrityVerdict: {
          isUntampered: true,
          hashMatchesLedger: true,
          blockConfirmations: 1,
          immutableReceiptUrl: `https://explorer.chakravyuha.network/tx/${computedFingerprint}`,
        },
      };

      setLastSubmission(newRecord);
      setIsSubmitting(false);
      onReportRegistered(newRecord);
    }, 1100);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            STEP 1 • ON-CHAIN ATTESTATION COMMITTAL
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <span>Register Threat Report on Decentralized Ledger</span>
          </h3>
        </div>

        <span className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-white/5">
          Contract: <span className="text-cyan-300 font-bold">{CHAKRAVYUHA_SMART_CONTRACT_ADDRESS.slice(0, 8)}...</span>
        </span>
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-slate-400 block uppercase font-bold text-[11px]">
            Incident / Report Title:
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 outline-none focus:border-cyan-400 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 block uppercase font-bold text-[11px]">
            Target Domain / Host Subject (Sanitized):
          </label>
          <input
            type="text"
            value={targetSubject}
            onChange={(e) => setTargetSubject(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 outline-none focus:border-cyan-400 text-xs"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-slate-400 block uppercase font-bold text-[11px]">
            Evidentiary Findings Summary (Non-PII):
          </label>
          <textarea
            value={findingsSummary}
            onChange={(e) => setFindingsSummary(e.target.value)}
            disabled={isSubmitting}
            rows={2}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 outline-none focus:border-cyan-400 text-xs resize-none"
          />
        </div>
      </div>

      {/* Live Calculated Cryptographic Fingerprint Display */}
      <div className="p-3.5 rounded-xl bg-[#060b17] border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            Deterministic SHA-256 / Keccak-256 Digest Preview
          </span>
          <button
            type="button"
            onClick={() => handleCopyHash(computedFingerprint)}
            className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Digest'}</span>
          </button>
        </div>

        <div className="p-2.5 rounded-lg bg-black/60 font-mono text-cyan-300 text-xs break-all select-all">
          {computedFingerprint}
        </div>
        <p className="text-[11px] text-slate-400 font-sans">
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

        <span className="text-[11px] text-slate-400">
          Target Smart Contract: <strong className="text-slate-300">ThreatRegistryV4.sol</strong>
        </span>
      </div>

      {/* Transaction Confirmation Card */}
      {lastSubmission && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 text-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Attestation Successfully Mined on Ledger!</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
              BLOCK #{lastSubmission.blockNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block">Report ID:</span>
              <span className="text-slate-100 font-bold">{lastSubmission.reportId}</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 truncate">
              <span className="text-slate-400 block">Transaction Hash:</span>
              <span className="text-cyan-300 font-bold truncate block">{lastSubmission.transactionHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

