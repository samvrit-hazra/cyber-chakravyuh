import { useState } from 'react';
import { Share2, Globe, FileText, Crosshair, AlertTriangle, Link as LinkIcon, Info } from 'lucide-react';
import {
  THREAT_GRAPH_NODES,
  THREAT_GRAPH_LINKS,
} from '../../utils/threatIntelligenceData.ts';
import type { ThreatGraphNode } from '../../types/threatIntelligence.ts';

export function ThreatRelationshipGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-camp-1');
  const [filterType, setFilterType] = useState<
    'all' | 'campaign' | 'domain' | 'url' | 'incident' | 'indicator'
  >('all');

  if (!THREAT_GRAPH_NODES || THREAT_GRAPH_NODES.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-8 text-center space-y-3 shadow-sm font-mono">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#356D68]/10 flex items-center justify-center text-[#356D68] dark:text-[#79A99C]">
          <Share2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[#182629] dark:text-[#E8E6DC] uppercase">
          Threat Relationship Nexus
        </h4>
        <p className="text-xs text-[#647477] dark:text-[#A6B3AE] max-w-md mx-auto">
          No correlated adversarial clusters detected. New threat reports and discovered malicious domains will dynamically map here.
        </p>
      </div>
    );
  }

  const selectedNode =
    THREAT_GRAPH_NODES.find((n) => n.id === selectedNodeId) || THREAT_GRAPH_NODES[0];

  // Connected links for selected entity
  const connectedLinks = THREAT_GRAPH_LINKS.filter(
    (l) => l.source === selectedNodeId || l.target === selectedNodeId
  );

  const getNodeColor = (type: ThreatGraphNode['type']) => {
    switch (type) {
      case 'campaign':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/40 text-rose-700 dark:text-rose-300',
          badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40',
          icon: Crosshair,
        };
      case 'domain':
        return {
          bg: 'bg-[#356D68]/10 dark:bg-[#79A99C]/20 border-[#356D68]/40 text-[#356D68] dark:text-[#79A99C]',
          badge: 'bg-[#356D68]/20 text-[#356D68] dark:text-[#79A99C] border-[#356D68]/40',
          icon: Globe,
        };
      case 'url':
        return {
          bg: 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 border-[#A95636]/40 text-[#A95636] dark:text-[#C47A52]',
          badge: 'bg-[#A95636]/20 text-[#A95636] dark:text-[#C47A52] border-[#A95636]/40',
          icon: LinkIcon,
        };
      case 'incident':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/40 text-amber-700 dark:text-amber-300',
          badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
          icon: FileText,
        };
      case 'indicator':
      default:
        return {
          bg: 'bg-slate-500/10 dark:bg-slate-800/30 border-slate-400/40 text-slate-700 dark:text-slate-300',
          badge: 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-400/40',
          icon: AlertTriangle,
        };
    }
  };

  const filteredNodes =
    filterType === 'all'
      ? THREAT_GRAPH_NODES
      : THREAT_GRAPH_NODES.filter((n) => n.type === filterType);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            RELATIONSHIP GRAPH & CORROBORATED THREAT NEXUS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Share2 className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Multi-Entity Threat Nexus</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
              (Campaigns ↔ Domains ↔ URLs ↔ Incidents)
            </span>
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F3F1E9] dark:bg-[#101A1D] p-1 rounded-lg border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
          {(['all', 'campaign', 'domain', 'url', 'incident', 'indicator'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer text-[11px] ${
                filterType === t
                  ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-xs'
                  : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Node Matrix */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
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
                    ? `${meta.bg} ring-2 ring-[#A95636] dark:ring-[#C47A52]`
                    : 'bg-[#F3F1E9] dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40 text-[#182629] dark:text-[#E8E6DC]'
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
      <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#647477] dark:text-[#A6B3AE]">Selected Nexus Node:</span>
            <span className="text-[#A95636] dark:text-[#C47A52] font-bold text-sm">{selectedNode.label}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]">
              Type: {selectedNode.type}
            </span>
          </div>
          {selectedNode.details && (
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px]">{selectedNode.details}</span>
          )}
        </div>

        {/* Evidence Connections List */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#182629] dark:text-[#E8E6DC] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            Supporting Evidentiary Links ({connectedLinks.length})
          </h4>

          {connectedLinks.length === 0 ? (
            <p className="text-[#647477] dark:text-[#A6B3AE] text-xs py-2">No cross-entity links connected to this node in the current scope.</p>
          ) : (
            <div className="space-y-2">
              {connectedLinks.map((link, idx) => {
                const isOutbound = link.source === selectedNodeId;
                const otherNodeId = isOutbound ? link.target : link.source;
                const otherNode = THREAT_GRAPH_NODES.find((n) => n.id === otherNodeId);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#A95636] dark:text-[#C47A52] font-bold">
                          {isOutbound ? 'Outgoing ➔' : 'Incoming ➔'}
                        </span>
                        <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{link.relationship}</span>
                        <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px]">
                          ({otherNode?.label || otherNodeId})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#F3F1E9] dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144]">
                        Target Type: {otherNode?.type || 'entity'}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[11px] text-[#182629] dark:text-[#E8E6DC]">
                      <strong className="text-[#356D68] dark:text-[#79A99C]">Evidence Basis: </strong>
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
