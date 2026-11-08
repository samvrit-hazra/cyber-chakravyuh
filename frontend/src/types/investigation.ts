/**
 * Phase 4 — Intelligent URL Investigation Domain Types
 */

export type RiskClassification =
  | 'Low Risk'
  | 'Suspicious'
  | 'High Risk'
  | 'Confirmed Malicious'
  | 'Inconclusive';

export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT';
  value: string;
  ttl?: number;
}

export interface DomainIntelligence {
  domain: string;
  domainAge: string | null;
  registrationDate: string | null;
  expirationDate: string | null;
  registrar: string | null;
  dnsRecords: DnsRecord[];
  dnssecStatus: 'Signed' | 'Unsigned' | 'Indeterminate';
  ipAddress: string;
  asnNumber: string;
  asnOrganization: string;
  country: string;
  city?: string;
  subnetCidr: string;
  reputationScore: number; // 0 - 100
  reputationLabel: 'Clean' | 'Questionable' | 'Poor' | 'Hostile' | 'Unknown';
}

export interface PhishingIndicators {
  hasTyposquatting: boolean;
  typosquattingTarget?: string;
  hasHomograph: boolean;
  homographDetails?: string;
  suspiciousUrlPatterns: string[];
  redirectChainRisk: 'None' | 'Low' | 'Moderate' | 'Cloaking Detected';
  impersonatedBrand?: string;
  brandSimilarityPercent?: number;
  knownThreatMatches: {
    database: string;
    signature: string;
    category: string;
    matchConfidence: number;
  }[];
}

export interface RedirectHop {
  hopNumber: number;
  url: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  isSsl: boolean;
  note?: string;
}

export interface RedirectAnalysis {
  originalUrl: string;
  intermediateHops: RedirectHop[];
  finalDestination: string;
  totalHops: number;
  statusText: string;
  isCloaked: boolean;
}

export type EvidenceSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface TechnicalFinding {
  id: string;
  title: string;
  description: string;
  evidence: string;
  severity: EvidenceSeverity;
  source: string;
  ruleId?: string;
}

export interface RecommendedAction {
  id: string;
  priority: 'Immediate' | 'Important' | 'Advisory';
  action: string;
  rationale: string;
  role: 'User' | 'SecOps' | 'Network Admin';
}

export interface UrlInvestigationResult {
  investigationId: string;
  targetUrl: string;
  canonicalUrl: string;
  timestamp: string;
  durationMs: number;
  riskClassification: RiskClassification;
  riskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  evidenceCoverage: number; // 0 - 100
  isDemoState: boolean;
  dataSourceLabel: string;
  domainIntelligence: DomainIntelligence;
  phishingIndicators: PhishingIndicators;
  redirectAnalysis: RedirectAnalysis;
  technicalFindings: TechnicalFinding[];
  recommendedActions: RecommendedAction[];
  ed25519Signature: string;
  reportHash?: string;
  txHash?: string;
  blockchainStatus?: string;
  contractAddress?: string;
  etherscanUrl?: string;
}

