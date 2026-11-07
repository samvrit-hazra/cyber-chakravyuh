import { useState, useEffect } from 'react';
import {
  WebsiteSubmissionForm,
  SecurityScoreOverviewSection,
  AssessmentFindingsSection,
  PassiveSafetyNoticeBanner,
  SecurityReportActionsBar,
} from '../security/index.ts';
import {
  WEBSITE_PRESET_SCENARIOS,
} from '../../utils/websiteSecurityEngine.ts';
import { ThreatApiService } from '../../services/threatApi.ts';
import type { WebsiteSecurityAssessmentResult } from '../../types/websiteSecurity.ts';
import { LoadingState } from '../common/LoadingState.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface WebsiteSecurityTabProps {
  initialUrl?: string;
}

export function WebsiteSecurityTab({ initialUrl }: WebsiteSecurityTabProps) {
  const defaultUrl = initialUrl || WEBSITE_PRESET_SCENARIOS[1].url;
  const [currentUrl, setCurrentUrl] = useState<string>(defaultUrl);
  const [result, setResult] = useState<WebsiteSecurityAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeAssessment = async (target: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { result: evaluation } = await ThreatApiService.assessWebsiteSecurity(target);
      setResult(evaluation);
      setCurrentUrl(target);
    } catch (err) {
      console.error('Website security assessment failed:', err);
      setError('Unable to complete passive security assessment. Check host reachability.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const { result: evaluation } = await ThreatApiService.assessWebsiteSecurity(defaultUrl);
        if (isMounted) {
          setResult(evaluation);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Initial assessment failed:', err);
          setError('Security telemetry failed to load.');
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [defaultUrl]);

  return (
    <div className="space-y-6">
      {/* Website Submission Form & Scenarios */}
      <WebsiteSubmissionForm
        onAssess={executeAssessment}
        isLoading={isLoading}
        initialUrl={currentUrl}
      />

      {/* Loading Radar */}
      {isLoading && (
        <div className="py-16">
          <LoadingState
            message="LAYER 4 ENDPOINT INTEL • PASSIVE SECURITY AUDIT ACTIVE"
            submessage={`Inspecting HTTP response headers, verifying HSTS enforcement, parsing mixed content for ${currentUrl}...`}
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Passive Assessment Diagnostic Failure</span>
          </div>
          <p className="text-xs">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => executeAssessment(currentUrl)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Assessment
          </Button>
        </div>
      )}

      {/* Results View */}
      {!isLoading && !error && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar (Copy summary, Download JSON, View raw details) */}
          <SecurityReportActionsBar result={result} />

          {/* Mandatory Non-Exploitation Safety Notice */}
          <PassiveSafetyNoticeBanner notice={result.passiveSafetyNotice} />

          {/* Security Score Overview (Score 0-100, Grade, 7 categories breakdown) */}
          <SecurityScoreOverviewSection result={result} />

          {/* Detailed Findings Register (All 7 categories, expandable details, impact & remediation) */}
          <AssessmentFindingsSection findings={result.findings} />
        </div>
      )}
    </div>
  );
}
