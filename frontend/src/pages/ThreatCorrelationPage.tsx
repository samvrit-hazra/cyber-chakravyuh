import { useState } from 'react';
import {
  Share2,
  ArrowLeft,
  Layers,
  Globe,
  Server,
  Fingerprint,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';
import {
  ThreatRelationshipGraph,
  CampaignsListSection,
  MaliciousDomainsSection,
  RepeatedIndicatorsSection,
  ImpersonationPatternsSection,
  ThreatReportHistorySection,
} from '../components/threatIntel/index.ts';

export function ThreatCorrelationPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  // Active view: 'all' | 'graph' | 'campaigns' | 'infrastructure' | 'impersonation'
  const [activeTab, setActiveTab] = useState<'graph' | 'campaigns' | 'infrastructure' | 'impersonation'>('graph');

  const handleDeepScanDomain = (domainUrl: string) => {
    navigateTo('url-analyzer', domainUrl);
  };

  const handleSelectReportHash = (hash: string) => {
    navigateTo('threat-registry', undefined, {
      title: 'Correlated Threat Attestation',
      targetSubject: hash,
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Threat Correlation Workspace */}
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

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A95636] dark:text-[#C47A52] font-bold">
            Module 4 • Intelligent Threat Correlation
          </span>
        </div>

        {/* Minimal Header */}
        <div className="space-y-1.5 text-left border-b border-[#D9DED7] dark:border-[#304144] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight flex items-center gap-2.5">
            <Share2 className="w-7 h-7 text-[#A95636] dark:text-[#C47A52]" />
            <span>Intelligent Threat Correlation</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            Correlate related indicators across submitted reports. Uncover shared bulletproof hosting infrastructure, repeated domain networks, recurring impersonation patterns, and trace multi-entity campaign relationship graphs.
          </p>
        </div>

        {/* Cross-Incident Telemetry Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Active Campaigns</span>
            <div className="text-2xl font-extrabold font-mono text-[#A95636] dark:text-[#C47A52]">
              3 Tracked
            </div>
            <p className="text-[11px] text-[#A95636] dark:text-[#C47A52] font-mono">
              PhantomHook, Hydra, Specter
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Repeated Infrastructure</span>
            <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              AS49505
            </div>
            <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono truncate" title="185.191.171.12">
              IP: 185.191.171.12 Colocated
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Correlated Domains</span>
            <div className="text-2xl font-extrabold font-mono text-[#356D68] dark:text-[#79A99C]">
              14 Hosts
            </div>
            <p className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono">
              Cross-linked across reports
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Graph Nexus Entities</span>
            <div className="text-2xl font-extrabold font-mono text-[#182629] dark:text-[#E8E6DC]">
              24 Nodes
            </div>
            <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono">
              Campaigns ↔ Hosts ↔ URLs
            </p>
          </div>
        </div>

        {/* AI Correlation Insight Banner */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52] shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <strong className="text-[#182629] dark:text-[#E8E6DC] font-heading block">
                Deterministic Cross-Report Correlation Active:
              </strong>
              <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed">
                Multiple user submissions targeting JPMorgan Chase and PayPal share identical bulletproof hosting IP <code>185.191.171.12</code> on ASN <code>AS49505</code>, confirming they belong to a coordinated <strong>Operation PhantomHook</strong> campaign cluster.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDeepScanDomain('chase-security-resolver.online')}
            className="px-3.5 py-1.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] text-[#182629] dark:text-[#E8E6DC] font-mono text-[11px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <span>Scan Cluster Host</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D9DED7] dark:border-[#304144] gap-2 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('graph')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'graph'
                ? 'border-[#A95636] dark:border-[#C47A52] text-[#A95636] dark:text-[#C47A52]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>1. Relationship Graph</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'campaigns'
                ? 'border-[#A95636] dark:border-[#C47A52] text-[#A95636] dark:text-[#C47A52]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Phishing Campaigns</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('infrastructure')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'infrastructure'
                ? 'border-[#A95636] dark:border-[#C47A52] text-[#A95636] dark:text-[#C47A52]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>3. Repeated Infrastructure (ASNs & IPs)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('impersonation')}
            className={`pb-3 px-3.5 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'impersonation'
                ? 'border-[#A95636] dark:border-[#C47A52] text-[#A95636] dark:text-[#C47A52]'
                : 'border-transparent text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>4. Recurring Impersonation Patterns</span>
          </button>
        </div>

        {/* Tab 1: Relationship Graph */}
        {activeTab === 'graph' && (
          <div className="space-y-6">
            <ThreatRelationshipGraph />
            <ThreatReportHistorySection onSelectReportHash={handleSelectReportHash} />
          </div>
        )}

        {/* Tab 2: Active Phishing Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <CampaignsListSection />
            <MaliciousDomainsSection onInvestigateDomain={handleDeepScanDomain} />
          </div>
        )}

        {/* Tab 3: Repeated Infrastructure */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-6">
            <RepeatedIndicatorsSection />
            <MaliciousDomainsSection onInvestigateDomain={handleDeepScanDomain} />
          </div>
        )}

        {/* Tab 4: Impersonation Patterns */}
        {activeTab === 'impersonation' && (
          <div className="space-y-6">
            <ImpersonationPatternsSection />
          </div>
        )}

        {/* Bottom Banner Linking to Web3 Attestation */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#647477] dark:text-[#A6B3AE] shadow-xs">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#356D68] dark:text-[#79A99C] shrink-0" />
            <span>Want to anchor correlated threat findings onto the decentralized Ethereum ledger?</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('threat-registry')}
            className="inline-flex items-center gap-1.5 font-bold text-[#356D68] dark:text-[#79A99C] hover:underline cursor-pointer shrink-0 font-mono"
          >
            <span>Open Web3 Threat Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
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
