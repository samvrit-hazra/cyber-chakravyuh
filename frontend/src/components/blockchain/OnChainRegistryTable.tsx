import { Eye, CheckCircle2 } from 'lucide-react';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';

interface OnChainRegistryTableProps {
  records: BlockchainReportRecord[];
  onViewDetails: (record: BlockchainReportRecord) => void;
}

export function OnChainRegistryTable({ records, onViewDetails }: OnChainRegistryTableProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            IMMUTABLE PUBLIC REGISTRY
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <span>Decentralized Threat Report Ledger</span>
            <span className="text-xs text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({records.length} Committed Records)
            </span>
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#D9DED7] dark:border-[#304144]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] text-[11px] border-b border-[#D9DED7] dark:border-[#304144]">
              <th className="py-2.5 px-3 font-semibold">REPORT ID & TITLE</th>
              <th className="py-2.5 px-3 font-semibold">TARGET SUBJECT</th>
              <th className="py-2.5 px-3 font-semibold">CRYPTOGRAPHIC FINGERPRINT</th>
              <th className="py-2.5 px-3 font-semibold">BLOCK & TX</th>
              <th className="py-2.5 px-3 font-semibold">STATUS</th>
              <th className="py-2.5 px-3 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DED7] dark:divide-[#304144] bg-white dark:bg-[#19272A]">
            {records.map((rec) => (
              <tr key={rec.reportId} className="hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/40 transition-colors">
                <td className="py-3 px-3">
                  <span className="text-[#A95636] dark:text-[#C47A52] font-bold block">{rec.reportId}</span>
                  <span className="text-[#182629] dark:text-[#E8E6DC] text-xs truncate max-w-[200px] block" title={rec.reportTitle}>
                    {rec.reportTitle}
                  </span>
                </td>
                <td className="py-3 px-3 text-[#182629] dark:text-[#E8E6DC] font-bold">
                  {rec.targetSubject}
                </td>
                <td className="py-3 px-3">
                  <span className="text-[#356D68] dark:text-[#79A99C] font-mono text-[11px] truncate max-w-[150px] block" title={rec.reportFingerprint}>
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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    {rec.verificationStatus}
                  </span>
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
