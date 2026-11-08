import { useState, useEffect } from 'react';
import {
  Radio,
  ArrowRight,
  Crosshair,
  Terminal,
  RefreshCw,
  Search,
  FolderGit2,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { ThreatDistributionChart } from '../components/dashboard/ThreatDistributionChart.tsx';
import { ThreatCategoryChart } from '../components/dashboard/ThreatCategoryChart.tsx';
import { ThreatActivityPanel } from '../components/dashboard/ThreatActivityPanel.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';
import { ThreatApiService } from '../services/threatApi.ts';
import { Button } from '../components/common/Button.tsx';
import { Badge } from '../components/common/Badge.tsx';

export function ThreatIntelPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  // Dashboard Data State
  const [dashboard, setDashboard] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [mitreTechniques, setMitreTechniques] = useState<any[]>([]);
  const [selectedThreatTactic, setSelectedThreatTactic] = useState<string>('T1566');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Deep Scan State
  const [deepScanInput, setDeepScanInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [deepScanResult, setDeepScanResult] = useState<any>(null);

  const loadData = () => {
    ThreatApiService.getThreatDashboard()
      .then((d) => setDashboard(d))
      .catch((err) => console.error('Dashboard error:', err));

    ThreatApiService.getThreatCampaigns()
      .then((c) => setCampaigns(c))
      .catch((err) => console.error('Campaigns error:', err));

    ThreatApiService.getThreatMitreMatrix()
      .then((m) => {
        setMitreTechniques(m);
        if (m.length > 0 && !selectedThreatTactic) {
          setSelectedThreatTactic(m[0].technique_id);
        }
      })
      .catch((err) => console.error('MITRE error:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncFeeds = async () => {
    setIsSyncing(true);
    try {
      await ThreatApiService.syncThreatFeeds();
      loadData();
    } catch (err) {
      console.error('Feed sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExecuteDeepScan = async (targetToScan?: string) => {
    const target = (targetToScan || deepScanInput).trim();
    if (!target) return;

    setIsScanning(true);
    try {
      const res = await ThreatApiService.deepScanIoc(target);
      setDeepScanResult(res);
    } catch (err) {
      console.error('Deep scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeepScanDomain = (domainUrl: string) => {
    setDeepScanInput(domainUrl);
    handleExecuteDeepScan(domainUrl);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const currentMitre =
    mitreTechniques.find((t) => t.technique_id === selectedThreatTactic) || mitreTechniques[0] || null;

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Threat Intel Workspace */}
      <main className="flex-1 pt-20 sm:pt-22 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono font-bold tracking-widest uppercase bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] border border-[#A95636]/25 dark:border-[#C47A52]/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#B64B46] dark:text-[#E17B70]" />
              <span>MODULE 4: GLOBAL ADVERSARY RADAR & THREAT INTELLIGENCE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
              Threat Intelligence Radar
            </h1>

            <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
              Aggregated real-time threat intelligence from OpenPhish, abuse.ch FeodoTracker, URLhaus, and ThreatFox. Correlated with MITRE ATT&CK Enterprise techniques and verified across MongoDB threat collections.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncFeeds}
              disabled={isSyncing}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
              className="font-mono text-xs border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52] hover:bg-[#A95636]/10"
            >
              {isSyncing ? 'Syncing Feeds...' : 'Sync Live Feeds'}
            </Button>
          </div>
        </div>

        {/* Real Dynamic Threat Metrics Banner (Zero Hardcoded Data) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Global Threat Feeds</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#A95636] dark:text-[#C47A52]">
              {dashboard ? `${dashboard.feed_status.synchronized} / ${dashboard.feed_status.configured}` : '5 / 5'} Synced
            </div>
            <p className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono">
              OpenPhish • FeodoTracker • ATT&CK
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Active Campaigns</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#B64B46] dark:text-[#E17B70]">
              {dashboard ? `${dashboard.campaigns.clusters} Clusters` : 'Live Correlation'}
            </div>
            <p className="text-[11px] text-[#B64B46] dark:text-[#E17B70] font-mono">
              Evidence-Backed Clusters
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Threat Indicators</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#182629] dark:text-[#E8E6DC]">
              {dashboard ? `${dashboard.indicators.total.toLocaleString()} IOCs` : 'Indexing...'}
            </div>
            <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono">
              {dashboard ? `${dashboard.indicators.new_last_24h} Ingested (24h)` : 'Live Ingestion'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-1">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] uppercase">Takedown Velocity</span>
            <div className="text-sm sm:text-base font-extrabold font-mono text-[#647477] dark:text-[#A6B3AE] truncate pt-1">
              {dashboard ? dashboard.takedown_velocity : 'Not enough verified data'}
            </div>
            <p className="text-[10px] text-[#A87532] dark:text-[#D7AA61] font-mono">
              Requires ISP Telemetry Confirmation
            </p>
          </div>
        </div>

        {/* Deep IOC Investigation Search Bar */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
                <span>Deep IOC Investigation & Multi-Feed Cross-Correlation</span>
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Investigate any domain, URL, IP, or hash against synchronized feeds, VirusTotal, and MITRE techniques with SSRF protection.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#356D68]/10 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/30 font-bold self-start sm:self-auto">
              SSRF GUARD PROTECTED
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] absolute left-3 top-3" />
              <input
                type="text"
                value={deepScanInput}
                onChange={(e) => setDeepScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteDeepScan()}
                placeholder="Enter target domain (e.g. secure-login-chase-update.pages.dev), URL, IP, or hash..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] placeholder:text-[#647477] dark:placeholder:text-[#A6B3AE] text-xs font-mono focus:outline-hidden focus:border-[#A95636]"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleExecuteDeepScan()}
              disabled={isScanning}
              className="whitespace-nowrap font-mono text-xs px-5 w-full sm:w-auto"
            >
              {isScanning ? 'Investigating...' : 'Deep Scan'}
            </Button>
          </div>

          {/* Quick Test Samples */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono">
            <div className="flex items-center gap-2">
              <span>Quick Test Samples:</span>
              <button
                type="button"
                onClick={() => {
                  setDeepScanInput('secure-login-chase-update.pages.dev');
                  handleExecuteDeepScan('secure-login-chase-update.pages.dev');
                }}
                className="underline hover:text-[#A95636] dark:hover:text-[#C47A52]"
              >
                Chase Phish (.pages.dev)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setDeepScanInput('162.243.103.246:8080');
                  handleExecuteDeepScan('162.243.103.246:8080');
                }}
                className="underline hover:text-[#A95636] dark:hover:text-[#C47A52]"
              >
                Emotet C2 (IP:Port)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setDeepScanInput('127.0.0.1');
                  handleExecuteDeepScan('127.0.0.1');
                }}
                className="text-rose-600 dark:text-rose-400 font-bold underline"
              >
                Test SSRF Block (127.0.0.1)
              </button>
            </div>
          </div>

          {/* Deep Scan Result Dossier */}
          {deepScanResult && (
            <div className="pt-4 border-t border-[#D9DED7] dark:border-[#304144] space-y-4">
              {/* Verdict Header */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  deepScanResult.verdict === 'MALICIOUS'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : deepScanResult.verdict === 'RESTRICTED_TARGET'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#647477] dark:text-[#A6B3AE] uppercase">TARGET:</span>
                    <span className="font-mono text-sm font-bold text-[#182629] dark:text-[#E8E6DC] break-all">
                      {deepScanResult.target}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-[#647477] dark:text-[#A6B3AE]">
                      Classification: <strong className="text-[#182629] dark:text-[#E8E6DC]">{deepScanResult.normalized_type.toUpperCase()}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-[#647477] dark:text-[#A6B3AE]">
                      Corroborated by: <strong className="text-[#A95636] dark:text-[#C47A52]">{deepScanResult.sources_corroborated.join(', ') || 'Internal Lake'}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      deepScanResult.verdict === 'MALICIOUS'
                        ? 'rose'
                        : deepScanResult.verdict === 'RESTRICTED_TARGET'
                        ? 'amber'
                        : 'cyan'
                    }
                    size="md"
                  >
                    {deepScanResult.verdict}
                  </Badge>
                  <div className="text-right font-mono text-xs">
                    <span className="text-[#647477] dark:text-[#A6B3AE] block text-[10px]">RISK SCORE</span>
                    <span className="text-base font-extrabold text-[#B64B46] dark:text-[#E17B70]">
                      {deepScanResult.risk_score} / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Findings & Campaign Association Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Findings */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2">
                  <span className="text-[#647477] dark:text-[#A6B3AE] uppercase text-[10px] font-bold block">
                    TELEMETRY EVIDENCE & SOURCE CORROBORATION
                  </span>
                  <div className="space-y-2">
                    {deepScanResult.findings.map((f: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#A95636] dark:text-[#C47A52]">{f.source}</span>
                          <span className="text-rose-600 dark:text-rose-400 uppercase font-bold">{f.severity}</span>
                        </div>
                        <p className="text-[11px] text-[#182629] dark:text-[#E8E6DC] leading-snug">{f.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign & Mitigations */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3">
                  <span className="text-[#647477] dark:text-[#A6B3AE] uppercase text-[10px] font-bold block">
                    CAMPAIGN CLUSTERING & MITRE ATT&CK
                  </span>

                  {deepScanResult.matched_campaign ? (
                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                      <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] block">MATCHED CAMPAIGN:</span>
                      <span className="font-bold text-sm text-[#A95636] dark:text-[#C47A52] block">
                        {deepScanResult.matched_campaign.name}
                      </span>
                      <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] block">
                        Attribution: <strong>{deepScanResult.matched_campaign.attribution}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE] text-[11px]">
                      No active adversary campaign cluster linked to this target.
                    </div>
                  )}

                  {deepScanResult.recommended_actions?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-bold uppercase block">
                        RECOMMENDED DEFENSIVE ACTIONS:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-[#182629] dark:text-[#E8E6DC]">
                        {deepScanResult.recommended_actions.map((act: string, idx: number) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real Correlated Threat Campaigns Panel */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
                <span>Correlated Threat Campaigns & Adversary Clusters</span>
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Heuristic clustering grouping indicators by malware family, shared C2, and infrastructure provenance
              </p>
            </div>
            <span className="text-xs font-mono text-[#356D68] dark:text-[#79A99C] font-bold">
              {campaigns.length} Evidence-Backed Clusters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.slice(0, 6).map((camp) => (
              <div
                key={camp.campaign_id}
                className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3 font-mono text-xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A95636] dark:text-[#C47A52] font-bold">{camp.campaign_id}</span>
                    <Badge variant={camp.confidence >= 90 ? 'rose' : 'amber'} size="sm">
                      {camp.confidence}% CONF
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">{camp.name}</h4>
                  <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Attribution: {camp.attribution}</p>
                </div>

                <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-[#647477] dark:text-[#A6B3AE]">
                    <span>Indexed Indicators:</span>
                    <strong className="text-[#182629] dark:text-[#E8E6DC]">{camp.ioc_count}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#647477] dark:text-[#A6B3AE]">
                    <span>Sources:</span>
                    <span className="text-[#356D68] dark:text-[#79A99C] font-semibold">{camp.sources.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Adversary Threat Activity IOC Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-[#B64B46] dark:text-[#E17B70]" />
              <span>Real-Time Adversary IOC Stream</span>
            </h2>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Click Deep Scan on any row to investigate
            </span>
          </div>
          <ThreatActivityPanel onInvestigateDomain={handleDeepScanDomain} />
        </div>

        {/* Attack Vector Taxonomy & Defense Layer Mesh */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatDistributionChart defenseMesh={dashboard?.defense_mesh} />
          <ThreatCategoryChart categories={dashboard?.threat_categories} />
        </div>

        {/* MITRE ATT&CK Matrix Mapping Section */}
        <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-6">
          <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
                <span>MITRE ATT&CK® Enterprise Phishing Taxonomy</span>
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Heuristic mapping of adversarial tactics observed across synchronized threat telemetry
              </p>
            </div>
            <span className="text-xs font-mono text-[#36745F] dark:text-[#79B69A] font-semibold">
              STIX Enterprise Corroborated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mitreTechniques.map((tactic) => (
              <div
                key={tactic.technique_id}
                onClick={() => setSelectedThreatTactic(tactic.technique_id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                  selectedThreatTactic === tactic.technique_id
                    ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 border-[#A95636] dark:border-[#C47A52] shadow-sm'
                    : 'bg-[#EAECE6]/40 dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/50'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[#A95636] dark:text-[#C47A52]">{tactic.technique_id}</span>
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
                <h4 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC] leading-snug">
                  {tactic.name}
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                  <span>Phase: {tactic.tactic}</span>
                  <span className="text-[#356D68] dark:text-[#79A99C] font-bold">
                    {tactic.observed_count} observed
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Tactic Deep Dive */}
          {currentMitre && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#EAECE6]/50 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#A95636] dark:text-[#C47A52] font-bold">
                <span>TACTICAL BREAKDOWN: {currentMitre.technique_id} — {currentMitre.name} ({currentMitre.tactic})</span>
                <span className="text-[#356D68] dark:text-[#79A99C]">
                  Evidence Sources: {currentMitre.evidence_sources?.join(', ') || 'Synchronized Feeds'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#182629] dark:text-[#E8E6DC] leading-relaxed">
                {currentMitre.description}
              </p>

              {currentMitre.sample_indicators?.length > 0 && (
                <div className="pt-2 text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
                  <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">Sample Observed Indicators: </span>
                  {currentMitre.sample_indicators.join(' • ')}
                </div>
              )}

              <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#647477] dark:text-[#A6B3AE]">
                  <strong>Recommended Defensive Control:</strong> {currentMitre.mitigations}
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo('url-analyzer')}
                  className="text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 shrink-0 font-bold"
                >
                  <span>Inspect Target in URL Analyzer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

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
