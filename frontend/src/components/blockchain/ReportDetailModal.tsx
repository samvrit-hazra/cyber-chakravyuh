import { useState } from 'react';
import { Fingerprint, CheckCircle2, Blocks, History, Shield, ExternalLink, Copy, Check, Scale } from 'lucide-react';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';

interface ReportDetailModalProps {
  record: BlockchainReportRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onFileDispute?: (reportId: string, challengerDid: string, reason: string, evidenceUri?: string) => void;
}

export function ReportDetailModal({ record, isOpen, onClose, onFileDispute }: ReportDetailModalProps) {
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [challengerDid, setChallengerDid] = useState('did:key:analyst-node-07');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidenceUri, setDisputeEvidenceUri] = useState('');

  if (!record) return null;

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    if (onFileDispute) {
      onFileDispute(record.reportId, challengerDid, disputeReason, disputeEvidenceUri);
    }
    setShowDisputeForm(false);
    setDisputeReason('');
    setDisputeEvidenceUri('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Decentralized Report Audit Dossier: ${record.reportId}`}
      subtitle={`Indicator: ${record.targetSubject}`}
      size="xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Verification Status Banner */}
        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          record.verificationStatus === 'Disputed'
            ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 text-amber-800 dark:text-amber-200'
            : record.verificationStatus === 'Tamper Detected'
            ? 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30 text-rose-800 dark:text-rose-200'
            : 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC] block">{record.verificationStatus}</span>
              <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                Cryptographic commitment anchored on Ethereum Sepolia Testnet
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-black/10 dark:bg-white/10 text-[10px] font-bold uppercase self-start sm:self-auto">
            BLOCK #{record.blockNumber}
          </span>
        </div>

        {/* 1. Report Metadata & Incident Context */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
              1. Threat Report Overview & Indicators
            </h4>
            <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{record.reportId}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">Reported Phishing Campaign</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{record.campaignName || 'Independent Campaign Attestation'}</span>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">Suspicious URL / Domain Indicator</span>
              <span className="text-[#356D68] dark:text-[#79A99C] font-bold">{record.targetSubject}</span>
            </div>
          </div>

          {record.incidentSummary && (
            <div className="p-3 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">Security Incident Summary</span>
              <p className="text-[#182629] dark:text-[#E8E6DC] font-sans text-xs leading-relaxed">{record.incidentSummary}</p>
            </div>
          )}

          {record.supportingEvidenceUri && (
            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">Supporting Evidence Reference (IPFS)</span>
              <a
                href={record.supportingEvidenceUri.startsWith('http') ? record.supportingEvidenceUri : `https://ipfs.io/ipfs/${record.supportingEvidenceUri.replace('ipfs://', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#356D68] dark:text-[#79A99C] hover:underline flex items-center gap-1 font-bold break-all"
              >
                <span>{record.supportingEvidenceUri}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {/* Cryptographic Fingerprint */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[#647477] dark:text-[#A6B3AE] text-[11px]">
              <span className="uppercase font-bold text-[10px]">Deterministic Cryptographic Fingerprint:</span>
              <button
                type="button"
                onClick={() => handleCopy(record.reportFingerprint)}
                className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer flex items-center gap-1 font-bold"
              >
                {copiedFingerprint ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFingerprint ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
            <pre className="p-2 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#356D68] dark:text-[#79A99C] text-xs break-all select-all font-mono font-bold">
              {record.reportFingerprint}
            </pre>
          </div>
        </div>

        {/* 2. Blockchain Transaction Details */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Blocks className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            2. Blockchain Ledger Settlement Telemetry
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">SMART CONTRACT ADDRESS</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold truncate block">{record.smartContractAddress}</span>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">TRANSACTION HASH</span>
              <span className="text-[#356D68] dark:text-[#79A99C] font-bold truncate block">{record.transactionHash}</span>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">BLOCK NUMBER & NETWORK</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">#{record.blockNumber} • {record.network}</span>
            </div>

            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">SUBMITTER PROVENANCE</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold truncate block">{record.submitterAddress}</span>
            </div>
          </div>

          <div className="pt-1 flex justify-between items-center text-[11px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Gas Consumed: <strong className="text-[#182629] dark:text-[#E8E6DC]">{record.gasUsed}</strong></span>
            <a
              href={`https://sepolia.etherscan.io/tx/${record.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Verify On Public Block Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Revision History & Disputes Tracking */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              3. Revision History & Audit Log ({record.revisions.length} Revisions)
            </h4>
            {onFileDispute && (
              <button
                type="button"
                onClick={() => setShowDisputeForm(!showDisputeForm)}
                className="text-[11px] text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Scale className="w-3 h-3" />
                <span>{showDisputeForm ? 'Cancel Dispute' : 'Challenge / Dispute Report'}</span>
              </button>
            )}
          </div>

          {/* Dispute Filing Inline Form */}
          {showDisputeForm && (
            <form onSubmit={handleDisputeSubmit} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-300 block text-[11px]">
                Submit Peer Dispute Challenge
              </span>
              <input
                type="text"
                placeholder="Challenger DID (e.g. did:key:...)"
                value={challengerDid}
                onChange={(e) => setChallengerDid(e.target.value)}
                className="w-full p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono"
                required
              />
              <textarea
                placeholder="Reason for dispute (e.g. Verified authorized enterprise CDN reverse proxy node)..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={2}
                className="w-full p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono resize-none"
                required
              />
              <input
                type="text"
                placeholder="Supporting Evidence IPFS URI (optional)..."
                value={disputeEvidenceUri}
                onChange={(e) => setDisputeEvidenceUri(e.target.value)}
                className="w-full p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="primary" type="submit">
                  Record Dispute On-Chain
                </Button>
              </div>
            </form>
          )}

          {/* Active Disputes */}
          {record.disputes && record.disputes.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Recorded Disputes ({record.disputes.length})
              </span>
              {record.disputes.map((disp) => (
                <div key={disp.disputeId} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-800 dark:text-amber-300 font-bold">{disp.disputeId} • {disp.status}</span>
                    <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">{disp.timestamp}</span>
                  </div>
                  <p className="text-[#182629] dark:text-[#E8E6DC] font-sans text-xs">{disp.reason}</p>
                  <div className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">
                    Challenger: <span className="font-mono text-[#182629] dark:text-[#E8E6DC]">{disp.challengerDid}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Revisions */}
          <div className="space-y-2 pt-1">
            {record.revisions.map((rev) => (
              <div key={rev.revisionNumber} className="p-3 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 dark:text-amber-300 font-bold">Revision v{rev.revisionNumber}.0</span>
                  <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">{rev.timestamp}</span>
                </div>
                <p className="text-[#182629] dark:text-[#E8E6DC] font-sans text-xs">{rev.changeSummary}</p>
                <div className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">
                  Committed by: <span className="text-[#182629] dark:text-[#E8E6DC] font-mono">{rev.authorDid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. External Corroborating Evidence References */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            4. External Corroborating Evidence References ({record.evidenceReferences.length})
          </h4>

          <div className="space-y-2">
            {record.evidenceReferences.map((ev, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{ev.sourceName}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F3F1E9] dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144]">
                    {ev.evidenceType}
                  </span>
                </div>
                <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE] break-all">
                  Artifact Digest: <span className="text-[#356D68] dark:text-[#79A99C] font-mono">{ev.artifactHash}</span>
                </div>
                {ev.uri && (
                  <div className="text-[11px]">
                    <a
                      href={ev.uri.startsWith('http') ? ev.uri : `https://ipfs.io/ipfs/${ev.uri.replace('ipfs://', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>URI: {ev.uri}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-[#D9DED7] dark:border-[#304144]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </Modal>
  );
}
