import { useState, type KeyboardEvent } from 'react';
import { Search, X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { EXAMPLE_URL_SUGGESTIONS } from '../../utils/investigationEngine.ts';
import type { RiskClassification } from '../../types/investigation.ts';

interface UrlSubmissionFormProps {
  onInvestigate: (url: string) => void;
  isLoading?: boolean;
  initialUrl?: string;
}

export function UrlSubmissionForm({
  onInvestigate,
  isLoading = false,
  initialUrl = '',
}: UrlSubmissionFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUrl = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Please enter a target URL or domain to investigate.');
      return false;
    }

    // Accept domains or full URLs
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
    if (!urlPattern.test(trimmed)) {
      setValidationError('Please enter a valid URL or hostname (e.g. https://example.com or malicious-site.net/login).');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateUrl(url)) {
      onInvestigate(url.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUrl('');
    setValidationError(null);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setValidationError(null);
    onInvestigate(presetUrl);
  };

  const getPillBadgeStyle = (classification: RiskClassification) => {
    switch (classification) {
      case 'Confirmed Malicious':
        return 'border-rose-500/40 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400';
      case 'High Risk':
        return 'border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400';
      case 'Suspicious':
        return 'border-purple-500/40 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400';
      case 'Low Risk':
        return 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400';
      case 'Inconclusive':
      default:
        return 'border-slate-500/40 text-slate-300 hover:bg-slate-500/20 hover:border-slate-400';
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0b162c] to-[#070e1f] border border-cyan-500/25 p-5 md:p-7 shadow-[0_0_30px_rgba(6,182,212,0.12)]">
      {/* Decorative cyber grid accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none blur-xl" />

      <div className="space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              INTELLIGENT URL & DOMAIN FORENSICS
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Multi-vector heuristics, DNS correlation, homograph detection & real-time threat mesh
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saptarishi AI Core v4.2</span>
          </div>
        </div>

        {/* Large Investigation Input */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
              <Search className="w-5 h-5 transition-transform group-focus-within:scale-110" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Paste suspicious target URL, IP, or domain (e.g. https://security-paypal.phish-alert.net/login)..."
              disabled={isLoading}
              className={`w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#030712]/90 border font-mono text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                validationError
                  ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                  : 'border-cyan-500/40 hover:border-cyan-400/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
              }`}
            />

            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Clear input"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 p-0.5 rounded-full bg-slate-800 hover:bg-slate-700" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="px-6 font-mono font-bold tracking-wider uppercase text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            >
              <span>INVESTIGATE</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Example URL Suggestions */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 font-semibold shrink-0">Sample Telemetry Dossiers:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {EXAMPLE_URL_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => handleSelectPreset(suggestion.url)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer bg-slate-900/70 backdrop-blur-sm ${getPillBadgeStyle(
                  suggestion.expectedClassification
                )}`}
              >
                <span className="font-semibold">{suggestion.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

