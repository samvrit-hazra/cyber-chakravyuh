import { useState } from 'react';
import { Fingerprint } from 'lucide-react';
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

interface BlockchainVerificationTabProps {
  initialVerificationHash?: string;
}

export function BlockchainVerificationTab({ initialVerificationHash }: BlockchainVerificationTabProps) {
  const [records, setRecords] = useState<BlockchainReportRecord[]>(INITIAL_ONCHAIN_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainReportRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleReportRegistered = (newRecord: BlockchainReportRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleOpenDetails = (record: BlockchainReportRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Module B Header */}
      <Card variant="glass" className="p-6 border-cyan-500/30 bg-[#070d1e]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              DECENTRALIZED THREAT REGISTRY & WEB3 VERIFICATION (MODULE B)
            </h3>
            <p className="text-xs text-slate-400">
              Cryptographic report attestation, immutable revision history, zero-knowledge privacy commitments & Merkle proof auditing.
            </p>
          </div>
          <Badge variant="cyan" size="sm">
            LAYER 6: DATA VAULT ACTIVE
          </Badge>
        </div>
      </Card>

      {/* Mandatory Blockchain Zero-Trust Disclaimers */}
      <BlockchainRegistryBanner />

      {/* Step 1: Report Submission Interface */}
      <ReportSubmissionCard onReportRegistered={handleReportRegistered} />

      {/* Step 2: Cryptographic Report Integrity Prover */}
      <ReportVerificationProver
        records={records}
        onViewRecordDetails={handleOpenDetails}
        initialQuery={initialVerificationHash}
      />

      {/* On-Chain Immutable Threat Ledger Table */}
      <OnChainRegistryTable records={records} onViewDetails={handleOpenDetails} />

      {/* Comprehensive Report Detail Modal */}
      <ReportDetailModal
        record={selectedRecord}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
