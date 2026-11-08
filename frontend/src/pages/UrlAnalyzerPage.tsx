import { Sparkles, ArrowRight, MessageSquare, Radio } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { URLAnalyzer } from '../components/analyzer/URLAnalyzer.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function UrlAnalyzerPage() {
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>URL & DOMAIN FORENSICS ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            URL Security & Heuristic Analyzer
          </h1>

          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            De-anonymize deceptive URL structures, trace multi-hop cloaking redirects, audit authoritative DNS records, and assess WHOIS domain maturity before visiting any link.
          </p>
        </div>

        {/* Central In-Depth URL Analyzer Tool */}
        <div className="pt-1">
          <URLAnalyzer
            initialUrl={targetUrl}
            onOpenAnalystConsole={() => navigateTo('threat-registry')}
          />
        </div>

        {/* Cross-Tool Recommendations */}
        <div className="pt-6 border-t border-[#D9DED7] dark:border-[#304144] grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            onClick={() => navigateTo('sms-scanner')}
            className="p-5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#356D68] dark:hover:border-[#79A99C] transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-md bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/25 dark:border-[#79A99C]/30 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">
                  Did this link arrive via SMS or Chat?
                </h3>
                <p className="text-xs text-[#647477] dark:text-[#A6B3AE] mt-0.5">
                  Analyze the accompanying message text for psychological coercion in SMS Scanner.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] group-hover:text-[#356D68] dark:group-hover:text-[#79A99C] group-hover:translate-x-1 transition-all shrink-0" />
          </div>

          <div
            onClick={() => navigateTo('threat-intel')}
            className="p-5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-md bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/25 dark:border-[#C47A52]/30 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">
                  Explore Active Threat Campaigns
                </h3>
                <p className="text-xs text-[#647477] dark:text-[#A6B3AE] mt-0.5">
                  Cross-reference this domain with global adversary telemetry and live attack feeds.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] group-hover:text-[#A95636] dark:group-hover:text-[#C47A52] group-hover:translate-x-1 transition-all shrink-0" />
          </div>
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
