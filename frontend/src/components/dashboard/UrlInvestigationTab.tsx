import { useState, useEffect } from 'react';
import {
  UrlSubmissionForm,
  RiskOverviewSection,
  DomainIntelligenceSection,
  PhishingIndicatorsSection,
  RedirectAnalysisSection,
  TechnicalEvidenceSection,
  RecommendedActionsSection,
  ReportActionsBar,
} from '../investigation/index.ts';
import { ThreatApiService } from '../../services/threatApi.ts';
import type { UrlInvestigationResult } from '../../types/investigation.ts';
import { LoadingState } from '../common/LoadingState.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface UrlInvestigationTabProps {
  initialUrl?: string;
}

export function UrlInvestigationTab({
  initialUrl = '',
}: UrlInvestigationTabProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [result, setResult] = useState<UrlInvestigationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeInvestigation = async (target: string) => {
    if (!target || !target.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const { result: evaluation } = await ThreatApiService.investigateUrl(target);
      setResult(evaluation);
      setCurrentUrl(target);
    } catch (err) {
      console.error('Investigation failed:', err);
      setError('Unable to complete deep lexical investigation. Please check network connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial investigation on mount ONLY if initialUrl is present
  useEffect(() => {
    if (!initialUrl || !initialUrl.trim()) return;
    let isMounted = true;
    const run = async () => {
      try {
        const { result: evaluation } = await ThreatApiService.investigateUrl(initialUrl);
        if (isMounted) {
          setResult(evaluation);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Investigation failed:', err);
          setError('Unable to complete deep lexical investigation. Please check network connectivity.');
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [initialUrl]);

  return (
    <div className="space-y-6">
      {/* URL Submission Form with Validation & Presets */}
      <UrlSubmissionForm
        onInvestigate={executeInvestigation}
        isLoading={isLoading}
        initialUrl={currentUrl}
      />

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="py-16">
          <LoadingState
            message="SAPTARISHI LAYER 1 • DEEP FORENSIC SCAN IN PROGRESS"
            submessage={`Corroborating DNS records, computing Shannon entropy, inspecting homoglyphs, and querying threat databases for ${currentUrl}...`}
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Investigation Error Encountered</span>
          </div>
          <p className="text-xs">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => executeInvestigation(currentUrl)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Investigation
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && !result && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              No URL Currently Investigated
            </h3>
            <p className="text-xs text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed">
              Enter any URL in the field above and click &quot;INVESTIGATE&quot; to inspect Shannon entropy, DNS records, homoglyphs, and SSL trust indicators in real-time.
            </p>
          </div>
        </div>
      )}

      {/* Results View — All 6 Required Sections & Actions */}
      {!isLoading && !error && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Report Actions Bar (Download, Copy Summary, View Raw Details) */}
          <ReportActionsBar result={result} />

          {/* Section 1: Risk Overview */}
          <RiskOverviewSection result={result} />

          {/* Section 2: Domain Intelligence */}
          <DomainIntelligenceSection intelligence={result.domainIntelligence} />

          {/* Section 3: Phishing Indicators */}
          <PhishingIndicatorsSection indicators={result.phishingIndicators} />

          {/* Section 4: Redirect Analysis */}
          <RedirectAnalysisSection redirectAnalysis={result.redirectAnalysis} />

          {/* Section 5: Technical Evidence */}
          <TechnicalEvidenceSection findings={result.technicalFindings} />

          {/* Section 6: Recommended Actions */}
          <RecommendedActionsSection actions={result.recommendedActions} />
        </div>
      )}
    </div>
  );
}
