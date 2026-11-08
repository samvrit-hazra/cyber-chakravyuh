import { UserCheck } from 'lucide-react';
import { MOCK_IMPERSONATION_PATTERNS } from '../../utils/threatIntelligenceData.ts';

export function ImpersonationPatternsSection() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
            IMPERSONATION & MIMICRY TAXONOMY
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Target Brand Optical Deception Vectors</span>
          </h3>
        </div>
      </div>

      {MOCK_IMPERSONATION_PATTERNS.length === 0 ? (
        <div className="py-8 text-center font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
          No active brand impersonation patterns flagged across current radar telemetry.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {MOCK_IMPERSONATION_PATTERNS.map((imp) => (
            <div
              key={imp.id}
              className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#182629] dark:text-[#E8E6DC] text-sm">{imp.targetBrand}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-amber-700 dark:text-amber-300">
                  {imp.similarityRatio}% Resemblance
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                <span>Technique: <strong className="text-[#356D68] dark:text-[#79A99C]">{imp.mimicryType}</strong></span>
              </div>

              <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-amber-700 dark:text-amber-300 text-xs break-all select-all font-mono">
                {imp.observedDomain}
              </div>

              <p className="text-[#647477] dark:text-[#A6B3AE] font-sans text-xs">
                <strong className="text-[#182629] dark:text-[#E8E6DC]">Lure Pretext: </strong>
                {imp.pretext}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
