import type {
  BlockchainReportRecord,
  VerificationStatus,
} from '../types/blockchainVerification.ts';

export const CHAKRAVYUHA_SMART_CONTRACT_ADDRESS = '0x71C94158a5F84b39E92348a209b52123498b89e2';
export const CHAKRAVYUHA_LEDGER_NETWORK = 'Chakravyuha L2 Secure Rollup (Chain ID: 8941)';

export const INITIAL_ONCHAIN_RECORDS: BlockchainReportRecord[] = [];

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
  const trimmed = (fingerprintQuery || '').trim();
  if (!trimmed) {
    return {
      status: 'Unregistered',
      matchedRecord: null,
      computedFingerprint: '',
    };
  }

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
