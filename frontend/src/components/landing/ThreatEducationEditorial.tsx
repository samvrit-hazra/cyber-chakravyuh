import { useState } from 'react';
import {
  Search,
  Radio,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';

interface ThreatEducationEditorialProps {
  onOpenMessageScanner: () => void;
  onLaunchDashboard: () => void;
  onOpenThreatIntel?: () => void;
}

export function ThreatEducationEditorial({
  onOpenMessageScanner,
  onLaunchDashboard,
  onOpenThreatIntel,
}: ThreatEducationEditorialProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeChecklistStep, setActiveChecklistStep] = useState<number | null>(null);

  const checklistSteps = [
    {
      num: 1,
      title: "Don't click suspicious links",
      detail: 'Never click unverified short links, sudden billing notices, or password reset alerts delivered via SMS or unexpected emails.',
    },
    {
      num: 2,
      title: 'Verify before you share',
      detail: 'Inspect the root domain hierarchy. Verify that paypal-notice.net is NOT paypal.com before interacting.',
    },
    {
      num: 3,
      title: 'Report harmful content',
      detail: 'Forward malicious SMS lures to 7726 (SPAM) and report phishing domains to Google Safe Browsing and Netcraft.',
    },
    {
      num: 4,
      title: 'Keep your devices updated',
      detail: 'Apply OS and browser security patches immediately to protect against zero-day sandbox escape exploits.',
    },
    {
      num: 5,
      title: 'Stay alert, stay safe',
      detail: 'Enforce hardware security keys or authenticator apps for 2FA rather than vulnerable SMS verification codes.',
    },
  ];

  return (
    <section id="threat-intel" className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-20">
      {/* 1. Three Core Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: SMS & Message Scanner */}
        <div
          onClick={onOpenMessageScanner}
          className="group p-5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#356D68] dark:hover:border-[#79A99C] shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-md bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/25 dark:border-[#79A99C]/30 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">
                SMS & Message Scanner
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-snug mt-0.5">
                Detect scam messages, phishing attempts and suspicious URLs in texts.
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded bg-[#EAECE6] dark:bg-[#223336] flex items-center justify-center shrink-0 group-hover:bg-[#356D68] dark:group-hover:bg-[#79A99C] group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] group-hover:text-white" />
          </div>
        </div>

        {/* Card 2: Threat Radar & Intelligence */}
        <div
          onClick={onOpenThreatIntel || (() => { window.location.hash = '#threat-intel'; })}
          className="group p-5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-md bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/25 dark:border-[#C47A52]/30 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">
                Threat Radar & Intelligence
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-snug mt-0.5">
                Global attack feeds, active adversary campaigns & MITRE matrix.
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded bg-[#EAECE6] dark:bg-[#223336] flex items-center justify-center shrink-0 group-hover:bg-[#A95636] dark:group-hover:bg-[#C47A52] group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] group-hover:text-white" />
          </div>
        </div>

        {/* Card 3: Web3 Threat Registry */}
        <div
          onClick={onLaunchDashboard}
          className="group p-5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] hover:border-[#356D68] dark:hover:border-[#79A99C] shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-md bg-[#356D68]/10 dark:bg-[#79A99C]/15 border border-[#356D68]/25 dark:border-[#79A99C]/30 flex items-center justify-center shrink-0">
              <Fingerprint className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">
                Web3 Threat Registry
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-snug mt-0.5">
                Decentralized threat ledger anchored to Ethereum smart contracts.
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded bg-[#EAECE6] dark:bg-[#223336] flex items-center justify-center shrink-0 group-hover:bg-[#356D68] dark:group-hover:bg-[#79A99C] group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] group-hover:text-white" />
          </div>
        </div>
      </div>

      {/* 2. Editorial Section: Understand the Threat */}
      <div
        id="how-it-works"
        className="p-5 sm:p-6 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-6 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Column 1: Narrative & Guidance */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#A95636] dark:text-[#C47A52]">
              — UNDERSTAND THE THREAT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] leading-tight">
              Phishing: <br />
              Know It. Stop It.
            </h2>
            <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
              From typosquatting to deceptive multi-hop redirects — learn how cybercriminals disguise malicious payloads, and how to stay one step ahead.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#emergency"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold text-white bg-[#A95636] hover:bg-[#8F472C] dark:bg-[#C47A52] dark:hover:bg-[#B06A44] shadow-sm transition-all"
              >
                <span>5-Step Playbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              {onOpenThreatIntel && (
                <button
                  type="button"
                  onClick={onOpenThreatIntel}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/30 dark:border-[#79A99C]/40 hover:bg-[#356D68]/10 dark:hover:bg-[#79A99C]/15 transition-all cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Adversary Radar</span>
                </button>
              )}
            </div>
          </div>

          {/* Column 2: Minimalist Isometric Phishing Vector Illustration */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Background Ambient Circle */}
              <div
                className={`absolute inset-4 rounded-full blur-xl ${
                  isDark ? 'bg-[#C47A52]/10' : 'bg-[#A95636]/10'
                }`}
              />

              {/* Minimalist Vector Envelope & Fishing Hook */}
              <svg viewBox="0 0 200 200" className="w-full h-full relative z-10" fill="none">
                {/* Fishing Line & Hook */}
                <path
                  d="M100 20 V80 C100 115 135 115 135 90 C135 75 115 75 115 85"
                  stroke={isDark ? '#C47A52' : '#A95636'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Isometric Mail Envelope */}
                <g transform="translate(45, 95)">
                  {/* Envelope Base */}
                  <rect
                    x="0"
                    y="0"
                    width="110"
                    height="72"
                    rx="4"
                    fill={isDark ? '#223336' : '#EAECE6'}
                    stroke={isDark ? '#304144' : '#D9DED7'}
                    strokeWidth="1.5"
                  />
                  {/* Flap lines */}
                  <path
                    d="M0 0 L55 42 L110 0"
                    stroke={isDark ? '#304144' : '#CBD5E1'}
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M0 72 L42 32"
                    stroke={isDark ? '#304144' : '#CBD5E1'}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M110 72 L68 32"
                    stroke={isDark ? '#304144' : '#CBD5E1'}
                    strokeWidth="1.5"
                  />

                  {/* Warning Exclamation Emblem on Envelope */}
                  <circle
                    cx="95"
                    cy="55"
                    r="12"
                    fill={isDark ? '#E17B70' : '#B64B46'}
                  />
                  <text
                    x="95"
                    y="60"
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    !
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Column 3: Quick Safety Checklist */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE] mb-3">
              QUICK SAFETY CHECKLIST
            </h4>

            <div className="space-y-2">
              {checklistSteps.map((step) => {
                const isSelected = activeChecklistStep === step.num;
                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveChecklistStep(isSelected ? null : step.num)}
                    className="p-2.5 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52] text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                        {step.num}
                      </span>
                      <span className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC]">
                        {step.title}
                      </span>
                    </div>
                    {isSelected && (
                      <p className="mt-2 pl-8 text-[11px] text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                        {step.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quote Callout Card */}
        <div className="pt-6 border-t border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-base sm:text-lg italic font-serif text-[#182629] dark:text-[#E8E6DC]">
              &ldquo;In cybersecurity, awareness is your strongest defence.&rdquo;
            </p>
            <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              — Cyber Chakravyuh Threat Intelligence Team
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#36745F] dark:text-[#79B69A] font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Data Retention • Client-Side Heuristics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
