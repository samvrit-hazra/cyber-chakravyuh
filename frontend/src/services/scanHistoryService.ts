import type { UrlInvestigationResult, RiskClassification } from '../types/investigation.ts';
import { extractDomain } from '../utils/investigationEngine.ts';

export interface SavedScanRecord {
  id: string;
  url: string;
  domain: string;
  timestamp: string;
  riskClassification: RiskClassification;
  riskScore: number;
  threatCategory: string;
  isAiFlagged: boolean;
  result: UrlInvestigationResult;
}

const STORAGE_KEY = 'cyber_chakravyuh_scan_history_v1';

export class ScanHistoryService {
  static getHistory(): SavedScanRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  static saveScan(result: UrlInvestigationResult): SavedScanRecord {
    const history = this.getHistory();
    const domain = extractDomain(result.targetUrl);

    // Filter out duplicate if same URL was scanned recently to keep list concise
    const filtered = history.filter((item) => item.url !== result.targetUrl);

    const record: SavedScanRecord = {
      id: result.investigationId || `SCAN-${Date.now().toString(36).toUpperCase()}`,
      url: result.targetUrl,
      domain,
      timestamp: new Date().toISOString(),
      riskClassification: result.riskClassification,
      riskScore: result.riskScore,
      threatCategory:
        result.phishingIndicators?.impersonatedBrand
          ? `Brand Spoofing (${result.phishingIndicators.impersonatedBrand})`
          : result.riskClassification === 'Low Risk'
          ? 'Legitimate Host'
          : 'Suspicious Infrastructure',
      isAiFlagged: result.phishingIndicators?.hasHomograph || result.phishingIndicators?.hasTyposquatting || false,
      result,
    };

    // Store up to 50 most recent scans
    const updated = [record, ...filtered].slice(0, 50);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // LocalStorage full or blocked
    }

    return record;
  }

  static deleteScan(id: string): SavedScanRecord[] {
    const history = this.getHistory().filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignored
    }
    return history;
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
  }
}
