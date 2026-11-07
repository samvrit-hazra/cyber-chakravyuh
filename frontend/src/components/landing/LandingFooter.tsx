import { Shield, ExternalLink, Terminal, Heart } from 'lucide-react';
import { Badge } from '../common/index.ts';

interface LandingFooterProps {
  onStartInvestigation: () => void;
  onLaunchDashboard: () => void;
  onOpenDocModal?: (title: string, content: string) => void;
}

export function LandingFooter({
  onStartInvestigation,
  onLaunchDashboard,
  onOpenDocModal,
}: LandingFooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDocClick = (title: string, summary: string) => {
    if (onOpenDocModal) {
      onOpenDocModal(title, summary);
    }
  };

  return (
    <footer className="border-t border-cyan-500/20 bg-[#030712] relative z-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-purple-600 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                CYBER CHAKRAVYUHA
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-cyan-300">Navigate the Threat. Verify the Trust.</strong>
              <br />
              An AI-powered cybersecurity command platform providing deep URL investigation, phishing detection, cryptographic TLS verification, and digital trust intelligence.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <Badge variant="cyan" size="sm">
                DEFCON-3 ACTIVE
              </Badge>
              <Badge variant="emerald" size="sm">
                ZERO-TRUST 100%
              </Badge>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('home')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Home Ingress
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Core Defense Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  5-Stage Workflow Pipeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('threat-intelligence')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Threat Telemetry
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Trust & Security Pillars
                </button>
              </li>
            </ul>
          </div>

          {/* Product & Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onStartInvestigation}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer text-cyan-300 font-semibold"
                >
                  <span>Start Investigation</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>SecOps Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDocClick('API & Webhooks', 'REST and WebSocket API endpoints for submitting URLs, streaming real-time telemetry, and retrieving Ed25519-signed verification receipts.')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  API & Webhooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDocClick('Threat IOC Feed', 'Daily sanitized JSON/CSV export of confirmed malicious domains and phishing indicators.')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Raw IOC Feeds
                </button>
              </li>
            </ul>
          </div>

          {/* Documentation & Project Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Documentation & Credits
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleDocClick('7-Layer Architecture Guide', 'Comprehensive specifications for Saptarishi Perimeter, Vyuha Network Gateway, Identity Vault, Endpoint Intel, Application Shield, Post-Quantum Vault, and Cognitive Core.')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  7-Layer Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDocClick('Attestation Whitepaper', 'Mathematical proof and cryptographic protocols behind zero-knowledge threat record verification.')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Verification Whitepaper
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDocClick('Responsible Disclosure Policy', 'Guidelines for reporting vulnerabilities under coordinated security disclosure.')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Security Disclosure
                </button>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1 pt-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  Built with Google Antigravity
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Cyber Chakravyuha. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Designed for Next-Generation Digital Trust Intelligence</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Cybersecurity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

