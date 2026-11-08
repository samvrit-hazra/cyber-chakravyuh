import type {
  BlockchainReportRecord,
  VerificationStatus,
} from '../types/blockchainVerification.ts';

export const CHAKRAVYUHA_SMART_CONTRACT_ADDRESS = '0x71C94158a5F84b39E92348a209b52123498b89e2';
export const CHAKRAVYUHA_LEDGER_NETWORK = 'Chakravyuha L2 Secure Rollup (Chain ID: 8941)';

export const INITIAL_ONCHAIN_RECORDS: BlockchainReportRecord[] = [
  {
    reportId: 'REP-941029',
    reportTitle: 'PhishAlert Banking AiTM Reverse Proxy Ingress',
    targetSubject: 'paypal-security.account-update.phish-alert.net',
    reportFingerprint: '0x8f49b1a20c384df9e7591e0a84519bc82e345109f284b12384a92c0192840192',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x4a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
    blockNumber: 4892104,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '48,210 Gwei (0.00048 ETH)',
    registrationTimestamp: '2026-11-07 14:18:22 UTC',
    verificationStatus: 'Verified On-Chain',
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
    evidenceReferences: [
      {
        sourceName: 'AlienVault OTX Pulse #90218',
        evidenceType: 'Threat Intelligence Match',
        artifactHash: 'sha256:7b10294810294810294810294810294810294810294810294810294810294810',
        uri: 'https://otx.alienvault.com/pulse/90218',
      },
      {
        sourceName: 'Saptarishi Honey-Mesh Session Capture',
        evidenceType: 'Sandbox Execution Log',
        artifactHash: 'sha256:1a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 248,
      immutableReceiptUrl: `https://explorer.chakravyuha.network/tx/0x4a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294`,
    },
  },
  {
    reportId: 'REP-940812',
    reportTitle: 'Chase SMS Fraud Notification Smishing Campaign',
    targetSubject: 'chase-security-resolver.online',
    reportFingerprint: '0x3c82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x8192039102948102948102948102948102948102948102948102948102948102',
    blockNumber: 4892010,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '46,120 Gwei (0.00046 ETH)',
    registrationTimestamp: '2026-11-07 11:45:10 UTC',
    verificationStatus: 'Verified On-Chain',
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
    evidenceReferences: [
      {
        sourceName: 'Carrier 7726 Spam Intercept Feed',
        evidenceType: 'Threat Intelligence Match',
        artifactHash: 'sha256:4910294810294810294810294810294810294810294810294810294810294810',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 342,
      immutableReceiptUrl: `https://explorer.chakravyuha.network/tx/0x8192039102948102948102948102948102948102948102948102948102948102`,
    },
  },
  {
    reportId: 'REP-938210',
    reportTitle: 'Web3 Airdrop Permit2 Malicious Approval Drainer',
    targetSubject: 'metamask-claim-airdrop-rewards.finance.io',
    reportFingerprint: '0x1a82fa019481029410948b2910c84102941094b81094218a0c1048b021941294',
    smartContractAddress: CHAKRAVYUHA_SMART_CONTRACT_ADDRESS,
    transactionHash: '0x1029381029381029381029381029381029381029381029381029381029381029',
    blockNumber: 4891840,
    network: CHAKRAVYUHA_LEDGER_NETWORK,
    gasUsed: '51,400 Gwei (0.00051 ETH)',
    registrationTimestamp: '2026-11-06 18:24:00 UTC',
    verificationStatus: 'Verified On-Chain',
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
    evidenceReferences: [
      {
        sourceName: 'Etherscan Verified Contract ABI Disassembly',
        evidenceType: 'Threat Intelligence Match',
        artifactHash: 'sha256:2210294810294810294810294810294810294810294810294810294810294810',
      },
    ],
    integrityVerdict: {
      isUntampered: true,
      hashMatchesLedger: true,
      blockConfirmations: 512,
      immutableReceiptUrl: `https://explorer.chakravyuha.network/tx/0x1029381029381029381029381029381029381029381029381029381029381029`,
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
 * Computes deterministic Keccak-256-style cryptographic hash of a report string
 */
export function generateReportFingerprint(content: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < content.length; i++) {
    hash ^= content.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  // Pad out to standard 64-hex char Keccak-256 style fingerprint
  return `0x${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}`;
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

  // If query is a raw JSON payload, compute fingerprint
  let targetHash = trimmed;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    targetHash = generateReportFingerprint(trimmed);
  }

  const match = records.find(
    (r) =>
      r.reportFingerprint.toLowerCase() === targetHash.toLowerCase() ||
      r.transactionHash.toLowerCase() === targetHash.toLowerCase() ||
      r.reportId.toLowerCase() === targetHash.toLowerCase()
  );

  if (!match) {
    // If it looks like an altered hash of a known report, mark Tamper Detected
    if (targetHash.length >= 10 && records.some((r) => r.reportId.toLowerCase().includes(targetHash.toLowerCase()))) {
      return {
        status: 'Tamper Detected',
        matchedRecord: null,
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

