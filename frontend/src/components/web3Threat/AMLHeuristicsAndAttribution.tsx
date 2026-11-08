import React from 'react';
import {
  ShieldAlert,
  Globe,
  ExternalLink,
  ListChecks,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, Badge } from '../common/index.ts';
import type { AMLFlag, AttributionInfo } from '../../types/web3Threat.ts';

interface AMLHeuristicsAndAttributionProps {
  amlFlags: AMLFlag[];
  attribution: AttributionInfo;
  recommendations: string[];
  executiveSummary: string;
}

export const AMLHeuristicsAndAttribution: React.FC<AMLHeuristicsAndAttributionProps> = ({
  amlFlags,
  attribution,
  recommendations,
  executiveSummary,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Column 1: AML Heuristic Rules Engine */}
      <Card variant="glass" className="p-6 bg-[#070d1e]/90 border-cyan-500/20 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AML Heuristic Rules Engine
            </h3>
          </div>
          <Badge variant="cyan" size="sm">
            4 ACTIVE RULES
          </Badge>
        </div>

        <div className="space-y-3">
          {amlFlags.map((flag) => (
            <div
              key={flag.type}
              className={`p-3.5 rounded-xl border transition-all ${
                flag.triggered
                  ? flag.severity === 'CRITICAL'
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-orange-950/20 border-orange-500/40'
                  : 'bg-black/30 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {flag.triggered ? (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-xs font-mono font-bold text-slate-100 truncate">
                    {flag.title}
                  </span>
                </div>

                {flag.triggered ? (
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      flag.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    }`}
                  >
                    {flag.severity}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                    PASSED
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {flag.reason}
              </p>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Analyst Executive Summary
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {executiveSummary}
          </p>
        </div>
      </Card>

      {/* Column 2: Threat Attribution & Recommended Protocol */}
      <div className="space-y-6">
        {/* Attribution Card */}
        <Card variant="glass" className="p-6 bg-[#070d1e]/90 border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                OSINT & Attribution Intelligence
              </h3>
            </div>
            {attribution.is_identified && (
              <Badge variant="rose" size="sm">
                CONFIRMED ENTITY
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Attributed Identity
              </span>
              <h4 className="text-sm font-mono font-bold text-cyan-300">
                {attribution.entity_name || 'Unattributed Entity'}
              </h4>
              <span className="text-xs text-slate-400 block mt-0.5">
                Classification: {attribution.category}
              </span>
            </div>

            {/* Tags */}
            {attribution.tags && attribution.tags.length > 0 && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                  Threat Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {attribution.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0b152d] border border-white/10 text-slate-300 uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Sources */}
            {attribution.sources && attribution.sources.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Corroborating Intelligence Sources
                </span>
                <div className="space-y-1.5">
                  {attribution.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 block group transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:underline mb-1">
                        <span className="truncate">{src.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1 text-slate-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {src.snippet}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Recommended Actions */}
        <Card variant="glass" className="p-6 bg-[#070d1e]/90 border-cyan-500/20 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ListChecks className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Recommended SOC Mitigation Protocols
            </h3>
          </div>

          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs text-slate-300 font-sans"
              >
                <span className="text-cyan-400 font-mono font-bold mt-0.5">
                  0{i + 1}.
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
