import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Home,
  Menu,
  X,
  Clock,
  ArrowRight,
  ChevronDown,
  Globe,
  MessageSquare,
  BookOpen,
  LifeBuoy,
  HelpCircle,
  Radio,
  Lock,
  Fingerprint,
  Info,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle.tsx';
import { ScanHistoryService } from '../../services/scanHistoryService.ts';
import { useNavigation, type PageId } from '../../context/NavigationContext.tsx';

interface LandingNavbarProps {
  onLoginClick?: () => void;
  onLaunchDashboard?: () => void;
  onOpenHistory?: () => void;
}

export function LandingNavbar({
  onOpenHistory,
}: LandingNavbarProps) {
  const { currentPage, navigateTo, openHistory } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  const toolsRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync scan history count
  useEffect(() => {
    try {
      const history = ScanHistoryService.getHistory();
      setHistoryCount(history.length);
    } catch {
      setHistoryCount(0);
    }
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: PageId) => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    setLearnDropdownOpen(false);
    navigateTo(page);
  };

  const handleLearnClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    setLearnDropdownOpen(false);
    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isToolActive =
    currentPage === 'url-analyzer' ||
    currentPage === 'sms-scanner' ||
    currentPage === 'tls-inspector' ||
    currentPage === 'security-auditor';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#F3F1E9]/95 dark:bg-[#101A1D]/95 backdrop-blur-md border-[#D9DED7] dark:border-[#304144] shadow-xs'
          : 'bg-[#F3F1E9]/90 dark:bg-[#101A1D]/90 backdrop-blur-xs border-[#D9DED7]/80 dark:border-[#304144]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group select-none active:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-full h-full object-contain" />
          </div>

          <span className="font-bold text-base sm:text-lg font-brand text-[#182629] dark:text-[#E8E6DC] tracking-wide whitespace-nowrap">
            Cyber Chakravyuh
          </span>
        </button>

        {/* Center: Minimalist Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium font-sans">
          {/* Home */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {/* Unified Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => {
                setToolsDropdownOpen(!toolsDropdownOpen);
                setLearnDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                isToolActive
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <span>Investigation Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180' : 'opacity-70'
                }`}
              />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-lg py-1.5 z-50 text-xs animate-in fade-in-0 duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('url-analyzer')}
                  className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 cursor-pointer transition-colors ${
                    currentPage === 'url-analyzer'
                      ? 'bg-[#EAECE6] dark:bg-[#223336]'
                      : 'hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60'
                  }`}
                >
                  <Globe className="w-4 h-4 text-[#A95636] dark:text-[#C47A52] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#182629] dark:text-[#E8E6DC]">URL & Phishing Analyzer</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Heuristic link inspection & redirects</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('sms-scanner')}
                  className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 cursor-pointer transition-colors ${
                    currentPage === 'sms-scanner'
                      ? 'bg-[#EAECE6] dark:bg-[#223336]'
                      : 'hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#A95636] dark:text-[#C47A52] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#182629] dark:text-[#E8E6DC]">SMS & Scam Detector</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Smishing urgency & social engineering</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('tls-inspector')}
                  className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 cursor-pointer transition-colors ${
                    currentPage === 'tls-inspector'
                      ? 'bg-[#EAECE6] dark:bg-[#223336]'
                      : 'hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60'
                  }`}
                >
                  <Lock className="w-4 h-4 text-[#356D68] dark:text-[#79A99C] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#182629] dark:text-[#E8E6DC]">TLS Certificate Inspector</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">X.509 chains & CT transparency logs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('security-auditor')}
                  className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 cursor-pointer transition-colors ${
                    currentPage === 'security-auditor'
                      ? 'bg-[#EAECE6] dark:bg-[#223336]'
                      : 'hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#36745F] dark:text-[#79B69A] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#182629] dark:text-[#E8E6DC]">Website Security Auditor</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Passive CSP, HSTS & header checks</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Threat Intel Direct Link */}
          <button
            type="button"
            onClick={() => handleNavClick('threat-intel')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentPage === 'threat-intel'
                ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Threat Intel</span>
          </button>

          {/* Learn & Resources Dropdown */}
          <div className="relative" ref={learnRef}>
            <button
              type="button"
              onClick={() => {
                setLearnDropdownOpen(!learnDropdownOpen);
                setToolsDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                learnDropdownOpen
                  ? 'text-[#182629] dark:text-[#E8E6DC] bg-[#EAECE6] dark:bg-[#223336]'
                  : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <span>Learn</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  learnDropdownOpen ? 'rotate-180' : 'opacity-70'
                }`}
              />
            </button>

            {learnDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-68 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-lg py-1.5 z-50 text-xs animate-in fade-in-0 duration-150">
                <button
                  type="button"
                  onClick={() => handleLearnClick('emergency')}
                  className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60 cursor-pointer"
                >
                  <LifeBuoy className="w-4 h-4 text-[#B64B46] dark:text-[#E17B70] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Incident Playbook</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">5-step containment if clicked</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLearnClick('how-it-works')}
                  className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#A95636] dark:text-[#C47A52] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Phishing Anatomy</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Typosquatting & SSL spoofing myths</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLearnClick('faq')}
                  className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#356D68] dark:text-[#79A99C] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Security FAQ</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Browser sandboxing & heuristics</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLearnClick('about')}
                  className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#F3F1E9] dark:hover:bg-[#223336]/60 cursor-pointer border-t border-[#D9DED7]/60 dark:border-[#304144]/60 mt-1 pt-2"
                >
                  <Info className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">About Platform</div>
                    <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Defensive architecture & policy</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Scan History, Theme Toggle, Web3 / Analyst Console CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Scan History Button */}
          <button
            type="button"
            onClick={onOpenHistory || openHistory}
            className="px-2.5 py-1.5 rounded text-xs font-medium text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            title="Open Scan History"
          >
            <Clock className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52] shrink-0" />
            <span className="hidden sm:inline">Scan History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52]">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <div className="shrink-0">
            <ThemeToggle size="sm" />
          </div>

          {/* Primary Action Button: Web3 Registry / Analyst Console */}
          <button
            type="button"
            onClick={() => handleNavClick('threat-registry')}
            className={`px-3 sm:px-3.5 py-1.5 rounded text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap shrink-0 font-sans shadow-xs ${
              currentPage === 'threat-registry'
                ? 'bg-[#8F462A] dark:bg-[#B26943] ring-1 ring-[#A95636] dark:ring-[#C47A52]'
                : 'bg-[#A95636] hover:bg-[#8F462A] dark:bg-[#C47A52] dark:hover:bg-[#B26943]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Analyst Console</span>
            <span className="xs:hidden">Console</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white border border-[#D9DED7] dark:border-[#304144] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D9DED7] dark:border-[#304144] bg-[#F3F1E9] dark:bg-[#101A1D] px-4 pt-3 pb-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Main Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`w-full px-3 py-2 rounded text-left font-medium text-xs flex items-center gap-2 cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('threat-intel')}
              className={`w-full px-3 py-2 rounded text-left font-medium text-xs flex items-center gap-2 cursor-pointer ${
                currentPage === 'threat-intel'
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <Radio className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              <span>Threat Intel Radar</span>
            </button>
          </div>

          {/* Investigation Tools Group */}
          <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#647477] dark:text-[#A6B3AE] font-bold pb-1">
              Investigation Tools
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('url-analyzer')}
              className={`w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 cursor-pointer ${
                currentPage === 'url-analyzer'
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              <span>URL & Phishing Analyzer</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('sms-scanner')}
              className={`w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 cursor-pointer ${
                currentPage === 'sms-scanner'
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              <span>SMS & Scam Detector</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('tls-inspector')}
              className={`w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 cursor-pointer ${
                currentPage === 'tls-inspector'
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
              <span>TLS Certificate Inspector</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('security-auditor')}
              className={`w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 cursor-pointer ${
                currentPage === 'security-auditor'
                  ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold'
                  : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#36745F] dark:text-[#79B69A]" />
              <span>Website Security Auditor</span>
            </button>
          </div>

          {/* Resources & Educational Guides */}
          <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#647477] dark:text-[#A6B3AE] font-bold pb-1">
              Resources & Documentation
            </div>
            <button
              type="button"
              onClick={() => handleLearnClick('emergency')}
              className="w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4 text-[#B64B46] dark:text-[#E17B70]" />
              <span>Emergency Containment Playbook</span>
            </button>
            <button
              type="button"
              onClick={() => handleLearnClick('how-it-works')}
              className="w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              <span>Phishing Anatomy & Attack Vectors</span>
            </button>
            <button
              type="button"
              onClick={() => handleLearnClick('faq')}
              className="w-full px-3 py-2 rounded text-left text-xs flex items-center gap-2.5 text-[#182629] dark:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
              <span>Security FAQ & Platform Policy</span>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-[#D9DED7] dark:border-[#304144] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenHistory) onOpenHistory();
                else openHistory();
              }}
              className="px-3 py-2 rounded text-xs font-medium bg-[#EAECE6] dark:bg-[#223336] text-[#182629] dark:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144] flex items-center gap-2 cursor-pointer flex-1 justify-center"
            >
              <Clock className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              <span>History ({historyCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('threat-registry')}
              className="px-3 py-2 rounded text-xs font-semibold bg-[#A95636] hover:bg-[#8F462A] dark:bg-[#C47A52] text-white flex items-center gap-2 cursor-pointer flex-1 justify-center shadow-xs"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Analyst Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
