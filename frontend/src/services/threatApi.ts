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
    const endpoint = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000/api';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`http://localhost:8000/health`, {
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
   * URL Investigation: Evaluates URL with live Groq AI & threat feeds
   */
  static async investigateUrl(url: string): Promise<{ result: UrlInvestigationResult; source: 'api' | 'heuristic' }> {
    const result = await performUrlInvestigation(url);
    return { result, source: result.isDemoState ? 'heuristic' : 'api' };
  }

  /**
   * Scam & Message Analysis: Evaluates message with live Groq AI NLP engine
   */
  static async analyzeMessage(content: string): Promise<{ result: ScamAnalysisResult; source: 'api' | 'heuristic' }> {
    const result = await performScamAnalysis(content);
    return { result, source: result.isDemoState ? 'heuristic' : 'api' };
  }

  /**
   * TLS Certificate Investigation: Evaluates certificate trust with live TLS socket + Groq AI
   */
  static async analyzeTls(target: string): Promise<{ result: TlsInvestigationResult; source: 'api' | 'heuristic' }> {
    const result = await performTlsInvestigation(target);
    return { result, source: result.isDemoState ? 'heuristic' : 'api' };
  }

  /**
   * Website Security Assessment: Evaluates posture with live HTTP audits + Groq AI
   */
  static async assessWebsiteSecurity(url: string): Promise<{ result: WebsiteSecurityAssessmentResult; source: 'api' | 'heuristic' }> {
    const result = await performWebsiteSecurityAssessment(url);
    return { result, source: result.isDemoState ? 'heuristic' : 'api' };
  }
}
