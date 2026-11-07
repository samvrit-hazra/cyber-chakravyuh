import { UserCheck } from 'lucide-react';
import { MOCK_IMPERSONATION_PATTERNS } from '../../utils/threatIntelligenceData.ts';

export function ImpersonationPatternsSection() {
  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            IMPERSONATION & MIMICRY TAXONOMY
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <span>Target Brand Optical Deception Vectors</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {MOCK_IMPERSONATION_PATTERNS.map((imp) => (
          <div
            key={imp.id}
            className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2.5 hover:border-amber-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 text-sm">{imp.targetBrand}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                {imp.similarityRatio}% Resemblance
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Technique: <strong className="text-cyan-300">{imp.mimicryType}</strong></span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-white/5 text-amber-200 text-xs break-all select-all">
              {imp.observedDomain}
            </div>

            <p className="text-slate-300 font-sans text-xs">
              <strong className="text-slate-400">Lure Pretext: </strong>
              {imp.pretext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
