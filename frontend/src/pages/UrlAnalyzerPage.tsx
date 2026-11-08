import { Globe, ArrowLeft, MessageSquare, ArrowRight } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { URLAnalyzer } from '../components/analyzer/URLAnalyzer.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function UrlAnalyzerPage() {
  const { targetUrl, navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Focused Workspace */}
      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-6">
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

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A95636] dark:text-[#C47A52] font-bold">
            Module 1: URL Scanner
          </span>
        </div>

        {/* Minimal Header */}
        <div className="space-y-1.5 text-left border-b border-[#D9DED7] dark:border-[#304144] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-[#A95636] dark:text-[#C47A52]" />
            <span>URL Scanner</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl leading-relaxed">
            De-anonymize suspicious web addresses, trace multi-hop cloaking redirects, audit DNS records, and check for phishing lookalikes.
          </p>
        </div>

        {/* Central In-Depth URL Analyzer Tool */}
        <div>
          <URLAnalyzer
            initialUrl={targetUrl}
            onOpenAnalystConsole={() => navigateTo('threat-registry')}
          />
        </div>

        {/* Quick Helper Tip */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#647477] dark:text-[#A6B3AE] shadow-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#A87532] dark:text-[#D7AA61] shrink-0" />
            <span>Did this link arrive inside a suspicious SMS or WhatsApp message?</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('sms-scanner')}
            className="inline-flex items-center gap-1.5 font-bold text-[#182629] dark:text-[#E8E6DC] hover:underline cursor-pointer shrink-0"
          >
            <span>Scan the message</span>
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
