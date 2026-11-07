import { useState } from 'react';
import {
  LandingNavbar,
  HeroSection,
  ThreatStatistics,
  CoreFeatures,
  HowItWorks,
  TrustAndSecurity,
  LandingFooter,
  FeatureDetailModal,
  AuthModal,
  type FeatureDetail,
} from '../components/landing/index.ts';
import { NetworkBackground, Modal, Button } from '../components/common/index.ts';

interface LandingPageProps {
  onStartInvestigation: (url?: string) => void;
  onLaunchDashboard: () => void;
  onOpenDesignSystem?: () => void;
}

export function LandingPage({
  onStartInvestigation,
  onLaunchDashboard,
}: LandingPageProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Documentation / Policy modal for footer links
  const [docModalInfo, setDocModalInfo] = useState<{ title: string; content: string } | null>(null);

  const handleLearnMore = (feature: FeatureDetail) => {
    setSelectedFeature(feature);
    setIsFeatureModalOpen(true);
  };

  const handleExplorePlatform = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Animated Particle Constellation */}
      <NetworkBackground opacity={0.35} nodeCount={42} />

      {/* Section 1: Navigation */}
      <LandingNavbar
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLaunchDashboard={onLaunchDashboard}
      />

      {/* Main Landing Sections */}
      <main className="flex-1 relative z-10">
        {/* Section 2: Hero */}
        <HeroSection
          onStartInvestigation={onStartInvestigation}
          onExplorePlatform={handleExplorePlatform}
        />

        {/* Section 3: Threat Statistics */}
        <ThreatStatistics />

        {/* Section 4: Core Features */}
        <CoreFeatures onLearnMore={handleLearnMore} />

        {/* Section 5: How It Works */}
        <HowItWorks />

        {/* Section 6: Trust & Security */}
        <TrustAndSecurity />
      </main>

      {/* Section 7: Footer */}
      <LandingFooter
        onStartInvestigation={() => onStartInvestigation()}
        onLaunchDashboard={onLaunchDashboard}
        onOpenDocModal={(title, content) => setDocModalInfo({ title, content })}
      />

      {/* Feature Deep-Dive Modal ("Learn More" interaction) */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        onStartInvestigation={() => {
          setIsFeatureModalOpen(false);
          onStartInvestigation();
        }}
      />

      {/* Authentication Modal ("Login" interaction) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => onLaunchDashboard()}
      />

      {/* Documentation / Verification Modal (Zero Dead Links) */}
      <Modal
        isOpen={Boolean(docModalInfo)}
        onClose={() => setDocModalInfo(null)}
        title={docModalInfo?.title || 'Documentation & Reference'}
        subtitle="Cyber Chakravyuha Architecture & Verification Protocols"
        size="md"
        footer={
          <Button variant="outline" size="sm" onClick={() => setDocModalInfo(null)}>
            Dismiss
          </Button>
        }
      >
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
            <span className="text-cyan-400 font-bold block">[OFFICIAL SPECIFICATION]</span>
            <p>{docModalInfo?.content}</p>
          </div>
          <p className="text-slate-400 text-[11px]">
            For full cryptographic verification tools and enterprise CLI integrations, visit the SecOps Workbench.
          </p>
        </div>
      </Modal>
    </div>
  );
}

