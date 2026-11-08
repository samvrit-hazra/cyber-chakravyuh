import { Shield } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { WebsiteSecurityTab } from '../components/dashboard/WebsiteSecurityTab.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function SecurityAuditorPage() {
  const { targetUrl, navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Workspace */}
      <main className="flex-1 pt-20 sm:pt-22 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono font-bold tracking-widest uppercase bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] border border-[#A95636]/25 dark:border-[#C47A52]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>MODULE 4: PASSIVE WEBSITE SECURITY ASSESSMENT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            Website Security Auditor
          </h1>

          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            Passive security hygiene assessment across 7 essential categories: Content-Security-Policy (CSP), HSTS, clickjacking frame protection, cookie attributes, and sensitive endpoint leaks. Powered by <code className="text-[#A95636] dark:text-[#C47A52] font-mono font-semibold">/api/security/audit</code>.
          </p>
        </div>

        {/* Central Website Security Tool */}
        <div className="pt-1">
          <WebsiteSecurityTab initialUrl={targetUrl || undefined} />
        </div>
      </main>

      {/* History Slide-over */}
      <ScanHistoryView
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        onSelectScan={(url) => navigateTo('url-analyzer', url)}
      />

      <LandingFooter />
    </div>
  );
}
