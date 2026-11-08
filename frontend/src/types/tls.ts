/**
 * Phase 6 — TLS Certificate & Digital Trust Intelligence Types
 */

export type TlsCertificateStatus =
  | 'Valid & Trusted'
  | 'Expired Certificate'
  | 'Hostname Mismatch'
  | 'Untrusted / Self-Signed'
  | 'Revoked Certificate'
  | 'Weak Cryptography'
  | 'Compromised CA Indicator'
  | 'Inconclusive / Refused';

export type TrustGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface CertificateChainNode {
  level: 'Root CA' | 'Intermediate CA' | 'Leaf / Website';
  commonName: string;
  organization?: string;
  country?: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  fingerprintSha256: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  keySizeBits: number;
  isTrustedInSystemStore: boolean;
  keyUsage: string[];
  crlDistributionPoints?: string[];
  ocspUrl?: string;
  isRevoked?: boolean;
}

export interface CertificateTransparencyRecord {
  logOperator: string;
  logId: string;
  timestamp: string;
  logVersion: string;
  inclusionProofStatus: 'Verified' | 'Pending' | 'Missing';
  entryType: 'Precertificate' | 'X509Certificate';
}

export interface TlsSecurityFinding {
  id: string;
  category:
    | 'Expired'
    | 'Invalid'
    | 'Hostname Mismatch'
    | 'Untrusted CA'
    | 'Revocation'
    | 'Weak Cryptography'
    | 'Certificate Transparency'
    | 'Compromised CA';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  technicalDetails: string;
  isCompromisedTrust: boolean; // true = compromised trust, false = benign misconfiguration
}

export interface TlsInvestigationResult {
  investigationId: string;
  targetDomain: string;
  targetPort: number;
  analyzedAt: string;
  certificateStatus: TlsCertificateStatus;
  trustGrade: TrustGrade;
  trustScore: number; // 0 - 100
  protocolVersion: 'TLS 1.3' | 'TLS 1.2' | 'TLS 1.1' | 'TLS 1.0' | 'SSL 3.0';
  cipherSuite: string;
  isPfsSupported: boolean; // Perfect Forward Secrecy

  // Certificate Identity Overview
  subject: {
    commonName: string;
    organization?: string;
    organizationalUnit?: string;
    country?: string;
    state?: string;
    locality?: string;
  };
  issuer: {
    commonName: string;
    organization?: string;
    country?: string;
    serialNumber: string;
  };
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isExpired: boolean;
  subjectAltNames: string[];
  isHostnameMatched: boolean;

  // Cryptography Details
  signatureAlgorithm: string;
  publicKeyInfo: {
    algorithm: string;
    keySizeBits: number;
    curve?: string;
    exponent?: string;
  };

  // Revocation & CT
  ocspStapling: {
    isStapled: boolean;
    status: 'Good (Unrevoked)' | 'Revoked' | 'Unknown';
    responderUrl?: string;
  };

  // Graphical Chain & CT
  certificateChain: CertificateChainNode[];
  certificateTransparency: CertificateTransparencyRecord[];

  // Security Findings
  securityFindings: TlsSecurityFinding[];

  // Important Warnings (Required by specification)
  importantWarnings: {
    httpsNotLegitimateNotice: string;
    validTlsNotSafeNotice: string;
    caKeyGenLimitationNotice: string;
    configurationVsCompromiseNotice: string;
  };

  isDemoState: boolean;
  dataSourceLabel: string;
}

