import { useState } from 'react';
import { Layers } from 'lucide-react';

interface DeconstructScenario {
  id: string;
  label: string;
  verdict: 'malicious' | 'clean' | 'suspicious';
  score: number;
  scheme: string;
  subdomain: string;
  impersonatedBrand: string;
  rootDomain: string;
  path: string;
  dnsA: string;
  asn: string;
  whoisAge: string;
  entropy: string;
  notes: string;
}

const SCENARIOS: DeconstructScenario[] = [
  {
    id: 'phish',
    label: 'Credential Harvester',
    verdict: 'malicious',
    score: 88,
    scheme: 'https://',
    subdomain: 'security.login.',
    impersonatedBrand: 'paypal.',
    rootDomain: 'account-update-portal.net',
    path: '/auth/verify.php?token=9x41',
    dnsA: '185.191.171.12',
    asn: 'AS45154 (HostRoyale Bulletproof)',
    whoisAge: '4 Days (< 14d Threshold)',
    entropy: '4.28 Bits (Elevated Randomness)',
    notes: 'Brand token inserted into third-level subdomain to deceive victims while root points to an unindexed domain registered 4 days ago.',
  },
  {
    id: 'clean',
    label: 'Authoritative Host',
    verdict: 'clean',
    score: 5,
    scheme: 'https://',
    subdomain: 'accounts.',
    impersonatedBrand: '',
    rootDomain: 'google.com',
    path: '/signin/v2/identifier',
    dnsA: '142.250.190.46',
    asn: 'AS15169 (Google LLC)',
    whoisAge: '28+ Years (1997-09-15)',
    entropy: '2.14 Bits (Standard Lexical)',
    notes: 'Established authoritative domain hierarchy with verified autonomous system routing, DNSSEC validation, and long-term registration provenance.',
  },
  {
    id: 'cloaked',
    label: 'Multi-Hop Cloak',
    verdict: 'suspicious',
    score: 64,
    scheme: 'http://',
    subdomain: 't.',
    impersonatedBrand: 'docu-sign.',
    rootDomain: 'shared-billing.click',
    path: '/download/invoice.pdf.exe',
    dnsA: '45.142.214.88',
    asn: 'AS209605 (Flyservers)',
    whoisAge: '11 Days (Newly Registered)',
    entropy: '3.91 Bits (Obfuscated)',
    notes: 'Unencrypted transport with executable extension disguised as PDF payload delivered via deceptive domain registered 11 days ago.',
  },
];

export function UrlDecompositionDiagram() {
  const [selectedId, setSelectedId] = useState<string>('phish');
  const active = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  return (
    <div className="w-full bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] rounded-md shadow-sm overflow-hidden text-left">
      {/* Schematic Header Bar */}
      <div className="px-4 py-3 bg-[#EAECE6] dark:bg-[#223336] border-b border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider text-[#647477] dark:text-[#A6B3AE] uppercase">
          <Layers className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
          <span>RFC 3986 Lexical Decomposition Schematic</span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                selectedId === s.id
                  ? 'bg-[#182629] dark:bg-[#E8E6DC] text-white dark:text-[#182629] font-bold'
                  : 'bg-white dark:bg-[#19272A] text-[#647477] dark:text-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Forensic Anatomy */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Visual String Breakdown */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-medium text-[#647477] dark:text-[#A6B3AE] flex items-center justify-between">
            <span>Target URI Syntax Decomposition</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                active.verdict === 'malicious'
                  ? 'bg-[#B64B46]/10 text-[#B64B46] dark:text-[#E17B70] border border-[#B64B46]/30'
                  : active.verdict === 'suspicious'
                  ? 'bg-[#A87532]/10 text-[#A87532] dark:text-[#D7AA61] border border-[#A87532]/30'
                  : 'bg-[#36745F]/10 text-[#36745F] dark:text-[#79B69A] border border-[#36745F]/30'
              }`}
            >
              Score: {active.score}/100 — {active.verdict.toUpperCase()}
            </span>
          </div>

          {/* Color-Coded URI Segment Blocks */}
          <div className="p-3.5 bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] rounded text-xs sm:text-sm font-mono break-all flex flex-wrap items-center gap-0.5 leading-relaxed">
            {/* 1. Scheme */}
            <span
              className="text-[#647477] dark:text-[#A6B3AE] bg-white dark:bg-[#19272A] px-1.5 py-0.5 rounded border border-[#D9DED7] dark:border-[#304144]"
              title="Scheme: Transport Protocol"
            >
              {active.scheme}
            </span>

            {/* 2. Subdomains */}
            {active.subdomain && (
              <span
                className="text-[#356D68] dark:text-[#79A99C] bg-[#356D68]/10 dark:bg-[#79A99C]/15 px-1.5 py-0.5 rounded border border-[#356D68]/20 dark:border-[#79A99C]/30"
                title="Subdomain Hierarchy Depth"
              >
                {active.subdomain}
              </span>
            )}

            {/* 3. Impersonated Brand Token */}
            {active.impersonatedBrand && (
              <span
                className="text-[#B64B46] dark:text-[#E17B70] bg-[#B64B46]/10 dark:bg-[#E17B70]/15 px-1.5 py-0.5 rounded font-bold border border-[#B64B46]/30 dark:border-[#E17B70]/30 underline decoration-wavy decoration-[#B64B46]"
                title="Lure Token: High-value impersonation string in sub-label"
              >
                {active.impersonatedBrand}
              </span>
            )}

            {/* 4. Root Domain */}
            <span
              className="text-[#A95636] dark:text-[#C47A52] bg-[#A95636]/10 dark:bg-[#C47A52]/15 px-1.5 py-0.5 rounded font-bold border border-[#A95636]/30 dark:border-[#C47A52]/30"
              title="Authoritative Root Domain: True Registrar Ingress"
            >
              {active.rootDomain}
            </span>

            {/* 5. Path Payload */}
            <span
              className="text-[#647477] dark:text-[#A6B3AE] px-1 py-0.5"
              title="Resource Path & Query Arguments"
            >
              {active.path}
            </span>
          </div>

          {/* Segment Key Legend */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-[#647477]" /> Scheme
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-[#356D68] dark:bg-[#79A99C]" /> Subdomains
            </span>
            {active.impersonatedBrand && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#B64B46] dark:bg-[#E17B70]" /> Impersonated Brand
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-[#A95636] dark:bg-[#C47A52]" /> Root Domain
            </span>
          </div>
        </div>

        {/* 4 Technical Signal Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {/* Signal 1: WHOIS Registration */}
          <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
            <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">Domain Maturity</span>
            <div className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate">{active.whoisAge}</div>
            <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-sans">
              Maturity metric flags newly registered domains acting as short-lived disposable phishing lures.
            </p>
          </div>

          {/* Signal 2: Network Infrastructure */}
          <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
            <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">BGP Routing & ASN</span>
            <div className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate">{active.asn}</div>
            <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-sans">
              Resolves IP: <code className="text-[#A95636] dark:text-[#C47A52]">{active.dnsA}</code> mapped against known threat host ranges.
            </p>
          </div>

          {/* Signal 3: Shannon Entropy */}
          <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
            <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">Lexical Randomness</span>
            <div className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate">{active.entropy}</div>
            <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-sans">
              Shannon entropy measures algorithmic character randomness and DGA patterns.
            </p>
          </div>

          {/* Signal 4: Verdict Rationale */}
          <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
            <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">Forensic Rationale</span>
            <div className="text-[11px] text-[#182629] dark:text-[#E8E6DC] font-sans leading-relaxed">
              {active.notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
