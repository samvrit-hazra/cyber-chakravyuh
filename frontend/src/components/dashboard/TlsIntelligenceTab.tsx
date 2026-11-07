import { useState, useEffect } from 'react';
import {
  TlsSubmissionForm,
  TlsOverviewSection,
  CertificateChainVisualizer,
  TlsSecurityFindingsSection,
  TlsImportantWarningsBanner,
  TlsReportActionsBar,
} from '../tls/index.ts';
import { TLS_PRESET_SCENARIOS } from '../../utils/tlsAnalysisEngine.ts';
import { ThreatApiService } from '../../services/threatApi.ts';
import type { TlsInvestigationResult } from '../../types/tls.ts';
import { LoadingState } from '../common/LoadingState.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface TlsIntelligenceTabProps {
  initialDomain?: string;
}

export function TlsIntelligenceTab({ initialDomain }: TlsIntelligenceTabProps) {
  const defaultDomain = initialDomain || TLS_PRESET_SCENARIOS[0].domain;
  const [currentDomain, setCurrentDomain] = useState<string>(defaultDomain);
  const [result, setResult] = useState<TlsInvestigationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeInvestigation = async (target: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { result: evaluation } = await ThreatApiService.analyzeTls(target);
      setResult(evaluation);
      setCurrentDomain(target);
    } catch (err) {
      console.error('TLS Investigation failed:', err);
      setError('Unable to complete X.509 certificate chain validation. Check connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const { result: evaluation } = await ThreatApiService.analyzeTls(defaultDomain);
        if (isMounted) {
          setResult(evaluation);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Initial TLS investigation failed:', err);
          setError('TLS telemetry failed to load.');
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [defaultDomain]);

  return (
    <div className="space-y-6">
      {/* TLS Submission Form & Presets */}
      <TlsSubmissionForm
        onAnalyze={executeInvestigation}
        isLoading={isLoading}
        initialDomain={currentDomain}
      />

      {/* Loading Radar */}
      {isLoading && (
        <div className="py-16">
          <LoadingState
            message="LAYER 5 APPLICATION SHIELD • TLS PKI TELEMETRY ACTIVE"
            submessage={`Tracing X.509 root anchors, querying OCSP responders, verifying Certificate Transparency for ${currentDomain}...`}
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>TLS Handshake / Audit Diagnostic Error</span>
          </div>
          <p className="text-xs">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => executeInvestigation(currentDomain)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry PKI Investigation
          </Button>
        </div>
      )}

      {/* Results View */}
      {!isLoading && !error && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar (Copy Summary, Download Report, View Details) */}
          <TlsReportActionsBar result={result} />

          {/* Mandatory Zero-Trust PKI Warnings Banner */}
          <TlsImportantWarningsBanner warnings={result.importantWarnings} />

          {/* Certificate Overview (Identity, Status, Grade, SANs, Crypto profile) */}
          <TlsOverviewSection result={result} />

          {/* Graphical Certificate Chain Visualizer (Root CA -> Intermediate CA -> Leaf) */}
          <CertificateChainVisualizer chain={result.certificateChain} />

          {/* Security Findings & Certificate Transparency Audit */}
          <TlsSecurityFindingsSection
            findings={result.securityFindings}
            certificateTransparency={result.certificateTransparency}
          />
        </div>
      )}
    </div>
  );
}
