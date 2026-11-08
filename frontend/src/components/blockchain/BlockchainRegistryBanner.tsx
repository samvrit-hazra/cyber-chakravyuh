import { AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

export function BlockchainRegistryBanner() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-4 shadow-sm relative overflow-hidden font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-3">
        <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#182629] dark:text-[#E8E6DC]">
            DECENTRALIZED THREAT REGISTRY & CRYPTOGRAPHIC ATTESTATION
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-[#356D68]/10 dark:bg-[#79A99C]/20 border border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C] font-bold uppercase">
          Zero-PII On-Chain Commitments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1: Integrity != Absolute Truth */}
        <div className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Integrity ≠ Absolute Truth</span>
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-xs">
            The blockchain record cryptographically proves the <strong>immutability and revision history</strong> of a submitted report. It proves the document has not been altered since registration, but does not inherently guarantee that the reporter's factual assertions or subjective claims are true.
          </p>
        </div>

        {/* Rule 2: Zero-PII Policy */}
        <div className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1.5">
          <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C] font-bold">
            <Lock className="w-4 h-4 text-[#356D68] dark:text-[#79A99C] shrink-0" />
            <span>Zero-PII Privacy Commitment</span>
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-xs">
            To prevent privacy violations and credential leakage, <strong>never send raw passwords, OTPs, personal messages, or confidential URLs directly to the public blockchain</strong>. Only irreversible SHA-256 / Keccak-256 Merkle root hashes and sanitized metadata are committed on-chain.
          </p>
        </div>
      </div>
    </div>
  );
}
