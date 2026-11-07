import { useState } from 'react';
import {
  LandingNavbar,
  HeroSection,
  ThreatEducationEditorial,
  EmergencyChecklistSection,
  FaqSection,
  LandingFooter,
  AuthModal,
} from '../components/landing/index.ts';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { Modal, Button } from '../components/common/index.ts';
import { useNavigation } from '../context/NavigationContext.tsx';

export function LandingPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [docModalInfo, setDocModalInfo] = useState<{ title: string; content: string } | null>(null);

  const handleStartInvestigation = (url?: string) => {
    navigateTo('url-analyzer', url);
  };

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col relative selection:bg-[#A95636]/20 dark:selection:bg-[#C47A52]/25 selection:text-[#A95636] dark:selection:text-[#C47A52] font-sans transition-colors duration-200">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Home Presentation Surfaces */}
      <main className="flex-1 relative z-10 space-y-0">
        {/* Section 1: Hero & Prominent URL Analyzer Public Bar (Image 1 Layout) */}
        <HeroSection
          onStartInvestigation={handleStartInvestigation}
        />

        {/* Section 2: Capability Cards & Editorial Threat Guide (Image 2 Layout) */}
        <ThreatEducationEditorial
          onOpenMessageScanner={() => navigateTo('sms-scanner')}
          onLaunchDashboard={() => navigateTo('threat-registry')}
          onOpenThreatIntel={() => navigateTo('threat-intel')}
        />
        {/* Section 3: Emergency Containment Playbook */}
        <EmergencyChecklistSection />

        {/* Section 4: Security FAQ */}
        <FaqSection />
      </main>

      {/* Persistent Scan History Drawer */}
      <ScanHistoryView
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        onSelectScan={(url) => navigateTo('url-analyzer', url)}
      />

      {/* Corporate Security Footer (Image 2 Layout) */}
      <LandingFooter
        onStartInvestigation={() => navigateTo('url-analyzer')}
        onLaunchDashboard={() => navigateTo('threat-registry')}
        onOpenDocModal={(title, content) => setDocModalInfo({ title, content })}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => navigateTo('analyst-console')}
      />

      {/* Documentation / Verification Modal */}
      <Modal
        isOpen={Boolean(docModalInfo)}
        onClose={() => setDocModalInfo(null)}
        title={docModalInfo?.title || 'Documentation'}
      >
        <div className="space-y-4 text-xs font-sans text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
          <p>{docModalInfo?.content}</p>
          <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDocModalInfo(null)}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
