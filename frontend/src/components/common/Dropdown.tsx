import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
  isDestructive?: boolean;
}

export interface DropdownProps {
  label?: string;
  items: DropdownItem[];
  selectedId?: string;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  trigger?: React.ReactNode;
}

export function Dropdown({
  label,
  items,
  selectedId,
  onSelect,
  placeholder = 'Select option...',
  searchable = false,
  disabled = false,
  className,
  trigger,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = searchable && search.trim()
    ? items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div ref={dropdownRef} className={cn('relative inline-block w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase mb-1.5">
          {label}
        </label>
      )}

      {trigger ? (
        <div onClick={() => !disabled && setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full h-9 px-3 rounded-lg bg-white dark:bg-[#19272A] text-sm text-[#182629] dark:text-[#E8E6DC]',
            'border border-[#D9DED7] dark:border-[#304144] shadow-xs flex items-center justify-between',
            'hover:border-[#A95636] dark:hover:border-[#C47A52] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52]',
            'transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedItem?.icon && <span className="text-[#647477] dark:text-[#A6B3AE] shrink-0">{selectedItem.icon}</span>}
            <span className={cn('truncate', !selectedItem && 'text-[#647477] dark:text-[#A6B3AE] font-normal')}>
              {selectedItem ? selectedItem.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={cn('w-4 h-4 text-[#647477] dark:text-[#A6B3AE] shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 py-1 rounded-xl',
            'bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-md',
            'shadow-[0_10px_35px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-150 overflow-hidden'
          )}
        >
          {searchable && (
            <div className="p-2 border-b border-white/[0.06]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter..."
                  className="w-full h-7 pl-8 pr-2 text-xs bg-[#F3F1E9] dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] rounded border border-[#D9DED7] dark:border-[#304144] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52]"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#647477] dark:text-[#A6B3AE] text-center font-mono">
                No matching entries
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left',
                      isSelected
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                        : item.isDestructive
                        ? 'text-rose-400 hover:bg-rose-500/10'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
                      item.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.icon && <span className="shrink-0">{item.icon}</span>}
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                          {item.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

