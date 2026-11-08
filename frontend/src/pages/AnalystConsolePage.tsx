import { useState } from 'react';
import {
  BarChart3,
  ShieldAlert,
  Search,
  Globe,
  FileCheck2,
  Terminal,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { StatCard } from '../components/dashboard/StatCard.tsx';
import { RecentInvestigationsTable } from '../components/dashboard/RecentInvestigationsTable.tsx';
import { InvestigationActivityChart } from '../components/dashboard/InvestigationActivityChart.tsx';
import { ForensicReportModal } from '../components/dashboard/ForensicReportModal.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { mockStatMetrics, mockInvestigations } from '../utils/dashboardMockData.ts';
import type { InvestigationRecord } from '../types/dashboard.ts';
import { useNavigation } from '../context/NavigationContext.tsx';

export function AnalystConsolePage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();
  const [selectedRecord, setSelectedRecord] = useState<InvestigationRecord | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const statIcons = [
    <Search key="search" className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />,
    <ShieldAlert key="alert" className="w-5 h-5 text-[#B64B46] dark:text-[#E17B70]" />,
    <Globe key="globe" className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />,
    <FileCheck2 key="check" className="w-5 h-5 text-[#36745F] dark:text-[#79B69A]" />,
  ];

  const handleViewReport = (record: InvestigationRecord) => {
    setSelectedRecord(record);
    setIsReportOpen(true);
  };

  const handleMitigateThreat = (record: InvestigationRecord) => {
    alert(`Perimeter sinkhole rule activated for host: ${record.url}. Threat ID ${record.id} updated.`);
  };

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main SOC Analyst Console Workspace */}
      <main className="flex-1 pt-20 sm:pt-22 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] border border-[#A95636]/20 dark:border-[#C47A52]/30">
              <Terminal className="w-3.5 h-3.5" />
              <span>SOC INCIDENT MANAGEMENT & FORENSIC ATTESTATIONS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
              SOC Analyst Console
            </h1>

            <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
              Operational incident response workstation for security engineers. Audit individual forensic dossiers, review cryptographic proofs, and dispatch perimeter containment rules.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] px-3.5 py-2 rounded-xl self-start md:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#36745F] dark:bg-[#79B69A] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#36745F] dark:bg-[#79B69A] -ml-4" />
            <span className="font-semibold text-[#182629] dark:text-[#E8E6DC]">CLASSIFICATION:</span>
            <span className="text-[#A87532] dark:text-[#D7AA61] font-bold">TLP:AMBER+STRICT</span>
          </div>
        </div>

        {/* 4 Core Operational KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStatMetrics.map((stat, idx) => (
            <StatCard key={stat.id} stat={stat} icon={statIcons[idx]} />
          ))}
        </div>

        {/* 24-Hour Telemetry Volume Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
              <span>Incident Investigation Velocity (24-Hour Telemetry)</span>
            </h2>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Automated SOC Heuristics Stream
            </span>
          </div>
          <InvestigationActivityChart />
        </div>

        {/* Comprehensive Incident Database & Filter Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm dark:shadow-2xl space-y-6">
          <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">
                Active Incident Registry & Audit Log
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Search, filter, and inspect verified investigation reports across all 7 defense rings
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('url-analyzer')}
              className="px-3.5 py-1.5 rounded-xl bg-[#A95636] hover:bg-[#8F472C] dark:bg-[#C47A52] dark:hover:bg-[#B06A44] text-white text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>+ New Investigation Target</span>
            </button>
          </div>

          <RecentInvestigationsTable
            records={mockInvestigations}
            onViewReport={handleViewReport}
          />
        </div>
      </main>

      {/* Forensic Report Modal */}
      <ForensicReportModal
        record={selectedRecord}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onMitigate={handleMitigateThreat}
        onNavigateToBlockchain={(hash) => alert(`Verified against Ethereum Merkle Root: ${hash}`)}
      />

      {/* History Slide-over */}
      <ScanHistoryView
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        onSelectScan={(url) => navigateTo('url-analyzer', url)}
      />

      <LandingFooter />
    </div>
  );
}
