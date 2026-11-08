import {
  Globe,
  Lock,
  MessageSquare,
  Shield,
  Radio,
  Fingerprint,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { ScanHistoryView } from '../components/analyzer/ScanHistoryView.tsx';
import { useNavigation, type PageId } from '../context/NavigationContext.tsx';

interface ToolCard {
  id: PageId;
  title: string;
  description: string;
  icon: typeof Globe;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  tags: string[];
  ctaText: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'url-analyzer',
    title: 'URL Scanner',
    description:
      'Inspect suspicious web addresses for phishing traps, deceptive redirects, homoglyph domain impersonation, and malicious downloads.',
    icon: Globe,
    iconBg: 'bg-[#A95636]/10 dark:bg-[#C47A52]/15',
    iconColor: 'text-[#A95636] dark:text-[#C47A52]',
    accentBorder: 'hover:border-[#A95636] dark:hover:border-[#C47A52]',
    tags: ['Phishing Detection', 'Redirect Tracer', 'Domain Age'],
    ctaText: 'Open URL Scanner',
  },
  {
    id: 'tls-inspector',
    title: 'SSL Certificate Analyzer',
    description:
      'Validate HTTPS certificate chains, issuing Certificate Authority trust, revocation status, expiration dates, and cryptographic cipher strength.',
    icon: Lock,
    iconBg: 'bg-[#356D68]/10 dark:bg-[#79A99C]/15',
    iconColor: 'text-[#356D68] dark:text-[#79A99C]',
    accentBorder: 'hover:border-[#356D68] dark:hover:border-[#79A99C]',
    tags: ['X.509 Chain Audit', 'Certificate Transparency', 'Cipher Check'],
    ctaText: 'Open SSL Analyzer',
  },
  {
    id: 'sms-scanner',
    title: 'Scam Message Detector',
    description:
      'Analyze SMS texts, WhatsApp messages, and emails with AI to detect urgency manipulation, fake bank alerts, and dangerous payment requests.',
    icon: MessageSquare,
    iconBg: 'bg-[#A87532]/10 dark:bg-[#D7AA61]/15',
    iconColor: 'text-[#A87532] dark:text-[#D7AA61]',
    accentBorder: 'hover:border-[#A87532] dark:hover:border-[#D7AA61]',
    tags: ['AI Urgency Detection', 'Brand Impersonation', 'Link Extraction'],
    ctaText: 'Open Scam Detector',
  },
  {
    id: 'security-auditor',
    title: 'Website Security Auditor',
    description:
      'Passive website hygiene assessment inspecting defensive HTTP headers (CSP, HSTS, X-Frame-Options), cookie protections, and exposed ports.',
    icon: Shield,
    iconBg: 'bg-[#36745F]/10 dark:bg-[#79B69A]/15',
    iconColor: 'text-[#36745F] dark:text-[#79B69A]',
    accentBorder: 'hover:border-[#36745F] dark:hover:border-[#79B69A]',
    tags: ['Security Headers', 'HSTS & CSP Audit', 'Passive Shodan Intel'],
    ctaText: 'Open Security Auditor',
  },
  {
    id: 'threat-intel',
    title: 'Threat Intelligence Radar',
    description:
      'Monitor real-time adversary infrastructure, active phishing campaigns, MITRE ATT&CK mapping, and cross-correlated Indicators of Compromise.',
    icon: Radio,
    iconBg: 'bg-[#B64B46]/10 dark:bg-[#E17B70]/15',
    iconColor: 'text-[#B64B46] dark:text-[#E17B70]',
    accentBorder: 'hover:border-[#B64B46] dark:hover:border-[#E17B70]',
    tags: ['Live Threat Feeds', 'MITRE ATT&CK', 'Adversary IOC Stream'],
    ctaText: 'Open Threat Radar',
  },
  {
    id: 'threat-registry',
    title: 'Web3 Threat Registry',
    description:
      'Decentralized immutable threat incident ledger and cryptographic attestation console anchored on-chain with SHA-256 evidence validation.',
    icon: Fingerprint,
    iconBg: 'bg-[#2A5753]/10 dark:bg-[#669387]/15',
    iconColor: 'text-[#2A5753] dark:text-[#669387]',
    accentBorder: 'hover:border-[#2A5753] dark:hover:border-[#669387]',
    tags: ['Smart Contract Ledger', 'Tamper-Evident SHA-256', 'Merkle Proofs'],
    ctaText: 'Open Threat Registry',
  },
];

export function LandingPage() {
  const { navigateTo, isHistoryOpen, closeHistory } = useNavigation();

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] flex flex-col font-sans transition-colors duration-150">
      {/* Universal Top Nav */}
      <LandingNavbar />

      {/* Main Minimal Content Workspace */}
      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10">
        {/* Minimal Clean Title Section */}
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            Security Analysis Tools
          </h1>

          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] max-w-2xl mx-auto leading-relaxed">
            Select an investigation tool below to analyze web addresses, inspect SSL certificates, evaluate scam messages, or audit website security.
          </p>
        </div>

        {/* 6 Clean, Distinct Boxes / Cards without module numbering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;

            return (
              <div
                key={tool.id}
                onClick={() => navigateTo(tool.id)}
                className={`group rounded-2xl bg-white dark:bg-[#19272A] border-2 border-[#D9DED7] dark:border-[#304144] ${tool.accentBorder} p-6 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-4 active:scale-[0.99]`}
              >
                <div className="space-y-3.5">
                  {/* Top: Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center shrink-0 border border-[#D9DED7]/40 dark:border-[#304144]/40 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-xl font-bold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight group-hover:text-[#A95636] dark:group-hover:text-[#C47A52] transition-colors flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h2>
                    <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] leading-relaxed mt-1.5 font-sans">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Bottom: Tags + Action Pill */}
                <div className="pt-3 border-t border-[#D9DED7] dark:border-[#304144] space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAECE6]/80 dark:bg-[#223336]/80 text-[#647477] dark:text-[#A6B3AE]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#182629] dark:text-white group-hover:underline">
                    <span>{tool.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Footer */}
        <footer className="pt-8 border-t border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#647477] dark:text-[#A6B3AE]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#182629] dark:text-[#E8E6DC]">Cyber Chakravyuh</span>
            <span>•</span>
            <span>Digital Threat & Web Trust Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <span>API Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Zero Data Retention</span>
          </div>
        </footer>
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
