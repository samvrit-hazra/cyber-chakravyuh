import { useState } from 'react';
import {
  Radio,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Terminal,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { ThreatDistributionChart } from '../components/dashboard/ThreatDistributionChart.tsx';
import { ThreatCategoryChart } from '../components/dashboard/ThreatCategoryChart.tsx';
import { ThreatActivityPanel } from '../components/dashboard/ThreatActivityPanel.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function ThreatIntelPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();
  const [selectedThreatTactic, setSelectedThreatTactic] = useState<string>('T1566');

  const handleDeepScanDomain = (domainUrl: string) => {
    navigateTo('url-analyzer', domainUrl);
  };

  const mitreTactics = [
    {
      id: 'T1566',
      name: 'Phishing (Spearphishing Link)',
      phase: 'Initial Access',
      description: 'Adversaries send malicious links via email, SMS, or social media to deceive victims into navigating to credential harvesting or malware staging landing pages.',
      mitigations: 'Implement multi-factor authentication (FIDO2 keys), automated URL heuristic inspection, and user awareness training.',
      severity: 'Critical',
    },
    {
      id: 'T1583.001',
      name: 'Acquire Infrastructure: Domains',
      phase: 'Resource Development',
      description: 'Threat actors register lookalike typosquatting domains and punycode homoglyphs mimicking trusted banking and cloud institutions.',
      mitigations: 'Proactive brand domain trademark monitoring, WHOIS registration age gating (< 14 days), and passive DNS logging.',
      severity: 'High',
    },
    {
      id: 'T1071.001',
      name: 'Application Layer Protocol: Web',
      phase: 'Command and Control',
      description: 'Malicious scripts communicate with backend Command & Control (C2) servers over HTTPS to exfiltrate intercepted session tokens.',
      mitigations: 'Strict Content Security Policy (CSP), TLS inspection, and outbound proxy null-routing.',
      severity: 'High',
    },
    {
      id: 'T1204.001',
      name: 'User Execution: Malicious Link',
      phase: 'Execution',
      description: 'Victim clicks deceptive hyperlink embedded in coercive urgent messaging, triggering arbitrary code download or credential submission.',
      mitigations: 'Browser sandbox isolation, zero-click endpoint defenses, and real-time link scanners.',
      severity: 'Medium',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Threat Intel Workspace */}
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

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#B64B46] dark:text-[#E17B70] font-bold">
            Threat Intelligence Radar
          </span>
        </div>

        {/* Minimal Header */}
        <div className="space-y-1.5 text-left border-b border-[#D9DED7] dark:border-[#304144] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-[#B64B46] dark:text-[#E17B70] animate-pulse" />
            <span>Threat Intelligence Radar</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl leading-relaxed">
            Monitor real-time adversary infrastructure, tracked phishing campaigns, MITRE ATT&CK adversary tactics, and cross-correlated Indicators of Compromise (IoCs).
          </p>
        </div>

        {/* Global Threat Landscape Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Threat Feeds</span>
            <div className="text-2xl font-extrabold font-mono text-[#A95636] dark:text-[#C47A52]">14 Synced</div>
            <p className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono">100% Active</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Active Campaigns</span>
            <div className="text-2xl font-extrabold font-mono text-[#B64B46] dark:text-[#E17B70]">24 Clusters</div>
            <p className="text-[11px] text-[#B64B46] dark:text-[#E17B70] font-mono">High Adversary Volume</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Domains Intercepted</span>
            <div className="text-2xl font-extrabold font-mono text-[#182629] dark:text-[#E8E6DC]">3,140 Hosts</div>
            <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono">Last 24 Hours</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Takedown Velocity</span>
            <div className="text-2xl font-extrabold font-mono text-[#36745F] dark:text-[#79B69A]">4.2 Hours</div>
            <p className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono">Automated ISP Notice</p>
          </div>
        </div>

        {/* Live Adversary Threat Activity Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#B64B46] dark:text-[#E17B70]" />
              <span>Real-Time Adversary IOC Stream</span>
            </h2>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Click Deep Scan to investigate any IOC
            </span>
          </div>
          <ThreatActivityPanel onInvestigateDomain={handleDeepScanDomain} />
        </div>

        {/* Attack Vector Taxonomy & Defense Layer Mesh */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatDistributionChart />
          <ThreatCategoryChart />
        </div>

        {/* MITRE ATT&CK Matrix Mapping Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-5">
          <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
                <span>MITRE ATT&CK® Enterprise Phishing Taxonomy</span>
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Heuristic mapping of adversarial tactics observed in Cyber Chakravyuh telemetry
              </p>
            </div>
            <span className="text-xs font-mono text-[#36745F] dark:text-[#79B69A] font-semibold">
              v14.1 Corroborated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {mitreTactics.map((tactic) => (
              <div
                key={tactic.id}
                onClick={() => setSelectedThreatTactic(tactic.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                  selectedThreatTactic === tactic.id
                    ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 border-[#A95636] dark:border-[#C47A52] shadow-xs'
                    : 'bg-[#EAECE6]/40 dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/50'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[#A95636] dark:text-[#C47A52]">{tactic.id}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      tactic.severity === 'Critical'
                        ? 'bg-[#B64B46]/10 text-[#B64B46] dark:text-[#E17B70]'
                        : 'bg-[#A87532]/10 text-[#A87532] dark:text-[#D7AA61]'
                    }`}
                  >
                    {tactic.severity}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#182629] dark:text-[#E8E6DC] leading-snug">
                  {tactic.name}
                </h4>
                <p className="text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                  Phase: {tactic.phase}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Tactic Deep Dive */}
          {(() => {
            const current = mitreTactics.find((t) => t.id === selectedThreatTactic) || mitreTactics[0];
            return (
              <div className="p-4 rounded-xl bg-[#EAECE6]/50 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 text-xs">
                <div className="font-mono text-[#A95636] dark:text-[#C47A52] font-bold">
                  TACTICAL BREAKDOWN: {current.id} — {current.name}
                </div>
                <p className="text-[#182629] dark:text-[#E8E6DC] leading-relaxed">
                  {current.description}
                </p>
                <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="text-[#647477] dark:text-[#A6B3AE]">
                    <strong>Defense Control:</strong> {current.mitigations}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('url-analyzer')}
                    className="text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 shrink-0 font-bold"
                  >
                    <span>Inspect Target URLs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
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
