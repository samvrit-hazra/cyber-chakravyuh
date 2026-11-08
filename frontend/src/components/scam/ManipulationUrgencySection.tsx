import { Flame, AlertOctagon, CheckCircle2, ShieldCheck, Scale, Info } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface ManipulationUrgencySectionProps {
  urgencyAndManipulation: ScamAnalysisResult['urgencyAndManipulation'];
}

export function ManipulationUrgencySection({
  urgencyAndManipulation,
}: ManipulationUrgencySectionProps) {
  const { urgencyScore, isUrgencyLegitimate, urgencyRationale, indicators } =
    urgencyAndManipulation;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            SECTION 3 • PSYCHOLOGICAL COERCION & URGENCY EVALUATION
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Social Engineering Levers & Urgency Calibration</span>
          </h3>
        </div>

        {/* Urgency Gauge Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Urgency Level:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              urgencyScore > 75
                ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                : urgencyScore > 40
                ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {urgencyScore}% {urgencyScore > 75 ? 'Intense' : urgencyScore > 40 ? 'Moderate' : 'Low'}
          </span>
        </div>
      </div>

      {/* CRITICAL CORE RULE: Urgency Legitimate vs Coercive Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start gap-3.5 text-xs font-mono ${
          isUrgencyLegitimate
            ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
            : 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 text-amber-800 dark:text-amber-200'
        }`}
      >
        <div className="p-2 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shrink-0">
          <Scale className={`w-5 h-5 ${isUrgencyLegitimate ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-sm">
              Urgency Classification: {isUrgencyLegitimate ? 'Operationally Justified / Non-Malicious' : 'Coercive / Fraudulent Time Pressure'}
            </span>
            {isUrgencyLegitimate ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-xs">
            {urgencyRationale}
          </p>
          <div className="pt-1 text-[11px] text-[#647477] dark:text-[#A6B3AE] flex items-center gap-1.5 font-mono">
            <Info className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Chakravyuha Core Principle: High urgency or persuasive wording alone does not prove fraud without deceptive intent or unverified payment/credential vectors.</span>
          </div>
        </div>
      </div>

      {/* Detected Manipulation Indicators Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
          Active Manipulation Vectors ({indicators.length})
        </h4>

        {indicators.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#647477] dark:text-[#A6B3AE] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>No deceptive manipulation levers (fear, greed, artificial scarcity, or authority bias) were flagged.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators.map((ind, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 font-mono text-xs hover:border-[#A95636]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A95636] dark:bg-[#C47A52]" />
                    {ind.technique}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      ind.severity === 'critical'
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                        : ind.severity === 'high'
                        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52]'
                    }`}
                  >
                    {ind.severity}
                  </span>
                </div>

                <p className="text-[#647477] dark:text-[#A6B3AE] font-sans text-xs leading-relaxed">
                  {ind.explanation}
                </p>

                <div className="bg-white dark:bg-[#19272A] p-2.5 rounded-lg border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE] block">SUPPORTING TEXT EXCERPT</span>
                  <p className="text-[#A95636] dark:text-[#C47A52] text-[11px] italic break-words">
                    "{ind.supportingSnippet}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
