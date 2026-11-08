import { useState } from 'react';
import { Scale, CheckCircle2, ShieldAlert, UserCheck, Plus } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';

interface DisputeTrackerPanelProps {
  records: BlockchainReportRecord[];
  onFileDispute: (reportId: string, challengerDid: string, reason: string, evidenceUri?: string) => void;
  onValidateReport: (reportId: string, validatorDid: string) => void;
  onViewDetails: (record: BlockchainReportRecord) => void;
}

export function DisputeTrackerPanel({
  records,
  onFileDispute,
  onValidateReport,
  onViewDetails,
}: DisputeTrackerPanelProps) {
  const [selectedReportId, setSelectedReportId] = useState<string>(records[0]?.reportId || '');
  const [challengerDid, setChallengerDid] = useState('did:key:analyst-node-04');
  const [disputeReason, setDisputeReason] = useState('');
  const [evidenceUri, setEvidenceUri] = useState('');
  const [isFiling, setIsFiling] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeDisputes = records.flatMap((rec) =>
    (rec.disputes || []).map((d) => ({
      ...d,
      reportId: rec.reportId,
      targetSubject: rec.targetSubject,
      campaignName: rec.campaignName,
    }))
  );

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId || !disputeReason.trim()) return;

    setIsFiling(true);
    setTimeout(() => {
      onFileDispute(selectedReportId, challengerDid, disputeReason, evidenceUri);
      setIsFiling(false);
      setDisputeReason('');
      setEvidenceUri('');
      setSuccessMessage(`Dispute successfully committed to smart contract for ${selectedReportId}`);
      setTimeout(() => setSuccessMessage(null), 3500);
    }, 700);
  };

  const handleValidate = (reportId: string) => {
    onValidateReport(reportId, 'did:chakravyuha:peer-consensus-node');
    setSuccessMessage(`Corroborating attestation consensus recorded for ${reportId}`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
            MODULE 6 • REVISIONS, DISPUTES & CONSENSUS
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Track Report Provenance, Disputes & Peer Validation</span>
          </h3>
        </div>

        <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] bg-[#F3F1E9] dark:bg-[#101A1D] px-2.5 py-1 rounded-lg border border-[#D9DED7] dark:border-[#304144]">
          Active Disputes: <strong className="text-amber-700 dark:text-amber-400">{activeDisputes.length}</strong>
        </span>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Two Column Layout: Dispute Filing Form & Active Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: File a Dispute / Challenge */}
        <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3.5">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>File a Dispute on Existing Intelligence</span>
          </h4>
          <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-sans">
            Challenge inaccurate claims, false positives, or outdated indicators. Your challenge and supporting evidence URI are permanently recorded on the report’s on-chain revision history.
          </p>

          <form onSubmit={handleSubmitDispute} className="space-y-3">
            <div>
              <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[10px] mb-1">
                Select Target Threat Report:
              </label>
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs font-mono outline-none"
              >
                {records.map((r) => (
                  <option key={r.reportId} value={r.reportId}>
                    {r.reportId} — {r.targetSubject} ({r.verificationStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[10px] mb-1">
                Challenger DID / Public Key:
              </label>
              <input
                type="text"
                value={challengerDid}
                onChange={(e) => setChallengerDid(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs font-mono outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[10px] mb-1">
                Dispute Reason / Factual Evidence:
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Explain the technical contradiction, verified CDN reverse proxy status, or false positive reason..."
                rows={2}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs font-mono resize-none outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[10px] mb-1">
                Supporting Evidence URI (IPFS / DNSSEC Proof):
              </label>
              <input
                type="text"
                placeholder="ipfs://bafybei... or https://dnssec-analyzer..."
                value={evidenceUri}
                onChange={(e) => setEvidenceUri(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs font-mono outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isFiling}
              className="w-full font-bold uppercase text-xs"
            >
              {isFiling ? 'RECORDING DISPUTE ON-CHAIN...' : 'SUBMIT DISPUTE ATTESTATION'}
            </Button>
          </form>
        </div>

        {/* Right: Active Disputes & Peer Validation Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Active Disputes Under Community Audit</span>
            </h4>
            <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">
              Multi-party Consensus
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {records.map((rec) => {
              const hasDisputes = rec.disputes && rec.disputes.length > 0;
              const isPending = rec.verificationStatus === 'Pending Audit' || rec.verificationStatus === 'Pending Attestation';

              return (
                <div
                  key={rec.reportId}
                  className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                    hasDisputes
                      ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30'
                      : isPending
                      ? 'bg-sky-500/10 dark:bg-sky-950/20 border-sky-500/30'
                      : 'bg-white dark:bg-[#19272A] border-[#D9DED7] dark:border-[#304144]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#A95636] dark:text-[#C47A52] font-bold block">{rec.reportId}</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC] font-bold text-xs">{rec.targetSubject}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        rec.verificationStatus === 'Disputed'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300'
                          : rec.verificationStatus === 'Validated'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-sky-500/20 border-sky-500/40 text-sky-800 dark:text-sky-300'
                      }`}
                    >
                      {rec.verificationStatus}
                    </span>
                  </div>

                  {rec.campaignName && (
                    <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-sans">
                      Campaign: <strong className="text-[#182629] dark:text-[#E8E6DC]">{rec.campaignName}</strong>
                    </p>
                  )}

                  {rec.disputes && rec.disputes.length > 0 && (
                    <div className="p-2.5 rounded bg-white dark:bg-[#101A1D] border border-amber-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase block">
                        Dispute by {rec.disputes[0].challengerDid.slice(0, 16)}...
                      </span>
                      <p className="text-[11px] text-[#182629] dark:text-[#E8E6DC] font-sans">
                        "{rec.disputes[0].reason}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-[#D9DED7]/60 dark:border-[#304144]/60">
                    <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">
                      {rec.revisions.length} on-chain revisions
                    </span>

                    <div className="flex items-center gap-1.5">
                      {rec.verificationStatus !== 'Validated' && (
                        <button
                          type="button"
                          onClick={() => handleValidate(rec.reportId)}
                          className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Corroborate</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onViewDetails(rec)}
                        className="px-2 py-1 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] text-[10px] cursor-pointer"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
