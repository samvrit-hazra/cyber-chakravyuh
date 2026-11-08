import { useState } from 'react';
import { Search, CheckCircle2, AlertOctagon, HelpCircle, Shield, ArrowRight, ShieldAlert } from 'lucide-react';
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

  const handleVerify = (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : queryInput;
    const res = verifyReportOnChain(q, records);
    setProverResult(res);
  };

  const handleLoadSample = (sampleType: 'authentic' | 'tampered' | 'unregistered') => {
    let sample = '';
    if (sampleType === 'authentic') {
      sample = '0x8f49b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840192';
    } else if (sampleType === 'tampered') {
      // Intentionally altered payload that specifies report REP-941029 with different text
      sample = '{"reportId":"REP-941029","targetSubject":"paypal-security.fake.com","forged":true}';
    } else {
      sample = '0x9999999999999999999999999999999999999999999999999999999999999999';
    }
    setQueryInput(sample);
    handleVerify(sample);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Validated':
      case 'Verified On-Chain':
        return {
          pill: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-300',
          icon: CheckCircle2,
          text: '100% UNTAMPERED AUTHENTIC LEDGER RECORD',
        };
      case 'Tamper Detected':
        return {
          pill: 'bg-rose-500/20 border-rose-500/40 text-rose-800 dark:text-rose-300 animate-pulse',
          icon: AlertOctagon,
          text: 'TAMPER DETECTED: FINGERPRINT DOES NOT MATCH ON-CHAIN COMMITMENT',
        };
      case 'Disputed':
        return {
          pill: 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300',
          icon: ShieldAlert,
          text: 'REPORT COMMITTED BUT CURRENTLY DISPUTED BY PEER AUDITOR',
        };
      case 'Pending Attestation':
      case 'Pending Audit':
        return {
          pill: 'bg-sky-500/20 border-sky-500/40 text-sky-800 dark:text-sky-300',
          icon: Shield,
          text: 'PENDING BLOCKCHAIN ATTESTATION CONVERGENCE',
        };
      case 'Unregistered':
      default:
        return {
          pill: 'bg-slate-500/20 border-slate-500/40 text-slate-800 dark:text-slate-300',
          icon: HelpCircle,
          text: 'NO CRYPTOGRAPHIC ATTESTATION FOUND ON LEDGER',
        };
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            MODULE 6 • INDEPENDENT INTEGRITY PROVER
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Shield className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Independently Check Threat Report Integrity</span>
          </h3>
        </div>

        {/* Quick Sample Test Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-semibold uppercase mr-1">
            Test Case:
          </span>
          <button
            type="button"
            onClick={() => handleLoadSample('authentic')}
            className="px-2 py-1 rounded bg-[#EAECE6] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] hover:border-[#356D68] border border-[#D9DED7] dark:border-[#304144] text-[10px] cursor-pointer"
          >
            Valid Hash
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('tampered')}
            className="px-2 py-1 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:border-rose-500 text-[10px] cursor-pointer font-bold"
          >
            Tampered Report
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('unregistered')}
            className="px-2 py-1 rounded bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144] text-[10px] cursor-pointer"
          >
            Unregistered
          </button>
        </div>
      </div>

      {/* Prover Input */}
      <div className="space-y-2">
        <label className="text-[#647477] dark:text-[#A6B3AE] block uppercase font-bold text-[11px]">
          Input Report Hash, Tx Hash, Report ID, or Raw Report Payload:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="0x8f49b1a20c384df9e... or REP-941029 or JSON payload"
            className="flex-1 p-3 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] font-mono text-xs outline-none focus:border-[#A95636] dark:focus:border-[#C47A52]"
          />
          <Button
            variant="primary"
            onClick={() => handleVerify()}
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
                  proverResult.status === 'Verified On-Chain' || proverResult.status === 'Validated'
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30'
                    : proverResult.status === 'Tamper Detected'
                    ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/40'
                    : proverResult.status === 'Disputed'
                    ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-500/10 dark:bg-slate-950/20 border-slate-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 shrink-0" />
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
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">REPORT ID</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{proverResult.matchedRecord.reportId}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">TARGET INDICATOR</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC] font-bold font-mono">{proverResult.matchedRecord.targetSubject}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">BLOCK CONFIRMATIONS</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {proverResult.matchedRecord.integrityVerdict.blockConfirmations} Confirmations
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                      <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px] uppercase font-bold">PROVENANCE</span>
                      <span className="text-[#182629] dark:text-[#E8E6DC] font-bold truncate block">
                        {proverResult.matchedRecord.submitterAddress.slice(0, 12)}...
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
