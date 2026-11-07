import { Sparkles, Quote, Scale, ShieldQuestion, FileText, Brain } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface AiExplanationSectionProps {
  aiExplanation: ScamAnalysisResult['aiExplanation'];
}

export function AiExplanationSection({ aiExplanation }: AiExplanationSectionProps) {
  const { summaryRationale, supportingSnippets, manipulationTechniques, evidenceVsInterpretation } =
    aiExplanation;

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/3 w-80 h-40 bg-purple-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
          EXPLAINABLE AI • AUDITABLE COGNITIVE REASONING
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Why This Message Appears Suspicious</span>
        </h3>
      </div>

      {/* Primary Summary Rationale */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Cognitive Threat Assessment Rationale</span>
        </div>
        <p className="text-xs md:text-sm font-sans text-slate-200 leading-relaxed">
          {summaryRationale}
        </p>
      </div>

      {/* Exact Supporting Text Snippets */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Quote className="w-4 h-4 text-cyan-400" />
          Exact Supporting Text Snippets ({supportingSnippets.length})
        </h4>

        {supportingSnippets.length === 0 ? (
          <p className="text-xs font-mono text-slate-400 p-3 rounded-lg bg-[#060b17] border border-white/5">
            No specific incriminating quotations flagged in text sample.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportingSnippets.map((snippet, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2.5 font-mono text-xs hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-400 font-bold uppercase">{snippet.context}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      snippet.severity === 'critical'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : snippet.severity === 'high'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    }`}
                  >
                    {snippet.severity}
                  </span>
                </div>

                <blockquote className="bg-black/60 p-3 rounded-lg border-l-2 border-purple-400 text-slate-100 italic text-xs leading-relaxed select-all">
                  "{snippet.quote}"
                </blockquote>

                <p className="text-slate-400 font-sans text-xs">
                  <strong className="text-slate-300">Flagged Logic: </strong>
                  {snippet.flaggedReason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Potential Manipulation Techniques List */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-2.5 font-mono text-xs">
        <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldQuestion className="w-4 h-4 text-purple-400" />
          Catalog of Identified Manipulation Techniques
        </h4>

        <div className="flex flex-wrap gap-2 pt-1">
          {manipulationTechniques.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-purple-500/30 text-purple-200 text-xs font-semibold"
            >
              • {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Side-by-Side: Hard Evidence vs AI Interpretive Reasoning */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">
              Transparency Audit: Hard Evidence vs. AI Interpretation
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">Separation of Fact & Inference</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Hard Factual Evidence */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
              <FileText className="w-4 h-4" />
              <span>Verifiable Hard Evidence (Ground Truth)</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              {evidenceVsInterpretation.hardEvidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-black/40 p-2.5 rounded border border-white/5">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span className="font-sans text-xs">{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: AI Model Interpretation */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[11px]">
              <Brain className="w-4 h-4" />
              <span>AI Interpretive Deduction (Probabilistic)</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              {evidenceVsInterpretation.aiInterpretation.map((interp, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-black/40 p-2.5 rounded border border-white/5">
                  <span className="text-purple-400 font-bold">~</span>
                  <span className="font-sans text-xs">{interp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

