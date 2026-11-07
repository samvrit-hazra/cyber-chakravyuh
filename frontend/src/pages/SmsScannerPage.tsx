import { MessageSquare, Globe, Lock, AlertTriangle } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { ScamMessageScanner } from '../components/landing/ScamMessageScanner.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function SmsScannerPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  const handleScanUrlFromMessage = (url: string) => {
    navigateTo('url-analyzer', url);
  };

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Workspace */}
      <main className="flex-1 pt-20 sm:pt-22 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono font-bold tracking-widest uppercase bg-[#356D68]/10 dark:bg-[#79A99C]/15 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/25 dark:border-[#79A99C]/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>LINGUISTIC & SOCIAL ENGINEERING RADAR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            SMS & Scam Message Detector
          </h1>

          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            Detect coercive urgency, spoofed bank warnings, and social engineering manipulation delivered via SMS, WhatsApp, and chat notifications.
          </p>
        </div>

        {/* Central Scam Message Scanner */}
        <div className="pt-1">
          <ScamMessageScanner onScanUrl={handleScanUrlFromMessage} />
        </div>

        {/* Educational Smishing Taxonomy Guide */}
        <div className="p-5 sm:p-6 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-5">
          <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">
                Common Smishing (SMS Phishing) Attack Patterns
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                How cybercriminals disguise fraudulent SMS text messages
              </p>
            </div>
            <span className="text-xs font-mono text-[#A95636] dark:text-[#C47A52] font-semibold">
              Client-Side Heuristic Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
            <div className="p-4 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2">
              <div className="flex items-center gap-2 text-[#B64B46] dark:text-[#E17B70] font-bold font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Artificial Urgency & Panic</span>
              </div>
              <p className="text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                Phrases like &ldquo;Account suspended in 24 hours&rdquo; or &ldquo;Immediate action required&rdquo; attempt to bypass rational scrutiny and trigger hasty clicks.
              </p>
            </div>

            <div className="p-4 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2">
              <div className="flex items-center gap-2 text-[#A87532] dark:text-[#D7AA61] font-bold font-mono">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Financial Authority Impersonation</span>
              </div>
              <p className="text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                Scammers impersonate tax departments, major banks, or credit card alert systems, urging victims to verify login credentials on fraudulent lookalike portals.
              </p>
            </div>

            <div className="p-4 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2">
              <div className="flex items-center gap-2 text-[#356D68] dark:text-[#79A99C] font-bold font-mono">
                <Globe className="w-4 h-4 shrink-0" />
                <span>Obfuscated Short Links</span>
              </div>
              <p className="text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                Shortened URLs (bit.ly, tinyurl, or random IP domains) hide the true landing destination. Always paste the URL into our URL Analyzer first.
              </p>
            </div>
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
