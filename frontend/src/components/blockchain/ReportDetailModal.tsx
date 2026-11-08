import { useState } from 'react';
import { Fingerprint, CheckCircle2, Blocks, History, Shield, ExternalLink, Copy, Check } from 'lucide-react';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';

interface ReportDetailModalProps {
  record: BlockchainReportRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDetailModal({ record, isOpen, onClose }: ReportDetailModalProps) {
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  if (!record) return null;

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Decentralized Report Audit Dossier: ${record.reportId}`}
      subtitle={`Anchored Subject: ${record.targetSubject}`}
      size="xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Verification Status Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC] block">{record.verificationStatus}</span>
              <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Cryptographic consensus confirmed across network nodes</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase self-start sm:self-auto">
            BLOCK #{record.blockNumber}
          </span>
        </div>

        {/* 1. Report Identifier & Cryptographic Fingerprint */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
              1. Report Identifier & Cryptographic Fingerprint
            </h4>
            <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{record.reportId}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[#647477] dark:text-[#A6B3AE] text-[11px]">
              <span>Deterministic Merkle Fingerprint (Keccak-256):</span>
              <button
                type="button"
                onClick={() => handleCopy(record.reportFingerprint)}
                className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer flex items-center gap-1 font-bold"
              >
                {copiedFingerprint ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFingerprint ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#356D68] dark:text-[#79A99C] text-xs break-all select-all font-mono">
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
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">REGISTRATION TIMESTAMP</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{record.registrationTimestamp}</span>
            </div>
          </div>

          <div className="pt-1 flex justify-between items-center text-[11px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Gas Consumption: <strong className="text-[#182629] dark:text-[#E8E6DC]">{record.gasUsed}</strong></span>
            <a
              href={record.integrityVerdict.immutableReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 font-bold"
            >
              <span>View On Public Block Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Revision History */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            3. Immutable Revision History ({record.revisions.length} Revisions)
          </h4>

          <div className="space-y-2">
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

        {/* 4. Evidence References */}
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
