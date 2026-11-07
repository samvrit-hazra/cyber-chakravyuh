import { Radio, Layers } from 'lucide-react';
import { MOCK_REPEATED_INDICATORS } from '../../utils/threatIntelligenceData.ts';

export function RepeatedIndicatorsSection() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            INFRASTRUCTURE PATTERNS & REPEATED ARTIFACTS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Radio className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Recurring Threat Infrastructure Fingerprints</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({MOCK_REPEATED_INDICATORS.length} Cluster Signals)
            </span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {MOCK_REPEATED_INDICATORS.map((ind) => (
          <div
            key={ind.id}
            className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 hover:border-[#A95636]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
                {ind.indicatorType}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  ind.severity === 'critical'
                    ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                }`}
              >
                {ind.frequency} Reoccurrences
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#A95636] dark:text-[#C47A52] font-bold text-xs select-all">
              {ind.value}
            </div>

            <p className="text-[#647477] dark:text-[#A6B3AE] font-sans text-xs">{ind.notes}</p>

            <div className="space-y-1 pt-1 text-[11px]">
              <span className="text-[#647477] dark:text-[#A6B3AE] uppercase text-[10px] block font-semibold">CORRELATED DOMAINS:</span>
              <div className="flex flex-wrap gap-1">
                {ind.connectedDomains.map((dom) => (
                  <span key={dom} className="px-2 py-0.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-[10px]">
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
