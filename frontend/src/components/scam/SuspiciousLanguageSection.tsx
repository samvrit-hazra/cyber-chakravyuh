import { MessageSquareWarning, SpellCheck, Volume2, ShieldCheck } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface SuspiciousLanguageSectionProps {
  suspiciousLanguage: ScamAnalysisResult['suspiciousLanguage'];
}

export function SuspiciousLanguageSection({ suspiciousLanguage }: SuspiciousLanguageSectionProps) {
  const { flaggedKeywords, syntaxNotes, sentimentTone, deceptiveStyleScore } = suspiciousLanguage;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            SECTION 2 • SUSPICIOUS LANGUAGE & LINGUISTIC SYNTAX
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <MessageSquareWarning className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Semantic Patterns & Deceptive Styling</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Deceptive Style Index:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              deceptiveStyleScore > 70
                ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                : deceptiveStyleScore > 40
                ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {deceptiveStyleScore} / 100
          </span>
        </div>
      </div>

      {/* Grid: Keywords, Tone, Syntax Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Flagged Keywords & Lexical Red Flags */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <SpellCheck className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            Flagged Deceptive Keywords ({flaggedKeywords.length})
          </h4>

          {flaggedKeywords.length === 0 ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>No coercive or deceptive keyword triggers found in analyzed sample.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {flaggedKeywords.map((word, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-md bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono font-semibold"
                >
                  ⚡ {word}
                </span>
              ))}
            </div>
          )}

          <p className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] pt-1">
            Highlighted keywords represent lexical tokens correlated with social engineering payloads.
          </p>
        </div>

        {/* Sentiment Tone & Affective Stance */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
            Linguistic Tone & Pragmatic Stance
          </h4>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Classified Tone:</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{sentimentTone}</span>
            </div>
            <p className="text-[#647477] dark:text-[#A6B3AE] text-[11px] leading-relaxed pt-1">
              Evaluates whether the speaker relies on authoritative intimidation, unearned flattery, artificial scarcity, or urgent administrative coercion.
            </p>
          </div>
        </div>
      </div>

      {/* Syntax & Grammatical Anomalies */}
      <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-2.5 font-mono text-xs">
        <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
          Grammatical, Syntactic & Orthographic Observations ({syntaxNotes.length})
        </h4>

        {syntaxNotes.length === 0 ? (
          <p className="text-[#647477] dark:text-[#A6B3AE] text-xs">No notable syntactic abnormalities detected.</p>
        ) : (
          <ul className="space-y-1.5 text-[#182629] dark:text-[#E8E6DC]">
            {syntaxNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white dark:bg-[#19272A] p-2.5 rounded-lg border border-[#D9DED7] dark:border-[#304144]">
                <span className="text-[#A95636] dark:text-[#C47A52] font-bold">›</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
