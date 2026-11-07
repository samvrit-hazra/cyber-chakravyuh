import { Globe, ArrowRight, ShieldAlert } from 'lucide-react';
import { MOCK_MALICIOUS_DOMAINS, MOCK_RELATED_URLS } from '../../utils/threatIntelligenceData.ts';

interface MaliciousDomainsSectionProps {
  onInvestigateDomain?: (domain: string) => void;
}

export function MaliciousDomainsSection({ onInvestigateDomain }: MaliciousDomainsSectionProps) {
  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            REPORTED MALICIOUS DOMAINS & INGRESS PATHS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Active Adversary Infrastructure Fleet</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({MOCK_MALICIOUS_DOMAINS.length} Hostile Domains)
            </span>
          </h3>
        </div>
      </div>

      {/* Malicious Domains Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-[11px]">
              <th className="py-2.5 px-3 font-semibold">HOSTILE DOMAIN</th>
              <th className="py-2.5 px-3 font-semibold">THREAT CATEGORY</th>
              <th className="py-2.5 px-3 font-semibold">RISK SCORE</th>
              <th className="py-2.5 px-3 font-semibold">IP & BULLETPROOF ASN</th>
              <th className="py-2.5 px-3 font-semibold">PARENT CAMPAIGN</th>
              <th className="py-2.5 px-3 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_MALICIOUS_DOMAINS.map((domain) => (
              <tr key={domain.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    <span className="font-bold text-slate-100">{domain.domain}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-0.5">Registrar: {domain.registrar}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[11px]">
                    {domain.threatCategory}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-rose-400">
                  {domain.riskScore}/100
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200">{domain.ipAddress}</div>
                  <div className="text-[10px] text-slate-500">{domain.asnNumber} • {domain.asnOrg}</div>
                </td>
                <td className="py-3 px-3 text-cyan-300">
                  {domain.associatedCampaignName}
                </td>
                <td className="py-3 px-3 text-right">
                  {onInvestigateDomain && (
                    <button
                      type="button"
                      onClick={() => onInvestigateDomain(domain.domain)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Related Suspicious URLs Sub-Panel */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
        <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Related Suspicious URLs & Weaponized Landing Endpoints ({MOCK_RELATED_URLS.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOCK_RELATED_URLS.map((rel) => (
            <div key={rel.id} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {rel.detectionType}
                </span>
                <span className="text-[10px] text-slate-400">Confidence: {rel.confidence}%</span>
              </div>
              <div className="p-2 rounded bg-black/50 text-cyan-300 break-all select-all text-[11px]">
                {rel.url}
              </div>
              {rel.redirectTarget && (
                <div className="text-[10px] text-amber-300 italic">
                  Redirects to: {rel.redirectTarget}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

