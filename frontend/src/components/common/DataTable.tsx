import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  selectedRowKeys?: string[];
  selectable?: boolean;
  onSelectionChange?: (keys: string[]) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchFilter,
  pageSize = 5,
  onRowClick,
  selectedRowKeys = [],
  selectable = false,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    if (searchFilter) {
      return data.filter((row) => searchFilter(row, query));
    }
    // Default fallback search: stringify row values
    return data.filter((row) =>
      Object.values(row as Record<string, unknown>).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [data, query, searchFilter]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const allKeys = paginatedData.map(keyExtractor);
      onSelectionChange(Array.from(new Set([...selectedRowKeys, ...allKeys])));
    } else {
      const pageKeys = new Set(paginatedData.map(keyExtractor));
      onSelectionChange(selectedRowKeys.filter((k) => !pageKeys.has(k)));
    }
  };

  const handleRowSelect = (key: string) => {
    if (!onSelectionChange) return;
    if (selectedRowKeys.includes(key)) {
      onSelectionChange(selectedRowKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedRowKeys, key]);
    }
  };

  const isAllCurrentSelected =
    paginatedData.length > 0 && paginatedData.every((row, i) => selectedRowKeys.includes(keyExtractor(row, i)));

  return (
    <div className={cn('w-full space-y-3', className)}>
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#0b152d]/80 text-slate-200 placeholder-slate-500 rounded-lg border border-cyan-500/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 font-mono"
            />
          </div>

          <span className="text-xs font-mono text-slate-400">
            Total Records: <strong className="text-cyan-400">{filteredData.length}</strong>
          </span>
        </div>
      )}

      {/* Table container with cyber frame */}
      <div className="w-full overflow-hidden rounded-xl border border-cyan-500/15 bg-[#0b152d]/70 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#070d1e]/80 text-slate-400 uppercase font-mono tracking-wider">
                {selectable && (
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      'p-3 font-semibold select-none',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.sortable && 'cursor-pointer hover:text-cyan-300 transition-colors'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-1.5',
                        col.align === 'center' && 'justify-center',
                        col.align === 'right' && 'justify-end'
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="inline-flex flex-col text-slate-500">
                          {sortKey === col.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                            )
                          ) : (
                            <ChevronUp className="w-3.5 h-3.5 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="p-8 text-center text-slate-500 font-mono"
                  >
                    No matching threat data found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const key = keyExtractor(row, idx);
                  const isSelected = selectedRowKeys.includes(key);

                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        'transition-colors duration-150',
                        onRowClick && 'cursor-pointer',
                        isSelected
                          ? 'bg-cyan-500/10'
                          : idx % 2 === 0
                          ? 'bg-transparent hover:bg-slate-800/40'
                          : 'bg-white/[0.01] hover:bg-slate-800/40'
                      )}
                    >
                      {selectable && (
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRowSelect(key)}
                            className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            'p-3 text-slate-200',
                            col.align === 'center' && 'text-center',
                            col.align === 'right' && 'text-right'
                          )}
                        >
                          {col.render
                            ? col.render(row, idx)
                            : String((row as Record<string, unknown>)[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-white/[0.06] bg-[#070d1e]/90 text-xs font-mono">
            <span className="text-slate-400">
              Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
              <strong className="text-slate-200">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

