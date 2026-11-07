import { Search, ShieldAlert, Globe, FileCheck2, AlertTriangle, RefreshCw } from 'lucide-react';
import { StatCard } from './StatCard.tsx';
import { ThreatDistributionChart } from './ThreatDistributionChart.tsx';
import { RiskClassificationChart } from './RiskClassificationChart.tsx';
import { InvestigationActivityChart } from './InvestigationActivityChart.tsx';
import { ThreatCategoryChart } from './ThreatCategoryChart.tsx';
import { InvestigationTimeline } from './InvestigationTimeline.tsx';
import { RecentInvestigationsTable } from './RecentInvestigationsTable.tsx';
import { ThreatActivityPanel } from './ThreatActivityPanel.tsx';
import { Button, Badge } from '../common/index.ts';
import { mockStatMetrics, mockInvestigations } from '../../utils/dashboardMockData.ts';
import type { InvestigationRecord } from '../../types/dashboard.ts';

interface OverviewTabProps {
  onViewReport: (record: InvestigationRecord) => void;
  onInvestigateDomain: (domain: string) => void;
  stateMode: 'ready' | 'loading' | 'empty' | 'error';
  onRetry: () => void;
}

export function OverviewTab({
  onViewReport,
  onInvestigateDomain,
  stateMode,
  onRetry,
}: OverviewTabProps) {
  const statIcons = [
    <Search key="search" className="w-5 h-5 text-cyan-400" />,
    <ShieldAlert key="alert" className="w-5 h-5 text-rose-400" />,
    <Globe key="globe" className="w-5 h-5 text-purple-400" />,
    <FileCheck2 key="check" className="w-5 h-5 text-emerald-400" />,
  ];

  if (stateMode === 'loading') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-800/40 border border-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-xl bg-slate-800/40 border border-white/5" />
          <div className="h-64 rounded-xl bg-slate-800/40 border border-white/5" />
        </div>
        <div className="h-96 rounded-xl bg-slate-800/40 border border-white/5" />
      </div>
    );
  }

  if (stateMode === 'error') {
    return (
      <div className="p-12 text-center rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl space-y-4 max-w-lg mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">SOC Telemetry Stream Interrupted</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Unable to establish synchronized mTLS handshake with the Saptarishi Invariant stream. Gateway buffer returned status 503.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="mx-auto"
        >
          Retry Telemetry Synchronization
        </Button>
      </div>
    );
  }

  if (stateMode === 'empty') {
    return (
      <div className="p-12 text-center rounded-2xl border border-cyan-500/20 bg-[#0b152d]/60 backdrop-blur-xl space-y-4 max-w-lg mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
          <Globe className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">No Telemetry Ingress Recorded</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          All 7 Chakravyuha rings are online, but no target URLs have been submitted for evaluation yet.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onInvestigateDomain('https://paypal.com')}
          className="mx-auto"
        >
          Submit First URL Target
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 4 Overview Stat Cards */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Telemetry Overview Indicators
          </h2>
          <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
            DEMO DATASET ACTIVE
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStatMetrics.map((stat, idx) => (
            <StatCard key={stat.id} stat={stat} icon={statIcons[idx]} />
          ))}
        </div>
      </section>

      {/* Row 1 Visualizations: Investigation Activity (24H) + Risk Classification Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <InvestigationActivityChart />
        </div>
        <div className="lg:col-span-5">
          <RiskClassificationChart />
        </div>
      </section>

      {/* Row 2 Visualizations: Threat Distribution (7 Layers) + Threat Category Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ThreatDistributionChart />
        </div>
        <div className="lg:col-span-6">
          <ThreatCategoryChart />
        </div>
      </section>

      {/* Row 3 Visualizations & Feeds: Recent Timeline + Threat Activity Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <InvestigationTimeline onSelectRecord={onViewReport} />
        </div>
        <div className="lg:col-span-6">
          <ThreatActivityPanel onInvestigateDomain={onInvestigateDomain} />
        </div>
      </section>

      {/* Recent Investigations Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              Recent Security Investigations Log
            </h3>
            <p className="text-xs text-slate-400">
              Complete searchable registry of evaluated URLs, risk grades, and cryptographic report attestations.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold hidden sm:inline-block">
            {mockInvestigations.length} Records Ingested
          </span>
        </div>

        <RecentInvestigationsTable
          records={mockInvestigations}
          onViewReport={onViewReport}
        />
      </section>
    </div>
  );
}
