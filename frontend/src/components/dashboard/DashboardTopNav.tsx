import { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Activity,
  Menu,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  LogOut,
  UserCheck,
  Server,
} from 'lucide-react';
import { Badge, Button, ThemeToggle } from '../common/index.ts';
import { ThreatApiService, type ApiHealthStatus } from '../../services/threatApi.ts';

interface DashboardTopNavProps {
  onToggleMobileSidebar: () => void;
  onOpenNotifications: () => void;
  onBackToLanding: () => void;
  unreadCount?: number;
  onSearch?: (query: string) => void;
}

export function DashboardTopNav({
  onToggleMobileSidebar,
  onOpenNotifications,
  onBackToLanding,
  unreadCount = 3,
  onSearch,
}: DashboardTopNavProps) {
  const [searchVal, setSearchVal] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [apiHealth, setApiHealth] = useState<ApiHealthStatus | null>(null);

  useEffect(() => {
    let isMounted = true;
    ThreatApiService.checkHealth().then((status) => {
      if (isMounted) {
        setApiHealth(status);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#19272A]/95 backdrop-blur-md border-b border-[#D9DED7] dark:border-[#304144] px-4 sm:px-6 h-16 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & Brand / Portal Return */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToLanding}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-xs text-[#647477] dark:text-[#A6B3AE] hover:text-[#A95636] dark:hover:text-[#C47A52] hidden sm:flex"
        >
          Public Portal
        </Button>

        <div className="h-5 w-px bg-[#D9DED7] dark:bg-[#304144] hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide text-[#182629] dark:text-[#E8E6DC] font-brand">
              Cyber Chakravyuh
            </span>
            <span className="text-[10px] text-[#A95636] dark:text-[#C47A52] font-mono tracking-wider uppercase -mt-0.5">
              Analyst Console
            </span>
          </div>
        </div>
      </div>

      {/* Center: Command Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647477] dark:text-[#A6B3AE] pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search indicator, target URL, IP, or certificate hash..."
            className="w-full h-9 pl-9 pr-12 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] text-xs text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] focus:ring-1 focus:ring-[#C47A52]/30 font-mono transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE] bg-[#EAECE6] dark:bg-[#223336] rounded border border-[#D9DED7] dark:border-[#304144] pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Telemetry, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Defense Grid Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
          <Activity className="w-3.5 h-3.5 text-[#36745F] dark:text-[#79B69A]" />
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-medium">Heuristic Engine:</span>
          <span className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono font-semibold">ONLINE</span>
        </div>

        {/* API Backend Connection Indicator */}
        <div
          className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]"
          title={
            apiHealth?.isAvailable
              ? `Connected to ${apiHealth.endpoint}`
              : `Operating safely in deterministic client-side analysis mode.`
          }
        >
          <Server
            className={`w-3.5 h-3.5 ${
              apiHealth?.isAvailable ? 'text-[#36745F] dark:text-[#79B69A]' : 'text-[#A87532] dark:text-[#D7AA61]'
            }`}
          />
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-medium">Cluster:</span>
          <span
            className={`text-[11px] font-mono font-semibold ${
              apiHealth?.isAvailable ? 'text-[#36745F] dark:text-[#79B69A]' : 'text-[#A87532] dark:text-[#D7AA61]'
            }`}
          >
            {apiHealth ? (apiHealth.isAvailable ? 'CONNECTED' : 'LOCAL ENGINE') : 'PROBING...'}
          </span>
        </div>

        {/* Dedicated Dual Theme Toggle */}
        <ThemeToggle size="sm" />

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors cursor-pointer"
          aria-label="View security notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B64B46] dark:bg-[#E17B70]" />
            </span>
          )}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#A95636]/10 dark:bg-[#C47A52]/20 border border-[#A95636]/30 dark:border-[#C47A52]/40 flex items-center justify-center text-[#A95636] dark:text-[#C47A52]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC]">Security Analyst</span>
              <span className="text-[9px] text-[#A95636] dark:text-[#C47A52] font-mono">SOC OPERATOR</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE]" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] shadow-2xl backdrop-blur-xl z-50 text-xs font-sans space-y-1 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="p-2 border-b border-[#D9DED7] dark:border-[#304144] space-y-0.5">
                <p className="font-bold text-[#182629] dark:text-[#E8E6DC]">Active Investigation Session</p>
                <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-mono">analyst@chakravyuh.internal</p>
                <Badge variant="cyan" size="sm" className="mt-1">
                  ROLE: TIER-2 ANALYST
                </Badge>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  alert('Deterministic Heuristic Engine Active — All rules verified.');
                }}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#EAECE6] dark:hover:bg-[#293A3C] text-[#182629] dark:text-[#E8E6DC] transition-colors cursor-pointer text-left"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                <span>Verification Credentials</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onBackToLanding();
                }}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#B64B46]/10 dark:hover:bg-[#E17B70]/10 text-[#B64B46] dark:text-[#E17B70] transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Return to Public Home</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
