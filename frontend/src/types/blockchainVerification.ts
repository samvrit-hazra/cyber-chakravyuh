/**
 * Module 6 — Decentralized Threat Intelligence & Web3 Verification Types
 * In compliance with Problem Statement Module 6:
 * - Suspicious URL or domain indicators
 * - Reported phishing campaigns
 * - Security incident summaries
 * - Cryptographic fingerprints of reports
 * - Supporting evidence references
 * - Revisions, disputes, and validation status
 */

export type VerificationStatus =
  | 'Verified On-Chain'
  | 'Validated'
  | 'Pending Attestation'
  | 'Pending Audit'
  | 'Disputed'
  | 'Revoked'
  | 'Tamper Detected'
  | 'Unregistered';

export interface ReportRevision {
  revisionNumber: number;
  timestamp: string;
  authorDid: string;
  merkleRootHash: string;
  changeSummary: string;
}

export interface DisputeRecord {
  disputeId: string;
  challengerDid: string;
  reason: string;
  timestamp: string;
  status: 'Open' | 'Resolved' | 'Rejected';
  supportingEvidenceUri?: string;
}

export interface CorroboratingEvidenceRef {
  sourceName: string;
  evidenceType:
    | 'Threat Intelligence Match'
    | 'DNS Passive Snapshot'
    | 'Certificate Transparency Proof'
    | 'Sandbox Execution Log'
    | 'IPFS Forensic Artifact'
    | 'Phishing DOM Capture';
  artifactHash: string;
  uri?: string;
}

export interface BlockchainReportRecord {
  reportId: string;
  reportTitle: string;
  campaignName?: string; // Reported Phishing Campaign
  targetSubject: string; // Suspicious URL or domain indicator (Sanitized domain/host)
  incidentSummary?: string; // Security incident summary
  supportingEvidenceUri?: string; // Supporting evidence reference (IPFS CID / URI)
  reportFingerprint: string; // Cryptographic fingerprint (SHA-256 / Keccak-256)
  smartContractAddress: string;
  transactionHash: string;
  blockNumber: number;
  network: string; // e.g. "Ethereum Sepolia Testnet" or "Chakravyuha L2"
  gasUsed: string;
  registrationTimestamp: string;
  verificationStatus: VerificationStatus;
  submitterAddress: string;
  revisions: ReportRevision[];
  disputes?: DisputeRecord[];
  evidenceReferences: CorroboratingEvidenceRef[];
  integrityVerdict: {
    isUntampered: boolean;
    hashMatchesLedger: boolean;
    blockConfirmations: number;
    immutableReceiptUrl: string;
  };
}

export interface BlockchainVerificationQuery {
  fingerprintOrJson: string;
}
