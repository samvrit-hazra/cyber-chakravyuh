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
        return 'border-[#B64B46]/40 text-[#B64B46] dark:text-[#E17B70] hover:bg-[#B64B46]/10';
      case 'High Risk':
        return 'border-[#A87532]/40 text-[#A87532] dark:text-[#D7AA61] hover:bg-[#A87532]/10';
      case 'Suspicious':
        return 'border-[#A95636]/40 text-[#A95636] dark:text-[#C47A52] hover:bg-[#A95636]/10';
      case 'Low Risk':
        return 'border-[#36745F]/40 text-[#36745F] dark:text-[#79B69A] hover:bg-[#36745F]/10';
      case 'Inconclusive':
      default:
        return 'border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE] hover:bg-[#EAECE6] dark:hover:bg-[#223336]';
    }
  };

  return (
    <div className="relative rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-7 shadow-sm dark:shadow-2xl">
      <div className="space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-mono tracking-tight text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A95636] dark:bg-[#C47A52] animate-pulse" />
              INTELLIGENT URL & DOMAIN FORENSICS
            </h2>
            <p className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono mt-0.5">
              Multi-vector heuristics, DNS correlation, homograph detection & real-time threat mesh
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/20 dark:border-[#C47A52]/30 text-[11px] font-mono text-[#A95636] dark:text-[#C47A52]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chakravyuh AI Core v4.2</span>
          </div>
        </div>

        {/* Large Investigation Input */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A95636] dark:text-[#C47A52]">
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
              className={`w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border font-mono text-sm sm:text-base text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE]/60 outline-none transition-all duration-200 ${
                validationError
                  ? 'border-[#B64B46] dark:border-[#E17B70] ring-2 ring-[#E17B70]/20'
                  : 'border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/60 dark:hover:border-[#C47A52]/60 focus:border-[#A95636] dark:focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20'
              }`}
            />

            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Clear input"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 p-0.5 rounded-full bg-[#D9DED7] dark:bg-[#304144]" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="px-6 font-mono font-bold tracking-wider uppercase text-sm shadow-md"
            >
              <span>INVESTIGATE</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#B64B46] dark:text-[#E17B70] bg-[#B64B46]/10 dark:bg-[#E17B70]/10 border border-[#B64B46]/20 dark:border-[#E17B70]/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Example URL Suggestions */}
        <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono">
          <span className="text-[#647477] dark:text-[#A6B3AE] font-semibold shrink-0">Sample Telemetry Dossiers:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {EXAMPLE_URL_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => handleSelectPreset(suggestion.url)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer bg-[#EAECE6] dark:bg-[#223336] ${getPillBadgeStyle(
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
