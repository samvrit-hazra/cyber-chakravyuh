import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Terminal, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { LoadingState } from '../components/common/LoadingState.tsx';
import { NetworkBackground } from '../components/common/NetworkBackground.tsx';
import {
  UrlSubmissionForm,
  RiskOverviewSection,
  DomainIntelligenceSection,
  PhishingIndicatorsSection,
  RedirectAnalysisSection,
  TechnicalEvidenceSection,
  RecommendedActionsSection,
  ReportActionsBar,
} from '../components/investigation/index.ts';
import { performUrlInvestigation } from '../utils/investigationEngine.ts';
import type { UrlInvestigationResult } from '../types/investigation.ts';

interface InvestigationDashboardProps {
  initialUrl?: string;
  onBackToLanding: () => void;
  onOpenDesignSystem?: () => void;
}

export function InvestigationDashboard({
  initialUrl = 'https://security-verify.paypal.account-update.phish-alert.net/login',
  onBackToLanding,
  onOpenDesignSystem,
}: InvestigationDashboardProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [result, setResult] = useState<UrlInvestigationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeInvestigation = async (target: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const evaluation = await performUrlInvestigation(target);
      setResult(evaluation);
      setCurrentUrl(target);
    } catch (err) {
      console.error('Investigation error:', err);
      setError('Deep lexical analysis failed to complete. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const evaluation = await performUrlInvestigation(initialUrl);
        if (isMounted) {
          setResult(evaluation);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Investigation error:', err);
          setError('Deep lexical analysis failed to complete. Please retry.');
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [initialUrl]);

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col relative selection:bg-[#A95636]/20 selection:text-[#A95636]">
      {/* Background Animated Constellation */}
      <NetworkBackground opacity={0.3} nodeCount={32} />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#19272A]/90 backdrop-blur-md border-b border-[#D9DED7] dark:border-[#304144] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToLanding}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="font-mono text-xs border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] hover:border-[#A95636] dark:hover:border-[#C47A52]"
            >
              Back to Home
            </Button>

            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Cyber Chakravyuh" className="w-8 h-8 object-contain" />
              <div className="hidden sm:block">
                <span className="font-mono font-bold text-sm tracking-wider text-[#182629] dark:text-[#E8E6DC]">
                  CYBER CHAKRAVYUHA
                </span>
                <span className="text-[10px] font-mono text-[#A95636] dark:text-[#C47A52] block -mt-0.5">
                  DEEP FORENSIC INVESTIGATION LAB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="cyan" size="sm">
              <Terminal className="w-3 h-3 mr-1 inline" />
              LAYER 1 ACTIVE
            </Badge>

            {onOpenDesignSystem && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenDesignSystem}
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 hidden md:inline-flex"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Design System
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Investigation Canvas */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
        {/* Large Submission Interface */}
        <UrlSubmissionForm
          onInvestigate={executeInvestigation}
          isLoading={isLoading}
          initialUrl={currentUrl}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="py-20">
            <LoadingState
              message="LAYER 1 SAPTARISHI ENGINE EVALUATION"
              submessage={`Inspecting DNS records, analyzing homoglyphs, tracing redirect hops, and querying threat matrices for ${currentUrl}...`}
            />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-3 font-mono">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Investigation Diagnostic Failure</span>
            </div>
            <p className="text-xs">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeInvestigation(currentUrl)}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Forensic Scan
            </Button>
          </div>
        )}

        {/* Results Sections */}
        {!isLoading && !error && result && (
          <div className="space-y-6 animate-fade-in">
            {/* Actions Bar (Download, Copy Summary, View Details) */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D9DED7] dark:border-[#304144] bg-white/80 dark:bg-[#19272A]/80 py-4 px-6 text-center text-xs font-mono text-[#647477] dark:text-[#A6B3AE] relative z-10">
        Cyber Chakravyuha • Multi-Vector Digital Trust Intelligence • Zero-Trust Heuristic Engine
      </footer>
    </div>
  );
}
