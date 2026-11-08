import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageId =
  | 'home'
  | 'url-analyzer'
  | 'tls-inspector'
  | 'sms-scanner'
  | 'security-auditor'
  | 'threat-correlation'
  | 'threat-intel'
  | 'threat-registry'
  | 'analyst-console';

export interface PendingThreatReport {
  title?: string;
  targetSubject?: string;
  campaignName?: string;
  findingsSummary?: string;
  evidenceUri?: string;
}

interface NavigationContextType {
  currentPage: PageId;
  targetUrl: string;
  pendingReport: PendingThreatReport | null;
  navigateTo: (page: PageId, targetUrl?: string, pendingReport?: PendingThreatReport) => void;
  clearPendingReport: () => void;
  isHistoryOpen: boolean;
  openHistory: () => void;
  closeHistory: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const parseHash = (): PageId => {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'url-analyzer') return 'url-analyzer';
  if (hash === 'tls-inspector') return 'tls-inspector';
  if (hash === 'sms-scanner') return 'sms-scanner';
  if (hash === 'security-auditor') return 'security-auditor';
  if (hash === 'threat-correlation' || hash === 'threat-intel') return 'threat-correlation';
  if (hash === 'threat-registry' || hash === 'analyst-console') return 'threat-registry';
  return 'home';
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>(parseHash);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [pendingReport, setPendingReport] = useState<PendingThreatReport | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const page = parseHash();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId, newTargetUrl?: string, newPendingReport?: PendingThreatReport) => {
    if (newTargetUrl !== undefined) {
      setTargetUrl(newTargetUrl);
    }
    if (newPendingReport !== undefined) {
      setPendingReport(newPendingReport);
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearPendingReport = () => setPendingReport(null);
  const openHistory = () => setIsHistoryOpen(true);
  const closeHistory = () => setIsHistoryOpen(false);

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        targetUrl,
        pendingReport,
        navigateTo,
        clearPendingReport,
        isHistoryOpen,
        openHistory,
        closeHistory,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
