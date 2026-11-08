import React, { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  RefreshCw,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { Card, Badge, Button } from '../common/index.ts';
import { TransactionGraphView } from '../web3Threat/TransactionGraphView.tsx';
import { MLFeaturesBreakdown } from '../web3Threat/MLFeaturesBreakdown.tsx';
import { AMLHeuristicsAndAttribution } from '../web3Threat/AMLHeuristicsAndAttribution.tsx';
import {
  web3ThreatService,
  DEMO_WALLETS,
} from '../../services/web3ThreatService.ts';
import type { Web3ThreatAnalysisResult, DemoWallet } from '../../types/web3Threat.ts';

interface Web3ThreatTabProps {
  initialAddress?: string;
}

export const Web3ThreatTab: React.FC<Web3ThreatTabProps> = ({
  initialAddress = '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
}) => {
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [hopDepth, setHopDepth] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<Web3ThreatAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async (targetAddr?: string) => {
    const addr = (targetAddr || addressInput).trim().toLowerCase();
    if (!addr) {
      setError('Please provide a valid Ethereum wallet address.');
      return;
    }

    if (!addr.startsWith('0x') || addr.length !== 42) {
      setError('Invalid format: address must be a 42-character hexadecimal string beginning with 0x.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await web3ThreatService.analyzeWallet(addr, hopDepth);
      setAnalysisResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(`Threat Analysis Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial analysis on mount
  useEffect(() => {
    handleRunAnalysis(initialAddress);
  }, []);

  const handleSelectDemo = (demo: DemoWallet) => {
    setAddressInput(demo.address);
    handleRunAnalysis(demo.address);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card variant="glass" className="p-6 border-cyan-500/30 bg-[#070d1e]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              WEB3 THREAT DETECTION & ML TRANSACTION GRAPH TRACER (ENGINE 6)
            </h3>
            <p className="text-xs text-slate-400">
              On-chain fund tracing, XGBoost ML structuring risk prediction, AML heuristic pattern detection, and interactive forensic network topology.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              ML ENGINE ACTIVE
            </Badge>
            <Badge variant="cyan" size="sm">
              GRAPH VISUALIZER
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quick-Test Scenario Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase text-[11px] font-bold text-slate-300">
            One-Click Intelligence Presets (Real & Simulated Testbeds):
          </span>
          <span className="hidden sm:inline text-[10px]">
            Click any wallet to launch instant ML inspection
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DEMO_WALLETS.map((demo) => {
            const isSelected = addressInput.toLowerCase() === demo.address.toLowerCase();
            const isCritical = demo.expected_risk.includes('CRITICAL');
            const isHigh = demo.expected_risk.includes('HIGH');

            return (
              <button
                key={demo.address}
                onClick={() => handleSelectDemo(demo)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-[#081226]/80 hover:bg-[#0c1b38] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'SAFE'}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate font-mono">
                  {demo.label}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                  {demo.address.slice(0, 6)}...{demo.address.slice(-4)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wallet Search & Configuration Bar */}
      <Card variant="glass" className="p-5 bg-[#070e22]/90 border-white/10 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunAnalysis();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Address Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter Ethereum wallet address (0x...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500"
            />
          </div>

          {/* Hop Depth Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 font-mono text-xs">
            <span className="text-[10px] text-slate-400 px-2 uppercase">Hops:</span>
            {[1, 2, 3].map((depth) => (
              <button
                key={depth}
                type="button"
                onClick={() => setHopDepth(depth)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  hopDepth === depth
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {depth} {depth === 1 ? 'Hop' : 'Hops'}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Tracing...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Investigate Wallet</span>
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {/* Main Analysis Display */}
      {analysisResult && (
        <div className="space-y-6">
          {/* SECTION 1: Transaction Network Graph Visualizer */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Transaction Network Topology & Graph Trace
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Interactive Canvas • Pan, Zoom, Filter & Inspect Nodes
              </span>
            </div>

            <TransactionGraphView
              graphData={analysisResult.graph}
              onSelectAddress={(addr) => {
                setAddressInput(addr);
                handleRunAnalysis(addr);
              }}
            />
          </div>

          {/* SECTION 2: ML Structuring Classifier & 9 Features Breakdown */}
          <MLFeaturesBreakdown
            features={analysisResult.ml_features}
            riskScore={analysisResult.overall_risk_score}
            riskLevel={analysisResult.risk_level}
            mlStructuringScore={analysisResult.ml_structuring_score}
          />

          {/* SECTION 3: AML Heuristics Rules & OSINT Attribution */}
          <AMLHeuristicsAndAttribution
            amlFlags={analysisResult.aml_flags}
            attribution={analysisResult.attribution}
            recommendations={analysisResult.recommended_actions}
            executiveSummary={analysisResult.executive_summary}
          />
        </div>
      )}
    </div>
  );
};
