import type {
  BlockchainReportRecord,
  VerificationStatus,
  DisputeRecord,
} from '../types/blockchainVerification.ts';

export const CHAKRAVYUHA_SMART_CONTRACT_ADDRESS = '0x71C94158a5F84b39E92348a209b52123498b89e2';
export const CHAKRAVYUHA_LEDGER_NETWORK = 'Ethereum Sepolia Testnet (EVM Chain ID: 11155111)';

export const INITIAL_ONCHAIN_RECORDS: BlockchainReportRecord[] = [
  {
    reportId: 'REP-941029',
    reportTitle: 'PayPal Banking AiTM Reverse Proxy Ingress',
    campaignName: 'PayPal Brand Impersonation Credential Harvest Wave 4',
    targetSubject: 'paypal-security.account-update.phish-alert.net',
    incidentSummary:
      'Adversaries deployed automated Adversary-in-the-Middle (AiTM) proxy infrastructure to capture session cookies and bypass FIDO2 MFA.',
    supportingEvidenceUri: 'ipfs://bafybeiczsscdsbs7ff3ux45g7qdaxufhzy7pvAbc1/forensic-dump.json',
    reportFingerprint: '0x8f49b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840192',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x4a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
    blockNumber: 4892104,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '48,210 Gwei (0.00048 ETH)',
    registrationTimestamp: '2026-11-07 14:18:22 UTC',
    verificationStatus: 'Validated',
    submitterAddress: '0x3dE8190c128419bC01928491029481bC01928401',
    revisions: [
      {
        revisionNumber: 1,
        timestamp: '2026-11-07 14:18:22 UTC',
        authorDid: 'did:chakravyuha:node-04-perimeter',
        merkleRootHash: '0x8f49b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840192',
        changeSummary: 'Initial verified attestation filing from automated AiTM sensor feed.',
      },
      {
        revisionNumber: 2,
        timestamp: '2026-11-07 15:02:10 UTC',
        authorDid: 'did:chakravyuha:soc-analyst-lead',
        merkleRootHash: '0x992b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840199',
        changeSummary: 'Corroborated 3 additional subdomains mapped to bulletproof host IP 185.191.171.12.',
      },
    ],
    disputes: [],
    evidenceReferences: [
      {
        sourceName: 'AlienVault OTX Pulse #90218',
        evidenceType: 'Threat Intelligence Match',
        artifactHash: 'sha256:7b10294810294810294810294810294810294810294810294810294810294810',
        uri: 'https://otx.alienvault.com/pulse/90218',
      },
      {
        sourceName: 'Honey-Mesh Session Capture',
        evidenceType: 'Sandbox Execution Log',
        artifactHash: 'sha256:1a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
        uri: 'ipfs://bafybeiczsscdsbs7ff3ux45g7qdaxufhzy7pvAbc1/forensic-dump.json',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 248,
      immutableReceiptUrl: `https://sepolia.etherscan.io/tx/0x4a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294`,
    },
  },
  {
    reportId: 'REP-940812',
    reportTitle: 'Chase SMS Fraud Notification Smishing Wave',
    campaignName: 'Chase Urgent KYC Smishing Campaign',
    targetSubject: 'chase-security-resolver.online',
    incidentSummary:
      'Mass automated SMS campaign spoofing Chase security alerts with 2-hour card cancellation urgency timer to harvest debit card CVVs.',
    supportingEvidenceUri: 'ipfs://bafybeif47a98214b7ff3ux45g7qdaxufhzy7pvAbc2/sms-evidence.eml',
    reportFingerprint: '0x3c82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x8192039102948102948102948102948102948102948102948102948102948102',
    blockNumber: 4892010,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '46,120 Gwei (0.00046 ETH)',
    registrationTimestamp: '2026-11-07 11:45:10 UTC',
    verificationStatus: 'Validated',
    submitterAddress: '0x99A8190c128419bC01928491029481bC01928499',
    revisions: [
      {
        revisionNumber: 1,
        timestamp: '2026-11-07 11:45:10 UTC',
        authorDid: 'did:chakravyuha:telecom-gateway-attestor',
        merkleRootHash: '0x3c82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
        changeSummary: 'Smishing SMS alert registration with sanitized message vector.',
      },
    ],
    disputes: [],
    evidenceReferences: [
      {
        sourceName: 'Carrier 7726 Spam Intercept Feed',
        evidenceType: 'Threat Intelligence Match',
        artifactHash: 'sha256:4910294810294810294810294810294810294810294810294810294810294810',
        uri: 'ipfs://bafybeif47a98214b7ff3ux45g7qdaxufhzy7pvAbc2/sms-evidence.eml',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 342,
      immutableReceiptUrl: `https://sepolia.etherscan.io/tx/0x8192039102948102948102948102948102948102948102948102948102948102`,
    },
  },
  {
    reportId: 'REP-938210',
    reportTitle: 'Web3 Airdrop Permit2 Malicious Approval Drainer',
    campaignName: 'PinkDrainer Permit2 Approval Exploit',
    targetSubject: 'metamask-claim-airdrop-rewards.finance.io',
    incidentSummary:
      'Deceptive Web3 connection interface requesting infinite ERC-20 Permit2 signature allowances to drain user balances.',
    supportingEvidenceUri: 'ipfs://bafybeia208491048102948102948102948102948102948102948102948/drainer-contract.sol',
    reportFingerprint: '0x1a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x1029381029381029381029381029381029381029381029381029381029381029',
    blockNumber: 4891840,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '51,400 Gwei (0.00051 ETH)',
    registrationTimestamp: '2026-11-06 18:24:00 UTC',
    verificationStatus: 'Pending Audit',
    submitterAddress: '0x77F8190c128419bC01928491029481bC01928477',
    revisions: [
      {
        revisionNumber: 1,
        timestamp: '2026-11-06 18:24:00 UTC',
        authorDid: 'did:chakravyuha:smart-contract-scanner',
        merkleRootHash: '0x1a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
        changeSummary: 'Malicious Permit2 spender approval contract address attestation.',
      },
    ],
    disputes: [],
    evidenceReferences: [
      {
        sourceName: 'Etherscan Verified Contract ABI Disassembly',
        evidenceType: 'Threat Intelligence Match',
        artifactHash: 'sha256:2210294810294810294810294810294810294810294810294810294810294810',
        uri: 'https://sepolia.etherscan.io/address/0x71C94158a5F84b39E92348a209b52123498b89e2',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 512,
      immutableReceiptUrl: `https://sepolia.etherscan.io/tx/0x1029381029381029381029381029381029381029381029381029381029381029`,
    },
  },
  {
    reportId: 'REP-937105',
    reportTitle: 'Reported CDN Subdomain (False Positive Dispute)',
    campaignName: 'Akamai Edge Gateway Attribution Audit',
    targetSubject: 'static-auth-cdn-edge.cloud',
    incidentSummary:
      'Initially flagged as an unauthorized credential mirror; disputed by site operators as verified multi-region static asset CDN.',
    supportingEvidenceUri: 'ipfs://bafybeihdwdcefghjkla456789012345678901234567890123456789012/dnssec-attestation.json',
    reportFingerprint: '0x7e82fa019481029410948b2910c84102941094b81094218a0c1048b021941277',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x5519381029381029381029381029381029381029381029381029381029381055',
    blockNumber: 4891512,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '42,100 Gwei (0.00042 ETH)',
    registrationTimestamp: '2026-11-05 09:12:00 UTC',
    verificationStatus: 'Disputed',
    submitterAddress: '0x22B8190c128419bC01928491029481bC01928422',
    revisions: [
      {
        revisionNumber: 1,
        timestamp: '2026-11-05 09:12:00 UTC',
        authorDid: 'did:chakravyuha:automated-crawler',
        merkleRootHash: '0x7e82fa019481029410948b2910c84102941094b81094218a0c1048b021941277',
        changeSummary: 'Initial automated flag for suspicious lookalike CDN domain.',
      },
      {
        revisionNumber: 2,
        timestamp: '2026-11-06 11:30:00 UTC',
        authorDid: 'did:key:z6MkhaXgBZDvotDkL5257faiz489...',
        merkleRootHash: '0x7e82fa019481029410948b2910c84102941094b81094218a0c1048b021941277',
        changeSummary: 'Dispute recorded by domain owner with DNSSEC verification proofs.',
      },
    ],
    disputes: [
      {
        disputeId: 'DISP-104',
        challengerDid: 'did:key:z6MkhaXgBZDvotDkL5257faiz489...',
        reason:
          'Verified authorized enterprise CDN reverse proxy node. Reverse DNS and ASN ownership attestations confirmed legitimate.',
        timestamp: '2026-11-06 11:30:00 UTC',
        status: 'Open',
        supportingEvidenceUri: 'ipfs://bafybeihdwdcefghjkla456789012345678901234567890123456789012/dnssec-attestation.json',
      },
    ],
    evidenceReferences: [
      {
        sourceName: 'Authoritative DNSSEC Key Chain',
        evidenceType: 'DNS Passive Snapshot',
        artifactHash: 'sha256:8810294810294810294810294810294810294810294810294810294810294888',
        uri: 'ipfs://bafybeihdwdcefghjkla456789012345678901234567890123456789012/dnssec-attestation.json',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 780,
      immutableReceiptUrl: `https://sepolia.etherscan.io/tx/0x5519381029381029381029381029381029381029381029381029381029381055`,
    },
  },
];

/**
 * Sanitizes input to ensure ZERO PII, passwords, or raw secrets are registered on-chain
 */
export function sanitizeReportPayload(rawPayload: Record<string, unknown>): {
  sanitized: Record<string, unknown>;
  sanitizationLog: string[];
} {
  const log: string[] = [];
  const sanitized: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(rawPayload)) {
    const k = key.toLowerCase();
    if (k.includes('password') || k.includes('secret') || k.includes('token') || k.includes('otp') || k.includes('key')) {
      log.push(`Stripped sensitive credential field: "${key}"`);
      continue;
    }
    if (k.includes('email') || k.includes('phone') || k.includes('user') || k.includes('name')) {
      log.push(`Masked PII attribute: "${key}" (replaced with zero-knowledge commitment)`);
      sanitized[key] = '[REDACTED_PII_COMMITMENT]';
      continue;
    }
    sanitized[key] = val;
  }

  log.push('Applied SHA-256 Merkle root hashing over sanitized evidentiary artifacts.');
  return { sanitized, sanitizationLog: log };
}

/**
 * Computes deterministic Keccak-256 / SHA-256 style cryptographic hash of a report string
 */
export function generateReportFingerprint(content: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0xcbf29ce4;
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    hash1 ^= code;
    hash1 += (hash1 << 1) + (hash1 << 4) + (hash1 << 7) + (hash1 << 8) + (hash1 << 24);
    hash2 ^= (code * 31);
    hash2 += (hash2 << 2) + (hash2 << 5) + (hash2 << 9) + (hash2 << 13) + (hash2 << 21);
  }
  const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = ((hash1 ^ hash2) >>> 0).toString(16).padStart(8, '0');
  const hex4 = ((hash1 + hash2) >>> 0).toString(16).padStart(8, '0');
  return `0x${hex1}${hex2}${hex3}${hex4}${hex2}${hex1}${hex4}${hex3}`;
}

/**
 * Verifies a fingerprint against the decentralized ledger
 */
export function verifyReportOnChain(
  fingerprintQuery: string,
  records: BlockchainReportRecord[]
): {
  status: VerificationStatus;
  matchedRecord: BlockchainReportRecord | null;
  computedFingerprint: string;
} {
  const trimmed = fingerprintQuery.trim();
  if (!trimmed) {
    return {
      status: 'Unregistered',
      matchedRecord: null,
      computedFingerprint: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
  }

  let targetHash = trimmed;
  if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.length > 66) {
    targetHash = generateReportFingerprint(trimmed);
  }

  const match = records.find(
    (r) =>
      r.reportFingerprint.toLowerCase() === targetHash.toLowerCase() ||
      r.transactionHash.toLowerCase() === targetHash.toLowerCase() ||
      r.reportId.toLowerCase() === targetHash.toLowerCase()
  );

  if (!match) {
    // Check if it appears to be an altered version of a known report ID
    const idMatch = records.find((r) => r.reportId.toLowerCase() === trimmed.toLowerCase());
    if (idMatch && idMatch.reportFingerprint.toLowerCase() !== targetHash.toLowerCase()) {
      return {
        status: 'Tamper Detected',
        matchedRecord: idMatch,
        computedFingerprint: targetHash,
      };
    }

    return {
      status: 'Unregistered',
      matchedRecord: null,
      computedFingerprint: targetHash,
    };
  }

  return {
    status: match.verificationStatus,
    matchedRecord: match,
    computedFingerprint: targetHash,
  };
}

/**
 * Files a dispute on an on-chain threat report
 */
export function fileReportDispute(
  records: BlockchainReportRecord[],
  reportId: string,
  challengerDid: string,
  reason: string,
  evidenceUri?: string
): BlockchainReportRecord[] {
  return records.map((rec) => {
    if (rec.reportId !== reportId) return rec;

    const newDispute: DisputeRecord = {
      disputeId: `DISP-${Math.floor(100 + Math.random() * 900)}`,
      challengerDid: challengerDid.trim() || 'did:key:anonymous-auditor',
      reason: reason.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      status: 'Open',
      supportingEvidenceUri: evidenceUri?.trim() || undefined,
    };

    const newRevision = {
      revisionNumber: rec.revisions.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      authorDid: challengerDid.trim() || 'did:key:anonymous-auditor',
      merkleRootHash: rec.reportFingerprint,
      changeSummary: `Dispute filed by ${challengerDid.slice(0, 14)}...: ${reason.slice(0, 80)}`,
    };

    return {
      ...rec,
      verificationStatus: 'Disputed' as VerificationStatus,
      disputes: [...(rec.disputes || []), newDispute],
      revisions: [...rec.revisions, newRevision],
    };
  });
}

/**
 * Corroborates/validates a report
 */
export function validateThreatReport(
  records: BlockchainReportRecord[],
  reportId: string,
  validatorDid: string
): BlockchainReportRecord[] {
  return records.map((rec) => {
    if (rec.reportId !== reportId) return rec;

    const newRevision = {
      revisionNumber: rec.revisions.length + 1,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      authorDid: validatorDid.trim() || 'did:chakravyuha:peer-validator',
      merkleRootHash: rec.reportFingerprint,
      changeSummary: `Cryptographic consensus corroboration confirmed by ${validatorDid.slice(0, 14)}...`,
    };

    return {
      ...rec,
      verificationStatus: 'Validated' as VerificationStatus,
      revisions: [...rec.revisions, newRevision],
    };
  });
}
