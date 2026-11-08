import { useState } from 'react';
import { Brain, ArrowRight, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button.tsx';

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

  return (
    <div className="relative rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-7 shadow-xs">
      <div className="space-y-4">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading tracking-tight text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#A95636] dark:bg-[#C47A52]" />
              AI-POWERED SCAM & MESSAGE ANALYSIS
            </h2>
            <p className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono mt-0.5">
              Paste suspicious SMS, email, job offers, investment pitches, or support messages for NLP cognitive evaluation
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/25 dark:border-[#79A99C]/30 text-[11px] font-mono text-[#356D68] dark:text-[#79A99C]">
            <Brain className="w-3.5 h-3.5" />
            <span>Layer 7 Cognitive NLP Engine</span>
          </div>
        </div>

        {/* Security Disclaimers Banner */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded bg-[#A87532]/10 border border-[#A87532]/25 text-[#A87532] dark:text-[#D7AA61] text-xs font-mono">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#A87532] dark:text-[#D7AA61]" />
          <span>
            <strong>Zero-Credential Safe Protocol:</strong> Never paste real OTP codes, account passwords, private keys, or secret seed recovery phrases.
          </span>
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
            className={`w-full p-4 rounded bg-white dark:bg-[#101A1D] border font-mono text-xs sm:text-sm text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] outline-none transition-all duration-200 resize-y leading-relaxed ${
              validationError
                ? 'border-[#B64B46] dark:border-[#E17B70] ring-1 ring-[#B64B46]/20'
                : 'border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/60 focus:border-[#A95636] dark:focus:border-[#C47A52] focus:ring-1 focus:ring-[#A95636]/30'
            }`}
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] bg-[#EAECE6] dark:bg-[#223336] px-2 py-0.5 rounded border border-[#D9DED7] dark:border-[#304144]">
              {text.length} characters
            </span>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#B64B46] dark:text-[#E17B70] bg-[#B64B46]/10 border border-[#B64B46]/30 px-3 py-2 rounded">
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
              className="flex-1 sm:flex-none px-6 font-mono font-bold tracking-wider uppercase text-xs"
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
              className="font-mono text-xs"
            >
              Clear Text
            </Button>
          </div>

          <div className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] text-right">
            Supports: SMS • Email • WhatsApp • Telegram • Invoices • Job Posts
          </div>
        </div>
      </div>
    </div>
  );
}
