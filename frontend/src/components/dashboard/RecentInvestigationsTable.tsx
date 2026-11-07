import { useState, useMemo } from 'react';
import { Search, Eye, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge, Button, Dropdown } from '../common/index.ts';
import type { InvestigationRecord } from '../../types/dashboard.ts';

interface RecentInvestigationsTableProps {
  records: InvestigationRecord[];
  onViewReport: (record: InvestigationRecord) => void;
}

export function RecentInvestigationsTable({
  records,
  onViewReport,
}: RecentInvestigationsTableProps) {
  const [query, setQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesQuery =
        !query.trim() ||
        r.url.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.threatCategory.toLowerCase().includes(query.toLowerCase()) ||
        (r.campaign && r.campaign.toLowerCase().includes(query.toLowerCase()));

      const matchesRisk = selectedRisk === 'all' || r.riskLevel === selectedRisk;
      const matchesType = selectedType === 'all' || r.type === selectedType;

      return matchesQuery && matchesRisk && matchesType;
    });
  }, [records, query, selectedRisk, selectedType]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search submitted URL, incident ID, campaign, category..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0b152d]/90 text-xs text-slate-200 placeholder-slate-500 border border-cyan-500/20 focus:outline-none focus:border-cyan-400 font-mono transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Risk Level Filter Dropdown */}
          <div className="w-36">
            <Dropdown
              selectedId={selectedRisk}
              onSelect={(item) => {
                setSelectedRisk(item.id);
                setCurrentPage(1);
              }}
              items={[
                { id: 'all', label: 'All Risks' },
                { id: 'critical', label: 'Critical' },
                { id: 'high', label: 'High Threat' },
                { id: 'guarded', label: 'Guarded' },
                { id: 'low', label: 'Low Risk' },
              ]}
            />
          </div>

          {/* Type Filter Dropdown */}
          <div className="w-44">
            <Dropdown
              selectedId={selectedType}
              onSelect={(item) => {
                setSelectedType(item.id);
                setCurrentPage(1);
              }}
              items={[
                { id: 'all', label: 'All Vectors' },
                { id: 'URL Analysis', label: 'URL Analysis' },
                { id: 'Scam Detection', label: 'Scam Detection' },
                { id: 'TLS Intelligence', label: 'TLS Intelligence' },
                { id: 'Website Security', label: 'Website Security' },
                { id: 'Threat Intelligence', label: 'Threat Intelligence' },
                { id: 'Blockchain Attestation', label: 'Blockchain Attestation' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Cyber Table Frame */}
      <div className="overflow-hidden rounded-xl border border-cyan-500/15 bg-[#0b152d]/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#070d1e]/90 text-slate-400 uppercase font-mono tracking-wider">
                <th className="p-3.5 font-semibold">Incident ID & URL</th>
                <th className="p-3.5 font-semibold">Investigation Type</th>
                <th className="p-3.5 font-semibold">Risk Level</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Timestamp</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    No matching investigation records found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const isCritical = record.riskLevel === 'critical';
                  const isHigh = record.riskLevel === 'high';
                  const isGuarded = record.riskLevel === 'guarded';

                  const badgeVariant = isCritical
                    ? 'rose'
                    : isHigh
                    ? 'amber'
                    : isGuarded
                    ? 'purple'
                    : 'emerald';

                  const statusBadgeVariant =
                    record.status === 'verified'
                      ? 'emerald'
                      : record.status === 'mitigated'
                      ? 'cyan'
                      : record.status === 'active'
                      ? 'rose'
                      : 'amber';

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onViewReport(record)}
                    >
                      {/* URL & ID */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-cyan-400 text-xs">
                              {record.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                              {record.threatCategory}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 max-w-sm">
                            <span className="text-slate-200 font-mono truncate text-xs group-hover:text-cyan-200">
                              {record.url}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(record.url, record.id);
                              }}
                              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 cursor-pointer"
                              title="Copy URL"
                            >
                              {copiedId === record.id ? (
                                <Check className="w-3 h-3 text-cyan-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-3.5 font-mono text-slate-300">
                        <span className="text-xs">{record.type}</span>
                      </td>

                      {/* Risk Level */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 font-mono">
                          <Badge variant={badgeVariant} size="sm" hasDot={isCritical}>
                            {record.riskLevel.toUpperCase()}
                          </Badge>
                          <span
                            className={`text-xs font-bold ${
                              isCritical
                                ? 'text-rose-400'
                                : isHigh
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {record.riskScore}/100
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <Badge variant={statusBadgeVariant} size="sm">
                          {record.status.toUpperCase()}
                        </Badge>
                      </td>

                      {/* Timestamp */}
                      <td className="p-3.5 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {record.timestamp}
                      </td>

                      {/* View Report */}
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onViewReport(record)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          View Report
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3.5 border-t border-white/[0.06] bg-[#070d1e]/90 text-xs font-mono">
            <span className="text-slate-400">
              Showing <strong className="text-slate-200">{paginatedRecords.length}</strong> of{' '}
              <strong className="text-slate-200">{filteredRecords.length}</strong> records
            </span>

            <div className="flex items-center gap-2">
              <Button
                size="xs"
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <span className="text-slate-300 font-bold px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                size="xs"
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
