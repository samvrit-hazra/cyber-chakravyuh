import type {
  UrlInvestigationResult,
  RiskClassification,
} from '../types/investigation.ts';

export const EXAMPLE_URL_SUGGESTIONS = [
  {
    label: 'PayPal Phish (Confirmed Malicious)',
    url: 'https://security-verify.paypal.account-update.phish-alert.net/login',
    expectedClassification: 'Confirmed Malicious' as RiskClassification,
    color: 'rose',
  },
  {
    label: 'Web3 Drainer (High Risk)',
    url: 'https://metamask-claim-airdrop-rewards.finance.io/connect',
    expectedClassification: 'High Risk' as RiskClassification,
    color: 'amber',
  },
  {
    label: 'Okta SSO Lure (Suspicious)',
    url: 'https://internal-sso.okta.enterprise-auth.cloud/step2',
    expectedClassification: 'Suspicious' as RiskClassification,
    color: 'purple',
  },
  {
    label: 'Google Auth (Low Risk)',
    url: 'https://accounts.google.com/signin/v2/identifier',
    expectedClassification: 'Low Risk' as RiskClassification,
    color: 'emerald',
  },
  {
    label: 'Unknown Staging (Inconclusive)',
    url: 'https://unknown-staging-temp-domain-9281.xyz/auth',
    expectedClassification: 'Inconclusive' as RiskClassification,
    color: 'neutral',
  },
];

/**
 * Heuristically evaluates a URL or fetches from API if online
 */
export async function performUrlInvestigation(rawUrl: string): Promise<UrlInvestigationResult> {
  const normalizedUrl = normalizeUrl(rawUrl);
  const startTime = Date.now();

  // Attempt real backend call if configured
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`http://localhost:5000/api/v1/investigate/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalizedUrl }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return {
        ...(data as UrlInvestigationResult),
        isDemoState: false,
        dataSourceLabel: 'Live Backend API (port 5000)',
      };
    }
  } catch {
    // Graceful fallback to client-side heuristic engine
  }

  // Artificial network latency simulation for realistic analysis feel
  await new Promise((r) => setTimeout(r, 650));

  const durationMs = Date.now() - startTime;
  return buildSyntheticAnalysis(normalizedUrl, durationMs);
}

export function normalizeUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return 'https://example.com';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    return url.replace(/https?:\/\//i, '').split('/')[0].toLowerCase();
  }
}

function calculateEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  const freqs: Record<string, number> = {};
  for (const c of str) {
    freqs[c] = (freqs[c] || 0) + 1;
  }
  let ent = 0;
  for (const c in freqs) {
    const p = freqs[c] / len;
    ent -= p * Math.log2(p);
  }
  return Number(ent.toFixed(2));
}

function buildSyntheticAnalysis(url: string, durationMs: number): UrlInvestigationResult {
  const domain = extractDomain(url);
  const lowerUrl = url.toLowerCase();

  // Preset 1: Confirmed Malicious (PayPal Lure)
  if (lowerUrl.includes('phish') || (lowerUrl.includes('paypal') && !domain.endsWith('paypal.com'))) {
    return {
      investigationId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      targetUrl: url,
      canonicalUrl: `https://${domain}/login`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      durationMs,
      riskClassification: 'Confirmed Malicious',
      riskScore: 96,
      confidenceScore: 99,
      evidenceCoverage: 98,
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha Simulated Heuristics (API Offline)',
      domainIntelligence: {
        domain,
        domainAge: '3 days (Registered 2026-11-04)',
        registrationDate: '2026-11-04 14:12:00 UTC',
        expirationDate: '2027-11-04 14:12:00 UTC',
        registrar: 'NiceNIC International Group Ltd.',
        dnsRecords: [
          { type: 'A', value: '185.191.171.12', ttl: 300 },
          { type: 'NS', value: 'ns1.bulletproof-dns.net', ttl: 3600 },
          { type: 'NS', value: 'ns2.bulletproof-dns.net', ttl: 3600 },
          { type: 'TXT', value: 'v=spf1 -all', ttl: 300 },
        ],
        dnssecStatus: 'Unsigned',
        ipAddress: '185.191.171.12',
        asnNumber: 'AS45154',
        asnOrganization: 'HostRoyale Bulletproof Networks Ltd.',
        country: 'Seychelles (SC)',
        city: 'Victoria',
        subnetCidr: '185.191.171.0/24',
        reputationScore: 98,
        reputationLabel: 'Hostile',
      },
      phishingIndicators: {
        hasTyposquatting: true,
        typosquattingTarget: 'paypal.com',
        hasHomograph: true,
        homographDetails: 'Cyrillic lowercase "а" (U+0430) substituted for Latin "a" in subdomain label',
        suspiciousUrlPatterns: [
          'Multiple nested subdomains (4 depth levels)',
          'High risk keywords in path: ["security-verify", "account-update", "login"]',
          'Ephemeral TLD with high spam score ratio (.net)',
        ],
        redirectChainRisk: 'Cloaking Detected',
        impersonatedBrand: 'PayPal Inc.',
        brandSimilarityPercent: 99.4,
        knownThreatMatches: [
          { database: 'Saptarishi Honey-Mesh', signature: 'SIG-PHISH-PAYPAL-V4', category: 'Credential Harvester', matchConfidence: 99 },
          { database: 'URLhaus Live IOCs', signature: 'URLH-2026-9812', category: 'Phishing Host', matchConfidence: 97 },
          { database: 'AlienVault OTX', signature: 'PULSE-FIN-SPOOF', category: 'Financial Scam', matchConfidence: 94 },
        ],
      },
      redirectAnalysis: {
        originalUrl: url,
        intermediateHops: [
          { hopNumber: 1, url: url, statusCode: 302, statusText: 'Found', latencyMs: 34, isSsl: true, note: 'User-agent cloaking check' },
          { hopNumber: 2, url: `https://${domain}/cdn/gate?token=c89f`, statusCode: 301, statusText: 'Moved Permanently', latencyMs: 22, isSsl: true, note: 'Anti-bot sandbox evasion' },
        ],
        finalDestination: `https://${domain}/auth/login/verify.php`,
        totalHops: 2,
        statusText: 'Multi-Hop Adversary Cloaking Detected',
        isCloaked: true,
      },
      technicalFindings: [
        {
          id: 'FIND-01',
          title: 'Active Credential Harvesting Form',
          description: 'DOM inspection detected an unencrypted password & credit card submission hook relaying to an adversary Telegram bot.',
          evidence: 'POST https://api.telegram.org/bot781928:AAH.../sendMessage',
          severity: 'critical',
          source: 'Cognitive Core DOM Sandbox',
          ruleId: 'RULE-HEURISTIC-CRED-STEAL',
        },
        {
          id: 'FIND-02',
          title: 'Cyrillic Homoglyph Character Invariant Violation',
          description: 'Domain utilizes internationalized domain name (IDN) punycode substitution to deceive visual verification.',
          evidence: 'Unicode: \u0430 (U+0430) vs ASCII: a (U+0061)',
          severity: 'critical',
          source: 'Saptarishi Lexical Ingress',
          ruleId: 'RULE-HOMOGLYPH-PUNYCODE',
        },
        {
          id: 'FIND-03',
          title: 'Suspicious Bulletproof ASN Autonomous System',
          description: 'Host IP is routed through AS45154, flagged for over 450 confirmed malicious phishing campaigns in the past 30 days.',
          evidence: 'ASN 45154 (HostRoyale Ltd.) • Threat Rating: 98/100',
          severity: 'high',
          source: 'BGP Routing Telemetry',
          ruleId: 'RULE-HOSTILE-ASN',
        },
        {
          id: 'FIND-04',
          title: 'Ephemeral ACME TLS Certificate Abuse',
          description: 'X.509 certificate issued 72 hours ago via automated ACME challenge without organizational verification (OV/EV).',
          evidence: 'Issuer: R3 (Let\'s Encrypt) • Valid From: 2026-11-04',
          severity: 'medium',
          source: 'PKI Certificate Auditor',
          ruleId: 'RULE-EPHEMERAL-TLS',
        },
      ],
      recommendedActions: [
        {
          id: 'ACT-01',
          priority: 'Immediate',
          action: 'Do not enter passwords, email addresses, or 2FA codes.',
          rationale: 'All keystrokes on this host are actively intercepted by an adversary credential harvester.',
          role: 'User',
        },
        {
          id: 'ACT-02',
          priority: 'Immediate',
          action: 'Sinkhole domain at enterprise DNS resolver and perimeter firewall.',
          rationale: 'Prevent enterprise endpoints from resolving 185.191.171.12.',
          role: 'Network Admin',
        },
        {
          id: 'ACT-03',
          priority: 'Important',
          action: 'Revoke and reset PayPal and email credentials if previously entered.',
          rationale: 'Mitigate active session hijacking and unauthorized financial transfers.',
          role: 'SecOps',
        },
      ],
      ed25519Signature: 'ed25519_9c82fa0184b2e9d841029c8741b80c421e902b7814c8104e78a0c218',
    };
  }

  // Preset 2: High Risk (Crypto Drainer / MetaMask Lure)
  if (lowerUrl.includes('metamask') || lowerUrl.includes('claim') || lowerUrl.includes('airdrop') || lowerUrl.includes('drain')) {
    return {
      investigationId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      targetUrl: url,
      canonicalUrl: `https://${domain}/connect`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      durationMs,
      riskClassification: 'High Risk',
      riskScore: 88,
      confidenceScore: 96,
      evidenceCoverage: 94,
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha Simulated Heuristics (API Offline)',
      domainIntelligence: {
        domain,
        domainAge: '8 days (Registered 2026-10-30)',
        registrationDate: '2026-10-30 09:24:00 UTC',
        expirationDate: '2027-10-30 09:24:00 UTC',
        registrar: 'NameCheap, Inc.',
        dnsRecords: [
          { type: 'A', value: '194.26.29.112', ttl: 300 },
          { type: 'NS', value: 'dns1.registrar-servers.com', ttl: 1800 },
        ],
        dnssecStatus: 'Unsigned',
        ipAddress: '194.26.29.112',
        asnNumber: 'AS209605',
        asnOrganization: 'Rox Networks B.V.',
        country: 'Netherlands (NL)',
        city: 'Amsterdam',
        subnetCidr: '194.26.29.0/24',
        reputationScore: 85,
        reputationLabel: 'Poor',
      },
      phishingIndicators: {
        hasTyposquatting: true,
        typosquattingTarget: 'metamask.io',
        hasHomograph: false,
        suspiciousUrlPatterns: [
          'Compounded lure keywords: ["claim", "airdrop", "rewards"]',
          'Uncommon compound extension (.finance.io)',
        ],
        redirectChainRisk: 'None',
        impersonatedBrand: 'MetaMask / ConsenSys',
        brandSimilarityPercent: 96.8,
        knownThreatMatches: [
          { database: 'Saptarishi Web3 Core', signature: 'DRAINER-PERMIT2-EXPLOIT', category: 'Smart Contract Drainer', matchConfidence: 96 },
        ],
      },
      redirectAnalysis: {
        originalUrl: url,
        intermediateHops: [],
        finalDestination: url,
        totalHops: 0,
        statusText: 'Direct Host Connection (No Intermediate Redirects)',
        isCloaked: false,
      },
      technicalFindings: [
        {
          id: 'FIND-W3-01',
          title: 'Malicious ERC-20 Permit2 Allowance Drainer',
          description: 'Client script injects an unverified off-chain EIP-712 signature request granting full token withdrawal permissions.',
          evidence: 'function: permit(owner, spender=0x71a..., value=MAX_UINT256)',
          severity: 'critical',
          source: 'Cognitive Web3 AST Inspector',
          ruleId: 'RULE-SMART-CONTRACT-DRAIN',
        },
        {
          id: 'FIND-W3-02',
          title: 'Brand Impersonation Layout Violation',
          description: 'Visual layout mirrors MetaMask Fox branding without legitimate ConsenSys origins.',
          evidence: 'Visual Similarity: 96.8% • Extracted Logo SHA: 49b01...',
          severity: 'high',
          source: 'Cognitive Vision ViT',
          ruleId: 'RULE-BRAND-SPOOF',
        },
      ],
      recommendedActions: [
        {
          id: 'ACT-01',
          priority: 'Immediate',
          action: 'Do not connect cryptocurrency wallets or sign typed messages.',
          rationale: 'Signing requests on this host will drain native tokens and NFTs immediately.',
          role: 'User',
        },
        {
          id: 'ACT-02',
          priority: 'Important',
          action: 'Revoke any pending token approvals using Revoke.cash or Etherscan.',
          rationale: 'Nullify existing approvals before contract exploitation.',
          role: 'User',
        },
      ],
      ed25519Signature: 'ed25519_7b19ac0234f981048b2910c84102941094b81094218a0c1048b02194',
    };
  }

  // Preset 3: Suspicious (Okta SSO Lure)
  if (lowerUrl.includes('okta') || lowerUrl.includes('sso') || lowerUrl.includes('enterprise-auth')) {
    return {
      investigationId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      targetUrl: url,
      canonicalUrl: `https://${domain}/step2`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      durationMs,
      riskClassification: 'Suspicious',
      riskScore: 68,
      confidenceScore: 84,
      evidenceCoverage: 88,
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha Simulated Heuristics (API Offline)',
      domainIntelligence: {
        domain,
        domainAge: '14 days (Registered 2026-10-24)',
        registrationDate: '2026-10-24 18:00:00 UTC',
        expirationDate: '2027-10-24 18:00:00 UTC',
        registrar: 'Porkbun LLC',
        dnsRecords: [
          { type: 'A', value: '45.154.255.89', ttl: 300 },
          { type: 'NS', value: 'curt.ns.cloudflare.com', ttl: 86400 },
          { type: 'NS', value: 'dora.ns.cloudflare.com', ttl: 86400 },
        ],
        dnssecStatus: 'Signed',
        ipAddress: '45.154.255.89',
        asnNumber: 'AS44050',
        asnOrganization: 'Petersburg Internet Network',
        country: 'Russian Federation (RU)',
        city: 'Saint Petersburg',
        subnetCidr: '45.154.255.0/24',
        reputationScore: 62,
        reputationLabel: 'Questionable',
      },
      phishingIndicators: {
        hasTyposquatting: true,
        typosquattingTarget: 'okta.com',
        hasHomograph: false,
        suspiciousUrlPatterns: [
          'Domain mimics enterprise authentication provider',
          'Cloud generic suffix (.cloud)',
        ],
        redirectChainRisk: 'Low',
        impersonatedBrand: 'Okta Identity',
        brandSimilarityPercent: 88.5,
        knownThreatMatches: [],
      },
      redirectAnalysis: {
        originalUrl: url,
        intermediateHops: [
          { hopNumber: 1, url: url, statusCode: 302, statusText: 'Found', latencyMs: 28, isSsl: true, note: 'Session token parameter append' },
        ],
        finalDestination: `https://${domain}/step2?session_auth=true`,
        totalHops: 1,
        statusText: 'Single Step Token Redirection',
        isCloaked: false,
      },
      technicalFindings: [
        {
          id: 'FIND-OK-01',
          title: 'Adversary-in-the-Middle (AiTM) Reverse Proxy Pattern',
          description: 'Host acts as transparent proxy to legitimate Okta endpoint while capturing session cookies.',
          evidence: 'Set-Cookie interception header detected in response stream',
          severity: 'high',
          source: 'Network Vyuha Gateway',
          ruleId: 'RULE-AITM-PROXY',
        },
        {
          id: 'FIND-OK-02',
          title: 'Missing Enterprise Content-Security-Policy',
          description: 'Critical CSP headers absent, allowing unauthorized script injection.',
          evidence: 'Header Content-Security-Policy: null',
          severity: 'medium',
          source: 'Application Shield',
          ruleId: 'RULE-MISSING-CSP',
        },
      ],
      recommendedActions: [
        {
          id: 'ACT-01',
          priority: 'Important',
          action: 'Verify domain origin through corporate password manager.',
          rationale: 'Legitimate password managers will not auto-fill on typosquatted domains.',
          role: 'User',
        },
        {
          id: 'ACT-02',
          priority: 'Important',
          action: 'Enforce FIDO2 WebAuthn hardware security keys for MFA.',
          rationale: 'FIDO2 bindings prevent AiTM session hijacking.',
          role: 'SecOps',
        },
      ],
      ed25519Signature: 'ed25519_5c82fa019481029410948b2910c84102941094b81094218a0c1048b02194',
    };
  }

  // Preset 4: Low Risk (Google Authenticator / Official Portal)
  if (lowerUrl.includes('google.com') || lowerUrl.includes('github.com') || lowerUrl.includes('microsoft.com')) {
    return {
      investigationId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      targetUrl: url,
      canonicalUrl: url,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      durationMs,
      riskClassification: 'Low Risk',
      riskScore: 4,
      confidenceScore: 99,
      evidenceCoverage: 100,
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha Simulated Heuristics (API Offline)',
      domainIntelligence: {
        domain,
        domainAge: '27 years (Registered 1997-09-15)',
        registrationDate: '1997-09-15 04:00:00 UTC',
        expirationDate: '2028-09-14 04:00:00 UTC',
        registrar: 'MarkMonitor, Inc.',
        dnsRecords: [
          { type: 'A', value: '142.250.190.46', ttl: 300 },
          { type: 'AAAA', value: '2a00:1450:4001:828::200e', ttl: 300 },
          { type: 'NS', value: 'ns1.google.com', ttl: 86400 },
          { type: 'NS', value: 'ns2.google.com', ttl: 86400 },
        ],
        dnssecStatus: 'Signed',
        ipAddress: '142.250.190.46',
        asnNumber: 'AS15169',
        asnOrganization: 'Google LLC',
        country: 'United States (US)',
        city: 'Mountain View',
        subnetCidr: '142.250.190.0/24',
        reputationScore: 2,
        reputationLabel: 'Clean',
      },
      phishingIndicators: {
        hasTyposquatting: false,
        hasHomograph: false,
        suspiciousUrlPatterns: [],
        redirectChainRisk: 'None',
        knownThreatMatches: [],
      },
      redirectAnalysis: {
        originalUrl: url,
        intermediateHops: [],
        finalDestination: url,
        totalHops: 0,
        statusText: 'Direct Authoritative Ingress',
        isCloaked: false,
      },
      technicalFindings: [
        {
          id: 'FIND-AUTH-01',
          title: 'Authoritative Extended Validation Root Trust Anchor',
          description: 'Host certificate matches global trusted root certificate authority with valid OCSP stapling.',
          evidence: 'Issuer: GTS CA 1C3 • Subject: Google Trust Services LLC',
          severity: 'info',
          source: 'PKI Certificate Auditor',
          ruleId: 'RULE-AUTHENTIC-PKI',
        },
        {
          id: 'FIND-AUTH-02',
          title: 'Strict HSTS Preload Enforcement',
          description: 'Domain is preloaded into major browsers with max-age=31536000 and includeSubDomains.',
          evidence: 'Header Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
          severity: 'info',
          source: 'Application Shield',
          ruleId: 'RULE-HSTS-PRELOAD',
        },
      ],
      recommendedActions: [
        {
          id: 'ACT-01',
          priority: 'Advisory',
          action: 'Connection verified safe. No blocking or defensive action required.',
          rationale: 'Target domain is an authoritative first-party digital service.',
          role: 'User',
        },
      ],
      ed25519Signature: 'ed25519_1a82fa019481029410948b2910c84102941094b81094218a0c1048b02194',
    };
  }

  // Preset 5: Inconclusive (Unknown domain, no verified threat, but no trust history)
  // Strictly respects: "Do not label an unknown URL as safe simply because no known threat was detected."
  return {
    investigationId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    targetUrl: url,
    canonicalUrl: url,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    durationMs,
    riskClassification: 'Inconclusive',
    riskScore: 50,
    confidenceScore: 42,
    evidenceCoverage: 48,
    isDemoState: true,
    dataSourceLabel: 'Chakravyuha Simulated Heuristics (API Offline)',
    domainIntelligence: {
      domain,
      domainAge: 'Unknown / Insufficient Telemetry',
      registrationDate: null,
      expirationDate: null,
      registrar: 'Privacy Protect, LLC (Redacted)',
      dnsRecords: [
        { type: 'A', value: '172.67.180.99', ttl: 300 },
        { type: 'NS', value: 'ns1.unknown-dns.org', ttl: 3600 },
      ],
      dnssecStatus: 'Indeterminate',
      ipAddress: '172.67.180.99',
      asnNumber: 'AS13335',
      asnOrganization: 'Cloudflare Proxy (Origin Cloaked)',
      country: 'United States (US)',
      subnetCidr: '172.67.180.0/24',
      reputationScore: 50,
      reputationLabel: 'Unknown',
    },
    phishingIndicators: {
      hasTyposquatting: false,
      hasHomograph: false,
      suspiciousUrlPatterns: [
        'Domain lacks historical reputation telemetry',
        'WHOIS record obscured behind generic privacy proxy',
      ],
      redirectChainRisk: 'None',
      knownThreatMatches: [],
    },
    redirectAnalysis: {
      originalUrl: url,
      intermediateHops: [],
      finalDestination: url,
      totalHops: 0,
      statusText: 'No Redirects Observed (Direct Probe)',
      isCloaked: false,
    },
    technicalFindings: [
      {
        id: 'FIND-INC-01',
        title: 'Insufficient Historical Evidence Coverage',
        description: 'No known threat actor signatures matched, but domain age and organizational attestation cannot be established.',
        evidence: `Telemetry confidence: 42% • Coverage: 48% • Calculated Shannon Entropy: ${calculateEntropy(domain)} bits`,
        severity: 'medium',
        source: 'Saptarishi Evaluation Core',
        ruleId: 'RULE-INCONCLUSIVE-ASSESSMENT',
      },
      {
        id: 'FIND-INC-02',
        title: 'Cloudflare Proxy Origin Cloaking',
        description: 'True origin server IP address and hosting provider are masked behind an edge CDN proxy.',
        evidence: 'IP: 172.67.180.99 (Shared Anycast IP)',
        severity: 'info',
        source: 'Network Vyuha Gateway',
        ruleId: 'RULE-PROXY-CLOAKED',
      },
    ],
    recommendedActions: [
      {
        id: 'ACT-01',
        priority: 'Important',
        action: 'Exercise heightened caution before submitting sensitive data.',
        rationale: 'Lack of verified threat intelligence does NOT confirm safety for newly observed domains.',
        role: 'User',
      },
      {
        id: 'ACT-02',
        priority: 'Important',
        action: 'Schedule automated recursive crawl in 24 hours to observe domain maturation.',
        rationale: 'Adversaries frequently register domains weeks before deploying weaponized payloads.',
        role: 'SecOps',
      },
    ],
    ed25519Signature: 'ed25519_3c82fa019481029410948b2910c84102941094b81094218a0c1048b02194',
  };
}

