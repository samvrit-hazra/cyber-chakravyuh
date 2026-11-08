import { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Clipboard,
} from 'lucide-react';
import {
  performScamAnalysis,
  SCAM_EXAMPLE_PRESETS,
} from '../../utils/scamAnalysisEngine.ts';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface ScamMessageScannerProps {
  onScanUrl?: (url: string) => void;
}

export function ScamMessageScanner({ onScanUrl }: ScamMessageScannerProps) {
  const [messageText, setMessageText] = useState(SCAM_EXAMPLE_PRESETS[0].sampleText);
  const [selectedPresetId, setSelectedPresetId] = useState(SCAM_EXAMPLE_PRESETS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);

  const handleSelectPreset = (preset: (typeof SCAM_EXAMPLE_PRESETS)[0]) => {
    setSelectedPresetId(preset.id);
    setMessageText(preset.sampleText);
    runAnalysis(preset.sampleText);
  };

  const runAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await performScamAnalysis(textToAnalyze);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip.trim()) {
        setSelectedPresetId('');
        setMessageText(clip);
        runAnalysis(clip);
      }
    } catch {
      // Clipboard denied
    }
  };

  return (
    <section id="message-checker" className="py-16 relative border-t border-[#D9DED7] dark:border-[#304144] bg-[#F3F1E9] dark:bg-[#101A1D] transition-colors scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EAECE6] dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono text-[#A95636] dark:text-[#C47A52]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Social Engineering & Manipulation Scanner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            Analyze Suspicious SMS & Email Content
          </h2>
          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] leading-relaxed font-sans">
            Phishing links are frequently delivered inside urgent SMS notifications, delivery updates, and banking alerts designed to bypass rational inspection.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {SCAM_EXAMPLE_PRESETS.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer active:scale-[0.97] ${
                selectedPresetId === preset.id
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 border-[#A95636] dark:border-[#C47A52] text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'bg-white dark:bg-[#19272A] border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Input & Inspection Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Text Input */}
          <div className="lg:col-span-6 bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] rounded-md p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE]">
                Message Excerpt
              </span>
              <button
                type="button"
                onClick={handlePaste}
                className="text-xs text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 transition-colors cursor-pointer font-mono"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste Clipboard</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                setSelectedPresetId('');
              }}
              placeholder="Paste suspicious text message, email content, or chat excerpt..."
              className="w-full bg-[#EAECE6]/50 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] rounded-md p-3.5 text-xs sm:text-sm text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE]/60 focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] focus:ring-1 focus:ring-[#A95636]/30 leading-relaxed font-sans"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono">
                🔒 Evaluated in volatile memory. No credentials saved.
              </span>
              <button
                type="button"
                onClick={() => runAnalysis(messageText)}
                disabled={isAnalyzing || !messageText.trim()}
                className="px-5 py-2.5 rounded-md bg-[#A95636] hover:bg-[#8F472C] dark:bg-[#C47A52] dark:hover:bg-[#B06A44] text-white font-medium text-xs disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer font-sans"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Inspect Text</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Verdict */}
          <div className="lg:col-span-6 space-y-4">
            {result ? (
              <div className="bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] rounded-md p-5 space-y-4 shadow-sm">
                {/* Result header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#D9DED7] dark:border-[#304144]">
                  <div className="flex items-center gap-3">
                    {result.riskClassification.includes('Scam') ? (
                      <div className="p-2 rounded bg-[#B64B46]/10 dark:bg-[#E17B70]/15 text-[#B64B46] dark:text-[#E17B70] border border-[#B64B46]/25 dark:border-[#E17B70]/30">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-[#36745F]/10 dark:bg-[#79B69A]/15 text-[#36745F] dark:text-[#79B69A] border border-[#36745F]/25 dark:border-[#79B69A]/30">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] block">
                        Classification & Pattern
                      </span>
                      <h4 className="text-base font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">
                        {result.riskClassification} ({result.scamCategory})
                      </h4>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] uppercase block">Risk Index</span>
                    <span
                      className={`text-xl font-extrabold ${
                        result.riskScore > 70
                          ? 'text-[#B64B46] dark:text-[#E17B70]'
                          : 'text-[#36745F] dark:text-[#79B69A]'
                      }`}
                    >
                      {result.riskScore}/100
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1.5 text-xs text-[#182629] dark:text-[#E8E6DC] leading-relaxed bg-[#EAECE6]/40 dark:bg-[#101A1D] p-3.5 rounded-md border border-[#D9DED7] dark:border-[#304144] font-sans">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A95636] dark:text-[#C47A52] block">
                    Diagnostic Analysis:
                  </span>
                  <p>{result.aiExplanation.summaryRationale}</p>
                </div>

                {/* Social Engineering Signals */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
                    <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] block">Impersonated Entity:</span>
                    <span className="font-semibold text-[#A87532] dark:text-[#D7AA61] truncate block">
                      {result.impersonation?.impersonatedEntity || 'None detected'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
                    <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] block">Urgency Pressure:</span>
                    <span className="font-semibold text-[#B64B46] dark:text-[#E17B70] truncate block">
                      {result.urgencyAndManipulation?.urgencyScore > 50 ? 'High Artificial Urgency' : 'Normal / Low'}
                    </span>
                  </div>
                </div>

                {/* Extracted Links */}
                {result.extractedUrls && result.extractedUrls.length > 0 && (
                  <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] space-y-2">
                    <span className="text-[11px] font-mono font-bold text-[#647477] dark:text-[#A6B3AE] uppercase tracking-wider block">
                      Extracted Ingress URLs ({result.extractedUrls.length}):
                    </span>
                    {result.extractedUrls.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono text-[#A95636] dark:text-[#C47A52]"
                      >
                        <span className="truncate max-w-[280px] select-all" title={item.url}>
                          {item.url}
                        </span>
                        {onScanUrl && (
                          <button
                            type="button"
                            onClick={() => onScanUrl(item.url)}
                            className="text-xs text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-1 font-semibold ml-2 cursor-pointer font-sans"
                          >
                            <span>Inspect URL</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[220px] rounded-md border border-dashed border-[#D9DED7] dark:border-[#304144] flex flex-col items-center justify-center p-6 text-center text-[#647477] dark:text-[#A6B3AE] space-y-2">
                <MessageSquare className="w-8 h-8 opacity-40" />
                <p className="text-xs font-mono">
                  Select a common phishing SMS preset above or paste text to audit manipulation indicators.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
