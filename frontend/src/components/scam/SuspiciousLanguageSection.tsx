import { MessageSquareWarning, SpellCheck, Volume2, ShieldCheck } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface SuspiciousLanguageSectionProps {
  suspiciousLanguage: ScamAnalysisResult['suspiciousLanguage'];
}

export function SuspiciousLanguageSection({ suspiciousLanguage }: SuspiciousLanguageSectionProps) {
  const { flaggedKeywords, syntaxNotes, sentimentTone, deceptiveStyleScore } = suspiciousLanguage;

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            SECTION 2 • SUSPICIOUS LANGUAGE & LINGUISTIC SYNTAX
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <MessageSquareWarning className="w-5 h-5 text-purple-400" />
            <span>Semantic Patterns & Deceptive Styling</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Deceptive Style Index:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              deceptiveStyleScore > 70
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : deceptiveStyleScore > 40
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {deceptiveStyleScore} / 100
          </span>
        </div>
      </div>

      {/* Grid: Keywords, Tone, Syntax Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Flagged Keywords & Lexical Red Flags */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <SpellCheck className="w-4 h-4 text-purple-400" />
            Flagged Deceptive Keywords ({flaggedKeywords.length})
          </h4>

          {flaggedKeywords.length === 0 ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>No coercive or deceptive keyword triggers found in analyzed sample.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {flaggedKeywords.map((word, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold"
                >
                  ⚡ {word}
                </span>
              ))}
            </div>
          )}

          <p className="text-[11px] font-mono text-slate-500 pt-1">
            Highlighted keywords represent lexical tokens correlated with social engineering payloads.
          </p>
        </div>

        {/* Sentiment Tone & Affective Stance */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            Linguistic Tone & Pragmatic Stance
          </h4>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Classified Tone:</span>
              <span className="text-purple-300 font-bold">{sentimentTone}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
              Evaluates whether the speaker relies on authoritative intimidation, unearned flattery, artificial scarcity, or urgent administrative coercion.
            </p>
          </div>
        </div>
      </div>

      {/* Syntax & Grammatical Anomalies */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-2.5 font-mono text-xs">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Grammatical, Syntactic & Orthographic Observations ({syntaxNotes.length})
        </h4>

        {syntaxNotes.length === 0 ? (
          <p className="text-slate-500 text-xs">No notable syntactic abnormalities detected.</p>
        ) : (
          <ul className="space-y-1.5 text-slate-300">
            {syntaxNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                <span className="text-purple-400 font-bold">›</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

