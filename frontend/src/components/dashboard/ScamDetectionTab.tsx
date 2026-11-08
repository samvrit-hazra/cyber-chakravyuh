import { useState, useEffect } from 'react';
import {
  ScamSubmissionForm,
  ScamRiskOverviewSection,
  SuspiciousLanguageSection,
  ManipulationUrgencySection,
  ImpersonationAndPaymentSection,
  ExtractedEntitiesSection,
  AiExplanationSection,
  RecommendedPrecautionsSection,
  ScamReportActionsBar,
} from '../scam/index.ts';
import { SCAM_EXAMPLE_PRESETS } from '../../utils/scamAnalysisEngine.ts';
import { ThreatApiService } from '../../services/threatApi.ts';
import type { ScamAnalysisResult } from '../../types/scam.ts';
import { LoadingState } from '../common/LoadingState.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface ScamDetectionTabProps {
  initialText?: string;
}

export function ScamDetectionTab({ initialText }: ScamDetectionTabProps) {
  const defaultText = initialText || SCAM_EXAMPLE_PRESETS[0].sampleText;
  const [currentText, setCurrentText] = useState<string>(defaultText);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeAnalysis = async (messageText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { result: evaluation } = await ThreatApiService.analyzeMessage(messageText);
      setResult(evaluation);
      setCurrentText(messageText);
    } catch (err) {
      console.error('Scam analysis failed:', err);
      setError('Unable to complete NLP scam classification. Please check network telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial analysis on mount
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const { result: evaluation } = await ThreatApiService.analyzeMessage(defaultText);
        if (isMounted) {
          setResult(evaluation);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Initial scam analysis failed:', err);
          setError('Analysis failed to initialize.');
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [defaultText]);

  const handleClear = () => {
    setCurrentText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Scam & Message Submission Interface */}
      <ScamSubmissionForm
        onAnalyze={executeAnalysis}
        isLoading={isLoading}
        initialText={currentText}
        onClear={handleClear}
      />

      {/* Loading Radar */}
      {isLoading && (
        <div className="py-16">
          <LoadingState
            message="LAYER 7 COGNITIVE CORE • NLP SCAM EVALUATION ACTIVE"
            submessage="Deconstructing semantic urgency, cross-referencing brand signatures, evaluating payment rails..."
          />
        </div>
      )}

      {/* Error Notice */}
      {!isLoading && error && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Cognitive Analysis Failure</span>
          </div>
          <p className="text-xs">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => executeAnalysis(currentText)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Analysis
          </Button>
        </div>
      )}

      {/* Results View — All Sections */}
      {!isLoading && !error && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar (Copy analysis, Clear analysis, View indicators, Export report) */}
          <ScamReportActionsBar result={result} onClear={handleClear} />

          {/* Section 1: Overall Risk Classification */}
          <ScamRiskOverviewSection result={result} />

          {/* Section 2: Suspicious Language Detection */}
          <SuspiciousLanguageSection suspiciousLanguage={result.suspiciousLanguage} />

          {/* Section 3: Urgency & Manipulation Indicators */}
          <ManipulationUrgencySection urgencyAndManipulation={result.urgencyAndManipulation} />

          {/* Sections 4 & 5: Impersonation & Payment Indicators */}
          <ImpersonationAndPaymentSection
            impersonation={result.impersonation}
            paymentIndicators={result.paymentIndicators}
          />

          {/* Sections 6-9: Extracted Technical Entities */}
          <ExtractedEntitiesSection
            extractedUrls={result.extractedUrls}
            extractedEmails={result.extractedEmails}
            extractedPhones={result.extractedPhones}
            suspiciousEntities={result.suspiciousEntities}
          />

          {/* AI Explanation: Why Suspicious, Supporting Snippets, Evidence vs Interpretation */}
          <AiExplanationSection aiExplanation={result.aiExplanation} />

          {/* Section 10: Recommended Precautions */}
          <RecommendedPrecautionsSection
            recommendedPrecautions={result.recommendedPrecautions}
            securityDisclosureNotice={result.securityDisclosureNotice}
          />
        </div>
      )}
    </div>
  );
}
