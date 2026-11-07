import { AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

export function BlockchainRegistryBanner() {
  return (
    <div className="rounded-2xl bg-[#091224] border border-cyan-500/30 p-5 md:p-6 space-y-4 shadow-xl relative overflow-hidden font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 text-cyan-400">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-100">
            DECENTRALIZED THREAT REGISTRY & CRYPTOGRAPHIC ATTESTATION
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
          Zero-PII On-Chain Commitments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1: Integrity != Absolute Truth */}
        <div className="p-3.5 rounded-xl bg-[#060b17] border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Integrity $\neq$ Absolute Truth</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            The blockchain record cryptographically proves the <strong>immutability and revision history</strong> of a submitted report. It proves the document has not been altered since registration, but does not inherently guarantee that the reporter's factual assertions or subjective claims are true.
          </p>
        </div>

        {/* Rule 2: Zero-PII Policy */}
        <div className="p-3.5 rounded-xl bg-[#060b17] border border-cyan-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Zero-PII Privacy Commitment</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            To prevent privacy violations and credential leakage, <strong>never send raw passwords, OTPs, personal messages, or confidential URLs directly to the public blockchain</strong>. Only irreversible SHA-256 / Keccak-256 Merkle root hashes and sanitized metadata are committed on-chain.
          </p>
        </div>
      </div>
    </div>
  );
}

