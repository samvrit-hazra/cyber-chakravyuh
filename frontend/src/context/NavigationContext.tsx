import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageId =
  | 'home'
  | 'url-analyzer'
  | 'tls-inspector'
  | 'sms-scanner'
  | 'security-auditor'
  | 'threat-intel'
  | 'threat-registry'
  | 'analyst-console';

interface NavigationContextType {
  currentPage: PageId;
  targetUrl: string;
  navigateTo: (page: PageId, targetUrl?: string) => void;
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
  if (hash === 'threat-intel') return 'threat-intel';
  if (hash === 'threat-registry' || hash === 'analyst-console') return 'threat-registry';
  return 'home';
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>(parseHash);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const page = parseHash();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId, newTargetUrl?: string) => {
    if (newTargetUrl) {
      setTargetUrl(newTargetUrl);
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHistory = () => setIsHistoryOpen(true);
  const closeHistory = () => setIsHistoryOpen(false);

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        targetUrl,
        navigateTo,
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
