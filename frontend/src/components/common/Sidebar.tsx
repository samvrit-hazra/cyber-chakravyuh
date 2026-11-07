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
  badgeVariant?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
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
  { id: 'design-system', label: 'Design System & Tokens', icon: <Sliders className="w-4 h-4" />, badge: 'v1.0', badgeVariant: 'cyan', section: 'SYSTEM ARCHITECTURE' },
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
          'fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#070d1e]/95 backdrop-blur-xl border-r border-cyan-500/15',
          'flex flex-col justify-between transition-all duration-300 ease-in-out select-none',
          isCollapsed ? 'w-18' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header / Branding area */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06] h-16">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.45)] shrink-0">
                <Shield className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5 truncate">
                  CHAKRAVYUHA
                </span>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                  SEC-OPS INTEL
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

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
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
                  <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
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
                          'w-full flex items-center rounded-lg text-xs font-medium transition-all group relative cursor-pointer',
                          isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-3',
                          isActive
                            ? 'bg-cyan-500/10 text-cyan-300 font-semibold shadow-[inset_0_0_12px_rgba(6,182,212,0.15)] border-l-2 border-cyan-400'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                          )}
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
        <div className="p-3 border-t border-white/[0.06] bg-[#050914]/80">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-slate-200">DEFENSE GRID</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% OPERATIONAL</span>
                </div>
              </div>
              <button
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800/60"
                aria-label="Support & Docs"
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

