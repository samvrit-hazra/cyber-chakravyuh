import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Brain,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '../common/index.ts';

export type DashboardTabId =
  | 'overview'
  | 'url-investigation'
  | 'scam-detection'
  | 'tls-intelligence'
  | 'website-security'
  | 'threat-intelligence'
  | 'blockchain-verification'
  | 'investigation-history'
  | 'settings';

export interface DashboardSidebarProps {
  activeTab: DashboardTabId;
  onSelectTab: (tab: DashboardTabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const navItems: {
    id: DashboardTabId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeVariant?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
    section?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      section: 'COMMAND DESK',
    },
    {
      id: 'url-investigation',
      label: 'URL Investigation',
      icon: <Globe className="w-4 h-4" />,
      badge: 'PRO',
      badgeVariant: 'cyan',
      section: 'INVESTIGATION ENGINES',
    },
    {
      id: 'scam-detection',
      label: 'Scam Detection',
      icon: <Brain className="w-4 h-4" />,
      badge: 'AI',
      badgeVariant: 'purple',
      section: 'INVESTIGATION ENGINES',
    },
    {
      id: 'tls-intelligence',
      label: 'TLS Intelligence',
      icon: <Lock className="w-4 h-4" />,
      section: 'INVESTIGATION ENGINES',
    },
    {
      id: 'website-security',
      label: 'Website Security',
      icon: <ShieldCheck className="w-4 h-4" />,
      section: 'INVESTIGATION ENGINES',
    },
    {
      id: 'threat-intelligence',
      label: 'Threat Intelligence',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: 'LIVE',
      badgeVariant: 'rose',
      section: 'INTELLIGENCE FEEDS',
    },
    {
      id: 'blockchain-verification',
      label: 'Blockchain Verification',
      icon: <Fingerprint className="w-4 h-4" />,
      badge: 'HASH',
      badgeVariant: 'emerald',
      section: 'INTELLIGENCE FEEDS',
    },
    {
      id: 'investigation-history',
      label: 'Investigation History',
      icon: <History className="w-4 h-4" />,
      section: 'SYSTEM & LOGS',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      section: 'SYSTEM & LOGS',
    },
  ];

  const sections = Array.from(new Set(navItems.map((item) => item.section || 'MAIN')));

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#070d1e]/95 backdrop-blur-xl border-r border-cyan-500/15 flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06] h-16">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-sky-500 to-purple-600 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.45)] shrink-0">
                <div className="w-full h-full bg-[#030712] rounded-[6px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-xs tracking-wider text-white truncate">
                  CHAKRAVYUHA SOC
                </span>
                <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-mono">
                  ACTIVE MATRIX
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.45)]">
                <Shield className="w-4 h-4 text-slate-950" />
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Nav Item List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
          {sections.map((sectionName) => {
            const items = navItems.filter((i) => i.section === sectionName);
            return (
              <div key={sectionName} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                    {sectionName}
                  </p>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onMobileClose();
                        }}
                        className={`w-full flex items-center rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                          isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-3'
                        } ${
                          isActive
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold shadow-[inset_0_0_12px_rgba(6,182,212,0.2)] border-l-2 border-cyan-400'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                          }`}
                        >
                          {item.icon}
                        </span>

                        {!isCollapsed && (
                          <div className="flex items-center justify-between flex-1 truncate">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <Badge
                                variant={item.badgeVariant || 'cyan'}
                                size="sm"
                                className="ml-1.5 py-0 px-1.5 text-[9px]"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Status Box */}
        <div className="p-3 border-t border-white/[0.06] bg-[#050914]/80">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-slate-200">SAPTARISHI MESH</span>
                  <span className="text-[9px] text-emerald-400 font-mono">100% OPERATIONAL</span>
                </div>
              </div>
              <button
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800/60"
                title="Documentation & Guidance"
                aria-label="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

