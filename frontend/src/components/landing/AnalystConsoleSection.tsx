import { useState } from 'react';
import {
  BarChart3,
  Search,
  ShieldAlert,
  Globe,
  FileCheck2,
  Radio,
  Database,
} from 'lucide-react';
import { StatCard } from '../dashboard/StatCard.tsx';
import { ThreatDistributionChart } from '../dashboard/ThreatDistributionChart.tsx';
import { InvestigationActivityChart } from '../dashboard/InvestigationActivityChart.tsx';
import { ThreatCategoryChart } from '../dashboard/ThreatCategoryChart.tsx';
import { RecentInvestigationsTable } from '../dashboard/RecentInvestigationsTable.tsx';
import { ThreatActivityPanel } from '../dashboard/ThreatActivityPanel.tsx';
import { ForensicReportModal } from '../dashboard/ForensicReportModal.tsx';
import { mockStatMetrics, mockInvestigations } from '../../utils/dashboardMockData.ts';
import type { InvestigationRecord } from '../../types/dashboard.ts';

interface AnalystConsoleSectionProps {
  onInvestigateUrl?: (url: string) => void;
}

export function AnalystConsoleSection({ onInvestigateUrl }: AnalystConsoleSectionProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'overview' | 'iocs' | 'records'>('overview');
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

  const handleDeepScanDomain = (domainUrl: string) => {
    if (onInvestigateUrl) {
      onInvestigateUrl(domainUrl);
    }
  };

  return (
    <section id="analyst-console" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] border border-[#A95636]/20 dark:border-[#C47A52]/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SECURITY OPERATIONS CENTER • REAL-TIME THREAT RADAR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            Analyst Intelligence Console
          </h2>
          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl font-sans">
            Correlated multi-vector telemetry, real-time threat activity feeds, and cryptographic audit dossiers for defensive cybersecurity teams.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] self-start md:self-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveConsoleTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
              activeConsoleTab === 'overview'
                ? 'bg-white dark:bg-[#293A3C] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144]'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry & Charts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveConsoleTab('iocs')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
              activeConsoleTab === 'iocs'
                ? 'bg-white dark:bg-[#293A3C] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144]'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#B64B46] dark:text-[#E17B70]" />
            <span>Live Threat IOCs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveConsoleTab('records')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
              activeConsoleTab === 'records'
                ? 'bg-white dark:bg-[#293A3C] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144]'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Incident Database</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStatMetrics.map((stat, idx) => (
          <StatCard key={stat.id} stat={stat} icon={statIcons[idx]} />
        ))}
      </div>

      {/* Tab 1: Telemetry Charts */}
      {activeConsoleTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InvestigationActivityChart />
            <ThreatDistributionChart />
          </div>
          <ThreatCategoryChart />
        </div>
      )}

      {/* Tab 2: Live IOC Activity Stream */}
      {activeConsoleTab === 'iocs' && (
        <div className="space-y-4">
          <ThreatActivityPanel onInvestigateDomain={handleDeepScanDomain} />
        </div>
      )}

      {/* Tab 3: Searchable Incident Database */}
      {activeConsoleTab === 'records' && (
        <div className="space-y-4">
          <RecentInvestigationsTable
            records={mockInvestigations}
            onViewReport={handleViewReport}
          />
        </div>
      )}

      {/* Forensic Report Modal */}
      <ForensicReportModal
        record={selectedRecord}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onMitigate={(rec) => alert(`Perimeter rule generated for ${rec.url}`)}
      />
    </section>
  );
}
