import { Radio, Layers } from 'lucide-react';
import { MOCK_REPEATED_INDICATORS } from '../../utils/threatIntelligenceData.ts';

export function RepeatedIndicatorsSection() {
  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            INFRASTRUCTURE PATTERNS & REPEATED ARTIFACTS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <Radio className="w-5 h-5 text-purple-400" />
            <span>Recurring Threat Infrastructure Fingerprints</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({MOCK_REPEATED_INDICATORS.length} Cluster Signals)
            </span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {MOCK_REPEATED_INDICATORS.map((ind) => (
          <div
            key={ind.id}
            className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2.5 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                {ind.indicatorType}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  ind.severity === 'critical'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                }`}
              >
                {ind.frequency} Reoccurrences
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-purple-300 font-bold text-xs select-all">
              {ind.value}
            </div>

            <p className="text-slate-300 font-sans text-xs">{ind.notes}</p>

            <div className="space-y-1 pt-1 text-[11px]">
              <span className="text-slate-500 uppercase text-[10px] block">CORRELATED DOMAINS:</span>
              <div className="flex flex-wrap gap-1">
                {ind.connectedDomains.map((dom) => (
                  <span key={dom} className="px-2 py-0.5 rounded bg-black/60 border border-white/5 text-slate-300 text-[10px]">
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
