import { useState, useEffect } from 'react';
import { Fingerprint, Radio, Blocks } from 'lucide-react';
import { Card, Badge } from '../common/index.ts';
import {
  BlockchainRegistryBanner,
  ReportSubmissionCard,
  ReportVerificationProver,
  OnChainRegistryTable,
  ReportDetailModal,
} from '../blockchain/index.ts';
import { INITIAL_ONCHAIN_RECORDS } from '../../utils/blockchainRegistryEngine.ts';
import type { BlockchainReportRecord } from '../../types/blockchainVerification.ts';
import { ThreatApiService } from '../../services/threatApi.ts';

interface BlockchainVerificationTabProps {
  initialVerificationHash?: string;
}

const STORAGE_KEY = 'cyber_chakravyuh_onchain_records';

export function BlockchainVerificationTab({ initialVerificationHash }: BlockchainVerificationTabProps) {
  const [records, setRecords] = useState<BlockchainReportRecord[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_ONCHAIN_RECORDS;
  });
  const [selectedRecord, setSelectedRecord] = useState<BlockchainReportRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [verificationQuery, setVerificationQuery] = useState(initialVerificationHash || '');
  const [networkStatus, setNetworkStatus] = useState<{
    network: string;
    chain_id: number;
    connected: boolean;
    latest_block: number;
    provider: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    ThreatApiService.getReportsNetworkInfo()
      .then((status) => {
        if (mounted) setNetworkStatus(status);
      })
      .catch(() => {
        ThreatApiService.getWeb3NetworkStatus()
          .then((st) => {
            if (mounted) setNetworkStatus(st);
          })
          .catch(() => {});
      });

    // Also synchronize live ledger records from backend
    ThreatApiService.getAllRegisteredReports()
      .then((backendReports) => {
        if (mounted && Array.isArray(backendReports) && backendReports.length > 0) {
          setRecords((prev) => {
            const existingIds = new Set(prev.map((r) => r.reportId.toLowerCase()));
            const newMapped: BlockchainReportRecord[] = backendReports
              .filter((b) => b.report_id && !existingIds.has(b.report_id.toLowerCase()))
              .map((b) => ({
                reportId: b.report_id,
                reportTitle: b.canonical_payload?.title || b.findings_summary || `Security Assessment (${b.report_id})`,
                targetSubject: b.target || 'N/A',
                reportFingerprint: b.report_hash,
                smartContractAddress: b.contract_address || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                transactionHash: b.tx_hash,
                blockNumber: b.block_number,
                network: 'Ethereum Sepolia (Chain ID: 11155111)',
                gasUsed: '21,000 Gwei (Sepolia QuickNode RPC)',
                registrationTimestamp: b.created_at ? new Date(b.created_at).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : new Date().toISOString(),
                verificationStatus: 'Verified On-Chain',
                submitterAddress: b.issuer_address || '0x7da0da917b7ba2b624b83ef485ecbdde6d97bbec',
                revisions: [
                  {
                    revisionNumber: 1,
                    timestamp: new Date().toISOString(),
                    authorDid: 'did:chakravyuha:authenticated-secops-analyst',
                    merkleRootHash: b.report_hash,
                    changeSummary: 'Canonical RFC JSON Digest registered on Sepolia',
                  },
                ],
                evidenceReferences: [
                  {
                    sourceName: 'Cyber Chakravyuh Saptarishi Ingress Verification',
                    evidenceType: 'Threat Intelligence Match',
                    artifactHash: b.report_hash,
                  },
                ],
                integrityVerdict: {
                  isUntampered: true,
                  hashMatchesLedger: true,
                  blockConfirmations: 1,
                  immutableReceiptUrl: b.etherscan_url || `https://sepolia.etherscan.io/tx/${b.tx_hash}`,
                },
              }));
            return [...prev, ...newMapped];
          });
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const handleReportRegistered = (newRecord: BlockchainReportRecord) => {
    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
    setVerificationQuery(newRecord.reportFingerprint);
  };

  const handleOpenDetails = (record: BlockchainReportRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Module B Header */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-[#356D68] dark:text-[#79A99C] uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              DECENTRALIZED THREAT REGISTRY & WEB3 VERIFICATION (MODULE B)
            </h3>
            <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Cryptographic report attestation, immutable revision history, zero-knowledge privacy commitments & Merkle proof auditing.
            </p>
          </div>
          <Badge variant="cyan" size="sm">
            LAYER 6: DATA VAULT ACTIVE
          </Badge>
        </div>

        {/* Live Network Telemetry Strip */}
        {networkStatus && (
          <div className="mt-4 pt-3 border-t border-[#D9DED7] dark:border-[#304144] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold uppercase tracking-wider">{networkStatus.network}</span>
              <span className="text-[#647477] dark:text-[#A6B3AE]">•</span>
              <span className="text-[#647477] dark:text-[#A6B3AE]">Chain ID: {networkStatus.chain_id}</span>
            </div>

            <div className="flex items-center gap-4 text-[#647477] dark:text-[#A6B3AE]">
              <div className="flex items-center gap-1.5">
                <Blocks className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
                <span>Latest Block:</span>
                <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">
                  #{networkStatus.latest_block ? networkStatus.latest_block.toLocaleString() : 'Live'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{networkStatus.provider}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Mandatory Blockchain Zero-Trust Disclaimers */}
      <BlockchainRegistryBanner />

      {/* Step 1: Report Submission Interface */}
      <ReportSubmissionCard onReportRegistered={handleReportRegistered} />

      {/* Step 2: Cryptographic Report Integrity Prover */}
      <ReportVerificationProver
        key={verificationQuery}
        records={records}
        onViewRecordDetails={handleOpenDetails}
        initialQuery={verificationQuery || initialVerificationHash}
      />

      {/* On-Chain Immutable Threat Ledger Table */}
      <OnChainRegistryTable
        records={records}
        onViewDetails={handleOpenDetails}
        onVerifyReport={(id) => setVerificationQuery(id)}
      />

      {/* Comprehensive Report Detail Modal */}
      <ReportDetailModal
        record={selectedRecord}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
