import { useState } from 'react';
import { Search, CheckCircle2, AlertOctagon, HelpCircle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { verifyReportOnChain } from '../../utils/blockchainRegistryEngine.ts';
import type { BlockchainReportRecord, VerificationStatus } from '../../types/blockchainVerification.ts';

interface ReportVerificationProverProps {
  records: BlockchainReportRecord[];
  onViewRecordDetails: (record: BlockchainReportRecord) => void;
  initialQuery?: string;
}

export function ReportVerificationProver({
  records,
  onViewRecordDetails,
  initialQuery = '0x8f49b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840192',
}: ReportVerificationProverProps) {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [proverResult, setProverResult] = useState<{
    status: VerificationStatus;
    matchedRecord: BlockchainReportRecord | null;
    computedFingerprint: string;
  } | null>(() => verifyReportOnChain(initialQuery, records));

  const handleVerify = () => {
    const res = verifyReportOnChain(queryInput, records);
    setProverResult(res);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified On-Chain':
        return {
          pill: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          icon: CheckCircle2,
          text: '100% UNTAMPERED AUTHENTIC LEDGER RECORD',
        };
      case 'Tamper Detected':
        return {
          pill: 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse',
          icon: AlertOctagon,
          text: 'TAMPER DETECTED: FINGERPRINT DOES NOT MATCH ON-CHAIN COMMITMENT',
        };
      case 'Pending Attestation':
        return {
          pill: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          icon: Shield,
          text: 'PENDING BLOCKCHAIN ATTESTATION',
        };
      case 'Unregistered':
      default:
        return {
          pill: 'bg-slate-500/20 border-slate-500/40 text-slate-300',
          icon: HelpCircle,
          text: 'NO CRYPTOGRAPHIC ATTESTATION FOUND ON LEDGER',
        };
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
            STEP 2 • CRYPTOGRAPHIC INTEGRITY PROVER
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Verify Report Integrity Against Blockchain Registry</span>
          </h3>
        </div>
      </div>

      {/* Prover Input */}
      <div className="space-y-2">
        <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px]">
          Enter Report Fingerprint (Hash), Transaction Hash, Report ID, or Raw JSON Payload:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="0x8f49b1a20c384df9e... or REP-941029..."
            className="flex-1 p-3 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] font-mono text-xs outline-none focus:border-[#A95636] dark:focus:border-[#C47A52]"
          />
          <Button
            variant="primary"
            onClick={handleVerify}
            leftIcon={<Search className="w-4 h-4" />}
            className="px-6 font-bold uppercase text-xs"
          >
            PROVE INTEGRITY
          </Button>
        </div>
      </div>

      {/* Prover Result Box */}
      {proverResult && (
        <div className="space-y-4 pt-1">
          {(() => {
            const meta = getStatusBadge(proverResult.status);
            const Icon = meta.icon;

            return (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  proverResult.status === 'Verified On-Chain'
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30'
                    : proverResult.status === 'Tamper Detected'
                    ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/40'
                    : 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">{meta.text}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${meta.pill}`}>
                    {proverResult.status}
                  </span>
                </div>

                {/* If Verified, show detailed metrics */}
                {proverResult.matchedRecord && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 text-[11px]">
                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">REPORT ID</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{proverResult.matchedRecord.reportId}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">BLOCK NUMBER</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">#{proverResult.matchedRecord.blockNumber}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">TIMESTAMP</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC]">{proverResult.matchedRecord.registrationTimestamp}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">CONFIRMATIONS</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {proverResult.matchedRecord.integrityVerdict.blockConfirmations} Blocks
                      </span>
                    </div>
                  </div>
                )}

                {proverResult.matchedRecord && (
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRecordDetails(proverResult.matchedRecord!)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="font-mono text-xs border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52] hover:bg-[#A95636]/10"
                    >
                      View Comprehensive Report Dossier
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

