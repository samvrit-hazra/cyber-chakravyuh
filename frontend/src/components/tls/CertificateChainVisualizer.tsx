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
      <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-6 font-mono text-xs text-[#647477] dark:text-[#A6B3AE] text-center shadow-xs">
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
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
          GRAPHICAL PKI HIERARCHY & TRUST ANCHOR
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
          <GitCommit className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
          <span>Interactive Certificate Chain Tree</span>
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
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
                className={`w-full p-4 rounded border transition-all cursor-pointer font-mono text-xs ${
                  isSelected
                    ? 'bg-[#EAECE6] dark:bg-[#223336] border-[#A95636] dark:border-[#C47A52] ring-1 ring-[#A95636]/30'
                    : 'bg-[#F3F1E9] dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded ${
                        node.isTrustedInSystemStore
                          ? 'bg-[#36745F]/10 border border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]'
                          : 'bg-[#B64B46]/10 border border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]'
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
                              ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 border-[#A95636]/30 dark:border-[#C47A52]/30 text-[#A95636] dark:text-[#C47A52]'
                              : isLeaf
                              ? 'bg-[#356D68]/10 dark:bg-[#79A99C]/15 border-[#356D68]/30 dark:border-[#79A99C]/30 text-[#356D68] dark:text-[#79A99C]'
                              : 'bg-[#A87532]/10 dark:bg-[#D7AA61]/15 border-[#A87532]/30 dark:border-[#D7AA61]/30 text-[#A87532] dark:text-[#D7AA61]'
                          }`}
                        >
                          {node.level}
                        </span>
                        <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">{node.commonName}</span>
                      </div>
                      <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] block pt-0.5">
                        Org: {node.organization || 'Unspecified'} ({node.country || 'Global'})
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                    <span className="text-[#647477] dark:text-[#A6B3AE] block">KEY LENGTH</span>
                    <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">
                      {node.publicKeyAlgorithm} {node.keySizeBits}-bit
                    </span>
                  </div>
                </div>
              </div>

              {/* Connector Arrow down to next node */}
              {index < chain.length - 1 && (
                <div className="flex flex-col items-center my-1 text-[#A95636] dark:text-[#C47A52]">
                  <div className="w-0.5 h-3 bg-[#A95636]/40 dark:bg-[#C47A52]/40" />
                  <ArrowDown className="w-4 h-4 -my-0.5" />
                  <div className="w-0.5 h-3 bg-[#A95636]/40 dark:bg-[#C47A52]/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer / Card */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-2.5">
          <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C] font-bold">
            <Key className="w-4 h-4" />
            <span className="uppercase tracking-wider">
              Selected Node Telemetry: [{selectedNode.level}] {selectedNode.commonName}
            </span>
          </div>
          <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">Click any node above to inspect</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Serial Number:</span>
            <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] break-all select-all">
              {selectedNode.serialNumber}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[#647477] dark:text-[#A6B3AE] text-[11px]">
              <span>SHA-256 Fingerprint:</span>
              <button
                type="button"
                onClick={() => handleCopy(selectedNode.fingerprintSha256)}
                className="text-[#A95636] dark:text-[#C47A52] hover:underline cursor-pointer flex items-center gap-1"
              >
                {copiedFingerprint === selectedNode.fingerprintSha256 ? (
                  <>
                    <Check className="w-3 h-3 text-[#36745F] dark:text-[#79B69A]" />
                    <span className="text-[#36745F] dark:text-[#79B69A]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#356D68] dark:text-[#79A99C] break-all select-all text-[11px]">
              {selectedNode.fingerprintSha256}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
          <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
            <span className="text-[#647477] dark:text-[#A6B3AE] block">Signature Algorithm:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{selectedNode.signatureAlgorithm}</span>
          </div>
          <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
            <span className="text-[#647477] dark:text-[#A6B3AE] block">Trust Anchor Status:</span>
            <span className={selectedNode.isTrustedInSystemStore ? 'text-[#36745F] dark:text-[#79B69A] font-semibold' : 'text-[#B64B46] dark:text-[#E17B70] font-semibold'}>
              {selectedNode.isTrustedInSystemStore ? 'Trusted in System Store' : 'Untrusted / Private'}
            </span>
          </div>
          <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
            <span className="text-[#647477] dark:text-[#A6B3AE] block">Key Usages ({selectedNode.keyUsage.length}):</span>
            <span className="text-[#647477] dark:text-[#A6B3AE] truncate block">{selectedNode.keyUsage.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
