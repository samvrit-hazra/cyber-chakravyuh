import { useState, type KeyboardEvent } from 'react';
import { Globe, ArrowRight, X, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import {
  WEBSITE_PRESET_SCENARIOS,
  normalizeTargetUrl,
  type WebsitePresetScenario,
} from '../../utils/websiteSecurityEngine.ts';
import type { SecurityGrade } from '../../types/websiteSecurity.ts';

interface WebsiteSubmissionFormProps {
  onAssess: (url: string) => void;
  isLoading?: boolean;
  initialUrl?: string;
}

export function WebsiteSubmissionForm({
  onAssess,
  isLoading = false,
  initialUrl = 'https://paypal-security-verification.phish-login.net',
}: WebsiteSubmissionFormProps) {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setValidationError('Please enter a target URL or domain to assess.');
      return;
    }
    const { url } = normalizeTargetUrl(trimmed);
    setValidationError(null);
    onAssess(url);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setValidationError(null);
  };

  const handleSelectPreset = (preset: WebsitePresetScenario) => {
    setUrlInput(preset.url);
    setValidationError(null);
    onAssess(preset.url);
  };

  const getPillStyle = (grade: SecurityGrade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20';
      case 'B':
      case 'C':
        return 'border-amber-500/40 text-amber-300 hover:bg-amber-500/20';
      case 'D':
      case 'F':
      default:
        return 'border-rose-500/40 text-rose-300 hover:bg-rose-500/20';
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0b162c] to-[#070e1f] border border-emerald-500/30 p-5 md:p-7 shadow-[0_0_35px_rgba(16,185,129,0.12)]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-bl-full pointer-events-none blur-xl" />

      <div className="space-y-4 relative z-10">
        {/* Title & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              WEBSITE SECURITY POSTURE ASSESSMENT
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Passive, non-intrusive audit of HTTP/S, defense-in-depth headers, mixed content, version disclosures & exposed endpoints
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Layer 4 Endpoint Intel</span>
          </div>
        </div>

        {/* Large Input Field */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
              <Globe className="w-5 h-5 transition-transform group-focus-within:scale-110" />
            </div>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter publicly accessible URL (e.g. https://example.com or http://legacy-host.lab)..."
              disabled={isLoading}
              className={`w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#030712]/95 border font-mono text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                validationError
                  ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                  : 'border-emerald-500/40 hover:border-emerald-400/70 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30'
              }`}
            />

            {urlInput && (
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
              className="px-6 font-mono font-bold tracking-wider uppercase text-sm bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]"
            >
              <span>ASSESS WEBSITE</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Preset Scenarios Selector */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 font-semibold shrink-0">Hygiene Archetypes:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {WEBSITE_PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer bg-slate-900/80 ${getPillStyle(
                  preset.expectedGrade
                )}`}
              >
                <span className="text-slate-400 mr-1">[{preset.categoryLabel}]</span>
                <span className="font-semibold">{preset.title.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

