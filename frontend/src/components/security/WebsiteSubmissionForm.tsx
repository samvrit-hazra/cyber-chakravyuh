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
        return 'border-[#36745F]/30 dark:border-[#79B69A]/30 text-[#36745F] dark:text-[#79B69A] bg-[#36745F]/10 dark:bg-[#79B69A]/10';
      case 'B':
      case 'C':
        return 'border-[#A87532]/30 dark:border-[#D7AA61]/30 text-[#A87532] dark:text-[#D7AA61] bg-[#A87532]/10 dark:bg-[#D7AA61]/10';
      case 'D':
      case 'F':
      default:
        return 'border-[#B64B46]/30 dark:border-[#E17B70]/30 text-[#B64B46] dark:text-[#E17B70] bg-[#B64B46]/10 dark:bg-[#E17B70]/10';
    }
  };

  return (
    <div className="relative rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-7 shadow-xs">
      <div className="space-y-4">
        {/* Title & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading tracking-tight text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#356D68] dark:bg-[#79A99C]" />
              WEBSITE SECURITY POSTURE ASSESSMENT
            </h2>
            <p className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono mt-0.5">
              Passive, non-intrusive audit of HTTP/S, defense-in-depth headers, mixed content, version disclosures & exposed endpoints
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/25 dark:border-[#79A99C]/30 text-[11px] font-mono text-[#356D68] dark:text-[#79A99C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Layer 4 Endpoint Intel</span>
          </div>
        </div>

        {/* Large Input Field */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#356D68] dark:text-[#79A99C]">
              <Globe className="w-5 h-5 transition-transform group-focus-within:scale-105" />
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
              className={`w-full pl-11 pr-11 py-3.5 rounded bg-white dark:bg-[#101A1D] border font-mono text-xs sm:text-sm text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] outline-none transition-all duration-200 ${
                validationError
                  ? 'border-[#B64B46] dark:border-[#E17B70] ring-1 ring-[#B64B46]/20'
                  : 'border-[#D9DED7] dark:border-[#304144] hover:border-[#356D68]/60 focus:border-[#356D68] dark:focus:border-[#79A99C] focus:ring-1 focus:ring-[#356D68]/30'
              }`}
            />

            {urlInput && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Clear input"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 p-0.5 rounded bg-[#EAECE6] dark:bg-[#223336]" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="px-6 font-mono font-bold tracking-wider uppercase text-xs bg-[#356D68] hover:bg-[#2A5753] dark:bg-[#79A99C] dark:hover:bg-[#669387] text-white shadow-xs"
            >
              <span>ASSESS WEBSITE</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#B64B46] dark:text-[#E17B70] bg-[#B64B46]/10 border border-[#B64B46]/30 px-3 py-2 rounded">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Preset Scenarios Selector */}
        <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono">
          <span className="text-[#647477] dark:text-[#A6B3AE] font-semibold shrink-0">Hygiene Archetypes:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {WEBSITE_PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${getPillStyle(
                  preset.expectedGrade
                )}`}
              >
                <span className="text-[#647477] dark:text-[#A6B3AE] mr-1">[{preset.categoryLabel}]</span>
                <span className="font-semibold">{preset.title.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
