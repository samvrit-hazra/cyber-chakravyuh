import { Fingerprint } from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { LandingFooter } from '../components/landing/LandingFooter.tsx';
import { BlockchainVerificationTab } from '../components/dashboard/BlockchainVerificationTab.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation } from '../context/NavigationContext.tsx';

export function ThreatRegistryPage() {
  const { navigateTo, targetUrl, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Workspace */}
      <main className="flex-1 pt-20 sm:pt-22 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono font-bold tracking-widest uppercase bg-[#356D68]/10 dark:bg-[#79A99C]/15 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/25 dark:border-[#79A99C]/30">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>MODULE 6: DECENTRALIZED THREAT REGISTRY & WEB3 ATTESTATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            Web3 Threat Registry
          </h1>

          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-3xl leading-relaxed">
            Cryptographic report attestation and immutable tamper-evident threat ledger anchored to Ethereum via <code className="text-[#356D68] dark:text-[#79A99C] font-mono font-semibold">ThreatRegistry.sol</code>. Verify SHA-256 evidence digests and on-chain Merkle root commitments. Powered by <code className="text-[#356D68] dark:text-[#79A99C] font-mono font-semibold">/api/web3/submit</code> & <code className="text-[#356D68] dark:text-[#79A99C] font-mono font-semibold">/api/web3/verify</code>.
          </p>
        </div>

        {/* Central Web3 Verification & Registry Tool */}
        <div className="pt-1">
          <BlockchainVerificationTab initialVerificationHash={targetUrl} />
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
