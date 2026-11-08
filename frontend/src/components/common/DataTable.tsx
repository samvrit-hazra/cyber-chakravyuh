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

      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
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
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
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
      const pageKeys = paginatedData.map((row, i) => keyExtractor(row, i));
      const combined = Array.from(new Set([...selectedRowKeys, ...pageKeys]));
      onSelectionChange(combined);
    } else {
      const pageKeys = new Set(paginatedData.map((row, i) => keyExtractor(row, i)));
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
    <div className={cn('w-full space-y-3 font-sans', className)}>
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#EAECE6]/50 dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] rounded border border-[#D9DED7] dark:border-[#304144] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] font-mono"
            />
          </div>

          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
            Records: <strong className="text-[#A95636] dark:text-[#C47A52]">{filteredData.length}</strong>
          </span>
        </div>
      )}

      {/* Table container */}
      <div className="w-full overflow-hidden rounded-md border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6]/60 dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] uppercase font-mono tracking-wider">
                {selectable && (
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-[#D9DED7] dark:border-[#304144] text-[#A95636] dark:text-[#C47A52] cursor-pointer"
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
                      col.sortable && 'cursor-pointer hover:text-[#A95636] dark:hover:text-[#C47A52] transition-colors'
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
                        <span className="inline-flex flex-col text-[10px]">
                          <ChevronUp
                            className={cn(
                              'w-2.5 h-2.5 -mb-1',
                              sortKey === col.key && sortDirection === 'asc'
                                ? 'text-[#A95636] dark:text-[#C47A52]'
                                : 'opacity-30'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'w-2.5 h-2.5',
                              sortKey === col.key && sortDirection === 'desc'
                                ? 'text-[#A95636] dark:text-[#C47A52]'
                                : 'opacity-30'
                            )}
                          />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DED7] dark:divide-[#304144]/60">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="p-8 text-center text-xs font-mono text-[#647477] dark:text-[#A6B3AE]"
                  >
                    No matching records found.
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
                        'transition-colors',
                        onRowClick && 'cursor-pointer',
                        isSelected
                          ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/15'
                          : 'hover:bg-[#EAECE6]/40 dark:hover:bg-[#223336]'
                      )}
                    >
                      {selectable && (
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRowSelect(key)}
                            className="rounded border-[#D9DED7] dark:border-[#304144] text-[#A95636] dark:text-[#C47A52] cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            'p-3 text-[#182629] dark:text-[#E8E6DC]',
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
          <div className="flex items-center justify-between p-3 border-t border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6]/50 dark:bg-[#101A1D] text-xs font-mono">
            <span className="text-[#647477] dark:text-[#A6B3AE]">
              Page <strong className="text-[#182629] dark:text-[#E8E6DC]">{currentPage}</strong> of{' '}
              <strong className="text-[#182629] dark:text-[#E8E6DC]">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#D9DED7] dark:hover:bg-[#223336] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#D9DED7] dark:hover:bg-[#223336] disabled:opacity-40 disabled:cursor-not-allowed"
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
