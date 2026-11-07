import { Lock } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { TlsIntelligenceTab } from '../components/dashboard/TlsIntelligenceTab.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function TlsInspectorPage() {
  const { targetUrl, navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Workspace */}
      <main className="flex-1 pt-20 sm:pt-22 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono font-bold tracking-widest uppercase bg-[#356D68]/10 dark:bg-[#79A99C]/15 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/25 dark:border-[#79A99C]/30">
            <Lock className="w-3.5 h-3.5" />
            <span>MODULE 2: TLS CERTIFICATE & DIGITAL TRUST ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            TLS & Certificate Chain Inspector
          </h1>

          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            Deep HTTPS handshake analysis, X.509 certificate hierarchy validation, Certificate Transparency (CT) log audits, and cipher suite evaluation. Powered by <code className="text-[#356D68] dark:text-[#79A99C] font-mono font-semibold">/api/cert/analyze</code>.
          </p>
        </div>

        {/* Central TLS Intelligence Tool */}
        <div className="pt-1">
          <TlsIntelligenceTab initialDomain={targetUrl || undefined} />
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
