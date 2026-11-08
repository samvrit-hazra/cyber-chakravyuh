import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Zap } from 'lucide-react';
import { nodeTypes, type Web3NodeData } from './CustomWeb3Nodes.tsx';
import { NodeDetailDrawer } from './NodeDetailDrawer.tsx';
import type { GraphTraceData, GraphNode } from '../../types/web3Threat.ts';

interface TransactionGraphViewProps {
  graphData: GraphTraceData;
  onSelectAddress?: (address: string) => void;
}

type LayoutMode = 'hierarchical' | 'radial' | 'grid';

export const TransactionGraphView: React.FC<TransactionGraphViewProps> = ({
  graphData,
  onSelectAddress,
}) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('hierarchical');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'FLAGGED_ONLY' | 'CRITICAL_ONLY'>('ALL');
  const [isTraceHighlighted, setIsTraceHighlighted] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Filter nodes based on risk filter
  const visibleNodes = useMemo(() => {
    return graphData.nodes.filter((n) => {
      if (n.is_root) return true; // Always show root target
      if (filterRisk === 'FLAGGED_ONLY') return n.is_flagged;
      if (filterRisk === 'CRITICAL_ONLY') return n.risk_level === 'CRITICAL';
      return true;
    });
  }, [graphData.nodes, filterRisk]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  // Compute positions
  const computedNodes: Node[] = useMemo(() => {
    const rootNode = visibleNodes.find((n) => n.is_root) || visibleNodes[0];
    const nonRootNodes = visibleNodes.filter((n) => n.id !== rootNode?.id);

    return visibleNodes.map((n, idx) => {
      let posX = 150;
      let posY = 200;

      if (layoutMode === 'hierarchical') {
        if (n.is_root) {
          posX = 420;
          posY = 260;
        } else {
          const isIncoming = graphData.edges.some(
            (e) => e.target === rootNode?.id && e.source === n.id
          );
          if (isIncoming) {
            posX = 80;
            posY = 140 + idx * 160;
          } else {
            const isMixerOrCex =
              n.classification?.toLowerCase().includes('mixer') ||
              n.classification?.toLowerCase().includes('exchange');
            posX = isMixerOrCex ? 800 : 580;
            posY = 100 + idx * 150;
          }
        }
      } else if (layoutMode === 'radial') {
        if (n.is_root) {
          posX = 480;
          posY = 300;
        } else {
          const totalNonRoot = Math.max(1, nonRootNodes.length);
          const nonRootIndex = nonRootNodes.findIndex((x) => x.id === n.id);
          const angle = (2 * Math.PI * nonRootIndex) / totalNonRoot;
          const radius = n.is_flagged ? 280 : 360;
          posX = 480 + Math.cos(angle) * radius;
          posY = 300 + Math.sin(angle) * radius;
        }
      } else {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        posX = col * 300 + 100;
        posY = row * 200 + 100;
      }

      return {
        id: n.id,
        type: 'web3Node',
        position: { x: posX, y: posY },
        data: {
          ...n,
          is_trace_path: isTraceHighlighted && n.is_flagged,
        } as Web3NodeData,
      };
    });
  }, [visibleNodes, layoutMode, graphData.edges, isTraceHighlighted]);

  // Compute edges
  const computedEdges: Edge[] = useMemo(() => {
    return graphData.edges
      .filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      .map((edge) => {
        const isTrace = isTraceHighlighted && edge.is_trace_path;
        const isCritical = edge.risk_level === 'CRITICAL' || edge.is_flagged;

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: `${edge.amount_eth.toFixed(2)} ETH`,
          animated: isTrace || isCritical,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isCritical ? '#f43f5e' : (isTrace ? '#06b6d4' : '#10b981'),
            width: 14,
            height: 14,
          },
          style: {
            stroke: isCritical ? '#f43f5e' : (isTrace ? '#06b6d4' : '#10b981'),
            strokeWidth: isCritical || isTrace ? 2.5 : 1.5,
            opacity: isTraceHighlighted && !isTrace ? 0.4 : 0.9,
          },
          labelStyle: {
            fill: isCritical ? '#fda4af' : '#67e8f9',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 10,
          },
          labelBgStyle: {
            fill: '#030712',
            fillOpacity: 0.9,
            stroke: isCritical ? '#f43f5e55' : '#06b6d455',
            strokeWidth: 1,
          },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 6,
        };
      });
  }, [graphData.edges, visibleNodeIds, isTraceHighlighted]);

  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  // Sync state when computed nodes/edges change
  useEffect(() => {
    setNodes(computedNodes);
    setEdges(computedEdges);
  }, [computedNodes, computedEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = graphData.nodes.find((n) => n.id === node.id);
      if (found) {
        setSelectedNode(found);
      }
    },
    [graphData.nodes]
  );

  return (
    <div className="relative w-full h-[580px] rounded-2xl border border-white/10 bg-[#02050e] overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#070e22]/90 border border-white/10 backdrop-blur-md shadow-lg">
        {/* Layout Modes */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 font-mono text-xs">
          <button
            onClick={() => setLayoutMode('hierarchical')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              layoutMode === 'hierarchical'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flow
          </button>
          <button
            onClick={() => setLayoutMode('radial')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              layoutMode === 'radial'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Radial
          </button>
          <button
            onClick={() => setLayoutMode('grid')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              layoutMode === 'grid'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grid
          </button>
        </div>

        {/* Filter by Risk */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 font-mono text-xs">
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              filterRisk === 'ALL'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({graphData.total_nodes})
          </button>
          <button
            onClick={() => setFilterRisk('FLAGGED_ONLY')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              filterRisk === 'FLAGGED_ONLY'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flagged ({graphData.flagged_nodes_count})
          </button>
        </div>

        {/* Trace Flow Pulse Toggle */}
        <button
          onClick={() => setIsTraceHighlighted(!isTraceHighlighted)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
            isTraceHighlighted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trace Path: {isTraceHighlighted ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      {/* Floating Graph Stats Badge */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-[#070e22]/90 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300">
        <div>
          <span className="text-slate-400">Total Volume:</span>{' '}
          <span className="text-cyan-400 font-bold">{graphData.total_volume_eth.toLocaleString()} ETH</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div>
          <span className="text-slate-400">Hops:</span>{' '}
          <span className="text-white font-bold">{graphData.depth}</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div>
          <span className="text-slate-400">Flagged Trails:</span>{' '}
          <span className="text-rose-400 font-bold">{graphData.suspicious_paths.length}</span>
        </div>
      </div>

      {/* ReactFlow Interactive Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        minZoom={0.2}
        maxZoom={2.0}
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#06b6d415" />
        <Controls
          className="!bg-[#070e22] !border !border-white/10 !rounded-xl !text-slate-300 overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as unknown as Web3NodeData;
            if (d?.is_root) return '#fbbf24';
            if (d?.is_flagged || d?.risk_level === 'CRITICAL') return '#f43f5e';
            return '#10b981';
          }}
          className="!bg-[#050b18]/90 !border !border-white/10 !rounded-xl"
          maskColor="rgba(3, 7, 18, 0.7)"
        />
      </ReactFlow>

      {/* Node Detail Side-Drawer */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onInvestigateAddress={onSelectAddress}
      />
    </div>
  );
};
