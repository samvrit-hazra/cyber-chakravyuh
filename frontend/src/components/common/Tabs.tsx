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
        variant === 'underline'
          ? 'border-b border-[#D9DED7] dark:border-[#304144] gap-6'
          : 'p-1 rounded-md bg-[#EAECE6] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] gap-1',
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
                'flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
                isActive
                  ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-semibold border border-[#D9DED7] dark:border-[#304144] shadow-sm'
                  : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-transparent',
                tab.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded font-mono',
                    isActive ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52]' : 'bg-[#D9DED7] dark:bg-[#304144] text-[#647477] dark:text-[#A6B3AE]'
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
              'group relative flex items-center gap-2 py-3 text-xs font-mono font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
              isActive
                ? 'text-[#A95636] dark:text-[#C47A52] font-semibold'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {tab.icon && (
              <span className={cn('shrink-0 transition-colors', isActive ? 'text-[#A95636] dark:text-[#C47A52]' : 'text-[#647477] dark:text-[#A6B3AE] group-hover:text-[#182629] dark:group-hover:text-[#E8E6DC]')}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-mono ml-1',
                  isActive ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52]' : 'bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE]'
                )}
              >
                {tab.badge}
              </span>
            )}

            {/* Active underline indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A95636] dark:bg-[#C47A52]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
