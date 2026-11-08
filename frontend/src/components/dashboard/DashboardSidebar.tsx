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
    badgeVariant?: 'copper' | 'spruce' | 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
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
      badge: 'CORE',
      badgeVariant: 'copper',
      section: 'INVESTIGATION ENGINES',
    },
    {
      id: 'scam-detection',
      label: 'Scam Detection',
      icon: <Brain className="w-4 h-4" />,
      badge: 'HEURISTIC',
      badgeVariant: 'copper',
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
      label: 'Cryptographic Ledger',
      icon: <Fingerprint className="w-4 h-4" />,
      badge: 'SHA-256',
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-[#19272A] border-r border-[#D9DED7] dark:border-[#304144] flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-sm dark:shadow-2xl ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#D9DED7] dark:border-[#304144] h-16">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-xs tracking-wider text-[#182629] dark:text-[#E8E6DC] truncate font-brand">
                  CYBER CHAKRAVYUH
                </span>
                <span className="text-[9px] text-[#A95636] dark:text-[#C47A52] uppercase tracking-wider font-mono">
                  SECURITY OPERATIONS
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center">
              <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-7 h-7 object-contain" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors cursor-pointer"
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
                  <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-[#647477] dark:text-[#A6B3AE] uppercase">
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
                            ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold border-l-2 border-[#A95636] dark:border-[#C47A52]'
                            : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336]'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-[#A95636] dark:text-[#C47A52]' : 'text-[#647477] dark:text-[#A6B3AE] group-hover:text-[#A95636] dark:group-hover:text-[#C47A52]'
                          }`}
                        >
                          {item.icon}
                        </span>

                        {!isCollapsed && (
                          <div className="flex items-center justify-between flex-1 truncate">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <Badge
                                variant={item.badgeVariant || 'copper'}
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
        <div className="p-3 border-t border-[#D9DED7] dark:border-[#304144] bg-[#F3F1E9] dark:bg-[#101A1D]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#36745F] dark:bg-[#79B69A]" />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-[#182629] dark:text-[#E8E6DC]">TELEMETRY FEED</span>
                  <span className="text-[9px] text-[#36745F] dark:text-[#79B69A] font-mono">HEURISTICS ACTIVE</span>
                </div>
              </div>
              <button
                className="p-1.5 text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] rounded hover:bg-[#D9DED7] dark:hover:bg-[#223336]"
                title="Documentation & Guidance"
                aria-label="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#36745F] dark:bg-[#79B69A]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
