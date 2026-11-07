import { useState } from 'react';
import { GitCommit, ShieldCheck, ShieldAlert, ArrowDown, Key, Check, Copy } from 'lucide-react';
import type { CertificateChainNode } from '../../types/tls.ts';

interface CertificateChainVisualizerProps {
  chain: CertificateChainNode[];
}

export function CertificateChainVisualizer({ chain }: CertificateChainVisualizerProps) {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(chain.length - 1);
  const [copiedFingerprint, setCopiedFingerprint] = useState<string | null>(null);

  if (chain.length === 0) {
    return (
      <div className="rounded-2xl bg-[#091224] border border-white/10 p-6 font-mono text-xs text-slate-400 text-center">
        No complete X.509 certificate chain provided by server during TLS handshake.
      </div>
    );
  }

  const selectedNode = chain[selectedNodeIndex] || chain[chain.length - 1];

  const handleCopy = (fingerprint: string) => {
    navigator.clipboard.writeText(fingerprint);
    setCopiedFingerprint(fingerprint);
    setTimeout(() => setCopiedFingerprint(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
          GRAPHICAL PKI HIERARCHY & TRUST ANCHOR
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
          <GitCommit className="w-5 h-5 text-cyan-400" />
          <span>Interactive Certificate Chain Tree</span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            (Root CA → Intermediate CA → Website)
          </span>
        </h3>
      </div>

      {/* Visual Chain Nodes Graph */}
      <div className="space-y-4">
        {chain.map((node, index) => {
          const isSelected = selectedNodeIndex === index;
          const isRoot = node.level === 'Root CA';
          const isLeaf = node.level === 'Leaf / Website';

          return (
            <div key={`${node.level}-${index}`} className="flex flex-col items-center">
              {/* Chain Node Box */}
              <div
                onClick={() => setSelectedNodeIndex(index)}
                className={`w-full p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'bg-[#060b17] border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        node.isTrustedInSystemStore
                          ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-950/80 border border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {node.isTrustedInSystemStore ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <ShieldAlert className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            isRoot
                              ? 'bg-purple-950 border-purple-500/40 text-purple-300'
                              : isLeaf
                              ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                              : 'bg-blue-950 border-blue-500/40 text-blue-300'
                          }`}
                        >
                          {node.level}
                        </span>
                        <span className="font-bold text-sm text-slate-100">{node.commonName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block pt-0.5">
                        Org: {node.organization || 'Unspecified'} ({node.country || 'Global'})
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right text-[11px] text-slate-400">
                    <span className="text-slate-500 block">KEY LENGTH</span>
                    <span className="font-bold text-slate-200">
                      {node.publicKeyAlgorithm} {node.keySizeBits}-bit
                    </span>
                  </div>
                </div>
              </div>

              {/* Connector Arrow down to next node */}
              {index < chain.length - 1 && (
                <div className="flex flex-col items-center my-1 text-cyan-400/70">
                  <div className="w-0.5 h-3 bg-cyan-500/40" />
                  <ArrowDown className="w-4 h-4 -my-0.5" />
                  <div className="w-0.5 h-3 bg-cyan-500/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer / Card */}
      <div className="rounded-xl bg-[#060b17] border border-cyan-500/30 p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Key className="w-4 h-4" />
            <span className="uppercase tracking-wider">
              Selected Node Telemetry: [{selectedNode.level}] {selectedNode.commonName}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Click any node above to inspect</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[11px] block">Serial Number:</span>
            <div className="p-2 rounded bg-slate-900 border border-white/5 text-slate-200 break-all select-all">
              {selectedNode.serialNumber}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>SHA-256 Fingerprint:</span>
              <button
                type="button"
                onClick={() => handleCopy(selectedNode.fingerprintSha256)}
                className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {copiedFingerprint === selectedNode.fingerprintSha256 ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-white/5 text-cyan-300 break-all select-all text-[11px]">
              {selectedNode.fingerprintSha256}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
          <div className="p-2.5 rounded bg-slate-900 border border-white/5">
            <span className="text-slate-400 block">Signature Algorithm:</span>
            <span className="text-slate-200 font-semibold">{selectedNode.signatureAlgorithm}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-white/5">
            <span className="text-slate-400 block">Trust Anchor Status:</span>
            <span className={selectedNode.isTrustedInSystemStore ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {selectedNode.isTrustedInSystemStore ? 'Trusted in System Store' : 'Untrusted / Private'}
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-white/5">
            <span className="text-slate-400 block">Key Usages ({selectedNode.keyUsage.length}):</span>
            <span className="text-slate-300 truncate block">{selectedNode.keyUsage.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

