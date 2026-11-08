import { Sparkles, Quote, Scale, ShieldQuestion, FileText, Brain } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface AiExplanationSectionProps {
  aiExplanation: ScamAnalysisResult['aiExplanation'];
}

export function AiExplanationSection({ aiExplanation }: AiExplanationSectionProps) {
  const { summaryRationale, supportingSnippets, manipulationTechniques, evidenceVsInterpretation } =
    aiExplanation;

  return (
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
          EXPLAINABLE AI • AUDITABLE COGNITIVE REASONING
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
          <Sparkles className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
          <span>Why This Message Appears Suspicious</span>
        </h3>
      </div>

      {/* Primary Summary Rationale */}
      <div className="p-4 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#A95636] dark:text-[#C47A52] uppercase tracking-wider">
          <Brain className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          <span>Cognitive Threat Assessment Rationale</span>
        </div>
        <p className="text-xs md:text-sm font-sans text-[#182629] dark:text-[#E8E6DC] leading-relaxed">
          {summaryRationale}
        </p>
      </div>

      {/* Exact Supporting Text Snippets */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#647477] dark:text-[#A6B3AE] uppercase tracking-wider flex items-center gap-2">
          <Quote className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
          Exact Supporting Text Snippets ({supportingSnippets.length})
        </h4>

        {supportingSnippets.length === 0 ? (
          <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] p-3 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
            No specific incriminating quotations flagged in text sample.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportingSnippets.map((snippet, idx) => (
              <div
                key={idx}
                className="p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 font-mono text-xs hover:border-[#A95636]/50 dark:hover:border-[#C47A52]/50 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#A95636] dark:text-[#C47A52] font-bold uppercase">{snippet.context}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      snippet.severity === 'critical'
                        ? 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]'
                        : snippet.severity === 'high'
                        ? 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]'
                        : 'bg-[#356D68]/10 border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]'
                    }`}
                  >
                    {snippet.severity}
                  </span>
                </div>

                <blockquote className="bg-white dark:bg-[#19272A] p-3 rounded border-l-2 border-[#A95636] dark:border-[#C47A52] text-[#182629] dark:text-[#E8E6DC] italic text-xs leading-relaxed select-all">
                  "{snippet.quote}"
                </blockquote>

                <p className="text-[#647477] dark:text-[#A6B3AE] font-sans text-xs">
                  <strong className="text-[#182629] dark:text-[#E8E6DC]">Flagged Logic: </strong>
                  {snippet.flaggedReason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Potential Manipulation Techniques List */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-2.5 font-mono text-xs">
        <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
          <ShieldQuestion className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          Catalog of Identified Manipulation Techniques
        </h4>

        <div className="flex flex-wrap gap-2 pt-1">
          {manipulationTechniques.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] text-[#A95636] dark:text-[#C47A52] text-xs font-semibold"
            >
              • {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Side-by-Side: Hard Evidence vs AI Interpretive Reasoning */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
            <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Transparency Audit: Hard Evidence vs. AI Interpretation
            </h4>
          </div>
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Separation of Fact & Inference</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Hard Factual Evidence */}
          <div className="p-4 rounded bg-white dark:bg-[#19272A] border border-[#356D68]/30 dark:border-[#79A99C]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C] font-bold uppercase text-[11px]">
              <FileText className="w-4 h-4" />
              <span>Verifiable Hard Evidence (Ground Truth)</span>
            </div>
            <ul className="space-y-2 text-[#647477] dark:text-[#A6B3AE]">
              {evidenceVsInterpretation.hardEvidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F3F1E9] dark:bg-[#101A1D] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                  <span className="text-[#36745F] dark:text-[#79B69A] font-bold">✓</span>
                  <span className="font-sans text-xs text-[#182629] dark:text-[#E8E6DC]">{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: AI Model Interpretation */}
          <div className="p-4 rounded bg-white dark:bg-[#19272A] border border-[#A95636]/30 dark:border-[#C47A52]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#A95636] dark:text-[#C47A52] font-bold uppercase text-[11px]">
              <Brain className="w-4 h-4" />
              <span>AI Interpretive Deduction (Probabilistic)</span>
            </div>
            <ul className="space-y-2 text-[#647477] dark:text-[#A6B3AE]">
              {evidenceVsInterpretation.aiInterpretation.map((interp, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F3F1E9] dark:bg-[#101A1D] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                  <span className="text-[#A95636] dark:text-[#C47A52] font-bold">~</span>
                  <span className="font-sans text-xs text-[#182629] dark:text-[#E8E6DC]">{interp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
