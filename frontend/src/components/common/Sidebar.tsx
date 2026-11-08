import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  Sliders,
  Settings,
  HelpCircle,
  Database,
  Lock,
} from 'lucide-react';
import { cn } from '../../utils/cn.ts';
import { Badge } from './Badge.tsx';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'copper' | 'spruce' | 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
  section?: string;
}

export interface SidebarProps {
  items?: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const defaultNavItems: NavItem[] = [
  { id: 'overview', label: 'Command Overview', icon: <Shield className="w-4 h-4" />, section: 'DEFENSE MATRIX' },
  { id: 'threat-stream', label: 'Threat Stream', icon: <AlertTriangle className="w-4 h-4" />, badge: '3', badgeVariant: 'rose', section: 'DEFENSE MATRIX' },
  { id: 'vyuha-layers', label: '7-Layer Chakravyuha', icon: <Layers className="w-4 h-4" />, section: 'DEFENSE MATRIX' },
  { id: 'telemetry', label: 'Live Telemetry', icon: <Activity className="w-4 h-4" />, badge: 'LIVE', badgeVariant: 'emerald', section: 'DIGITAL TRUST' },
  { id: 'identity-vault', label: 'Identity & Vault', icon: <Lock className="w-4 h-4" />, section: 'DIGITAL TRUST' },
  { id: 'data-assets', label: 'Data Lake Assets', icon: <Database className="w-4 h-4" />, section: 'DIGITAL TRUST' },
  { id: 'design-system', label: 'Design System & Tokens', icon: <Sliders className="w-4 h-4" />, badge: 'v1.0', badgeVariant: 'copper', section: 'SYSTEM ARCHITECTURE' },
  { id: 'audit-logs', label: 'Audit & Compliance', icon: <FileText className="w-4 h-4" />, section: 'SYSTEM ARCHITECTURE' },
  { id: 'settings', label: 'Console Settings', icon: <Settings className="w-4 h-4" />, section: 'SYSTEM ARCHITECTURE' },
];

export function Sidebar({
  items = defaultNavItems,
  activeId,
  onSelect,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  // Group nav items by section
  const sections = Array.from(new Set(items.map((i) => i.section || 'MAIN')));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-[#19272A] border-r border-[#D9DED7] dark:border-[#304144]',
          'flex flex-col justify-between transition-all duration-300 ease-in-out select-none',
          isCollapsed ? 'w-18' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header / Branding area */}
        <div className="flex items-center justify-between p-4 border-b border-[#D9DED7] dark:border-[#304144] h-16">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-wide text-[#182629] dark:text-[#E8E6DC] font-heading flex items-center gap-1.5 truncate">
                  CYBER CHAKRAVYUH
                </span>
                <span className="text-[10px] text-[#A95636] dark:text-[#C47A52] uppercase tracking-widest font-mono">
                  INTEL PLATFORM
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center">
              <img src="/logo.png" alt="Cyber Chakravyuh Logo" className="w-7 h-7 object-contain" />
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-md text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Links Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
          {sections.map((secName) => {
            const sectionItems = items.filter((i) => (i.section || 'MAIN') === secName);
            return (
              <div key={secName} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-[#647477] dark:text-[#A6B3AE] uppercase">
                    {secName}
                  </p>
                )}
                <div className="space-y-0.5">
                  {sectionItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelect(item.id);
                          onMobileClose?.();
                        }}
                        className={cn(
                          'w-full flex items-center rounded text-xs font-mono font-medium transition-all group relative cursor-pointer',
                          isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-3',
                          isActive
                            ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-semibold border-l-2 border-[#A95636] dark:border-[#C47A52]'
                            : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6]/50 dark:hover:bg-[#223336]'
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive ? 'text-[#A95636] dark:text-[#C47A52]' : 'text-[#647477] dark:text-[#A6B3AE] group-hover:text-[#A95636] dark:group-hover:text-[#C47A52]'
                          )}
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
                                className="ml-1.5 py-0 px-1.5 text-[10px]"
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

        {/* Bottom Status / User footer */}
        <div className="p-3 border-t border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6]/30 dark:bg-[#101A1D]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-[#36745F] dark:bg-[#79B69A]" />
                  <div className="absolute inset-0 rounded-full bg-[#36745F] dark:bg-[#79B69A] animate-ping opacity-75" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-[#182629] dark:text-[#E8E6DC] font-mono">DEFENSE GRID</span>
                  <span className="text-[10px] text-[#36745F] dark:text-[#79B69A] font-mono">100% OPERATIONAL</span>
                </div>
              </div>
              <button
                className="p-1.5 text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] rounded hover:bg-[#EAECE6] dark:hover:bg-[#223336]"
                aria-label="Support & Docs"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-[#36745F] dark:bg-[#79B69A]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
