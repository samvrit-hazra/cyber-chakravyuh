import { useState, useEffect } from 'react';
import { Fingerprint, UploadCloud, CheckCircle2, Copy, Check, Code2, ShieldAlert, FileText, Globe, Layers, Link as LinkIcon, Sparkles, X } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import {
  CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
  CHAKRAVYUHA_LEDGER_NETWORK,
  generateReportFingerprint,
  sanitizeReportPayload,
} from '../../utils/blockchainRegistryEngine.ts';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';
import { useNavigation } from '../../context/NavigationContext.tsx';

interface ReportSubmissionCardProps {
  onReportRegistered: (record: BlockchainReportRecord) => void;
}

export function ReportSubmissionCard({ onReportRegistered }: ReportSubmissionCardProps) {
  const { pendingReport, clearPendingReport } = useNavigation();

  const [reportTitle, setReportTitle] = useState('Critical Smishing Incident (Bank Lure)');
  const [campaignName, setCampaignName] = useState('Urgent Chase KYC Suspension Smishing Wave');
  const [targetSubject, setTargetSubject] = useState('chase-security-resolver.online');
  const [findingsSummary, setFindingsSummary] = useState(
    'Automated AiTM reverse proxy kit deployed with 2-hour coercive card cancellation timer. Colocated on bulletproof ASN AS49505 harvesting debit card numbers and CVVs.'
  );
  const [supportingEvidenceUri, setSupportingEvidenceUri] = useState(
    'ipfs://bafybeif47a98214b7ff3ux45g7qdaxufhzy7pvAbc2/sms-evidence.eml'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<BlockchainReportRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (pendingReport) {
      if (pendingReport.title) setReportTitle(pendingReport.title);
      if (pendingReport.campaignName) setCampaignName(pendingReport.campaignName);
      if (pendingReport.targetSubject) setTargetSubject(pendingReport.targetSubject);
      if (pendingReport.findingsSummary) setFindingsSummary(pendingReport.findingsSummary);
      if (pendingReport.evidenceUri) setSupportingEvidenceUri(pendingReport.evidenceUri);
    }
  }, [pendingReport]);

  // Live computed fingerprint from report fields
  const currentContent = `${reportTitle}|${campaignName}|${targetSubject}|${findingsSummary}|${supportingEvidenceUri}`;
  const computedFingerprint = generateReportFingerprint(currentContent);

  const handleSubmitOnChain = () => {
    setIsSubmitting(true);

    const { sanitizationLog } = sanitizeReportPayload({
      title: reportTitle,
      campaign: campaignName,
      subject: targetSubject,
      summary: findingsSummary,
      evidenceUri: supportingEvidenceUri,
    });

    setTimeout(() => {
      const newRecord: BlockchainReportRecord = {
        reportId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
        reportTitle,
        campaignName,
        targetSubject,
        incidentSummary: findingsSummary,
        supportingEvidenceUri,
        reportFingerprint: computedFingerprint,
        smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
        transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        blockNumber: 4892150 + Math.floor(Math.random() * 50),
        network: CHAKRAVYUHA_LEDGER_NETWORK,
        gasUsed: '47,820 Gwei (0.00048 ETH)',
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
        disputes: [],
        evidenceReferences: [
          {
            sourceName: 'Supporting Evidence IPFS CID',
            evidenceType: 'IPFS Forensic Artifact',
            artifactHash: computedFingerprint,
            uri: supportingEvidenceUri,
          },
          {
            sourceName: 'Threat Correlation Ingress Attestation',
            evidenceType: 'Threat Intelligence Match',
            artifactHash: generateReportFingerprint(targetSubject),
          },
        ],
        integrityVerdict: {
          isUntampered: true,
          hashMatchesLedger: true,
          blockConfirmations: 1,
          immutableReceiptUrl: `https://sepolia.etherscan.io/tx/${computedFingerprint}`,
        },
      };

      setLastSubmission(newRecord);
      setIsSubmitting(false);
      onReportRegistered(newRecord);
      if (pendingReport) {
        clearPendingReport();
      }
    }, 950);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            MODULE 6 • DECENTRALIZED THREAT SUBMISSION
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Fingerprint className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Submit Cryptographic Threat Intelligence Report</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] bg-[#F3F1E9] dark:bg-[#101A1D] px-2.5 py-1 rounded-lg border border-[#D9DED7] dark:border-[#304144]">
            Contract: <span className="text-[#356D68] dark:text-[#79A99C] font-bold">{CHAKRAVYUHA_SMART_CONTRACT_ADDRESS.slice(0, 10)}...</span>
          </span>
        </div>
      </div>

      {/* Pre-population Banner */}
      {pendingReport && (
        <div className="p-3.5 rounded-xl bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/30 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C] font-sans">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              <strong>Pre-populated from recent investigation:</strong> Subject <code>{pendingReport.targetSubject}</code> and technical findings loaded. Ready for cryptographic attestation committal.
            </span>
          </div>
          <button
            type="button"
            onClick={clearPendingReport}
            className="p-1 rounded hover:bg-[#356D68]/20 text-[#356D68] dark:text-[#79A99C] cursor-pointer shrink-0"
            title="Dismiss pre-fill"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Off-Chain Data Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-sans leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-amber-900 dark:text-amber-300">Privacy & Off-Chain Data Boundary:</strong>
          Raw URLs, personal communications, email bodies, passwords, and sensitive user data remain strictly off-chain.
          Only the deterministic cryptographic hash digest below will be committed to the public smart contract ledger to guarantee tamper-evident integrity.
        </div>
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incident Title */}
        <div className="space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Security Incident Title:</span>
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Critical Smishing Incident (Bank Lure)"
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs font-mono"
          />
        </div>

        {/* Reported Phishing Campaign */}
        <div className="space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Reported Phishing Campaign Name:</span>
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. PayPal Brand Impersonation Wave 4"
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs font-mono"
          />
        </div>

        {/* Suspicious URL or Domain Indicator */}
        <div className="space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#36745F] dark:text-[#79B69A]" />
            <span>Suspicious URL / Domain Indicator:</span>
          </label>
          <input
            type="text"
            value={targetSubject}
            onChange={(e) => setTargetSubject(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. chase-security-resolver.online"
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs font-mono"
          />
        </div>

        {/* Supporting Evidence Reference */}
        <div className="space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px] flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#2A5753] dark:text-[#669387]" />
            <span>Supporting Evidence Reference (IPFS CID / URI):</span>
          </label>
          <input
            type="text"
            value={supportingEvidenceUri}
            onChange={(e) => setSupportingEvidenceUri(e.target.value)}
            disabled={isSubmitting}
            placeholder="ipfs://bafybei... or https://..."
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs font-mono"
          />
        </div>

        {/* Security Incident Summary */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px]">
            Security Incident Summary (Technical Observations, IoCs):
          </label>
          <textarea
            value={findingsSummary}
            onChange={(e) => setFindingsSummary(e.target.value)}
            disabled={isSubmitting}
            rows={2}
            placeholder="Describe the technical observations, payload behavior, and observed attack vectors..."
            className="w-full p-2.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] text-xs resize-none font-mono"
          />
        </div>
      </div>

      {/* Live Calculated Cryptographic Fingerprint Display */}
      <div className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            Deterministic Cryptographic Fingerprint (Keccak-256 / SHA-256)
          </span>
          <button
            type="button"
            onClick={() => handleCopyHash(computedFingerprint)}
            className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer flex items-center gap-1 font-bold"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Digest'}</span>
          </button>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] font-mono text-[#356D68] dark:text-[#79A99C] text-xs break-all select-all font-bold">
          {computedFingerprint}
        </div>
        <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-sans">
          This cryptographic commitment uniquely anchors the report contents. If a single character or evidence reference is modified, the hash changes, invalidating any forged claim.
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
          className="w-full sm:w-auto px-6 font-bold tracking-wider uppercase text-xs"
        >
          {isSubmitting ? 'ANCHORING ON-CHAIN...' : 'RECORD ON-CHAIN COMMITMENT'}
        </Button>

        <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
          Network: <strong className="text-[#182629] dark:text-[#E8E6DC]">Ethereum Sepolia Testnet</strong>
        </span>
      </div>

      {/* Transaction Confirmation Card */}
      {lastSubmission && (
        <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cryptographic Commitment Successfully Mined on Ledger!</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 uppercase font-bold">
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
