/**
 * Phase 5 — AI-Powered Scam & Message Analysis Types
 */

export type ScamRiskClassification =
  | 'Confirmed Scam / Fraud'
  | 'High Risk / Likely Deceptive'
  | 'Suspicious'
  | 'Low Risk / Likely Legitimate'
  | 'Inconclusive';

export type ScamCategory =
  | 'Phishing & Credential Harvest'
  | 'Financial & Crypto Investment'
  | 'Employment & Task Scam'
  | 'Executive Impersonation (CEO Fraud)'
  | 'Tech Support & Extortion'
  | 'Advance-Fee / Lottery'
  | 'Benign Communication'
  | 'Uncategorized';

export interface ExtractedUrl {
  url: string;
  domain: string;
  riskRating: 'Hostile' | 'Suspicious' | 'Clean' | 'Unknown';
  isShortened: boolean;
  notes?: string;
}

export interface ExtractedEmail {
  address: string;
  domain: string;
  isFreeProvider: boolean;
  isLookalike: boolean;
  notes?: string;
}

export interface ExtractedPhone {
  number: string;
  formatted: string;
  countryCode?: string;
  isTollFreeOrVoip: boolean;
  notes?: string;
}

export interface SuspiciousEntity {
  name: string;
  type: 'Organization' | 'Cryptocurrency Wallet' | 'Person / Alias' | 'Case Reference' | 'Financial Platform';
  details: string;
  riskWeight: 'critical' | 'high' | 'medium' | 'low';
}

export interface ManipulationIndicator {
  technique: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  explanation: string;
  supportingSnippet: string;
}

export interface PaymentIndicator {
  method: 'Cryptocurrency' | 'Gift Cards' | 'Wire Transfer' | 'P2P (Zelle/Venmo/CashApp)' | 'Direct Card Entry' | 'None';
  riskLevel: 'critical' | 'high' | 'medium' | 'none';
  evidenceSnippet?: string;
  details: string;
}

export interface SupportingSnippet {
  quote: string;
  context: string;
  flaggedReason: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface EvidenceVsInterpretation {
  hardEvidence: string[];
  aiInterpretation: string[];
}

export interface ScamAnalysisResult {
  analysisId: string;
  analyzedAt: string;
  contentLength: number;
  rawSnippet: string;
  riskClassification: ScamRiskClassification;
  riskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  scamCategory: ScamCategory;
  isDemoState: boolean;
  dataSourceLabel: string;

  // 1. Language & Manipulation
  suspiciousLanguage: {
    flaggedKeywords: string[];
    syntaxNotes: string[];
    sentimentTone: string;
    deceptiveStyleScore: number; // 0 - 100
  };

  urgencyAndManipulation: {
    urgencyScore: number; // 0 - 100
    isUrgencyLegitimate: boolean;
    urgencyRationale: string;
    indicators: ManipulationIndicator[];
  };

  // 2. Impersonation & Payments
  impersonation: {
    isImpersonationDetected: boolean;
    impersonatedEntity?: string;
    entityType?: 'Financial Institution' | 'Financial Platform' | 'Government Body' | 'Corporate Executive' | 'Tech Support' | 'Service Provider';
    channelDiscrepancy: string;
    similarityPercent?: number;
  };

  paymentIndicators: PaymentIndicator[];

  // 3. Extracted Technical Indicators
  extractedUrls: ExtractedUrl[];
  extractedEmails: ExtractedEmail[];
  extractedPhones: ExtractedPhone[];
  suspiciousEntities: SuspiciousEntity[];

  // 4. AI Explanation
  aiExplanation: {
    summaryRationale: string;
    supportingSnippets: SupportingSnippet[];
    manipulationTechniques: string[];
    evidenceVsInterpretation: EvidenceVsInterpretation;
  };

  // 5. Recommended Precautions
  recommendedPrecautions: {
    id: string;
    priority: 'Immediate' | 'Important' | 'Advisory';
    instruction: string;
    rationale: string;
  }[];

  securityDisclosureNotice: string;
}
