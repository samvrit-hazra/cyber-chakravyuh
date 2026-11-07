import { Eye, CheckCircle2 } from 'lucide-react';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';

interface OnChainRegistryTableProps {
  records: BlockchainReportRecord[];
  onViewDetails: (record: BlockchainReportRecord) => void;
}

export function OnChainRegistryTable({ records, onViewDetails }: OnChainRegistryTableProps) {
  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            IMMUTABLE PUBLIC REGISTRY
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <span>Decentralized Threat Report Ledger</span>
            <span className="text-xs text-slate-400 font-normal">
              ({records.length} Committed Records)
            </span>
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-[11px]">
              <th className="py-2.5 px-3 font-semibold">REPORT ID & TITLE</th>
              <th className="py-2.5 px-3 font-semibold">TARGET SUBJECT</th>
              <th className="py-2.5 px-3 font-semibold">CRYPTOGRAPHIC FINGERPRINT</th>
              <th className="py-2.5 px-3 font-semibold">BLOCK & TX</th>
              <th className="py-2.5 px-3 font-semibold">STATUS</th>
              <th className="py-2.5 px-3 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map((rec) => (
              <tr key={rec.reportId} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3">
                  <span className="text-cyan-400 font-bold block">{rec.reportId}</span>
                  <span className="text-slate-200 text-xs truncate max-w-[200px] block" title={rec.reportTitle}>
                    {rec.reportTitle}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-300 font-bold">
                  {rec.targetSubject}
                </td>
                <td className="py-3 px-3">
                  <span className="text-purple-300 font-mono text-[11px] truncate max-w-[150px] block" title={rec.reportFingerprint}>
                    {rec.reportFingerprint.slice(0, 10)}...{rec.reportFingerprint.slice(-8)}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-200 font-bold block">#{rec.blockNumber}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[120px] block" title={rec.transactionHash}>
                    {rec.transactionHash.slice(0, 10)}...
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    {rec.verificationStatus}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(rec)}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
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
