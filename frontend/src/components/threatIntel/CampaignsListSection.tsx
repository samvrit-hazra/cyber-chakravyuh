import { ShieldAlert, Crosshair, Terminal, Clock } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '../../utils/threatIntelligenceData.ts';

export function CampaignsListSection() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-700 dark:text-rose-400 font-bold">
            ADVERSARIAL CAMPAIGN TRACKER
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Active Phishing & Fraud Operations</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({MOCK_CAMPAIGNS.length} Monitored Campaigns)
            </span>
          </h3>
        </div>

        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
          MOCK_CAMPAIGNS.length > 0
            ? 'bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/30 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
        }`}>
          {MOCK_CAMPAIGNS.length > 0 ? 'ALL CAMPAIGNS ACTIVE' : 'NO ACTIVE CAMPAIGNS'}
        </span>
      </div>

      {MOCK_CAMPAIGNS.length === 0 ? (
        <div className="py-10 text-center font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
          No active adversarial campaigns detected. Threat telemetry streams are clean.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
        {MOCK_CAMPAIGNS.map((camp) => (
          <div
            key={camp.id}
            className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3.5 hover:border-rose-500/40 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC] flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  {camp.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-500/30 uppercase font-bold">
                  {camp.status}
                </span>
              </div>

              {camp.threatActorGroup && (
                <div className="text-[11px] text-[#356D68] dark:text-[#79A99C]">
                  Actor: <strong className="text-[#182629] dark:text-[#E8E6DC]">{camp.threatActorGroup}</strong>
                </div>
              )}

              <p className="text-[#647477] dark:text-[#A6B3AE] font-sans text-xs leading-relaxed">
                {camp.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#D9DED7] dark:border-[#304144] text-[11px]">
              <div>
                <span className="text-[#647477] dark:text-[#A6B3AE] block">Target Sector:</span>
                <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{camp.targetSector}</span>
              </div>

              <div>
                <span className="text-[#647477] dark:text-[#A6B3AE] block">Impersonated Brands:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {camp.targetedBrands.map((b) => (
                    <span key={b} className="px-1.5 py-0.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#356D68] dark:text-[#79A99C] text-[10px]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#647477] dark:text-[#A6B3AE] block">MITRE ATT&CK Tactics:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {camp.tactics.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-white dark:bg-[#19272A] border border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52] text-[10px]">
                      <Terminal className="w-2.5 h-2.5 inline mr-1" />
                      {t.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[#647477] dark:text-[#A6B3AE] pt-1 text-[10px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Seen: {camp.firstSeen}
                </span>
                <span className="text-rose-700 dark:text-rose-400 font-bold">
                  {camp.activeDomainsCount} Domains • {camp.totalIocCount} IOCs
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
