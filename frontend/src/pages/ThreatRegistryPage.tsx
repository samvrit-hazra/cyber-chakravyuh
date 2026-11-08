import { Fingerprint, ArrowLeft } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { BlockchainVerificationTab } from '../components/dashboard/BlockchainVerificationTab.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function ThreatRegistryPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Workspace */}
      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
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

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#2A5753] dark:text-[#669387] font-bold">
            Module 6: Web3 Threat Registry
          </span>
        </div>

        {/* Minimal Header */}
        <div className="space-y-1.5 text-left border-b border-[#D9DED7] dark:border-[#304144] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight flex items-center gap-2.5">
            <Fingerprint className="w-7 h-7 text-[#2A5753] dark:text-[#669387]" />
            <span>Web3 Threat Registry & Cryptographic Attestation</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl leading-relaxed">
            Cryptographic report attestation and immutable tamper-evident threat ledger anchored to Ethereum via smart contracts.
          </p>
        </div>

        {/* Central Web3 Verification & Registry Tool */}
        <div>
          <BlockchainVerificationTab />
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
