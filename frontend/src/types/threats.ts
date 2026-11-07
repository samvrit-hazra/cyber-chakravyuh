export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export type DefenseLayer =
  | 'Perimeter (Saptarishi)'
  | 'Network (Vyuha Gateway)'
  | 'Identity & Access'
  | 'Endpoint Intel'
  | 'Application Shield'
  | 'Data Vault'
  | 'Cognitive Core';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  layer: DefenseLayer;
  sourceIp?: string;
  targetAsset: string;
  status: 'active' | 'mitigated' | 'investigating';
  riskScore: number;
}

export interface SecurityScoreOverview {
  overallScore: number; // 0 - 100
  trustGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  activeThreatCount: number;
  mitigatedThreatCount: number;
  systemIntegrity: number; // percentage
  aiConfidence: number; // percentage
}

