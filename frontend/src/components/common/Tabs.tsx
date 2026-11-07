import React from 'react';
import { cn } from '../../utils/cn.ts';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        'flex items-center overflow-x-auto no-scrollbar select-none',
        variant === 'underline' ? 'border-b border-white/[0.08] gap-6' : 'p-1 rounded-xl bg-[#070d1e]/90 border border-white/[0.08] gap-1',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.25)] border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent',
                tab.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded font-mono',
                    isActive ? 'bg-cyan-400/20 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'group relative flex items-center gap-2 py-3 text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
              isActive
                ? 'text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {tab.icon && (
              <span className={cn('shrink-0 transition-colors', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded font-mono ml-1',
                  isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                )}
              >
                {tab.badge}
              </span>
            )}

            {/* Active underline indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

