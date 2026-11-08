import { useState, useEffect } from 'react';
import {
  Clock,
  Search,
  Trash2,
  ExternalLink,
  X,
} from 'lucide-react';
import { ScanHistoryService, type SavedScanRecord } from '../../services/scanHistoryService.ts';
import { RiskBadge } from './RiskBadge.tsx';

interface ScanHistoryViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (url: string) => void;
}

export function ScanHistoryView({ isOpen, onClose, onSelectScan }: ScanHistoryViewProps) {
  const [history, setHistory] = useState<SavedScanRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      setHistory(ScanHistoryService.getHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = ScanHistoryService.deleteScan(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (confirm('Clear all local scan history?')) {
      ScanHistoryService.clearHistory();
      setHistory([]);
    }
  };

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.url.toLowerCase().includes(search.toLowerCase()) ||
      item.domain.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' || item.riskClassification.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <div>
              <h3 className="font-bold text-base font-heading text-[#182629] dark:text-[#E8E6DC]">
                Investigation History
              </h3>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Locally cached investigations. Zero server retention.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs text-[#B64B46] dark:text-[#E17B70] hover:bg-[#B64B46]/10 dark:hover:bg-[#E17B70]/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-mono"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] hover:bg-[#EAECE6] dark:hover:bg-[#293A3C] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3.5 bg-[#F3F1E9] dark:bg-[#101A1D] border-b border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 flex items-center bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] rounded-xl px-3 py-1.5 text-xs">
            <Search className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by URL or hostname..."
              className="w-full bg-transparent text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-1 text-xs font-mono">
            {['all', 'malicious', 'suspicious', 'clean'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-[#A95636] dark:bg-[#C47A52] text-white font-bold'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:bg-[#D9DED7] dark:hover:bg-[#293A3C]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#647477] dark:text-[#A6B3AE] font-mono">
              {search || filter !== 'all'
                ? 'No past investigations match the query.'
                : 'No investigations conducted yet. Enter a URL above to perform a scan.'}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectScan(item.url);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <RiskBadge classification={item.riskClassification} size="sm" />
                    <span className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                      Score: <strong className="text-[#182629] dark:text-[#E8E6DC]">{item.riskScore}/100</strong>
                    </span>
                    <span className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">• {item.timestamp}</span>
                  </div>
                  <p className="text-xs font-mono text-[#182629] dark:text-[#E8E6DC] truncate font-medium">
                    {item.url}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete record"
                    className="p-1.5 rounded-lg text-[#647477] dark:text-[#A6B3AE] hover:text-[#B64B46] dark:hover:text-[#E17B70] hover:bg-[#EAECE6] dark:hover:bg-[#293A3C] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ExternalLink className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] group-hover:text-[#A95636] dark:group-hover:text-[#C47A52] transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
