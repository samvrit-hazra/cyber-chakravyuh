import { ApiClient } from './apiClient.ts';
import { performUrlInvestigation } from '../utils/investigationEngine.ts';
import { performScamAnalysis } from '../utils/scamAnalysisEngine.ts';
import { performTlsInvestigation } from '../utils/tlsAnalysisEngine.ts';
import { performWebsiteSecurityAssessment } from '../utils/websiteSecurityEngine.ts';
import type { UrlInvestigationResult } from '../types/investigation.ts';
import type { ScamAnalysisResult } from '../types/scam.ts';
import type { TlsInvestigationResult } from '../types/tls.ts';
import type { WebsiteSecurityAssessmentResult } from '../types/websiteSecurity.ts';

export interface ApiHealthStatus {
  isAvailable: boolean;
  endpoint: string;
  mode: 'connected' | 'standalone-heuristic';
  checkedAt: string;
  error?: string;
}

export class ThreatApiService {
  /**
   * Probe backend API health status.
   * Never fabricates success if the backend server is offline.
   */
  static async checkHealth(): Promise<ApiHealthStatus> {
    const endpoint = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000/api/v1';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${endpoint}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          isAvailable: true,
          endpoint,
          mode: 'connected',
          checkedAt: new Date().toISOString(),
        };
      } else {
        return {
          isAvailable: false,
          endpoint,
          mode: 'standalone-heuristic',
          checkedAt: new Date().toISOString(),
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      return {
        isAvailable: false,
        endpoint,
        mode: 'standalone-heuristic',
        checkedAt: new Date().toISOString(),
        error: message,
      };
    }
  }

  /**
   * URL Investigation: Attempts real backend API call; if unavailable,
   * falls back to the deterministic client-side lexical engine.
   */
  static async investigateUrl(url: string): Promise<{ result: UrlInvestigationResult; source: 'api' | 'heuristic' }> {
    try {
      const apiResult = await ApiClient.post<UrlInvestigationResult>('/investigate/url', { url });
      return { result: apiResult, source: 'api' };
    } catch {
      // Backend unavailable; execute local deterministic engine
      const fallback = await performUrlInvestigation(url);
      return { result: fallback, source: 'heuristic' };
    }
  }

  /**
   * Scam & Message Analysis: Attempts real backend API call; if unavailable,
   * falls back to the deterministic client-side NLP engine.
   */
  static async analyzeMessage(content: string): Promise<{ result: ScamAnalysisResult; source: 'api' | 'heuristic' }> {
    try {
      const apiResult = await ApiClient.post<ScamAnalysisResult>('/investigate/message', { content });
      return { result: apiResult, source: 'api' };
    } catch {
      const fallback = await performScamAnalysis(content);
      return { result: fallback, source: 'heuristic' };
    }
  }

  /**
   * TLS Certificate Investigation: Attempts real backend API call; if unavailable,
   * falls back to the deterministic client-side PKI engine.
   */
  static async analyzeTls(target: string): Promise<{ result: TlsInvestigationResult; source: 'api' | 'heuristic' }> {
    try {
      const apiResult = await ApiClient.post<TlsInvestigationResult>('/investigate/tls', { target });
      return { result: apiResult, source: 'api' };
    } catch {
      const fallback = await performTlsInvestigation(target);
      return { result: fallback, source: 'heuristic' };
    }
  }

  /**
   * Website Security Assessment: Attempts real backend API call; if unavailable,
   * falls back to the deterministic client-side security assessment engine.
   */
  static async assessWebsiteSecurity(url: string): Promise<{ result: WebsiteSecurityAssessmentResult; source: 'api' | 'heuristic' }> {
    try {
      const apiResult = await ApiClient.post<WebsiteSecurityAssessmentResult>('/investigate/website-security', { url });
      return { result: apiResult, source: 'api' };
    } catch {
      const fallback = await performWebsiteSecurityAssessment(url);
      return { result: fallback, source: 'heuristic' };
    }
  }
}
