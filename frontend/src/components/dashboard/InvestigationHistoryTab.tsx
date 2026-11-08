import { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Eye,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Shield,
  FileJson,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Dropdown,
  LoadingState,
  EmptyState,
  AlertBanner,
} from '../common/index.ts';
import { mockInvestigations } from '../../utils/dashboardMockData.ts';
import type { InvestigationRecord } from '../../types/dashboard.ts';
import type {
  DateFilterOption,
  RiskFilterOption,
  TypeFilterOption,
  SortOption,
} from '../../types/historyAndSettings.ts';

interface InvestigationHistoryTabProps {
  onViewReport: (record: InvestigationRecord) => void;
  onNavigateToBlockchain?: (hash: string) => void;
}

export function InvestigationHistoryTab({
  onViewReport,
}: InvestigationHistoryTabProps) {
  // Evaluator state tester: 'ready' | 'loading' | 'empty' | 'error'
  const [stateMode, setStateMode] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');

  // Search & Filters
  const [query, setQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterOption>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskFilterOption>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<TypeFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Micro-interactions
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Reference timestamp: newest record timestamp in dataset
  const referenceTimestamp = useMemo(() => {
    if (mockInvestigations.length === 0) return 1794000000000;
    const timestamps = mockInvestigations.map((r) => new Date(r.timestamp.replace(' ', 'T')).getTime());
    return Math.max(...timestamps);
  }, []);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    if (stateMode === 'empty') return [];

    return mockInvestigations.filter((record) => {
      // 1. Text Search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesUrl = record.url.toLowerCase().includes(q);
        const matchesId = record.id.toLowerCase().includes(q);
        const matchesCategory = record.threatCategory.toLowerCase().includes(q);
        const matchesCampaign = record.campaign ? record.campaign.toLowerCase().includes(q) : false;
        const matchesIp = record.targetIp ? record.targetIp.toLowerCase().includes(q) : false;
        const matchesAsn = record.asn ? record.asn.toLowerCase().includes(q) : false;
        if (!matchesUrl && !matchesId && !matchesCategory && !matchesCampaign && !matchesIp && !matchesAsn) {
          return false;
        }
      }

      // 2. Risk Filter
      if (selectedRiskFilter !== 'all') {
        if (selectedRiskFilter === 'inconclusive') {
          if (record.riskScore > 35 && record.riskScore < 65 && record.status === 'investigating') {
            // matches inconclusive
          } else {
            return false;
          }
        } else if (record.riskLevel !== selectedRiskFilter) {
          return false;
        }
      }

      // 3. Type Filter
      if (selectedTypeFilter !== 'all' && record.type !== selectedTypeFilter) {
        return false;
      }

      // 4. Date Filter
      if (selectedDateFilter !== 'all') {
        const recordTime = new Date(record.timestamp.replace(' ', 'T')).getTime();
        const diffMs = referenceTimestamp - recordTime;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (selectedDateFilter === 'today' && diffHours > 24) {
          return false;
        }
        if (selectedDateFilter === '7days' && diffHours > 24 * 7) {
          return false;
        }
        if (selectedDateFilter === '30days' && diffHours > 24 * 30) {
          return false;
        }
      }

      return true;
    });
  }, [query, selectedRiskFilter, selectedTypeFilter, selectedDateFilter, referenceTimestamp, stateMode]);

  // Sorted dataset
  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];
    list.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.timestamp.replace(' ', 'T')).getTime() - new Date(a.timestamp.replace(' ', 'T')).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.timestamp.replace(' ', 'T')).getTime() - new Date(b.timestamp.replace(' ', 'T')).getTime();
      }
      if (sortBy === 'score-desc') {
        return b.riskScore - a.riskScore;
      }
      if (sortBy === 'score-asc') {
        return a.riskScore - b.riskScore;
      }
      if (sortBy === 'url-asc') {
        return a.url.localeCompare(b.url);
      }
      if (sortBy === 'url-desc') {
        return b.url.localeCompare(a.url);
      }
      return 0;
    });
    return list;
  }, [filteredRecords, sortBy]);

  // Paginated dataset
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Copy URL helper
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setQuery('');
    setSelectedDateFilter('all');
    setSelectedRiskFilter('all');
    setSelectedTypeFilter('all');
    setSortBy('date-desc');
    setCurrentPage(1);
    setStateMode('ready');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedDateFilter !== 'all' ||
    selectedRiskFilter !== 'all' ||
    selectedTypeFilter !== 'all';

  // Export CSV handler
  const handleExportCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['ID', 'Target_URL', 'Investigation_Type', 'Risk_Level', 'Risk_Score', 'Status', 'Timestamp', 'IP', 'Campaign', 'MITRE'];
      const rows = sortedRecords.map((r) => [
        r.id,
        `"${r.url.replace(/"/g, '""')}"`,
        r.type,
        r.riskLevel,
        r.riskScore,
        r.status,
        r.timestamp,
        r.targetIp || '',
        `"${(r.campaign || '').replace(/"/g, '""')}"`,
        `"${(r.mitreTactic || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CyberChakravyuha-History-Ledger-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 400);
  };

  // Export JSON handler
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(sortedRecords, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberChakravyuha-History-Archive-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header Card */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" />
              Investigation Audit Log & Historical Archive
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Complete historical ledger of analyzed target assets, forensic multi-layer determinations,
              and immutable cryptographic attestation records across Saptarishi nodes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
              onClick={handleExportCsv}
              isLoading={isExporting}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileJson className="w-4 h-4 text-cyan-400" />}
              onClick={handleExportJson}
            >
              Export JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4 text-[#C47A52]" />}
              onClick={() => {
                setStateMode('loading');
                setTimeout(() => setStateMode('ready'), 600);
              }}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* State Tester Toolbar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Archived Entries: <strong className="text-cyan-300">{mockInvestigations.length}</strong></span>
            <span>•</span>
            <span>Matched Filter: <strong className="text-slate-200">{filteredRecords.length}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[11px] mr-1">State Tester:</span>
            {(['ready', 'loading', 'empty', 'error'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setStateMode(mode)}
                className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                  stateMode === mode
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                    : 'bg-[#F3F1E9] dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Search and Filters Toolbar */}
      <Card variant="default" className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by URL, incident ID, IP, campaign, or MITRE..."
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] text-xs text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] font-mono transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div>
            <Dropdown
              selectedId={selectedDateFilter}
              onSelect={(item) => {
                setSelectedDateFilter(item.id as DateFilterOption);
                setCurrentPage(1);
              }}
              items={[
                { id: 'all', label: 'Date: All Time' },
                { id: 'today', label: 'Date: Today (<24h)' },
                { id: '7days', label: 'Date: Past 7 Days' },
                { id: '30days', label: 'Date: Past 30 Days' },
              ]}
            />
          </div>

          {/* Risk Level Filter Dropdown */}
          <div>
            <Dropdown
              selectedId={selectedRiskFilter}
              onSelect={(item) => {
                setSelectedRiskFilter(item.id as RiskFilterOption);
                setCurrentPage(1);
              }}
              items={[
                { id: 'all', label: 'Risk: All Tiers' },
                { id: 'critical', label: 'Risk: Critical (85-100)' },
                { id: 'high', label: 'Risk: High (70-84)' },
                { id: 'guarded', label: 'Risk: Guarded (40-69)' },
                { id: 'low', label: 'Risk: Low (0-39)' },
                { id: 'inconclusive', label: 'Risk: Inconclusive' },
              ]}
            />
          </div>

          {/* Type Filter Dropdown */}
          <div>
            <Dropdown
              selectedId={selectedTypeFilter}
              onSelect={(item) => {
                setSelectedTypeFilter(item.id as TypeFilterOption);
                setCurrentPage(1);
              }}
              items={[
                { id: 'all', label: 'Type: All Vectors' },
                { id: 'URL Analysis', label: 'Type: URL Analysis' },
                { id: 'Scam Detection', label: 'Type: Scam Detection' },
                { id: 'TLS Intelligence', label: 'Type: TLS Intelligence' },
                { id: 'Website Security', label: 'Type: Website Security' },
                { id: 'Threat Intelligence', label: 'Type: Threat Intelligence' },
                { id: 'Blockchain Attestation', label: 'Type: Blockchain Attestation' },
              ]}
            />
          </div>
        </div>

        {/* Second Row: Sorting, Page Size, and Active Filter Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              Sort:
            </span>
            <div className="w-48">
              <Dropdown
                selectedId={sortBy}
                onSelect={(item) => setSortBy(item.id as SortOption)}
                items={[
                  { id: 'date-desc', label: 'Date: Newest First' },
                  { id: 'date-asc', label: 'Date: Oldest First' },
                  { id: 'score-desc', label: 'Risk Score: Highest' },
                  { id: 'score-asc', label: 'Risk Score: Lowest' },
                  { id: 'url-asc', label: 'Target URL: A → Z' },
                  { id: 'url-desc', label: 'Target URL: Z → A' },
                ]}
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400 self-end sm:self-auto">
            <span>Per page:</span>
            {[5, 10, 20].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  pageSize === size
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                    : 'bg-[#F3F1E9] dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* State Mode 1: Loading State */}
      {stateMode === 'loading' && (
        <Card variant="default" className="p-12">
          <LoadingState
            message="QUERYING IMMUTABLE FORENSIC ARCHIVE..."
            submessage="Verifying cryptographic signatures and Merkle proofs across Chakravyuha nodes"
          />
        </Card>
      )}

      {/* State Mode 2: Error State */}
      {stateMode === 'error' && (
        <Card variant="default" className="p-6">
          <AlertBanner
            variant="danger"
            title="Telemetry Ingress Ledger Unreachable"
            description="The local forensic audit log could not synchronize with the Saptarishi gateway. Connection timed out after 3000ms. Please check network connectivity or retry the ledger query."
            action={
              <Button
                variant="danger"
                size="sm"
                onClick={() => setStateMode('ready')}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry Ledger Fetch
              </Button>
            }
          />
        </Card>
      )}

      {/* State Mode 3: Empty State (either forced or no search matches) */}
      {stateMode === 'ready' && filteredRecords.length === 0 && (
        <EmptyState
          icon={<Shield className="w-8 h-8 text-cyan-400" />}
          title="No Investigation Records Found"
          description={
            hasActiveFilters
              ? 'No historical cases match the active filter criteria or search query. Broaden your search or reset filters.'
              : 'The investigation history ledger is currently empty. Run a URL analysis or scam scan to generate records.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="primary" size="sm" onClick={handleClearFilters} leftIcon={<Filter className="w-4 h-4" />}>
                Reset All Filters
              </Button>
            ) : undefined
          }
        />
      )}

      {/* State Mode 4: Ready State Table */}
      {stateMode === 'ready' && filteredRecords.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6] dark:bg-[#223336] text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] uppercase tracking-wider">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Target Specifier / URL</th>
                  <th className="py-3 px-4">Vector</th>
                  <th className="py-3 px-4">Risk Classification</th>
                  <th className="py-3 px-4">Campaign / MITRE</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {paginatedRecords.map((record) => {
                  const isCrit = record.riskLevel === 'critical';
                  const isH = record.riskLevel === 'high';
                  const isG = record.riskLevel === 'guarded';

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 text-cyan-300 font-bold whitespace-nowrap">
                        {record.id}
                      </td>

                      {/* URL with Copy */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-slate-200 select-all" title={record.url}>
                            {record.url}
                          </span>
                          <button
                            onClick={() => handleCopyUrl(record.url, record.id)}
                            className="text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                            title="Copy target URL"
                          >
                            {copiedId === record.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Investigation Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[#182629] dark:text-[#E8E6DC] bg-[#F3F1E9] dark:bg-[#101A1D] px-2 py-0.5 rounded border border-[#D9DED7] dark:border-[#304144] text-[11px]">
                          {record.type}
                        </span>
                      </td>

                      {/* Risk Level & Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isCrit ? 'rose' : isH ? 'amber' : isG ? 'copper' : 'emerald'}
                            size="sm"
                            hasDot
                          >
                            {record.riskLevel.toUpperCase()}
                          </Badge>
                          <span
                            className={`font-bold ${
                              isCrit
                                ? 'text-rose-400'
                                : isH
                                ? 'text-amber-400'
                                : isG
                                ? 'text-[#C47A52]'
                                : 'text-emerald-400'
                            }`}
                          >
                            {record.riskScore}/100
                          </span>
                        </div>
                      </td>

                      {/* Campaign / MITRE */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <span className="text-[#C47A52] truncate block text-[11px]" title={record.campaign}>
                          {record.campaign || 'N/A'}
                        </span>
                        <span className="text-slate-500 text-[10px] truncate block" title={record.mitreTactic}>
                          {record.mitreTactic?.split(' ')[0] || 'N/A'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded ${
                            record.status === 'verified'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : record.status === 'mitigated'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : record.status === 'active'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {record.timestamp}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReport(record)}
                          leftIcon={<Eye className="w-3.5 h-3.5 text-cyan-400" />}
                        >
                          View Dossier
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
            <div className="text-slate-400">
              Showing <strong className="text-slate-200">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-slate-200">
                {Math.min(currentPage * pageSize, sortedRecords.length)}
              </strong>{' '}
              of <strong className="text-cyan-300">{sortedRecords.length}</strong> investigations
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="px-3 py-1 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#A95636] dark:text-[#C47A52] font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
