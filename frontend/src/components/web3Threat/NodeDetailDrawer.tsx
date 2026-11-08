import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import type { GraphNode } from '../../types/web3Threat.ts';

interface NodeDetailDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
  onInvestigateAddress?: (address: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onInvestigateAddress,
}) => {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(node.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighRisk = node.risk_level === 'CRITICAL' || node.risk_level === 'HIGH';

  return (
    <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 bg-[#070e22]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Node Intelligence
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Hop Level: {node.hop_distance} {node.is_root && '(Root Target)'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase text-slate-400">
          Wallet Address (EVM)
        </label>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-200 break-all select-all">
          <span className="flex-1">{node.address}</span>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
            title="Copy address"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Classification & Risk Badge */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-[#0b152d] border border-white/5 space-y-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Role</span>
          <span className="text-xs font-bold text-slate-100 truncate block">
            {node.classification}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#0b152d] border border-white/5 space-y-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Threat Level</span>
          <div className="flex items-center gap-1.5">
            {isHighRisk ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span
              className={`text-xs font-bold font-mono ${
                node.risk_level === 'CRITICAL'
                  ? 'text-rose-400'
                  : node.risk_level === 'HIGH'
                  ? 'text-orange-400'
                  : 'text-emerald-400'
              }`}
            >
              {node.risk_level} ({Math.round(node.risk_score * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
          <span className="text-[9px] text-slate-400 uppercase block mb-0.5">Est. Balance</span>
          <span className="text-white font-bold">{node.balance_eth.toFixed(3)} ETH</span>
        </div>
        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
          <span className="text-[9px] text-slate-400 uppercase block mb-0.5">Tx Volume</span>
          <span className="text-slate-200">{node.tx_count} recorded</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <a
          href={`https://etherscan.io/address/${node.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          <span>Etherscan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {onInvestigateAddress && !node.is_root && (
          <button
            onClick={() => onInvestigateAddress(node.address)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 transition-colors cursor-pointer"
          >
            <span>Trace Node</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
