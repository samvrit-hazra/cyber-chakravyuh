import { useState } from 'react';
import {
  Share2,
  ShieldAlert,
  Globe,
  Link as LinkIcon,
  FileText,
  Radio,
  Info,
} from 'lucide-react';
import {
  THREAT_GRAPH_NODES,
  THREAT_GRAPH_LINKS,
} from '../../utils/threatIntelligenceData.ts';
import type { ThreatNodeType } from '../../types/threatIntelligence.ts';

export function ThreatRelationshipGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-c1');
  const [filterType, setFilterType] = useState<string>('all');

  const selectedNode = THREAT_GRAPH_NODES.find((n) => n.id === selectedNodeId) || THREAT_GRAPH_NODES[0];

  // Find incoming & outgoing links for selected node
  const connectedLinks = THREAT_GRAPH_LINKS.filter(
    (l) => l.source === selectedNodeId || l.target === selectedNodeId
  );

  const getNodeColor = (type: ThreatNodeType) => {
    switch (type) {
      case 'campaign':
        return {
          bg: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: ShieldAlert,
        };
      case 'domain':
        return {
          bg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: Globe,
        };
      case 'url':
        return {
          bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: LinkIcon,
        };
      case 'incident':
        return {
          bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: FileText,
        };
      case 'indicator':
      default:
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: Radio,
        };
    }
  };

  const filteredNodes =
    filterType === 'all'
      ? THREAT_GRAPH_NODES
      : THREAT_GRAPH_NODES.filter((n) => n.type === filterType);

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            RELATIONSHIP GRAPH & CORROBORATED THREAT NEXUS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <span>Multi-Entity Threat Nexus</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              (Campaigns ↔ Domains ↔ URLs ↔ Incidents)
            </span>
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-white/5 text-xs font-mono">
          {(['all', 'campaign', 'domain', 'url', 'incident', 'indicator'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer text-[11px] ${
                filterType === t
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Node Matrix */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Click any nexus entity below to inspect verified evidence links:</span>
          <span>{filteredNodes.length} Active Nodes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const meta = getNodeColor(node.type);
            const Icon = meta.icon;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer font-mono text-xs flex items-center justify-between gap-2 ${
                  isSelected
                    ? `${meta.bg} shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400`
                    : 'bg-[#060b17] border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-bold truncate">{node.label}</span>
                </div>

                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border shrink-0 ${meta.badge}`}>
                  {node.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Entity & Evidence Pathways Details Panel */}
      <div className="p-4 rounded-xl bg-[#060b17] border border-cyan-500/30 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selected Nexus Node:</span>
            <span className="text-cyan-300 font-bold text-sm">{selectedNode.label}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-white/5">
              Type: {selectedNode.type}
            </span>
          </div>
          {selectedNode.details && (
            <span className="text-slate-400 text-[11px]">{selectedNode.details}</span>
          )}
        </div>

        {/* Evidence Connections List */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Supporting Evidentiary Links ({connectedLinks.length})
          </h4>

          {connectedLinks.length === 0 ? (
            <p className="text-slate-500 text-xs py-2">No cross-entity links connected to this node in the current scope.</p>
          ) : (
            <div className="space-y-2">
              {connectedLinks.map((link, idx) => {
                const isOutbound = link.source === selectedNodeId;
                const otherNodeId = isOutbound ? link.target : link.source;
                const otherNode = THREAT_GRAPH_NODES.find((n) => n.id === otherNodeId);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">
                          {isOutbound ? 'Outgoing ➔' : 'Incoming ➔'}
                        </span>
                        <span className="text-slate-200 font-bold">{link.relationship}</span>
                        <span className="text-slate-500 text-[11px]">
                          ({otherNode?.label || otherNodeId})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-white/5">
                        Target Type: {otherNode?.type || 'entity'}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300">
                      <strong className="text-cyan-300">Evidence Basis: </strong>
                      {link.evidenceBasis}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
