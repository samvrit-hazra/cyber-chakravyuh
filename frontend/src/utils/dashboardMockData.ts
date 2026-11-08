import type {
  InvestigationRecord,
  ThreatActivityItem,
  StatMetric,
} from '../types/dashboard.ts';

export const mockStatMetrics: StatMetric[] = [
  {
    id: 'total-investigations',
    title: 'Total Investigations',
    value: '0',
    change: '0.0%',
    trend: 'neutral',
    caption: 'Live scans initiated by user',
    variant: 'cyan',
  },
  {
    id: 'high-risk-findings',
    title: 'High-Risk Findings',
    value: '0',
    change: '0.0%',
    trend: 'neutral',
    caption: 'Confirmed malicious payloads & phishing intercepts',
    variant: 'rose',
  },
  {
    id: 'suspicious-domains',
    title: 'Suspicious Domains',
    value: '0',
    change: '0.0%',
    trend: 'neutral',
    caption: 'Deceptive indicators & homoglyph spoofs',
    variant: 'copper',
  },
  {
    id: 'verified-reports',
    title: 'Verified Reports',
    value: '0',
    change: '0.0%',
    trend: 'neutral',
    caption: 'Cryptographically signed audit records',
    variant: 'emerald',
  },
];

export const mockInvestigations: InvestigationRecord[] = [];

export const mockThreatActivities: ThreatActivityItem[] = [];

export const mockActivityTimeline: { time: string; scans: number; threats: number }[] = [];

export const mockLayerDistribution: { layer: string; count: number; percentage: number; color: string }[] = [];

export const mockRiskClassification: { level: string; count: number; percentage: number; color: string }[] = [];

export const mockCategoryDistribution: { category: string; count: number; percent: number; color: string }[] = [];
