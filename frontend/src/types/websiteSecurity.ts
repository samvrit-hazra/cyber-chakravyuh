/**
 * Phase 7 — Website Security Assessment Domain Types
 */

export type AssessmentCategory =
  | 'HTTP & HTTPS Configuration'
  | 'Security Headers'
  | 'TLS Configuration'
  | 'Mixed Content'
  | 'Suspicious Redirects'
  | 'Publicly Exposed Endpoints'
  | 'Software Version Information';

export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type SecurityGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface AssessmentFinding {
  id: string;
  category: AssessmentCategory;
  issueName: string;
  technicalEvidence: string;
  severity: SecuritySeverity;
  potentialImpact: string;
  recommendedRemediation: string;
  assessmentLimitations: string;
  remediationSnippet?: string; // Nginx, Apache, or Cloudflare directive
}

export interface CategoryScore {
  category: AssessmentCategory;
  score: number; // 0 - 100
  passedCount: number;
  issueCount: number;
  status: 'Optimal' | 'Adequate' | 'Deficient' | 'Hazardous';
}

export interface WebsiteSecurityAssessmentResult {
  assessmentId: string;
  targetUrl: string;
  canonicalHost: string;
  assessedAt: string;
  securityScore: number; // 0 - 100
  securityGrade: SecurityGrade;
  summaryVerdict: string;
  categoryScores: CategoryScore[];
  findings: AssessmentFinding[];
  passiveSafetyNotice: string;
  isDemoState: boolean;
  dataSourceLabel: string;
}

