import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Wallet,
  Shuffle,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export interface Web3NodeData extends Record<string, unknown> {
  address: string;
  short_address: string;
  classification: string;
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  is_flagged: boolean;
  is_root: boolean;
  balance_eth: number;
  tx_count: number;
  is_trace_path?: boolean;
}

export const Web3ForensicNode: React.FC<NodeProps> = memo(({ data, selected }) => {
  const node = data as unknown as Web3NodeData;

  const getTheme = () => {
    if (node.is_root) {
      return {
        border: 'border-amber-400',
        bg: 'bg-[#1a1408]/90',
        glow: 'shadow-[0_0_16px_rgba(251,191,36,0.35)]',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentText: 'text-amber-400',
      };
    }
    if (node.risk_level === 'CRITICAL' || node.is_flagged) {
      return {
        border: 'border-rose-500',
        bg: 'bg-[#1f0a0d]/90',
        glow: 'shadow-[0_0_16px_rgba(244,63,94,0.35)]',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        accentText: 'text-rose-400',
      };
    }
    if (node.classification?.toLowerCase().includes('mixer') || node.classification?.toLowerCase().includes('pool')) {
      return {
        border: 'border-purple-500',
        bg: 'bg-[#150a21]/90',
        glow: 'shadow-[0_0_16px_rgba(168,85,247,0.35)]',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        accentText: 'text-purple-400',
      };
    }
    if (node.classification?.toLowerCase().includes('exchange') || node.classification?.toLowerCase().includes('cex')) {
      return {
        border: 'border-cyan-500',
        bg: 'bg-[#061523]/90',
        glow: 'shadow-[0_0_16px_rgba(6,182,212,0.35)]',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        accentText: 'text-cyan-400',
      };
    }
    return {
      border: 'border-emerald-500/50',
      bg: 'bg-[#081812]/90',
      glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentText: 'text-emerald-400',
    };
  };

  const theme = getTheme();

  const getIcon = () => {
    if (node.is_root) return <Wallet className="w-4 h-4 text-amber-400" />;
    if (node.classification?.toLowerCase().includes('mixer')) return <Shuffle className="w-4 h-4 text-purple-400" />;
    if (node.classification?.toLowerCase().includes('exchange')) return <Building2 className="w-4 h-4 text-cyan-400" />;
    if (node.risk_level === 'CRITICAL') return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    if (node.risk_level === 'HIGH') return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    if (node.classification?.toLowerCase().includes('mule')) return <Flame className="w-4 h-4 text-rose-400" />;
    return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div
      className={`relative px-3.5 py-3 rounded-xl border backdrop-blur-md min-w-[210px] max-w-[260px] cursor-pointer transition-all duration-200 select-none ${
        theme.border
      } ${theme.bg} ${theme.glow} ${
        selected ? 'ring-2 ring-cyan-400 scale-[1.03]' : 'hover:scale-[1.01]'
      }`}
    >
      {/* ReactFlow Connection Handles */}
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-cyan-400 !border !border-slate-900" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-cyan-400 !border !border-slate-900" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-cyan-400 !border !border-slate-900 !opacity-0" id="top" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-cyan-400 !border !border-slate-900 !opacity-0" id="bottom" />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded bg-black/40 border border-white/5 shrink-0">
            {getIcon()}
          </div>
          <span className="font-mono text-xs font-bold text-white truncate">
            {node.short_address || `${node.address?.slice(0, 6)}...`}
          </span>
        </div>

        {node.is_root ? (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            ROOT
          </span>
        ) : (
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${theme.badgeBg}`}>
            {node.risk_level}
          </span>
        )}
      </div>

      {/* Role / Classification */}
      <div className="text-[11px] font-medium text-slate-300 truncate mb-2">
        {node.classification || 'Ethereum Entity'}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-white/[0.05] text-[10px] font-mono">
        <div>
          <span className="text-slate-400 block text-[9px] uppercase">Risk Score</span>
          <span className={`font-bold ${theme.accentText}`}>
            {Math.round((node.risk_score || 0) * 100)}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[9px] uppercase">Balance</span>
          <span className="text-slate-200 font-bold">
            {Number(node.balance_eth || 0).toFixed(2)} ETH
          </span>
        </div>
      </div>
    </div>
  );
});

export const nodeTypes = {
  web3Node: Web3ForensicNode,
};
