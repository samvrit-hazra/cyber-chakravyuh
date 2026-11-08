import { useState } from 'react';
import {
  Fingerprint,
  ArrowLeft,
  FileText,
  Search,
  Scale,
  Database,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';
import {
  INITIAL_ONCHAIN_RECORDS,
  CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
  fileReportDispute,
  validateThreatReport,
} from '../utils/blockchainRegistryEngine.ts';
import type { BlockchainReportRecord } from '../types/blockchainVerification.ts';
import {
  BlockchainRegistryBanner,
  ReportSubmissionCard,
  ReportVerificationProver,
  OnChainRegistryTable,
  ReportDetailModal,
  DisputeTrackerPanel,
} from '../components/blockchain/index.ts';

export function ThreatIntelPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  // Active Tab: 'submit' | 'prover' | 'ledger' | 'disputes'
  const [activeTab, setActiveTab] = useState<'submit' | 'prover' | 'ledger' | 'disputes'>('submit');

  // Decentralized Ledger State
  const [records, setRecords] = useState<BlockchainReportRecord[]>(INITIAL_ONCHAIN_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainReportRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New report registered
  const handleReportRegistered = (newRecord: BlockchainReportRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  // Open dossier modal
  const handleOpenDetails = (record: BlockchainReportRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  // File dispute
  const handleFileDispute = (reportId: string, challengerDid: string, reason: string, evidenceUri?: string) => {
    setRecords((prev) => fileReportDispute(prev, reportId, challengerDid, reason, evidenceUri));
    if (selectedRecord && selectedRecord.reportId === reportId) {
      const updated = records.find((r) => r.reportId === reportId);
      if (updated) setSelectedRecord(updated);
    }
  };

  // Validate report
  const handleValidateReport = (reportId: string, validatorDid: string) => {
    setRecords((prev) => validateThreatReport(prev, reportId, validatorDid));
    if (selectedRecord && selectedRecord.reportId === reportId) {
      const updated = records.find((r) => r.reportId === reportId);
      if (updated) setSelectedRecord(updated);
    }
  };

  const totalDisputes = records.reduce((acc, r) => acc + (r.disputes?.length || 0), 0);
  const validatedCount = records.filter((r) => r.verificationStatus === 'Validated' || r.verificationStatus === 'Verified On-Chain').length;

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Decentralized Threat Intelligence Workspace */}
      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Tools</span>
          </button>

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#356D68] dark:text-[#79A99C] font-bold">
            Module 6 • Decentralized Threat Intelligence
          </span>
        </div>

        {/* Minimal Header */}
        <div className="space-y-1.5 text-left border-b border-[#D9DED7] dark:border-[#304144] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight flex items-center gap-2.5">
            <Fingerprint className="w-7 h-7 text-[#356D68] dark:text-[#79A99C]" />
            <span>Decentralized Threat Intelligence</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            Transparent, tamper-evident sharing and verification of security intelligence anchored to Ethereum blockchain commitments. Submit indicators, verify integrity, audit provenance, and track revisions with zero on-chain PII.
          </p>
        </div>

        {/* Web3 Ledger Telemetry Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">On-Chain Commitments</span>
            <div className="text-2xl font-extrabold font-mono text-[#356D68] dark:text-[#79A99C]">
              {records.length} Reports
            </div>
            <p className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono">
              {validatedCount} Consensus Validated
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Smart Contract</span>
            <div className="text-sm font-extrabold font-mono text-[#182629] dark:text-[#E8E6DC] truncate" title={CHAKRAVYUHA_SMART_CONTRACT_ADDRESS}>
              {CHAKRAVYUHA_SMART_CONTRACT_ADDRESS.slice(0, 10)}...{CHAKRAVYUHA_SMART_CONTRACT_ADDRESS.slice(-6)}
            </div>
            <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono">
              Sepolia Testnet (EVM)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Peer Disputes</span>
            <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {totalDisputes} Recorded
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 font-mono">
              Open Community Audit
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Data Privacy</span>
            <div className="text-2xl font-extrabold font-mono text-[#36745F] dark:text-[#79B69A]">
              Zero PII
            </div>
            <p className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono">
              Off-Chain Secrets Only
            </p>
          </div>
        </div>

        {/* Privacy & Off-Chain Data Notice (Mandated by Problem Statement Module 6) */}
        <BlockchainRegistryBanner />

        {/* 4 Interactive Tab Selectors */}
        <div className="flex border-b border-[#D9DED7] dark:border-[#304144] gap-2 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'submit'
                ? 'border-[#356D68] dark:border-[#79A99C] text-[#356D68] dark:text-[#79A99C]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Submit Threat Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prover')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'prover'
                ? 'border-[#356D68] dark:border-[#79A99C] text-[#356D68] dark:text-[#79A99C]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>2. Integrity Prover</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'border-[#356D68] dark:border-[#79A99C] text-[#356D68] dark:text-[#79A99C]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>3. Verifiable Ledger ({records.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disputes')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'disputes'
                ? 'border-[#356D68] dark:border-[#79A99C] text-[#356D68] dark:text-[#79A99C]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>4. Revisions & Disputes ({totalDisputes})</span>
          </button>
        </div>

        {/* Tab 1: Submit Threat Report */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            <ReportSubmissionCard onReportRegistered={handleReportRegistered} />
          </div>
        )}

        {/* Tab 2: Independent Integrity Prover */}
        {activeTab === 'prover' && (
          <div className="space-y-6">
            <ReportVerificationProver
              records={records}
              onViewRecordDetails={handleOpenDetails}
            />
          </div>
        )}

        {/* Tab 3: Verifiable On-Chain Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <OnChainRegistryTable
              records={records}
              onViewDetails={handleOpenDetails}
            />
          </div>
        )}

        {/* Tab 4: Revisions & Disputes Tracker */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <DisputeTrackerPanel
              records={records}
              onFileDispute={handleFileDispute}
              onValidateReport={handleValidateReport}
              onViewDetails={handleOpenDetails}
            />
          </div>
        )}

        {/* Comprehensive Report Dossier Modal */}
        <ReportDetailModal
          record={selectedRecord}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onFileDispute={handleFileDispute}
        />
      </main>

      {/* History Slide-over */}
      <ScanHistoryView
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        onSelectScan={(url) => navigateTo('url-analyzer', url)}
      />
    </div>
  );
}
