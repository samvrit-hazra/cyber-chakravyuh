import React from 'react';
import {
  Brain,
  Cpu,
  AlertTriangle,
  CheckCircle,
  BarChart2,
} from 'lucide-react';
import { Card, Badge } from '../common/index.ts';
import type { MLFeature } from '../../types/web3Threat.ts';

interface MLFeaturesBreakdownProps {
  features: MLFeature[];
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  mlStructuringScore?: number | null;
}

export const MLFeaturesBreakdown: React.FC<MLFeaturesBreakdownProps> = ({
  features,
  riskScore,
  riskLevel,
  mlStructuringScore,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <Card variant="glass" className="p-6 bg-[#070d1e]/90 border-cyan-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              XGBoost Threat Classifier & Feature Intelligence
            </h3>
            <p className="text-xs text-slate-400">
              9-Vector behavioral feature extractor trained on on-chain illicit structuring patterns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={riskLevel === 'CRITICAL' ? 'rose' : (riskLevel === 'HIGH' ? 'amber' : 'emerald')} size="sm">
            MODEL: XGBOOST-STRUCT-V2
          </Badge>
        </div>
      </div>

      {/* Primary Score Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ML Gauge Card */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Composite Threat Score
          </span>
          <div className="my-3 flex items-baseline gap-2">
            <span
              className={`text-4xl font-extrabold font-mono ${
                riskScore >= 0.75
                  ? 'text-rose-400'
                  : riskScore >= 0.45
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {Math.round(riskScore * 100)}%
            </span>
            <span className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                riskScore >= 0.75
                  ? 'bg-rose-500'
                  : riskScore >= 0.45
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.round(riskScore * 100)}%` }}
            />
          </div>
        </div>

        {/* Model Output Probability */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400">
            ML Structuring Probability
          </span>
          <div className="my-3">
            <span className="text-3xl font-extrabold font-mono text-purple-400">
              {mlStructuringScore !== null && mlStructuringScore !== undefined
                ? `${(mlStructuringScore * 100).toFixed(1)}%`
                : 'N/A'}
            </span>
            <span className="block text-[11px] text-slate-400 mt-1">
              Raw inference probability from XGBoost booster tree
            </span>
          </div>
          <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>9 Features Vectorized</span>
          </div>
        </div>

        {/* Behavioral Anomaly Summary */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Anomaly Status
          </span>
          <div className="my-3">
            {features.some((f) => f.is_suspicious) ? (
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold font-mono">
                  {features.filter((f) => f.is_suspicious).length} Anomalies Triggered
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold font-mono">
                  All 9 Features In Normal Range
                </span>
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Evaluated against 100k+ labeled transaction vectors.
            </p>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Latency: &lt; 25ms inference
          </div>
        </div>
      </div>

      {/* 9 Features Breakdown Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          Feature Engineering Matrix (9 Dimensions)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feat) => (
            <div
              key={feat.key}
              className={`p-3.5 rounded-xl border transition-all ${
                feat.is_suspicious
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-[#0b152d]/60 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-slate-200 truncate">
                  {feat.name}
                </span>
                {feat.is_suspicious ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    ANOMALY
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    NORMAL
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mb-1">
                <span
                  className={`text-lg font-mono font-bold ${
                    feat.is_suspicious ? 'text-rose-400' : 'text-cyan-300'
                  }`}
                >
                  {typeof feat.value === 'number'
                    ? feat.value < 1 && feat.value > 0
                      ? feat.value.toFixed(4)
                      : feat.value.toLocaleString()
                    : feat.value}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ref: {feat.benchmark}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
