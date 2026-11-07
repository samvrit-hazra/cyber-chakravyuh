import { useState } from 'react';
import { Brain, ArrowRight, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { SCAM_EXAMPLE_PRESETS, type ExampleScamPreset } from '../../utils/scamAnalysisEngine.ts';

interface ScamSubmissionFormProps {
  onAnalyze: (text: string) => void;
  isLoading?: boolean;
  initialText?: string;
  onClear?: () => void;
}

export function ScamSubmissionForm({
  onAnalyze,
  isLoading = false,
  initialText = '',
  onClear,
}: ScamSubmissionFormProps) {
  const [text, setText] = useState(initialText);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bank-sms');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnalyze = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setValidationError('Please paste or type message content to analyze.');
      return;
    }
    if (trimmed.length < 15) {
      setValidationError('Message content is too short for linguistic evaluation (minimum 15 characters).');
      return;
    }
    setValidationError(null);
    onAnalyze(trimmed);
  };

  const handleClear = () => {
    setText('');
    setValidationError(null);
    if (onClear) onClear();
  };

  const handleSelectPreset = (preset: ExampleScamPreset) => {
    setSelectedPresetId(preset.id);
    setText(preset.sampleText);
    setValidationError(null);
    onAnalyze(preset.sampleText);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0e122b] to-[#070b1c] border border-purple-500/30 p-5 md:p-7 shadow-[0_0_35px_rgba(168,85,247,0.12)]">
      {/* Background cyber ambient highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-bl-full pointer-events-none blur-2xl" />

      <div className="space-y-4 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]" />
              AI-POWERED SCAM & MESSAGE ANALYSIS
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Paste suspicious SMS, email, job offers, investment pitches, or support messages for NLP cognitive evaluation
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-[11px] font-mono text-purple-300">
            <Brain className="w-3.5 h-3.5" />
            <span>Layer 7 Cognitive NLP Engine</span>
          </div>
        </div>

        {/* Security Disclaimers Banner */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Zero-Credential Safe Protocol:</strong> Never paste real OTP codes, account passwords, private keys, or secret seed recovery phrases.
          </span>
        </div>

        {/* Preset Selector Dropdown / Pills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Select Sample Attack / Benign Telemetry Dossier:
            </span>
            <span className="text-[10px] font-mono text-purple-400">7 Curated Scenarios</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SCAM_EXAMPLE_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id && text === preset.sampleText;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-slate-200 hover:border-purple-500/40'
                  }`}
                >
                  <span className="text-slate-500 mr-1.5">[{preset.categoryLabel}]</span>
                  <span>{preset.title.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Message Textarea */}
        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Paste suspicious SMS notification, email message body, job offer proposal, WhatsApp investment text, or customer support alert here..."
            rows={7}
            disabled={isLoading}
            className={`w-full p-4 rounded-xl bg-[#030712]/95 border font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 resize-y leading-relaxed ${
              validationError
                ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                : 'border-purple-500/40 hover:border-purple-400/70 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30'
            }`}
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
              {text.length} characters
            </span>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              isLoading={isLoading}
              className="flex-1 sm:flex-none px-6 font-mono font-bold tracking-wider uppercase text-sm bg-purple-600 hover:bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]"
            >
              <span>ANALYSE MESSAGE</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleClear}
              disabled={isLoading || !text}
              leftIcon={<X className="w-4 h-4" />}
              className="font-mono text-xs border-white/10 text-slate-400 hover:text-white"
            >
              Clear Text
            </Button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-right">
            Supports: SMS • Email • WhatsApp • Telegram • Invoices • Job Posts
          </div>
        </div>
      </div>
    </div>
  );
}

