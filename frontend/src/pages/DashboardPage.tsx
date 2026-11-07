import { useState } from 'react';
import {
  DashboardSidebar,
  type DashboardTabId,
} from '../components/dashboard/DashboardSidebar.tsx';
import { DashboardTopNav } from '../components/dashboard/DashboardTopNav.tsx';
import { OverviewTab } from '../components/dashboard/OverviewTab.tsx';
import { UrlInvestigationTab } from '../components/dashboard/UrlInvestigationTab.tsx';
import { ScamDetectionTab } from '../components/dashboard/ScamDetectionTab.tsx';
import { TlsIntelligenceTab } from '../components/dashboard/TlsIntelligenceTab.tsx';
import { WebsiteSecurityTab } from '../components/dashboard/WebsiteSecurityTab.tsx';
import { ThreatIntelligenceTab } from '../components/dashboard/ThreatIntelligenceTab.tsx';
import { BlockchainVerificationTab } from '../components/dashboard/BlockchainVerificationTab.tsx';
import { InvestigationHistoryTab } from '../components/dashboard/InvestigationHistoryTab.tsx';
import { SettingsTab } from '../components/dashboard/SettingsTab.tsx';
import { ForensicReportModal } from '../components/dashboard/ForensicReportModal.tsx';
import { NetworkBackground, Modal, Button, Badge } from '../components/common/index.ts';
import { mockInvestigations } from '../utils/dashboardMockData.ts';
import type { InvestigationRecord } from '../types/dashboard.ts';

interface DashboardPageProps {
  onBackToLanding: () => void;
  onOpenDesignSystem?: () => void;
  initialTab?: DashboardTabId;
  initialUrl?: string;
}

export function DashboardPage({
  onBackToLanding,
  initialTab = 'overview',
  initialUrl,
}: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabId>(initialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected record for Forensic Report Modal
  const [selectedReportRecord, setSelectedReportRecord] = useState<InvestigationRecord | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Notifications Modal
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Target URL passed into URL Investigation tab
  const [targetInvestigationUrl, setTargetInvestigationUrl] = useState<string>(
    initialUrl || 'https://security-verify.paypal.account-update.phish-alert.net/login'
  );

  // Target Hash passed into Blockchain Verification tab
  const [targetVerificationHash, setTargetVerificationHash] = useState<string | undefined>(undefined);

  // Evaluator state mode toggle: 'ready' | 'loading' | 'empty' | 'error'
  const [stateMode, setStateMode] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');

  const handleViewReport = (record: InvestigationRecord) => {
    setSelectedReportRecord(record);
    setIsReportModalOpen(true);
  };

  const handleInvestigateDomain = (domain: string) => {
    setTargetInvestigationUrl(domain);
    setActiveTab('url-investigation');
  };

  const handleSelectReportHash = (hash: string) => {
    setTargetVerificationHash(hash);
    setActiveTab('blockchain-verification');
  };

  const handleMitigateThreat = (record: InvestigationRecord) => {
    alert(`Mitigation protocol executed for ${record.id}. Target URL ${record.url} sinkholed at Saptarishi gateway.`);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Subtle Cyber Network Constellation */}
      <NetworkBackground opacity={0.3} nodeCount={36} />

      {/* Top SOC Navigation Bar */}
      <DashboardTopNav
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onBackToLanding={onBackToLanding}
        unreadCount={mockInvestigations.filter((i) => i.status === 'active' || i.status === 'investigating').length}
      />

      <div className="flex-1 flex relative z-10 w-full">
        {/* SOC Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Operational Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Operational Status Bar & Evaluator State Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0b152d]/80 border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Active View:
              </span>
              <Badge variant="cyan" size="sm">
                {activeTab.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>

            {/* Evaluator State Controls */}
            {activeTab === 'overview' && (
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">State Tester:</span>
                {(['ready', 'loading', 'empty', 'error'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setStateMode(mode)}
                    className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                      stateMode === mode
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Tab View Rendering */}
          {activeTab === 'overview' && (
            <OverviewTab
              onViewReport={handleViewReport}
              onInvestigateDomain={handleInvestigateDomain}
              stateMode={stateMode}
              onRetry={() => setStateMode('ready')}
            />
          )}

          {activeTab === 'url-investigation' && (
            <UrlInvestigationTab initialUrl={targetInvestigationUrl} />
          )}

          {activeTab === 'scam-detection' && <ScamDetectionTab />}

          {activeTab === 'tls-intelligence' && <TlsIntelligenceTab />}

          {activeTab === 'website-security' && <WebsiteSecurityTab />}

          {activeTab === 'threat-intelligence' && (
            <ThreatIntelligenceTab
              onInvestigateDomain={handleInvestigateDomain}
              onSelectReportHash={handleSelectReportHash}
            />
          )}

          {activeTab === 'blockchain-verification' && (
            <BlockchainVerificationTab initialVerificationHash={targetVerificationHash} />
          )}

          {activeTab === 'investigation-history' && (
            <InvestigationHistoryTab
              onViewReport={handleViewReport}
              onNavigateToBlockchain={handleSelectReportHash}
            />
          )}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* Forensic Report Modal */}
      <ForensicReportModal
        record={selectedReportRecord}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onMitigate={handleMitigateThreat}
        onNavigateToBlockchain={handleSelectReportHash}
      />

      {/* Notifications Drawer / Modal */}
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="SecOps Real-Time Alert Stream"
        subtitle="Active perimeter investigations & threat alerts"
        size="md"
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsNotificationsOpen(false)}>
            Close Feed
          </Button>
        }
      >
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
          {mockInvestigations.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setIsNotificationsOpen(false);
                handleViewReport(item);
              }}
              className="p-3 rounded-lg bg-slate-900/80 border border-white/5 hover:border-cyan-500/40 transition-colors cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{item.id}</span>
                <Badge variant={item.riskLevel === 'critical' ? 'rose' : item.riskLevel === 'high' ? 'amber' : 'cyan'} size="sm">
                  {item.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-200 truncate font-mono">{item.url}</p>
              <p className="text-[11px] text-slate-400 truncate">{item.details}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

