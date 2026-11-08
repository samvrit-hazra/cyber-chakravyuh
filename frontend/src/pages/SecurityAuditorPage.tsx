import { Shield, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { WebsiteSecurityTab } from '../components/dashboard/WebsiteSecurityTab.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function SecurityAuditorPage() {
  const { targetUrl, navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Focused Workspace */}
      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Tools</span>
          </button>

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#36745F] dark:text-[#79B69A] font-bold">
            Module 5: Website Security Auditor
          </span>
        </div>

        {/* Minimal Header */}
        <div className="space-y-1.5 text-left border-b border-[#D9DED7] dark:border-[#304144] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-[#36745F] dark:text-[#79B69A]" />
            <span>Website Security Auditor</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl leading-relaxed">
            Passive hygiene inspection of HTTP/S headers (CSP, HSTS, X-Frame-Options), cookie security flags, version leaks, and public exposure.
          </p>
        </div>

        {/* Central Website Security Tool */}
        <div>
          <WebsiteSecurityTab initialUrl={targetUrl || undefined} />
        </div>

        {/* Quick Helper Tip */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#647477] dark:text-[#A6B3AE] shadow-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#356D68] dark:text-[#79A99C] shrink-0" />
            <span>Need deeper X.509 cryptographic validation?</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('tls-inspector')}
            className="inline-flex items-center gap-1.5 font-bold text-[#182629] dark:text-[#E8E6DC] hover:underline cursor-pointer shrink-0"
          >
            <span>Open SSL Certificate Analyzer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* History Slide-over */}
      <ScanHistoryView
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        onSelectScan={(url) => navigateTo('url-analyzer', url)}
      />
    </div>
  );
}
