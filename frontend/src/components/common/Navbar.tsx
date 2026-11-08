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
      ? 'copper'
      : 'emerald';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F3F1E9]/95 dark:bg-[#101A1D]/95 backdrop-blur-md border-b border-[#D9DED7] dark:border-[#304144]">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base font-brand text-[#182629] dark:text-[#E8E6DC]">
                  Cyber Chakravyuh
                </span>
                <span className="hidden sm:inline-block">
                  <Badge variant="copper" size="sm" className="text-[9px] py-0 px-1.5">
                    DEFENSE MATRIX
                  </Badge>
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono tracking-tight">
                Navigate the Threat. Verify the Trust.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Command Search Input */}
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
              placeholder="Search threat vectors, IP, CVE, telemetry..."
              className="w-full h-9 pl-9 pr-12 rounded bg-white dark:bg-[#19272A] text-xs text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] focus:ring-1 focus:ring-[#A95636]/30 transition-all font-mono"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE] bg-[#EAECE6] dark:bg-[#223336] rounded border border-[#D9DED7] dark:border-[#304144] pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Operational Telemetry & Profile Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicators */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144]">
            <Activity className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-medium">Matrix:</span>
            <span className="text-[11px] text-[#36745F] dark:text-[#79B69A] font-mono font-semibold">VERIFIED</span>
          </div>

          <div className="hidden sm:flex items-center">
            <Badge variant={threatBadgeVariant} size="sm" hasDot pulseDot>
              {threatLevel}
            </Badge>
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors cursor-pointer"
            aria-label="View security alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B64B46] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B64B46]" />
              </span>
            )}
          </button>

          {/* Quick Command Console Button */}
          <button
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-[#A95636] dark:text-[#C47A52] bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/25 dark:border-[#C47A52]/30 hover:border-[#A95636]/50 transition-colors cursor-pointer"
            title="Terminal CLI"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">CONSOLE</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#D9DED7] dark:border-[#304144]">
            <div className="w-8 h-8 rounded bg-[#182629] dark:bg-[#E8E6DC] flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-white dark:bg-[#101A1D] rounded-xs flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
              </div>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#182629] dark:text-[#E8E6DC]">SecOps Commander</span>
              <span className="text-[10px] text-[#A95636] dark:text-[#C47A52] font-mono">SYS-ADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
