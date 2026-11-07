import { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  ShieldCheck,
  Terminal,
  Activity,
} from 'lucide-react';
import { Badge } from './Badge.tsx';

export interface NavbarProps {
  onToggleMobileMenu?: () => void;
  onOpenNotifications?: () => void;
  unreadAlertCount?: number;
  threatLevel?: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  onSearch?: (query: string) => void;
}

export function Navbar({
  onToggleMobileMenu,
  onOpenNotifications,
  unreadAlertCount = 3,
  threatLevel = 'ELEVATED',
  onSearch,
}: NavbarProps) {
  const [searchVal, setSearchVal] = useState('');

  const threatBadgeVariant =
    threatLevel === 'CRITICAL'
      ? 'rose'
      : threatLevel === 'HIGH'
      ? 'amber'
      : threatLevel === 'ELEVATED'
      ? 'purple'
      : 'emerald';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#060d1f]/85 backdrop-blur-xl border-b border-cyan-500/15">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                CYBER CHAKRAVYUHA
              </span>
              <span className="hidden sm:inline-block">
                <Badge variant="cyan" size="sm" className="text-[9px] py-0 px-1.5">
                  AI DEFENSE MATRIX
                </Badge>
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-mono tracking-tight">
              Navigate the Threat. Verify the Trust.
            </p>
          </div>
        </div>

        {/* Center: Command Search Input */}
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
              placeholder="Search threat vectors, IP, CVE, telemetry..."
              className="w-full h-9 pl-9 pr-12 rounded-lg bg-[#0b152d]/90 text-xs text-slate-200 placeholder-slate-500 border border-cyan-500/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all font-mono"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-white/10 pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Operational Telemetry & Profile Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicators */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0b152d]/80 border border-white/[0.08]">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] text-slate-300 font-medium">Matrix:</span>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold">VERIFIED</span>
          </div>

          <div className="hidden sm:flex items-center">
            <Badge variant={threatBadgeVariant} size="sm" hasDot pulseDot>
              {threatLevel}
            </Badge>
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="View security alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>

          {/* Quick Command Console Button */}
          <button
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-colors cursor-pointer"
            title="Terminal CLI"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">CONSOLE</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">SecOps Commander</span>
              <span className="text-[10px] text-cyan-400 font-mono">SYS-ADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
