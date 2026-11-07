import { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Activity,
  Menu,
  Shield,
  ShieldCheck,
  Sun,
  Moon,
  ChevronDown,
  ArrowLeft,
  LogOut,
  UserCheck,
  Server,
} from 'lucide-react';
import { Badge, Button } from '../common/index.ts';
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
  const [isMatrixTheme, setIsMatrixTheme] = useState(false);
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

  const toggleTheme = () => {
    setIsMatrixTheme(!isMatrixTheme);
    if (!isMatrixTheme) {
      document.documentElement.classList.add('cyber-matrix-mode');
    } else {
      document.documentElement.classList.remove('cyber-matrix-mode');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#060d1f]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Left: Mobile hamburger & Brand / Portal Return */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToLanding}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-xs text-slate-400 hover:text-cyan-300 hidden sm:flex"
        >
          Portal
        </Button>

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-sky-500 to-purple-600 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <div className="w-full h-full bg-[#030712] rounded-[6px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wider text-white">
              CYBER CHAKRAVYUHA
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
              SECURITY OPERATIONS CENTRE
            </span>
          </div>
        </div>
      </div>

      {/* Center: Command Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Command Search: Investigate URL, IP, CVE, or IOC..."
            className="w-full h-9 pl-9 pr-12 rounded-lg bg-[#0b152d]/90 text-xs text-slate-200 placeholder-slate-500 border border-cyan-500/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-white/10 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Telemetry, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Defense Grid Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b152d]/80 border border-white/[0.08]">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] text-slate-300 font-medium">Defense Grid:</span>
          <span className="text-[11px] text-emerald-400 font-mono font-semibold">ACTIVE</span>
        </div>

        {/* API Backend Connection Indicator */}
        <div
          className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b152d]/80 border border-white/[0.08]"
          title={
            apiHealth?.isAvailable
              ? `Connected to ${apiHealth.endpoint}`
              : `Backend service is offline at ${apiHealth?.endpoint || 'localhost:5000'}. Operating safely in deterministic client-side analysis mode.`
          }
        >
          <Server
            className={`w-3.5 h-3.5 ${
              apiHealth?.isAvailable ? 'text-emerald-400' : 'text-amber-400'
            }`}
          />
          <span className="text-[11px] text-slate-300 font-medium">API Core:</span>
          <span
            className={`text-[11px] font-mono font-semibold ${
              apiHealth?.isAvailable ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {apiHealth ? (apiHealth.isAvailable ? 'CONNECTED' : 'OFFLINE / DEMO') : 'PROBING...'}
          </span>
        </div>

        {/* Theme Controls Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
          title={isMatrixTheme ? 'Switch to Dark Navy' : 'Switch to High-Contrast Cyber Matrix'}
          aria-label="Toggle theme mode"
        >
          {isMatrixTheme ? (
            <Sun className="w-4 h-4 text-cyan-400 animate-spin" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          aria-label="View security notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          )}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">Commander Roy</span>
              <span className="text-[9px] text-cyan-400 font-mono">SECOPS LEAD</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-[#0b152d]/98 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="p-2 border-b border-white/10 space-y-0.5">
                <p className="font-bold text-white">Soumyadeep Roy</p>
                <p className="text-[10px] text-slate-400">roy@chakravyuha.internal</p>
                <Badge variant="emerald" size="sm" className="mt-1">
                  CLEARANCE: LEVEL 5
                </Badge>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  alert('Hardware Key Attestation: Ed25519 Token Active');
                }}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Clearance</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onBackToLanding();
                }}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Exit SOC Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
