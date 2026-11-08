import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  Upload,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../common/Button.tsx';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';
import { ThreatApiService } from '../../services/threatApi.ts';

interface ReportVerificationProverProps {
  records?: BlockchainReportRecord[];
  onViewRecordDetails: (record: BlockchainReportRecord) => void;
  initialQuery?: string;
}

interface AdvancedVerifyResult {
  verified: boolean;
  status: 'GENUINE' | 'TAMPERED' | 'UNREGISTERED' | 'INVALID_TRANSACTION';
  integrity: 'MATCH' | 'MISMATCH' | 'NOT_FOUND';
  network: string;
  chain_id: number;
  issuer_verified: boolean;
  blockchain_registered: boolean;
  report_id?: string;
  report_hash?: string;
  recalculated_hash?: string;
  tx_hash?: string;
  contract_address?: string;
  block_number?: number;
  timestamp?: string;
  target?: string;
  scan_type?: string;
  risk_score?: number;
  risk_level?: string;
  etherscan_url?: string;
  audit_details?: Record<string, any>;
}

export function ReportVerificationProver({
  onViewRecordDetails,
  initialQuery = '',
}: ReportVerificationProverProps) {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'upload'>('search');
  const [verifyResult, setVerifyResult] = useState<AdvancedVerifyResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setQueryInput(initialQuery.trim());
      executeVerify(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const executeVerify = async (queryStr: string, reportData?: Record<string, unknown>, reportId?: string) => {
    setIsVerifying(true);
    try {
      const res = await ThreatApiService.verifyReportOnChainAdvanced({
        query: queryStr,
        report_data: reportData,
        report_id: reportId,
      });
      setVerifyResult(res as AdvancedVerifyResult);
    } catch (err) {
      console.error('Verification error:', err);
      setVerifyResult({
        verified: false,
        status: 'UNREGISTERED',
        integrity: 'NOT_FOUND',
        network: 'Ethereum Sepolia',
        chain_id: 11155111,
        issuer_verified: false,
        blockchain_registered: false,
        recalculated_hash: queryStr,
        audit_details: { verdict: 'Network communication failure or unregistered record.' },
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearchVerify = () => {
    if (!queryInput.trim()) {
      setVerifyResult(null);
      return;
    }
    executeVerify(queryInput.trim());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        executeVerify('', json, json.report_id);
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid JSON report export.');
      }
    };
    reader.readAsText(file);
  };

  // Pre-fill a test genuine report
  const handleLoadSample = (type: 'genuine' | 'tampered') => {
    if (type === 'genuine') {
      const sampleQuery = 'CCR-2026-000001';
      setQueryInput(sampleQuery);
      executeVerify(sampleQuery);
    } else {
      // Simulate tampered uploaded report
      setUploadedFileName('tampered-security-report.json');
      executeVerify(
        '',
        {
          report_id: 'CCR-2026-000001',
          target: 'https://malicious-phish-bank.com',
          scan_type: 'url_analysis',
          findings_summary: 'Tampered summary claiming domain is safe!',
          risk_score: 5,
          risk_level: 'SAFE',
        },
        'CCR-2026-000001'
      );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
              STEP 2 • CRYPTOGRAPHIC INTEGRITY PROVER
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#356D68]/10 dark:bg-[#79A99C]/20 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/20">
              SEPOLIA ANCHOR
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-1">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span>Verify Report Integrity Against Blockchain Registry</span>
          </h3>
          <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] mt-0.5">
            Verify originality, detect tampering, and validate cryptographic evidence anchored to Ethereum Sepolia.
          </p>
        </div>

        {/* Tab switch: Direct Query vs Document Upload */}
        <div className="inline-flex rounded-lg p-1 bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-colors ${
              activeTab === 'search'
                ? 'bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] shadow-xs'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Direct Query
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-colors ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] shadow-xs'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Tamper Audit (Upload)
          </button>
        </div>
      </div>

      {/* Mode A: Direct Query by Report ID, SHA-256, or TX Hash */}
      {activeTab === 'search' && (
        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-widest text-[#647477] dark:text-[#A6B3AE] font-semibold block">
            QUERY REPORT FINGERPRINT / TX HASH / REPORT ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#647477] dark:text-[#A6B3AE]" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchVerify()}
                placeholder="Enter Report ID (CCR-2026-...), SHA-256 fingerprint, or Sepolia TX hash..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] placeholder:text-[#647477] dark:placeholder:text-[#A6B3AE] text-xs font-mono focus:outline-hidden focus:border-[#A95636] dark:focus:border-[#C47A52]"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleSearchVerify}
              disabled={isVerifying}
              className="whitespace-nowrap font-mono text-xs px-5"
            >
              {isVerifying ? 'Auditing Ledger...' : 'Verify Integrity'}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Accepts: Report ID • SHA-256 (64 hex) • Sepolia Transaction Hash (0x...)</span>
            <div className="flex items-center gap-2">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('genuine')}
                className="underline hover:text-[#356D68] dark:hover:text-[#79A99C]"
              >
                Sample Registered (CCR-2026-000001)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Document Upload & Tamper Detection */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-widest text-[#647477] dark:text-[#A6B3AE] font-semibold block">
            UPLOAD REPORT ARTIFACT FOR CRYPTOGRAPHIC RE-CALCULATION & AUDIT
          </label>
          <div className="relative border-2 border-dashed border-[#D9DED7] dark:border-[#304144] hover:border-[#356D68] dark:hover:border-[#79A99C] rounded-xl p-6 text-center transition-colors bg-[#F3F1E9]/50 dark:bg-[#101A1D]/50">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <Upload className="w-7 h-7 text-[#356D68] dark:text-[#79A99C]" />
              <p className="text-xs font-bold text-[#182629] dark:text-[#E8E6DC]">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Drop report JSON file here, or click to browse'}
              </p>
              <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                The system recomputes the canonical SHA-256 fingerprint in real-time and verifies against the Sepolia ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-[10px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Simulate Scenarios:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('tampered')}
              className="text-rose-600 dark:text-rose-400 font-bold underline hover:opacity-80"
            >
              Test Tampered Report Mismatch
            </button>
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {verifyResult && (
        <div className="space-y-4 pt-4 border-t border-[#D9DED7] dark:border-[#304144]">
          {/* Status Banner */}
          {verifyResult.status === 'GENUINE' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                    REPORT INTEGRITY VERIFIED • GENUINE
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 uppercase">
                  MATCH CONFIRMED
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 pl-7">
                Fingerprint matches registered on-chain record. Document has not been altered since registration.
              </p>
            </div>
          )}

          {verifyResult.status === 'TAMPERED' && (
            <div className="p-4 rounded-xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/40 space-y-2 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span className="font-bold text-sm text-rose-800 dark:text-rose-300">
                    CRITICAL TAMPER WARNING • TAMPERED REPORT
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-800 dark:text-rose-300 uppercase">
                  INTEGRITY MISMATCH
                </span>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 pl-7">
                The recalculated cryptographic fingerprint differs from the immutable fingerprint registered on Ethereum Sepolia. The contents of this document have been altered!
              </p>
            </div>
          )}

          {verifyResult.status === 'UNREGISTERED' && (
            <div className="p-4 rounded-xl bg-[#182629]/5 dark:bg-white/5 border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#647477] dark:text-[#A6B3AE]" />
                  <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">
                    NO CRYPTOGRAPHIC ATTESTATION FOUND ON LEDGER
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800 text-[#182629] dark:text-[#E8E6DC] uppercase">
                  UNREGISTERED
                </span>
              </div>
              <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] pl-7">
                No matching report fingerprint or transaction was found in the Ethereum Sepolia registry.
              </p>
            </div>
          )}

          {/* Audit Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            {verifyResult.report_id && (
              <div className="p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                <span className="text-[#647477] dark:text-[#A6B3AE] block uppercase text-[10px] font-bold">
                  REPORT ID
                </span>
                <span className="text-[#182629] dark:text-[#E8E6DC] font-bold text-xs">{verifyResult.report_id}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block uppercase text-[10px] font-bold">
                BLOCKCHAIN NETWORK
              </span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold text-xs">
                {verifyResult.network} (Chain ID: {verifyResult.chain_id || 11155111})
              </span>
            </div>

            {verifyResult.tx_hash && (
              <div className="p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#647477] dark:text-[#A6B3AE] block uppercase text-[10px] font-bold">
                    TRANSACTION HASH
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(verifyResult.tx_hash!)}
                      className="inline-flex items-center gap-1 text-[10px] text-[#356D68] dark:text-[#79A99C] hover:underline"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    {verifyResult.etherscan_url && (
                      <a
                        href={verifyResult.etherscan_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#356D68] dark:text-[#79A99C] hover:underline font-bold"
                      >
                        <span>Sepolia Etherscan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-[#182629] dark:text-[#E8E6DC] font-mono break-all block text-xs">
                  {verifyResult.tx_hash}
                </span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1 md:col-span-2">
              <span className="text-[#647477] dark:text-[#A6B3AE] block uppercase text-[10px] font-bold">
                REPORT FINGERPRINT (SHA-256 CANONICAL DIGEST)
              </span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-mono break-all block text-xs">
                {verifyResult.report_hash || verifyResult.recalculated_hash}
              </span>
            </div>

            {/* In case of Tampering, show side-by-side mismatch */}
            {verifyResult.status === 'TAMPERED' && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-2 md:col-span-2 text-rose-900 dark:text-rose-200">
                <span className="uppercase text-[10px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>CRYPTOGRAPHIC DIGEST MISMATCH BREAKDOWN</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="p-2 rounded bg-white/60 dark:bg-black/30 border border-rose-500/30">
                    <span className="text-rose-700 dark:text-rose-400 block font-bold">REGISTERED IMMUTABLE HASH:</span>
                    <span className="break-all">{verifyResult.report_hash}</span>
                  </div>
                  <div className="p-2 rounded bg-white/60 dark:bg-black/30 border border-rose-500/30">
                    <span className="text-rose-700 dark:text-rose-400 block font-bold">RECALCULATED UPLOAD HASH:</span>
                    <span className="break-all">{verifyResult.recalculated_hash}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification Checklist */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] font-bold block">
              CRYPTOGRAPHIC ATTESTATION AUDIT CHECKLIST
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                {verifyResult.blockchain_registered ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-[#647477] shrink-0" />
                )}
                <div className="text-[11px]">
                  <span className="text-[#647477] dark:text-[#A6B3AE] block text-[9px]">BLOCKCHAIN REGISTRATION</span>
                  <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">
                    {verifyResult.blockchain_registered ? 'Confirmed' : 'Unconfirmed'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {verifyResult.integrity === 'MATCH' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : verifyResult.integrity === 'MISMATCH' ? (
                  <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-[#647477] shrink-0" />
                )}
                <div className="text-[11px]">
                  <span className="text-[#647477] dark:text-[#A6B3AE] block text-[9px]">REPORT INTEGRITY</span>
                  <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">{verifyResult.integrity}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {verifyResult.issuer_verified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-[#647477] shrink-0" />
                )}
                <div className="text-[11px]">
                  <span className="text-[#647477] dark:text-[#A6B3AE] block text-[9px]">ISSUER AUTHENTICITY</span>
                  <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">
                    {verifyResult.issuer_verified ? 'Trusted Issuer' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {verifyResult.status === 'GENUINE' && (
            <div className="flex justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onViewRecordDetails({
                    reportId: verifyResult.report_id || 'CCR-RECORD',
                    reportTitle: verifyResult.audit_details?.verdict || 'Genuine Report Attestation',
                    targetSubject: verifyResult.target || 'N/A',
                    reportFingerprint: verifyResult.report_hash || verifyResult.recalculated_hash || '',
                    smartContractAddress: verifyResult.contract_address || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    transactionHash: verifyResult.tx_hash || '0x...',
                    blockNumber: verifyResult.block_number || 12092175,
                    network: verifyResult.network,
                    gasUsed: '21,000 Gwei (Sepolia QuickNode RPC)',
                    registrationTimestamp: verifyResult.timestamp || new Date().toISOString(),
                    verificationStatus: 'Verified On-Chain',
                    submitterAddress: '0x7da0da917b7ba2b624b83ef485ecbdde6d97bbec',
                    revisions: [],
                    evidenceReferences: [],
                    integrityVerdict: {
                      isUntampered: true,
                      hashMatchesLedger: true,
                      blockConfirmations: 1,
                      immutableReceiptUrl: verifyResult.etherscan_url || `https://sepolia.etherscan.io/tx/${verifyResult.tx_hash}`,
                    },
                  });
                }}
                className="font-mono text-xs border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C] hover:bg-[#356D68]/10"
              >
                View Cryptographic Dossier
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
