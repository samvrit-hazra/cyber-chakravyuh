import type {
  MaliciousDomain,
  PhishingCampaign,
  RepeatedIndicator,
  RelatedUrl,
  ImpersonationPattern,
  ThreatIncidentReport,
  ThreatGraphNode,
  ThreatGraphLink,
} from '../types/threatIntelligence.ts';

export const MOCK_CAMPAIGNS: PhishingCampaign[] = [
  {
    id: 'CAMP-PHANTOM',
    name: 'Operation PhantomHook',
    threatActorGroup: 'FIN-7 Affiliated Cluster',
    targetSector: 'Banking & Financial Institutions',
    targetedBrands: ['JPMorgan Chase', 'PayPal', 'Wells Fargo'],
    activeDomainsCount: 14,
    totalIocCount: 48,
    tactics: ['T1566.002 Spearphishing Link', 'T1556 Reverse Proxy Phish', 'T1110 Credential Stuffing'],
    status: 'Active',
    firstSeen: '2026-10-12',
    lastActivity: '2026-11-07 14:22 UTC',
    description: 'Automated adversary-in-the-middle (AiTM) kit bypassing standard 2FA via real-time session cookie harvesting.',
  },
  {
    id: 'CAMP-HYDRA',
    name: 'HydraDrain Web3 Syndicate',
    threatActorGroup: 'PinkDrainer Variant',
    targetSector: 'Decentralized Finance & Web3 Wallets',
    targetedBrands: ['MetaMask', 'Uniswap', 'OpenSea'],
    activeDomainsCount: 9,
    totalIocCount: 31,
    tactics: ['T1659 Social Engineering', 'T1565 Data Manipulation', 'T1499 Malicious Web3 Contract'],
    status: 'Active',
    firstSeen: '2026-10-28',
    lastActivity: '2026-11-07 16:04 UTC',
    description: 'Weaponized Permit2 token approval and eth_sign pop-up mimics designed to drain ERC-20 and NFT assets.',
  },
  {
    id: 'CAMP-SPECTER',
    name: 'SpecterSSO Enterprise Mesh',
    threatActorGroup: 'UNC3944 / Scattered Spider Sub-group',
    targetSector: 'Corporate Identity & Cloud SaaS',
    targetedBrands: ['Okta', 'Microsoft 365', 'Google Workspace'],
    activeDomainsCount: 6,
    totalIocCount: 22,
    tactics: ['T1566.001 Spearphishing Attachment', 'T1556 MFA Fatigue', 'T1078 Valid Accounts'],
    status: 'Active',
    firstSeen: '2026-11-01',
    lastActivity: '2026-11-07 11:30 UTC',
    description: 'Targeted executive spear-phishing targeting corporate help desks and single sign-on authentication perimeters.',
  },
];

export const MOCK_MALICIOUS_DOMAINS: MaliciousDomain[] = [
  {
    id: 'DOM-01',
    domain: 'paypal-security.account-update.phish-alert.net',
    threatCategory: 'Credential Harvester',
    riskScore: 96,
    firstObserved: '2026-11-04',
    lastActive: '2026-11-07',
    isActive: true,
    associatedCampaignId: 'CAMP-PHANTOM',
    associatedCampaignName: 'Operation PhantomHook',
    ipAddress: '185.191.171.12',
    asnNumber: 'AS49505',
    asnOrg: 'Bulletproof Russian Federation Host',
    registrar: 'NiceNIC International Group',
  },
  {
    id: 'DOM-02',
    domain: 'chase-security-resolver.online',
    threatCategory: 'SMS Smishing Gateway',
    riskScore: 94,
    firstObserved: '2026-11-05',
    lastActive: '2026-11-07',
    isActive: true,
    associatedCampaignId: 'CAMP-PHANTOM',
    associatedCampaignName: 'Operation PhantomHook',
    ipAddress: '185.191.171.12',
    asnNumber: 'AS49505',
    asnOrg: 'Bulletproof Russian Federation Host',
    registrar: 'Hostinger Operations',
  },
  {
    id: 'DOM-03',
    domain: 'metamask-claim-airdrop-rewards.finance.io',
    threatCategory: 'Web3 Wallet Drainer',
    riskScore: 92,
    firstObserved: '2026-11-02',
    lastActive: '2026-11-07',
    isActive: true,
    associatedCampaignId: 'CAMP-HYDRA',
    associatedCampaignName: 'HydraDrain Web3 Syndicate',
    ipAddress: '104.21.55.82',
    asnNumber: 'AS13335',
    asnOrg: 'Cloudflare Proxied Anycast',
    registrar: 'NameCheap, Inc.',
  },
  {
    id: 'DOM-04',
    domain: 'uniswap-v4-airdrop-pool.xyz',
    threatCategory: 'Web3 Permit2 Drainer',
    riskScore: 89,
    firstObserved: '2026-11-03',
    lastActive: '2026-11-07',
    isActive: true,
    associatedCampaignId: 'CAMP-HYDRA',
    associatedCampaignName: 'HydraDrain Web3 Syndicate',
    ipAddress: '104.21.55.82',
    asnNumber: 'AS13335',
    asnOrg: 'Cloudflare Proxied Anycast',
    registrar: 'Porkbun LLC',
  },
  {
    id: 'DOM-05',
    domain: 'internal-sso.okta.enterprise-auth.cloud',
    threatCategory: 'SSO Credential Intercept',
    riskScore: 88,
    firstObserved: '2026-11-06',
    lastActive: '2026-11-07',
    isActive: true,
    associatedCampaignId: 'CAMP-SPECTER',
    associatedCampaignName: 'SpecterSSO Enterprise Mesh',
    ipAddress: '194.26.29.114',
    asnNumber: 'AS200019',
    asnOrg: 'Alexhost SRL Offshore',
    registrar: 'Tucows Domains Inc.',
  },
];

export const MOCK_RELATED_URLS: RelatedUrl[] = [
  {
    id: 'URL-01',
    url: 'https://paypal-security.account-update.phish-alert.net/login',
    domain: 'paypal-security.account-update.phish-alert.net',
    campaignId: 'CAMP-PHANTOM',
    detectionType: 'Credential Phish',
    httpStatus: 200,
    confidence: 99,
  },
  {
    id: 'URL-02',
    url: 'https://chase-security-resolver.online/unlock?case=9412',
    domain: 'chase-security-resolver.online',
    campaignId: 'CAMP-PHANTOM',
    detectionType: 'Credential Phish',
    httpStatus: 302,
    redirectTarget: 'https://chase-security-resolver.online/auth/login.php',
    confidence: 98,
  },
  {
    id: 'URL-03',
    url: 'https://metamask-claim-airdrop-rewards.finance.io/connect',
    domain: 'metamask-claim-airdrop-rewards.finance.io',
    campaignId: 'CAMP-HYDRA',
    detectionType: 'Web3 Drainer',
    httpStatus: 200,
    confidence: 94,
  },
  {
    id: 'URL-04',
    url: 'https://internal-sso.okta.enterprise-auth.cloud/step2',
    domain: 'internal-sso.okta.enterprise-auth.cloud',
    campaignId: 'CAMP-SPECTER',
    detectionType: 'Credential Phish',
    httpStatus: 200,
    confidence: 92,
  },
];

export const MOCK_REPEATED_INDICATORS: RepeatedIndicator[] = [
  {
    id: 'IND-01',
    indicatorType: 'Shared IP Address',
    value: '185.191.171.12',
    frequency: 8,
    connectedDomains: ['paypal-security.account-update.phish-alert.net', 'chase-security-resolver.online', 'wells-security.com'],
    severity: 'critical',
    notes: 'Single unmanaged host routing multiple bank phishing lures simultaneously.',
  },
  {
    id: 'IND-02',
    indicatorType: 'Bulletproof ASN',
    value: 'AS49505 (Severen-Telecom / Bulletproof)',
    frequency: 14,
    connectedDomains: ['paypal-security.account-update.phish-alert.net', 'chase-security-resolver.online'],
    severity: 'critical',
    notes: 'Offshore routing provider historically non-responsive to law enforcement take-down requests.',
  },
  {
    id: 'IND-03',
    indicatorType: 'Favicon Hash',
    value: 'mmh3:-192840192 (PayPal Canonical)',
    frequency: 11,
    connectedDomains: ['paypal-security.account-update.phish-alert.net', 'paypal-verify.net'],
    severity: 'high',
    notes: 'Exact MurmurHash3 favicon signature stolen from legitimate PayPal assets.',
  },
  {
    id: 'IND-04',
    indicatorType: 'Certificate Serial',
    value: 'Let\'s Encrypt R3 Cross-Sign (0461829012398b1a80c2)',
    frequency: 6,
    connectedDomains: ['metamask-claim-airdrop-rewards.finance.io', 'uniswap-v4-airdrop-pool.xyz'],
    severity: 'medium',
    notes: 'Consecutively issued short-lived ACME certificates minted within minutes of domain registration.',
  },
];

export const MOCK_IMPERSONATION_PATTERNS: ImpersonationPattern[] = [
  {
    id: 'IMP-01',
    targetBrand: 'PayPal',
    mimicryType: 'Subdomain Prefixing',
    observedDomain: 'paypal-security.account-update.phish-alert.net',
    similarityRatio: 94,
    pretext: 'Account limitation alert demanding re-verification of credit card and identity numbers.',
  },
  {
    id: 'IMP-02',
    targetBrand: 'JPMorgan Chase Bank',
    mimicryType: 'Hyphen Typosquatting',
    observedDomain: 'chase-security-resolver.online',
    similarityRatio: 92,
    pretext: 'SMS smishing alert warning of unrecognized $1,429.99 Target transaction.',
  },
  {
    id: 'IMP-03',
    targetBrand: 'MetaMask',
    mimicryType: 'TLD Substitution',
    observedDomain: 'metamask-claim-airdrop-rewards.finance.io',
    similarityRatio: 88,
    pretext: 'Fake seasonal reward airdrop prompting eth_sign Permit2 wallet drainer.',
  },
  {
    id: 'IMP-04',
    targetBrand: 'Okta Enterprise SSO',
    mimicryType: 'Subdomain Prefixing',
    observedDomain: 'internal-sso.okta.enterprise-auth.cloud',
    similarityRatio: 90,
    pretext: 'Routine corporate authentication renewal designed to capture corporate employee MFA keys.',
  },
];

export const MOCK_THREAT_REPORTS: ThreatIncidentReport[] = [
  {
    id: 'REP-941029',
    title: 'PhishAlert Banking AiTM Reverse Proxy Ingress',
    targetDomain: 'paypal-security.account-update.phish-alert.net',
    campaignName: 'Operation PhantomHook',
    threatSeverity: 'critical',
    timestamp: '2026-11-07 14:15 UTC',
    reportedBy: 'Chakravyuha Perimeter Mesh Node #4',
    corroboratingSources: ['AlienVault OTX', 'URLhaus', 'Saptarishi Automated Crawler'],
    evidenceSummary: 'Active session cookie interception confirmed via reverse proxy telemetry. Shared IP 185.191.171.12 corroborates 8 related financial lures.',
    onChainVerificationHash: '0x8f49b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840192',
  },
  {
    id: 'REP-940812',
    title: 'Chase SMS Fraud Notification Smishing Campaign',
    targetDomain: 'chase-security-resolver.online',
    campaignName: 'Operation PhantomHook',
    threatSeverity: 'critical',
    timestamp: '2026-11-07 11:42 UTC',
    reportedBy: 'Telecom Threat Exchange Gateway',
    corroboratingSources: ['7726 SPAM Aggregator', 'VirusTotal URL Engine'],
    evidenceSummary: 'Target domain registered 48 hours prior. Employs 2-hour coercive cancellation timer.',
    onChainVerificationHash: '0x3c82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
  },
  {
    id: 'REP-938210',
    title: 'Web3 Airdrop Permit2 Malicious Approval Drainer',
    targetDomain: 'metamask-claim-airdrop-rewards.finance.io',
    campaignName: 'HydraDrain Web3 Syndicate',
    threatSeverity: 'high',
    timestamp: '2026-11-06 18:20 UTC',
    reportedBy: 'Web3 On-Chain Security Attestation Node',
    corroboratingSources: ['Etherscan Malicious Contract Registry', 'Blockaid Feed'],
    evidenceSummary: 'Injects fake MetaMask modal requesting unlimited ERC-20 token transfer approval.',
    onChainVerificationHash: '0x1a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
  },
];

// Relationship Network Graph Data
export const THREAT_GRAPH_NODES: ThreatGraphNode[] = [
  // Campaign Nodes
  { id: 'node-c1', label: 'Operation PhantomHook', type: 'campaign', severity: 'critical', details: 'Financial AiTM Phishing Campaign' },
  { id: 'node-c2', label: 'HydraDrain Web3', type: 'campaign', severity: 'critical', details: 'DeFi Permit2 Drainer Campaign' },
  { id: 'node-c3', label: 'SpecterSSO Mesh', type: 'campaign', severity: 'high', details: 'Corporate Identity Spear-Phish' },

  // Domain Nodes
  { id: 'node-d1', label: 'paypal-security.phish-alert.net', type: 'domain', severity: 'critical', details: 'IP: 185.191.171.12 (AS49505)' },
  { id: 'node-d2', label: 'chase-security-resolver.online', type: 'domain', severity: 'critical', details: 'IP: 185.191.171.12 (AS49505)' },
  { id: 'node-d3', label: 'metamask-claim-airdrop.finance.io', type: 'domain', severity: 'high', details: 'Cloudflare Proxied Anycast' },
  { id: 'node-d4', label: 'internal-sso.enterprise-auth.cloud', type: 'domain', severity: 'high', details: 'Alexhost Offshore IP' },

  // URL Ingress Nodes
  { id: 'node-u1', label: '/login (PayPal Lure)', type: 'url', severity: 'critical', details: 'Active credential capture' },
  { id: 'node-u2', label: '/unlock?case=9412', type: 'url', severity: 'critical', details: 'Coercive 2-hour smishing link' },
  { id: 'node-u3', label: '/connect (Web3)', type: 'url', severity: 'high', details: 'Permit2 approval popover' },

  // Reported Incident Nodes
  { id: 'node-i1', label: 'Incident #941029 (Banking Smish)', type: 'incident', severity: 'critical', details: 'Corroborated by AlienVault & URLhaus' },
  { id: 'node-i2', label: 'Incident #938210 (Drainer Trap)', type: 'incident', severity: 'high', details: 'Corroborated by Etherscan & Blockaid' },

  // Shared Indicator
  { id: 'node-ind1', label: 'Shared IP: 185.191.171.12', type: 'indicator', severity: 'critical', details: 'Bulletproof ASN AS49505' },
];

export const THREAT_GRAPH_LINKS: ThreatGraphLink[] = [
  // Campaign -> Domain
  { source: 'node-c1', target: 'node-d1', relationship: 'Controls Infrastructure', evidenceBasis: 'Coordinated DNS registration & identical reverse proxy AiTM payload' },
  { source: 'node-c1', target: 'node-d2', relationship: 'Controls Infrastructure', evidenceBasis: 'Shared registration timeline & matching SSL fingerprint' },
  { source: 'node-c2', target: 'node-d3', relationship: 'Controls Infrastructure', evidenceBasis: 'Identical Permit2 smart contract ABI caller' },
  { source: 'node-c3', target: 'node-d4', relationship: 'Controls Infrastructure', evidenceBasis: 'Targeted executive spear-phishing lure match' },

  // Domain -> Ingress URL
  { source: 'node-d1', target: 'node-u1', relationship: 'Hosts Weaponized Path', evidenceBasis: 'Active HTTP 200 payload with fake PayPal login form' },
  { source: 'node-d2', target: 'node-u2', relationship: 'Hosts Weaponized Path', evidenceBasis: 'Direct link transmitted in SMS messages' },
  { source: 'node-d3', target: 'node-u3', relationship: 'Hosts Weaponized Path', evidenceBasis: 'Web3 RPC provider hook for wallet signature' },

  // Evidence Connections: Shared Indicator
  { source: 'node-d1', target: 'node-ind1', relationship: 'Resolves To', evidenceBasis: 'DNS A Record: 185.191.171.12 (Confirmed by 3 global resolvers)' },
  { source: 'node-d2', target: 'node-ind1', relationship: 'Resolves To', evidenceBasis: 'DNS A Record: 185.191.171.12 (Colocated on bulletproof VPS)' },

  // Incident -> Domain & Campaign
  { source: 'node-i1', target: 'node-d1', relationship: 'Documents Hostility', evidenceBasis: 'Verified victim credential interception report' },
  { source: 'node-i1', target: 'node-c1', relationship: 'Attributes To', evidenceBasis: 'Identical AiTM kit parameters matching FIN-7 cluster' },
  { source: 'node-i2', target: 'node-d3', relationship: 'Documents Hostility', evidenceBasis: 'On-chain transaction hash showing drained assets' },
];

