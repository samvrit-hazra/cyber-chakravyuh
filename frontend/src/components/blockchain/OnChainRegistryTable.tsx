import { useState } from 'react';
import { Eye, CheckCircle2, AlertOctagon, Clock, ShieldAlert } from 'lucide-react';
import type { BlockchainReportRecord, VerificationStatus } from '../../types/blockchainVerification.ts';

interface OnChainRegistryTableProps {
  records: BlockchainReportRecord[];
  onViewDetails: (record: BlockchainReportRecord) => void;
}

export function OnChainRegistryTable({ records, onViewDetails }: OnChainRegistryTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRecords = records.filter((rec) => {
    if (filterStatus === 'all') return true;
    return rec.verificationStatus.toLowerCase().includes(filterStatus.toLowerCase());
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Validated':
      case 'Verified On-Chain':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 uppercase">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 uppercase">
            <ShieldAlert className="w-3 h-3" />
            Disputed
          </span>
        );
      case 'Tamper Detected':
      case 'Revoked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-500/30 uppercase">
            <AlertOctagon className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Pending Audit':
      case 'Pending Attestation':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-500/30 uppercase">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-5 shadow-xs font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            IMMUTABLE PROVENANCE LEDGER
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <span>Decentralized Threat Intelligence Registry</span>
            <span className="text-xs text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({records.length} Committed Records)
            </span>
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'validated', 'pending', 'disputed'].map((statusKey) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setFilterStatus(statusKey)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase cursor-pointer transition-colors ${
                filterStatus === statusKey
                  ? 'bg-[#182629] dark:bg-white text-white dark:text-[#182629]'
                  : 'bg-[#F3F1E9] dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
              }`}
            >
              {statusKey}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#D9DED7] dark:border-[#304144]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] text-[11px] border-b border-[#D9DED7] dark:border-[#304144]">
              <th className="py-2.5 px-3 font-semibold">REPORT ID & CAMPAIGN</th>
              <th className="py-2.5 px-3 font-semibold">TARGET INDICATOR</th>
              <th className="py-2.5 px-3 font-semibold">CRYPTOGRAPHIC COMMITMENT</th>
              <th className="py-2.5 px-3 font-semibold">BLOCK & TX</th>
              <th className="py-2.5 px-3 font-semibold">STATUS</th>
              <th className="py-2.5 px-3 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DED7] dark:divide-[#304144] bg-white dark:bg-[#19272A]">
            {filteredRecords.map((rec) => (
              <tr key={rec.reportId} className="hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/40 transition-colors">
                <td className="py-3 px-3">
                  <span className="text-[#A95636] dark:text-[#C47A52] font-bold block">{rec.reportId}</span>
                  <span className="text-[#182629] dark:text-[#E8E6DC] text-xs font-semibold truncate max-w-[220px] block" title={rec.campaignName || rec.reportTitle}>
                    {rec.campaignName || rec.reportTitle}
                  </span>
                  {rec.disputes && rec.disputes.length > 0 && (
                    <span className="inline-block mt-0.5 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-sans">
                      {rec.disputes.length} active dispute
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-bold block font-mono text-xs">
                    {rec.targetSubject}
                  </span>
                  {rec.supportingEvidenceUri && (
                    <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] truncate max-w-[180px] block font-mono">
                      Ref: {rec.supportingEvidenceUri.split('/').pop()}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span className="text-[#356D68] dark:text-[#79A99C] font-mono text-[11px] truncate max-w-[150px] block font-bold" title={rec.reportFingerprint}>
                    {rec.reportFingerprint.slice(0, 10)}...{rec.reportFingerprint.slice(-8)}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-bold block">#{rec.blockNumber}</span>
                  <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] truncate max-w-[120px] block" title={rec.transactionHash}>
                    {rec.transactionHash.slice(0, 10)}...
                  </span>
                </td>
                <td className="py-3 px-3">
                  {getStatusBadge(rec.verificationStatus)}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(rec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] hover:border-[#A95636] dark:hover:border-[#C47A52] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-[#A95636] dark:text-[#C47A52]" />
                    <span>View Dossier</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
