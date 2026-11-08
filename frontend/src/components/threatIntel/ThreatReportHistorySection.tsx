import { useState } from 'react';
import { FileText, Search, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { MOCK_THREAT_REPORTS } from '../../utils/threatIntelligenceData.ts';

interface ThreatReportHistorySectionProps {
  onSelectReportHash?: (hash: string) => void;
}

export function ThreatReportHistorySection({ onSelectReportHash }: ThreatReportHistorySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = MOCK_THREAT_REPORTS.filter((rep) => {
    const q = searchQuery.toLowerCase();
    return (
      rep.title.toLowerCase().includes(q) ||
      rep.targetDomain.toLowerCase().includes(q) ||
      rep.campaignName.toLowerCase().includes(q) ||
      rep.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            HISTORICAL INTELLIGENCE REPOSITORY
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <FileText className="w-5 h-5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Published Incident Dossiers</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({filteredReports.length} Dossiers)
            </span>
          </h3>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#647477] dark:text-[#A6B3AE]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report ID, domain or campaign..."
            className="pl-9 pr-3 py-1.5 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] w-64"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="py-8 text-center font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
          No published incident dossiers found in repository. Completed investigations will archive here.
        </div>
      ) : (
        <div className="space-y-3.5 font-mono text-xs">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 hover:border-[#356D68]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                    {report.threatSeverity}
                  </span>
                  <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{report.id}</span>
                  <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] text-sm">{report.title}</h4>
                </div>

                <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">{report.timestamp}</span>
              </div>

              <p className="text-[#647477] dark:text-[#A6B3AE] font-sans text-xs leading-relaxed">
                {report.evidenceSummary}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#D9DED7] dark:border-[#304144] text-[11px]">
                <div className="flex items-center gap-2 text-[#647477] dark:text-[#A6B3AE]">
                  <span>Domain: <strong className="text-[#182629] dark:text-[#E8E6DC]">{report.targetDomain}</strong></span>
                  <span>•</span>
                  <span>Campaign: <strong className="text-[#356D68] dark:text-[#79A99C]">{report.campaignName}</strong></span>
                </div>

                {report.onChainVerificationHash && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Attested On-Chain:</span>
                    <span className="text-[#647477] dark:text-[#A6B3AE] truncate max-w-[140px]" title={report.onChainVerificationHash}>
                      {report.onChainVerificationHash.slice(0, 10)}...
                    </span>
                    {onSelectReportHash && (
                      <button
                        type="button"
                        onClick={() => onSelectReportHash(report.onChainVerificationHash!)}
                        className="ml-1 text-[10px] text-[#A95636] dark:text-[#C47A52] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Verify</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
