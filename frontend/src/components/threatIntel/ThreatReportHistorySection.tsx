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
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            HISTORICAL INTELLIGENCE REPOSITORY
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Published Incident Dossiers</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({filteredReports.length} Dossiers)
            </span>
          </h3>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report ID, domain or campaign..."
            className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 font-mono text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 w-64"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3.5 font-mono text-xs">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2.5 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {report.threatSeverity}
                </span>
                <span className="text-cyan-400 font-bold">{report.id}</span>
                <h4 className="font-bold text-slate-100 text-sm">{report.title}</h4>
              </div>

              <span className="text-[11px] text-slate-400">{report.timestamp}</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {report.evidenceSummary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px]">
              <div className="flex items-center gap-2 text-slate-400">
                <span>Domain: <strong className="text-slate-200">{report.targetDomain}</strong></span>
                <span>•</span>
                <span>Campaign: <strong className="text-cyan-300">{report.campaignName}</strong></span>
              </div>

              {report.onChainVerificationHash && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Attested On-Chain:</span>
                  <span className="text-slate-400 truncate max-w-[140px]" title={report.onChainVerificationHash}>
                    {report.onChainVerificationHash.slice(0, 10)}...
                  </span>
                  {onSelectReportHash && (
                    <button
                      type="button"
                      onClick={() => onSelectReportHash(report.onChainVerificationHash!)}
                      className="text-cyan-400 hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                    >
                      <span>Verify</span>
                      <LinkIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

