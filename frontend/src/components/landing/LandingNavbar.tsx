import { useState, useEffect } from 'react';
import {
  Globe,
  Lock,
  MessageSquare,
  Shield,
  Radio,
  Fingerprint,
  Clock,
  Menu,
  X,
  Home,
  LayoutGrid,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle.tsx';
import { ScanHistoryService } from '../../services/scanHistoryService.ts';
import { useNavigation, type PageId } from '../../context/NavigationContext.tsx';

interface LandingNavbarProps {
  onOpenHistory?: () => void;
}

export function LandingNavbar({ onOpenHistory }: LandingNavbarProps) {
  const { currentPage, navigateTo, openHistory } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const history = ScanHistoryService.getHistory();
      setHistoryCount(history.length);
    } catch {
      setHistoryCount(0);
    }
  }, [currentPage]);

  const handleNavClick = (page: PageId) => {
    setMobileMenuOpen(false);
    navigateTo(page);
  };

  const navItems: { id: PageId; label: string; icon: typeof Globe }[] = [
    { id: 'url-analyzer', label: 'URL Scanner', icon: Globe },
    { id: 'tls-inspector', label: 'SSL Analyzer', icon: Lock },
    { id: 'sms-scanner', label: 'Scam Detector', icon: MessageSquare },
    { id: 'security-auditor', label: 'Security Auditor', icon: Shield },
    { id: 'threat-intel', label: 'Threat Radar', icon: Radio },
    { id: 'threat-registry', label: 'Web3 Registry', icon: Fingerprint },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 border-b ${
        isScrolled
          ? 'bg-white/98 dark:bg-[#101A1D]/98 backdrop-blur-md border-[#D9DED7] dark:border-[#304144] shadow-xs'
          : 'bg-white/90 dark:bg-[#101A1D]/90 backdrop-blur-xs border-[#D9DED7]/80 dark:border-[#304144]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 select-none active:scale-[0.98] transition-transform cursor-pointer shrink-0"
          title="Cyber Chakravyuh - Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#182629] dark:bg-white flex items-center justify-center p-1.5 shrink-0 shadow-xs">
            <img
              src="/logo.png"
              alt="Cyber Chakravyuh Logo"
              className="w-full h-full object-contain filter invert dark:invert-0"
            />
          </div>

          <div className="flex flex-col text-left">
            <span className="font-bold text-sm sm:text-base font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight leading-tight">
              Cyber Chakravyuh
            </span>
            <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] hidden sm:inline leading-tight font-sans">
              Threat Detection & Trust Intelligence
            </span>
          </div>
        </button>

        {/* Center: Clean Direct Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-[#182629] dark:bg-white text-white dark:text-[#182629] shadow-xs font-semibold'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#182629] dark:bg-white text-white dark:text-[#182629] shadow-xs font-semibold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Home Shortcut, Past Scans, Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Back to Tools button if inside a tool page */}
          {currentPage !== 'home' && (
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#182629] dark:text-[#E8E6DC] bg-[#EAECE6] dark:bg-[#223336] hover:bg-[#D9DED7] dark:hover:bg-[#293A3C] transition-colors cursor-pointer border border-[#D9DED7] dark:border-[#304144]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHistory || openHistory}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#182629] dark:text-[#E8E6DC] bg-white dark:bg-[#19272A] hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 border border-[#D9DED7] dark:border-[#304144] shadow-xs"
            title="View Past Scans"
          >
            <Clock className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52] shrink-0" />
            <span className="hidden sm:inline">Past Scans</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#182629] dark:bg-white text-white dark:text-[#182629]">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <div className="shrink-0 p-0.5 rounded-lg border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] shadow-xs">
            <ThemeToggle size="sm" />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144] cursor-pointer active:scale-95 shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`w-full p-2.5 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-colors ${
              currentPage === 'home'
                ? 'bg-[#182629] dark:bg-white text-white dark:text-[#182629]'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Tools (Home)</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full p-2.5 rounded-lg text-left text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-[#182629] dark:bg-white text-white dark:text-[#182629] font-bold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
