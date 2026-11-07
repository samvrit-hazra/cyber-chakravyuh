/**
 * Phase 8 — Threat Intelligence Domain Types
 */

export interface MaliciousDomain {
  id: string;
  domain: string;
  threatCategory: string;
  riskScore: number; // 0 - 100
  firstObserved: string;
  lastActive: string;
  isActive: boolean;
  associatedCampaignId: string;
  associatedCampaignName: string;
  ipAddress: string;
  asnNumber: string;
  asnOrg: string;
  registrar: string;
}

export interface RelatedUrl {
  id: string;
  url: string;
  domain: string;
  campaignId: string;
  detectionType: 'Credential Phish' | 'Malware Dropper' | 'Web3 Drainer' | 'Scareware Extortion';
  httpStatus: number;
  redirectTarget?: string;
  confidence: number; // 0 - 100
}

export interface PhishingCampaign {
  id: string;
  name: string;
  threatActorGroup?: string;
  targetSector: string;
  targetedBrands: string[];
  activeDomainsCount: number;
  totalIocCount: number;
  tactics: string[]; // MITRE ATT&CK
  status: 'Active' | 'Disrupted' | 'Dormant';
  firstSeen: string;
  lastActivity: string;
  description: string;
}

export interface RepeatedIndicator {
  id: string;
  indicatorType: 'Shared IP Address' | 'Bulletproof ASN' | 'Registrant Identity' | 'Favicon Hash' | 'Certificate Serial';
  value: string;
  frequency: number;
  connectedDomains: string[];
  severity: 'critical' | 'high' | 'medium';
  notes: string;
}

export interface ImpersonationPattern {
  id: string;
  targetBrand: string;
  mimicryType: 'Subdomain Prefixing' | 'Cyrillic Homoglyph' | 'TLD Substitution' | 'Hyphen Typosquatting';
  observedDomain: string;
  similarityRatio: number;
  pretext: string;
}

export interface ThreatIncidentReport {
  id: string;
  title: string;
  targetDomain: string;
  campaignName: string;
  threatSeverity: 'critical' | 'high' | 'medium';
  timestamp: string;
  reportedBy: string;
  corroboratingSources: string[];
  evidenceSummary: string;
  onChainVerificationHash?: string;
}

// Visual Graph Nodes and Evidence Links
export type ThreatNodeType = 'campaign' | 'domain' | 'url' | 'incident' | 'indicator';

export interface ThreatGraphNode {
  id: string;
  label: string;
  type: ThreatNodeType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  details?: string;
}

export interface ThreatGraphLink {
  source: string;
  target: string;
  relationship: string;
  evidenceBasis: string; // Factual basis for the relationship
}

