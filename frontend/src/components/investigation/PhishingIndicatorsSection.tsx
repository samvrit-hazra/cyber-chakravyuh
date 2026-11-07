import {
  AlertTriangle,
  Type,
  Binary,
  GitFork,
  Radio,
  CheckCircle2,
  Database,
  Crosshair,
} from 'lucide-react';
import type { PhishingIndicators } from '../../types/investigation.ts';

interface PhishingIndicatorsSectionProps {
  indicators: PhishingIndicators;
}

export function PhishingIndicatorsSection({ indicators }: PhishingIndicatorsSectionProps) {
  const {
    hasTyposquatting,
    typosquattingTarget,
    hasHomograph,
    homographDetails,
    suspiciousUrlPatterns,
    redirectChainRisk,
    impersonatedBrand,
    brandSimilarityPercent,
    knownThreatMatches,
  } = indicators;

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Section Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
          SECTION 3 • PHISHING & SOCIAL ENGINEERING INDICATORS
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Linguistic, Visual & Signature Phishing Vectors</span>
        </h3>
      </div>

      {/* 2x2 Grid of Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Typosquatting Indicator */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              Typosquatting Analysis
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                hasTyposquatting
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasTyposquatting ? 'DETECTED' : 'CLEAN'}
            </span>
          </div>

          {hasTyposquatting ? (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 text-xs font-mono text-rose-200 space-y-1">
              <p className="font-semibold text-rose-300">
                Impersonates High-Profile Target: <span className="underline">{typosquattingTarget}</span>
              </p>
              <p className="text-[11px] text-rose-300/80">
                Subdomain / domain structure employs optical mimicry to evade user inspection.
              </p>
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-400">
              No known lexical distance anomalies or high-profile target squatting detected.
            </p>
          )}
        </div>

        {/* Homograph & Punycode Indicator */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4 text-purple-400" />
              Homograph / Punycode Attacks
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                hasHomograph
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {hasHomograph ? 'FLAGGED' : 'CLEAN'}
            </span>
          </div>

          {hasHomograph ? (
            <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/20 text-xs font-mono text-purple-200 space-y-1">
              <p className="font-semibold text-purple-300">Confusable Character Substitution:</p>
              <p className="text-[11px] text-purple-300/90">{homographDetails || 'Non-ASCII Cyrillic or Greek homoglyphs in FQDN.'}</p>
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-400">
              Pure ASCII canonical domain. No internationalized IDN/punycode homoglyph deception.
            </p>
          )}
        </div>

        {/* Brand Impersonation Indicator */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-rose-400" />
              Brand Impersonation Vector
            </span>
            {impersonatedBrand ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/15 border border-rose-500/40 text-rose-300">
                {brandSimilarityPercent ? `${brandSimilarityPercent}% Match` : 'MATCH FOUND'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                NONE DETECTED
              </span>
            )}
          </div>

          {impersonatedBrand ? (
            <div className="p-3 rounded-lg bg-slate-900 border border-white/5 text-xs font-mono space-y-1">
              <p className="text-slate-300">
                Brand Target: <span className="font-bold text-rose-400">{impersonatedBrand}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Lexical and keyword matching indicates deceptive intention to harvest credentials for {impersonatedBrand}.
              </p>
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-400">
              No direct brand keywords or protected trademark patterns matched in URL path or hostname.
            </p>
          )}
        </div>

        {/* Redirect Chain Risk Indicator */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-4 h-4 text-amber-400" />
              Redirect Chain Risk
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                redirectChainRisk === 'Cloaking Detected'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                  : redirectChainRisk === 'Moderate'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {redirectChainRisk}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400">
            {redirectChainRisk === 'Cloaking Detected'
              ? 'Warning: User-Agent cloaking or IP-conditional bounce gates detected in the response stream.'
              : redirectChainRisk === 'Moderate'
              ? 'Multi-hop cross-domain redirect observed; destination server differs from ingress host.'
              : 'Direct destination path or benign single-hop TLS canonicalization.'}
          </p>
        </div>
      </div>

      {/* Suspicious URL Patterns */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Heuristic Pattern Matches ({suspiciousUrlPatterns.length})
        </h4>

        {suspiciousUrlPatterns.length === 0 ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>No suspicious path tokens, keyword luring, or high-entropy fragments detected.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suspiciousUrlPatterns.map((pattern, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono"
              >
                ⚠ {pattern}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Known Threat Intelligence Matches */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          Global Threat Intelligence Corroboration
        </h4>

        {knownThreatMatches.length === 0 ? (
          <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 text-xs font-mono text-slate-400">
            No active threat database records found. Note: Zero-day phish or freshly generated lures may not yet have public feed records.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {knownThreatMatches.map((threat, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-slate-900 border border-rose-500/20 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">{threat.database}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {threat.matchConfidence}% Match
                  </span>
                </div>
                <p className="text-slate-300 font-semibold">{threat.signature}</p>
                <p className="text-[11px] text-slate-500">Category: {threat.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

