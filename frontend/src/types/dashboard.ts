export type InvestigationType =
  | 'URL Analysis'
  | 'Scam Detection'
  | 'TLS Intelligence'
  | 'Website Security'
  | 'Threat Intelligence'
  | 'Blockchain Attestation';

export type DashboardRiskLevel = 'low' | 'guarded' | 'high' | 'critical';

export type InvestigationStatus = 'active' | 'mitigated' | 'investigating' | 'verified';

export interface InvestigationRecord {
  id: string;
  url: string;
  type: InvestigationType;
  riskLevel: DashboardRiskLevel;
  riskScore: number;
  status: InvestigationStatus;
  timestamp: string;
  targetIp?: string;
  threatCategory: string;
  campaign?: string;
  details: string;
  mitreTactic?: string;
  asn?: string;
}

export interface ThreatActivityItem {
  id: string;
  domain: string;
  campaign: string;
  category: string;
  riskLevel: DashboardRiskLevel;
  timestamp: string;
  indicators: string[];
  matchedLayer: string;
}

export interface StatMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  caption: string;
  variant: 'copper' | 'spruce' | 'cyan' | 'purple' | 'emerald' | 'rose';
}

