export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 76) return 'critical';
  if (score >= 51) return 'high';
  if (score >= 26) return 'medium';
  return 'low';
}

