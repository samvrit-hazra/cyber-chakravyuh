import { useState, useEffect, type KeyboardEvent } from 'react';
import {
  Link as LinkIcon,
  ArrowRight,
  Clipboard,
  Check,
  Copy,
  Download,
  Share2,
  Clock,
  Lock,
  Globe,
  CornerDownRight,
  ShieldAlert,
  AlertTriangle,
  Code2,
  Radar,
  Sparkles,
} from 'lucide-react';
import {
  performUrlInvestigation,
  extractDomain,
} from '../../utils/investigationEngine.ts';
import type { UrlInvestigationResult } from '../../types/investigation.ts';
import { ScanHistoryService } from '../../services/scanHistoryService.ts';
import { RiskBadge } from './RiskBadge.tsx';
import { ThreatScoreGauge } from './ThreatScoreGauge.tsx';
import { SecurityFindingsList } from './SecurityFindingsList.tsx';
import { RedirectTracer } from './RedirectTracer.tsx';
import { DomainDossier } from './DomainDossier.tsx';

interface URLAnalyzerProps {
  initialUrl?: string;
  onOpenHistory?: () => void;
  onOpenAnalystConsole?: (url?: string) => void;
}

export function URLAnalyzer({
  initialUrl = '',
  onOpenHistory,
  onOpenAnalystConsole,
}: URLAnalyzerProps) {
  const [url, setUrl] = useState(initialUrl);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<UrlInvestigationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'dossier' | 'redirects' | 'raw'>('overview');
  const [copiedWarning, setCopiedWarning] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // If a non-empty initialUrl is provided explicitly from outside, trigger scan
  useEffect(() => {
    if (initialUrl && initialUrl.trim() !== '') {
      setUrl(initialUrl);
      executeScan(initialUrl);
    }
  }, [initialUrl]);

  const validateUrl = (raw: string): boolean => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setValidationError('Please enter a target URL or domain to investigate.');
      return false;
    }

    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
    if (!pattern.test(trimmed)) {
      setValidationError('Please enter a valid hostname or web address (e.g., example.com or https://site.org/auth).');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const executeScan = async (target: string) => {
    if (!validateUrl(target)) return;

    setIsScanning(true);
    setScanStep(1);

    const t1 = setTimeout(() => setScanStep(2), 150);
    const t2 = setTimeout(() => setScanStep(3), 320);
    const t3 = setTimeout(() => setScanStep(4), 500);

    try {
      const res = await performUrlInvestigation(target.trim());
      setResult(res);
      ScanHistoryService.saveScan(res);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeScan(url);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeScan(url);
    }
  };


  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setValidationError(null);
      }
    } catch {
      // Fallback
    }
  };

  const handleCopyWarning = () => {
    if (!result) return;
    const warning = `⚠️ CYBERSECURITY ALERT — CYBER CHAKRAVYUH REPORT
Target: ${result.targetUrl}
Verdict: ${result.riskClassification.toUpperCase()} (Threat Score: ${result.riskScore}/100)
Rationale: ${result.recommendedActions?.[0]?.rationale || 'Deceptive indicators detected'}
Key Finding: ${result.technicalFindings?.[0]?.title || 'Potential credential theft risk'}
Timestamp: ${result.timestamp}
Do not enter credentials, financial information, or execute downloads.`;

    navigator.clipboard.writeText(warning);
    setCopiedWarning(true);
    setTimeout(() => setCopiedWarning(false), 2500);
  };

  const handleExportJson = () => {
    if (!result) return;
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `cyber-chakravyuh-report-${result.investigationId || 'investigation'}.json`;
    a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* 1. Main Search & Ingress Card */}
      <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 sm:p-6 shadow-sm transition-all">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 lg:gap-6">
            {/* Left Identity Block */}
            <div className="flex items-center gap-3.5 md:w-64 shrink-0">
              <div className="w-12 h-12 rounded-md bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/25 dark:border-[#C47A52]/30 flex items-center justify-center shrink-0">
                <LinkIcon className="w-6 h-6 text-[#A95636] dark:text-[#C47A52]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base font-heading text-[#182629] dark:text-[#E8E6DC]">
                  URL Analyzer
                </span>
                <span className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-tight">
                  Check any suspicious link for potential threats.
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px self-stretch bg-[#D9DED7] dark:bg-[#304144]" />

            {/* Right Input Bar */}
            <div className="flex-1 flex flex-col gap-2">
              <div
                className={`flex items-center rounded-md border bg-[#EAECE6]/50 dark:bg-[#101A1D] px-3.5 py-1.5 transition-all ${
                  validationError
                    ? 'border-[#B64B46] dark:border-[#E17B70] ring-1 ring-[#B64B46]/20'
                    : 'border-[#D9DED7] dark:border-[#304144] focus-within:border-[#A95636] dark:focus-within:border-[#C47A52] focus-within:ring-1 focus-within:ring-[#A95636]/20'
                }`}
              >
                <LinkIcon className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste suspicious URL here..."
                  className="w-full bg-transparent text-sm text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE]/60 py-2 focus:outline-none font-mono"
                  disabled={isScanning}
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handlePaste}
                    title="Paste from clipboard"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] rounded transition-colors cursor-pointer"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isScanning || !url.trim()}
                    className="px-5 py-2.5 rounded-md bg-[#A95636] hover:bg-[#8F472C] dark:bg-[#C47A52] dark:hover:bg-[#B06A44] text-white font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 font-sans"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Radar className="w-4 h-4" />
                        <span>Scan Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {validationError && (
                <p className="text-xs text-[#B64B46] dark:text-[#E17B70] font-sans pl-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </p>
              )}

              {/* Footer info & history */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                  RFC 3986 lexical inspection • Autonomous System routing • Zero synthetic telemetry
                </div>

                {onOpenHistory && (
                  <button
                    type="button"
                    onClick={onOpenHistory}
                    className="text-xs text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Scans</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Scanning Progress State */}
      {isScanning && (
        <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#A95636] dark:border-[#C47A52] border-t-transparent rounded-full animate-spin" />
              <h3 className="text-sm font-semibold text-[#182629] dark:text-[#E8E6DC]">
                Executing Multi-Vector Security Inspection
              </h3>
            </div>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Target: {extractDomain(url)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div
              className={`p-3 rounded-md border transition-colors ${
                scanStep >= 1
                  ? 'border-[#A95636]/50 dark:border-[#C47A52]/50 bg-[#A95636]/5 dark:bg-[#C47A52]/10 text-[#182629] dark:text-[#E8E6DC]'
                  : 'border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#D9DED7] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Lexical Entropy</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-md border transition-colors ${
                scanStep >= 2
                  ? 'border-[#A95636]/50 dark:border-[#C47A52]/50 bg-[#A95636]/5 dark:bg-[#C47A52]/10 text-[#182629] dark:text-[#E8E6DC]'
                  : 'border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#D9DED7] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] text-[10px] flex items-center justify-center font-bold">2</span>
                <span>DNS & BGP ASN</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-md border transition-colors ${
                scanStep >= 3
                  ? 'border-[#A95636]/50 dark:border-[#C47A52]/50 bg-[#A95636]/5 dark:bg-[#C47A52]/10 text-[#182629] dark:text-[#E8E6DC]'
                  : 'border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#D9DED7] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] text-[10px] flex items-center justify-center font-bold">3</span>
                <span>TLS Transport</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-md border transition-colors ${
                scanStep >= 4
                  ? 'border-[#A95636]/50 dark:border-[#C47A52]/50 bg-[#A95636]/5 dark:bg-[#C47A52]/10 text-[#182629] dark:text-[#E8E6DC]'
                  : 'border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#D9DED7] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Redirect Hops Tracer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Analysis Results Forensic Dossier */}
      {!isScanning && result && (
        <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] overflow-hidden shadow-sm space-y-0 transition-all">
          {/* Top Assessment Banner */}
          <div className="p-5 sm:p-7 border-b border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6]/50 dark:bg-[#101A1D]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <RiskBadge classification={result.riskClassification} size="md" />
                  <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">ID: {result.investigationId}</span>
                  <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Checked: {result.timestamp}</span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">
                    {result.riskClassification === 'Confirmed Malicious' && 'Confirmed Malicious Phishing Lure'}
                    {result.riskClassification === 'High Risk' && 'High-Threat Level Detected'}
                    {result.riskClassification === 'Suspicious' && 'Suspicious Indicators Detected'}
                    {result.riskClassification === 'Low Risk' && 'Clean Indicators — No Known Threats Detected'}
                    {result.riskClassification === 'Inconclusive' && 'Inconclusive / Insufficient Reputation Data'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] leading-relaxed mt-1 max-w-2xl font-sans">
                    {result.riskClassification === 'Confirmed Malicious' &&
                      'This URL actively impersonates legitimate banking or payment portals to steal authentication credentials and session tokens.'}
                    {result.riskClassification === 'High Risk' &&
                      'Multiple deceptive patterns detected, including suspicious domain age, unverified certificates, or abusive hosting networks.'}
                    {result.riskClassification === 'Suspicious' &&
                      'Unusual URL structure or newly observed domain without established reputation. Proceed with caution.'}
                    {result.riskClassification === 'Low Risk' &&
                      'Domain exhibits long-established trust chronology, authorized root certificate authority, and clean reputation records across threat feeds.'}
                    {result.riskClassification === 'Inconclusive' &&
                      'Domain lacks historical reputation telemetry or is cloaked behind privacy proxies. Lack of threat signatures does NOT guarantee safety.'}
                  </p>
                </div>
              </div>

              {/* Threat Score Gauge */}
              <div className="w-full lg:w-auto shrink-0">
                <ThreatScoreGauge
                  score={result.riskScore}
                  confidenceScore={result.confidenceScore}
                  evidenceCoverage={result.evidenceCoverage}
                  classification={result.riskClassification}
                />
              </div>
            </div>

            {/* Target URL string with copy actions */}
            <div className="mt-5 pt-4 border-t border-[#D9DED7] dark:border-[#304144] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 truncate max-w-xl text-[#647477] dark:text-[#A6B3AE]">
                <span>Target:</span>
                <span className="text-[#182629] dark:text-[#E8E6DC] font-medium truncate select-all" title={result.targetUrl}>
                  {result.targetUrl}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(result.targetUrl);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="px-2.5 py-1.5 rounded bg-[#EAECE6] hover:bg-[#D9DED7] dark:bg-[#223336] dark:hover:bg-[#293A3C] text-[#182629] dark:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#36745F] dark:text-[#79B69A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyWarning}
                  className="px-3 py-1.5 rounded bg-[#A95636]/10 hover:bg-[#A95636]/20 dark:bg-[#C47A52]/15 dark:hover:bg-[#C47A52]/25 text-[#A95636] dark:text-[#C47A52] border border-[#A95636]/30 dark:border-[#C47A52]/40 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                >
                  {copiedWarning ? <Check className="w-3.5 h-3.5 text-[#36745F] dark:text-[#79B69A]" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedWarning ? 'Warning Copied!' : 'Copy Warning'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-2.5 py-1.5 rounded bg-[#EAECE6] hover:bg-[#D9DED7] dark:bg-[#223336] dark:hover:bg-[#293A3C] text-[#182629] dark:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download JSON Report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Essential Indicator Cards */}
          <div className="p-5 sm:p-6 bg-[#EAECE6]/25 dark:bg-[#101A1D]/50 border-b border-[#D9DED7] dark:border-[#304144]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
              <span>Core Security Indicators</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Indicator 1: Domain Age */}
              <div className="p-3.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#647477] dark:text-[#A6B3AE]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" /> Domain Age
                  </span>
                  <span
                    className={`font-mono font-bold text-[11px] ${
                      result.domainIntelligence?.domainAge?.includes('days')
                        ? 'text-[#B64B46] dark:text-[#E17B70]'
                        : 'text-[#36745F] dark:text-[#79B69A]'
                    }`}
                  >
                    {result.domainIntelligence?.domainAge?.includes('days') ? 'High Risk Age' : 'Established'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC] truncate font-mono">
                  {result.domainIntelligence?.domainAge || 'Unindexed Registration'}
                </p>
                <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] leading-tight">
                  {result.domainIntelligence?.domainAge?.includes('days')
                    ? 'Phishing domains are frequently registered < 14 days before an attack.'
                    : 'Historical domain maturity confirms long-term registration stability.'}
                </p>
              </div>

              {/* Indicator 2: SSL/TLS Transport Verification */}
              <div className="p-3.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#647477] dark:text-[#A6B3AE]">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" /> Transport Security
                  </span>
                  <span
                    className={`font-mono font-bold text-[11px] ${
                      result.canonicalUrl.startsWith('https://') ? 'text-[#36745F] dark:text-[#79B69A]' : 'text-[#B64B46] dark:text-[#E17B70]'
                    }`}
                  >
                    {result.canonicalUrl.startsWith('https://') ? 'Encrypted TLS' : 'Plaintext HTTP'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC] truncate font-mono">
                  {result.canonicalUrl.startsWith('https://') ? 'TLS Certificate Active' : 'Unsigned / No Encryption'}
                </p>
                <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] leading-tight">
                  {result.canonicalUrl.startsWith('https://')
                    ? 'Session traffic is encrypted in transit. Note: Phishing sites also abuse free TLS certificates.'
                    : 'Connection lacks transport encryption. Credentials will be transmitted in plaintext.'}
                </p>
              </div>

              {/* Indicator 3: Brand Match & Homoglyphs */}
              <div className="p-3.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#647477] dark:text-[#A6B3AE]">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" /> Brand Spoofing
                  </span>
                  <span
                    className={`font-mono font-bold text-[11px] ${
                      result.phishingIndicators?.impersonatedBrand ? 'text-[#B64B46] dark:text-[#E17B70]' : 'text-[#36745F] dark:text-[#79B69A]'
                    }`}
                  >
                    {result.phishingIndicators?.impersonatedBrand ? 'Spoof Flag' : 'No Spoof'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC] truncate font-mono">
                  {result.phishingIndicators?.impersonatedBrand
                    ? `Mimics ${result.phishingIndicators.impersonatedBrand}`
                    : 'Authentic Entity'}
                </p>
                <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] leading-tight">
                  {result.phishingIndicators?.hasHomograph
                    ? 'Contains deceptive internationalized Cyrillic character substitutions.'
                    : 'No unauthorized brand keywords detected in host or path.'}
                </p>
              </div>

              {/* Indicator 4: Redirect Chain */}
              <div className="p-3.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#647477] dark:text-[#A6B3AE]">
                  <span className="flex items-center gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#A87532] dark:text-[#D7AA61]" /> Redirect Trail
                  </span>
                  <span
                    className={`font-mono font-bold text-[11px] ${
                      result.redirectAnalysis?.isCloaked
                        ? 'text-[#B64B46] dark:text-[#E17B70]'
                        : (result.redirectAnalysis?.totalHops || 0) > 0
                        ? 'text-[#A87532] dark:text-[#D7AA61]'
                        : 'text-[#36745F] dark:text-[#79B69A]'
                    }`}
                  >
                    {result.redirectAnalysis?.totalHops || 0} Hop(s)
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC] truncate font-mono">
                  {result.redirectAnalysis?.statusText || 'Direct Destination'}
                </p>
                <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] leading-tight">
                  {result.redirectAnalysis?.isCloaked
                    ? 'Intermediate URL bounces detect anti-sandbox cloaking techniques.'
                    : 'Direct resolution without multi-hop evasive redirects.'}
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Guidance & Structured Tabs */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Recommended Action Checklist */}
            <div
              className={`p-4 rounded-md border ${
                result.riskClassification === 'Confirmed Malicious' ||
                result.riskClassification === 'High Risk'
                  ? 'bg-[#B64B46]/10 dark:bg-[#E17B70]/10 border-[#B64B46]/30 dark:border-[#E17B70]/30 text-[#B64B46] dark:text-[#E17B70]'
                  : result.riskClassification === 'Suspicious'
                  ? 'bg-[#A87532]/10 dark:bg-[#D7AA61]/10 border-[#A87532]/30 dark:border-[#D7AA61]/30 text-[#A87532] dark:text-[#D7AA61]'
                  : 'bg-[#36745F]/10 dark:bg-[#79B69A]/10 border-[#36745F]/30 dark:border-[#79B69A]/30 text-[#36745F] dark:text-[#79B69A]'
              }`}
            >
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 mb-2 text-[#182629] dark:text-[#E8E6DC]">
                <ShieldAlert className="w-4 h-4 shrink-0 text-[#A95636] dark:text-[#C47A52]" />
                <span>Actionable Guidance For This Result</span>
              </h4>

              <ul className="text-xs space-y-1.5 leading-relaxed font-sans">
                {result.recommendedActions && result.recommendedActions.length > 0 ? (
                  result.recommendedActions.map((act) => (
                    <li key={act.id} className="text-[#182629] dark:text-[#E8E6DC]">
                      <strong className="text-[#182629] dark:text-white">[{act.role}] {act.action}</strong> — <span className="text-[#647477] dark:text-[#A6B3AE]">{act.rationale}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#647477] dark:text-[#A6B3AE]">
                    No immediate defensive action required. Ensure you verify domain spelling before submitting payment credentials.
                  </li>
                )}
              </ul>
            </div>

            {/* Detailed Investigation Navigation */}
            <div className="p-1 rounded-md bg-[#EAECE6] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] inline-flex flex-wrap gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97] ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144] font-bold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-transparent'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                <span>Security Findings</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52] font-bold">
                  {result.technicalFindings?.length || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97] ${
                  activeTab === 'dossier'
                    ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144] font-bold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-transparent'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
                <span>Domain & DNS Dossier</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('redirects')}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97] ${
                  activeTab === 'redirects'
                    ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144] font-bold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-transparent'
                }`}
              >
                <CornerDownRight className="w-3.5 h-3.5 text-[#A87532] dark:text-[#D7AA61]" />
                <span>Redirect Chain</span>
                {result.redirectAnalysis?.totalHops ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#A87532]/10 dark:bg-[#D7AA61]/20 text-[#A87532] dark:text-[#D7AA61] font-bold">
                    {result.redirectAnalysis.totalHops}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('raw')}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97] ${
                  activeTab === 'raw'
                    ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] shadow-sm border border-[#D9DED7] dark:border-[#304144] font-bold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-transparent'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
                <span>Raw Attestation</span>
              </button>
            </div>

            {/* Tab 1: Findings List */}
            {activeTab === 'overview' && (
              <SecurityFindingsList findings={result.technicalFindings} />
            )}

            {/* Tab 2: Domain & DNS Dossier */}
            {activeTab === 'dossier' && (
              <DomainDossier intelligence={result.domainIntelligence} />
            )}

            {/* Tab 3: Redirect Tracer */}
            {activeTab === 'redirects' && (
              <RedirectTracer analysis={result.redirectAnalysis} />
            )}

            {/* Tab 4: Raw Cryptographic Fingerprint */}
            {activeTab === 'raw' && (
              <div className="p-4 rounded-md bg-[#EAECE6]/50 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3 text-xs font-mono">
                <div className="space-y-1 text-[#182629] dark:text-[#E8E6DC]">
                  <div>
                    <span className="text-[#647477] dark:text-[#A6B3AE]">Target URL:</span>{' '}
                    <span className="text-[#A95636] dark:text-[#C47A52] font-semibold">{result.targetUrl}</span>
                  </div>
                  <div>
                    <span className="text-[#647477] dark:text-[#A6B3AE]">Canonical URL:</span>{' '}
                    <span>{result.canonicalUrl}</span>
                  </div>
                  <div>
                    <span className="text-[#647477] dark:text-[#A6B3AE]">Attestation Signature:</span>{' '}
                    <span className="select-all break-all">{result.ed25519Signature || `SIG-${result.investigationId}`}</span>
                  </div>
                  <div>
                    <span className="text-[#647477] dark:text-[#A6B3AE]">Evaluation Source:</span>{' '}
                    <span>{result.dataSourceLabel}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                  <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                    Deterministic RFC 3986 Heuristic Output
                  </span>
                  {onOpenAnalystConsole && (
                    <button
                      type="button"
                      onClick={() => onOpenAnalystConsole(result.targetUrl)}
                      className="text-xs text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <span>Deep Forensic Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
