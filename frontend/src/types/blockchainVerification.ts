/**
 * Phase 8 — Blockchain Threat Registry & Web3 Verification Types
 */

export type VerificationStatus =
  | 'Verified On-Chain'
  | 'Pending Attestation'
  | 'Tamper Detected'
  | 'Unregistered';

export interface ReportRevision {
  revisionNumber: number;
  timestamp: string;
  authorDid: string;
  merkleRootHash: string;
  changeSummary: string;
}

export interface CorroboratingEvidenceRef {
  sourceName: string;
  evidenceType: 'Threat Intelligence Match' | 'DNS Passive Snapshot' | 'Certificate Transparency Proof' | 'Sandbox Execution Log';
  artifactHash: string;
  uri?: string;
}

export interface BlockchainReportRecord {
  reportId: string;
  reportTitle: string;
  targetSubject: string; // Domain, URL hash, or Campaign name (Sanitized!)
  reportFingerprint: string; // Keccak-256 / SHA-256 cryptographic digest
  smartContractAddress: string;
  transactionHash: string;
  blockNumber: number;
  network: string; // e.g. "Chakravyuha L2 (Ethereum Rollup)"
  gasUsed: string;
  registrationTimestamp: string;
  verificationStatus: VerificationStatus;
  submitterAddress: string;
  revisions: ReportRevision[];
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

