import { useState } from 'react';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { InvestigationDashboard } from './pages/InvestigationDashboard.tsx';
import { DesignSystemShowcase } from './pages/DesignSystemShowcase.tsx';
import type { DashboardTabId } from './components/dashboard/DashboardSidebar.tsx';

export function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'investigation' | 'design-system'>('landing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTabId>('overview');
  const [targetUrl, setTargetUrl] = useState<string>('https://security-verify.paypal.account-update.phish-alert.net/login');

  const handleStartInvestigation = (url?: string) => {
    if (url) {
      setTargetUrl(url);
    }
    setDashboardTab('url-investigation');
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchDashboard = () => {
    setDashboardTab('overview');
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDesignSystem = () => {
    setCurrentPage('design-system');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage
          onStartInvestigation={handleStartInvestigation}
          onLaunchDashboard={handleLaunchDashboard}
          onOpenDesignSystem={handleOpenDesignSystem}
        />
      )}

      {currentPage === 'dashboard' && (
        <DashboardPage
          onBackToLanding={handleBackToLanding}
          onOpenDesignSystem={handleOpenDesignSystem}
          initialTab={dashboardTab}
          initialUrl={targetUrl}
        />
      )}

      {currentPage === 'investigation' && (
        <InvestigationDashboard
          initialUrl={targetUrl}
          onBackToLanding={handleBackToLanding}
          onOpenDesignSystem={handleOpenDesignSystem}
        />
      )}

      {currentPage === 'design-system' && (
        <DesignSystemShowcase onBackToLanding={handleBackToLanding} />
      )}
    </>
  );
}

export default App;
