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
          <Search className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search submitted URL, incident ID, campaign, category..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#19272A] text-xs text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] border border-[#D9DED7] dark:border-[#304144] focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] font-mono transition-all"
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
      <div className="overflow-hidden rounded-xl border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] shadow-sm dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] uppercase font-mono tracking-wider">
                <th className="p-3.5 font-semibold">Incident ID & URL</th>
                <th className="p-3.5 font-semibold">Investigation Type</th>
                <th className="p-3.5 font-semibold">Risk Level</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Timestamp</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DED7] dark:divide-[#304144]">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono">
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
                    ? 'copper'
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
                      className="hover:bg-[#EAECE6] dark:hover:bg-[#223336] transition-colors group cursor-pointer"
                      onClick={() => onViewReport(record)}
                    >
                      {/* URL & ID */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#A95636] dark:text-[#C47A52] text-xs">
                              {record.id}
                            </span>
                            <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-mono truncate max-w-[120px]">
                              {record.threatCategory}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 max-w-sm">
                            <span className="text-[#182629] dark:text-[#E8E6DC] font-mono truncate text-xs group-hover:text-[#A95636] dark:group-hover:text-[#C47A52]">
                              {record.url}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(record.url, record.id);
                              }}
                              className="text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] transition-colors p-0.5 cursor-pointer"
                              title="Copy URL"
                            >
                              {copiedId === record.id ? (
                                <Check className="w-3 h-3 text-[#36745F] dark:text-[#79B69A]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-3.5 font-mono text-[#647477] dark:text-[#A6B3AE]">
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
                                ? 'text-[#B64B46] dark:text-[#E17B70]'
                                : isHigh
                                ? 'text-[#A87532] dark:text-[#D7AA61]'
                                : 'text-[#36745F] dark:text-[#79B69A]'
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
                      <td className="p-3.5 font-mono text-xs text-[#647477] dark:text-[#A6B3AE] whitespace-nowrap">
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
          <div className="flex items-center justify-between p-3.5 border-t border-[#D9DED7] dark:border-[#304144] bg-[#EAECE6] dark:bg-[#223336] text-xs font-mono">
            <span className="text-[#647477] dark:text-[#A6B3AE]">
              Showing <strong className="text-[#182629] dark:text-[#E8E6DC]">{paginatedRecords.length}</strong> of{' '}
              <strong className="text-[#182629] dark:text-[#E8E6DC]">{filteredRecords.length}</strong> records
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
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold px-2">
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
