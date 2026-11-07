import { useState } from 'react';
import {
  Fingerprint,
  CheckCircle2,
  ExternalLink,
  History,
  Shield,
  Copy,
  Check,
  Blocks,
} from 'lucide-react';
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Decentralized Threat Dossier: ${record.reportId}`}
      subtitle={`Immutable cryptographic ledger attestation for ${record.targetSubject}`}
      size="xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Verification Status Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Cryptographic Verification Status: {record.verificationStatus}</span>
          </div>
          <span className="text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/10 text-slate-300">
            Confirmations: {record.integrityVerdict.blockConfirmations} Blocks
          </span>
        </div>

        {/* 1. Report Identifier & Cryptographic Fingerprint */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              1. Report Identifier & Cryptographic Fingerprint
            </h4>
            <span className="text-cyan-400 font-bold">{record.reportId}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Deterministic Merkle Fingerprint (Keccak-256):</span>
              <button
                type="button"
                onClick={() => handleCopy(record.reportFingerprint)}
                className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {copiedFingerprint ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFingerprint ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-cyan-300 text-xs break-all select-all">
              {record.reportFingerprint}
            </pre>
          </div>
        </div>

        {/* 2. Blockchain Transaction Details */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Blocks className="w-4 h-4 text-purple-400" />
            2. Blockchain Ledger Settlement Telemetry
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded bg-slate-900 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">SMART CONTRACT ADDRESS</span>
              <span className="text-slate-200 font-bold truncate block">{record.smartContractAddress}</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">TRANSACTION HASH</span>
              <span className="text-cyan-300 font-bold truncate block">{record.transactionHash}</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">BLOCK NUMBER & NETWORK</span>
              <span className="text-slate-200 font-bold">#{record.blockNumber} • {record.network}</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">REGISTRATION TIMESTAMP</span>
              <span className="text-slate-200 font-bold">{record.registrationTimestamp}</span>
            </div>
          </div>

          <div className="pt-1 flex justify-between items-center text-[11px] text-slate-400">
            <span>Gas Consumption: <strong className="text-slate-300">{record.gasUsed}</strong></span>
            <a
              href={record.integrityVerdict.immutableReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View On Public Block Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3. Revision History */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            3. Immutable Revision History ({record.revisions.length} Revisions)
          </h4>

          <div className="space-y-2">
            {record.revisions.map((rev) => (
              <div key={rev.revisionNumber} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300 font-bold">Revision v{rev.revisionNumber}.0</span>
                  <span className="text-[10px] text-slate-500">{rev.timestamp}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{rev.changeSummary}</p>
                <div className="text-[10px] text-slate-500">
                  Committed by: <span className="text-slate-400">{rev.authorDid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Evidence References */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            4. External Corroborating Evidence References ({record.evidenceReferences.length})
          </h4>

          <div className="space-y-2">
            {record.evidenceReferences.map((ev, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-bold">{ev.sourceName}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 border border-white/5">
                    {ev.evidenceType}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 break-all">
                  Artifact Digest: <span className="text-cyan-300">{ev.artifactHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </Modal>
  );
}
