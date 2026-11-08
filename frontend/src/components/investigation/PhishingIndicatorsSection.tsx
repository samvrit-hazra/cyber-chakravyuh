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
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm dark:shadow-2xl">
      {/* Section Header */}
      <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
          SECTION 3 • PHISHING & SOCIAL ENGINEERING INDICATORS
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-[#A87532] dark:text-[#D7AA61]" />
          <span>Linguistic, Visual & Signature Phishing Vectors</span>
        </h3>
      </div>

      {/* 2x2 Grid of Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Typosquatting Indicator */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              Typosquatting Analysis
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                hasTyposquatting
                  ? 'bg-[#B64B46]/10 dark:bg-[#E17B70]/20 border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]'
                  : 'bg-[#36745F]/10 dark:bg-[#79B69A]/20 border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A]'
              }`}
            >
              {hasTyposquatting ? 'DETECTED' : 'CLEAN'}
            </span>
          </div>

          {hasTyposquatting ? (
            <div className="p-3 rounded-lg bg-[#B64B46]/10 border border-[#B64B46]/20 text-xs font-mono text-[#B64B46] dark:text-[#E17B70] space-y-1">
              <p className="font-semibold">
                Impersonates High-Profile Target: <span className="underline">{typosquattingTarget}</span>
              </p>
              <p className="text-[11px] opacity-80">
                Subdomain / domain structure employs optical mimicry to evade user inspection.
              </p>
            </div>
          ) : (
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              No known lexical distance anomalies or high-profile target squatting detected.
            </p>
          )}
        </div>

        {/* Homograph & Punycode Indicator */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              Homograph / Punycode Attacks
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                hasHomograph
                  ? 'bg-[#B64B46]/10 dark:bg-[#E17B70]/20 border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]'
                  : 'bg-[#36745F]/10 dark:bg-[#79B69A]/20 border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A]'
              }`}
            >
              {hasHomograph ? 'FLAGGED' : 'CLEAN'}
            </span>
          </div>

          {hasHomograph ? (
            <div className="p-3 rounded-lg bg-[#A95636]/10 border border-[#A95636]/20 text-xs font-mono text-[#A95636] dark:text-[#C47A52] space-y-1">
              <p className="font-semibold">Confusable Character Substitution:</p>
              <p className="text-[11px] opacity-90">{homographDetails || 'Non-ASCII Cyrillic or Greek homoglyphs in FQDN.'}</p>
            </div>
          ) : (
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              Pure ASCII canonical domain. No internationalized IDN/punycode homoglyph deception.
            </p>
          )}
        </div>

        {/* Brand Impersonation Indicator */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#B64B46] dark:text-[#E17B70]" />
              Brand Impersonation Vector
            </span>
            {impersonatedBrand ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#B64B46]/10 dark:bg-[#E17B70]/20 border border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]">
                {brandSimilarityPercent ? `${brandSimilarityPercent}% Match` : 'MATCH FOUND'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#36745F]/10 dark:bg-[#79B69A]/20 border border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A]">
                NONE DETECTED
              </span>
            )}
          </div>

          {impersonatedBrand ? (
            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono space-y-1">
              <p className="text-[#182629] dark:text-[#E8E6DC]">
                Brand Target: <span className="font-bold text-[#B64B46] dark:text-[#E17B70]">{impersonatedBrand}</span>
              </p>
              <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                Lexical and keyword matching indicates deceptive intention to harvest credentials for {impersonatedBrand}.
              </p>
            </div>
          ) : (
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              No direct brand keywords or protected trademark patterns matched in URL path or hostname.
            </p>
          )}
        </div>

        {/* Redirect Chain Risk Indicator */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[#A87532] dark:text-[#D7AA61]" />
              Redirect Chain Risk
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                redirectChainRisk === 'Cloaking Detected'
                  ? 'bg-[#B64B46]/20 border-[#B64B46]/50 text-[#B64B46] dark:text-[#E17B70] animate-pulse'
                  : redirectChainRisk === 'Moderate'
                  ? 'bg-[#A87532]/15 border-[#A87532]/40 text-[#A87532] dark:text-[#D7AA61]'
                  : 'bg-[#36745F]/15 border-[#36745F]/40 text-[#36745F] dark:text-[#79B69A]'
              }`}
            >
              {redirectChainRisk}
            </span>
          </div>

          <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
            {redirectChainRisk === 'Cloaking Detected'
              ? 'Warning: User-Agent cloaking or IP-conditional bounce gates detected in the response stream.'
              : redirectChainRisk === 'Moderate'
              ? 'Multi-hop cross-domain redirect observed; destination server differs from ingress host.'
              : 'Direct destination path or benign single-hop TLS canonicalization.'}
          </p>
        </div>
      </div>

      {/* Suspicious URL Patterns */}
      <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          Heuristic Pattern Matches ({suspiciousUrlPatterns.length})
        </h4>

        {suspiciousUrlPatterns.length === 0 ? (
          <div className="flex items-center gap-2 text-xs font-mono text-[#36745F] dark:text-[#79B69A] bg-[#36745F]/5 border border-[#36745F]/20 p-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>No suspicious path tokens, keyword luring, or high-entropy fragments detected.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suspiciousUrlPatterns.map((pattern, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-md bg-[#B64B46]/10 border border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70] text-xs font-mono"
              >
                ⚠ {pattern}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Known Threat Intelligence Matches */}
      <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          Global Threat Intelligence Corroboration
        </h4>

        {knownThreatMatches.length === 0 ? (
          <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
            No active threat database records found. Note: Zero-day phish or freshly generated lures may not yet have public feed records.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {knownThreatMatches.map((threat, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#B64B46]/20 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#A95636] dark:text-[#C47A52]">{threat.database}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#B64B46]/10 text-[#B64B46] dark:text-[#E17B70] border border-[#B64B46]/30">
                    {threat.matchConfidence}% Match
                  </span>
                </div>
                <p className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{threat.signature}</p>
                <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Category: {threat.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
