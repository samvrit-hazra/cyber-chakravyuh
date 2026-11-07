import { ShieldAlert, Crosshair, Terminal, Clock } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '../../utils/threatIntelligenceData.ts';

export function CampaignsListSection() {
  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
            ADVERSARIAL CAMPAIGN TRACKER
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Active Phishing & Fraud Operations</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({MOCK_CAMPAIGNS.length} Monitored Campaigns)
            </span>
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-500/15 border border-rose-500/40 text-rose-300">
          ALL CAMPAIGNS ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
        {MOCK_CAMPAIGNS.map((camp) => (
          <div
            key={camp.id}
            className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-3.5 hover:border-rose-500/30 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-rose-400" />
                  {camp.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold">
                  {camp.status}
                </span>
              </div>

              {camp.threatActorGroup && (
                <div className="text-[11px] text-cyan-300">
                  Actor: <strong className="text-slate-200">{camp.threatActorGroup}</strong>
                </div>
              )}

              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {camp.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-slate-400 block">Target Sector:</span>
                <span className="text-slate-200 font-bold">{camp.targetSector}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Impersonated Brands:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {camp.targetedBrands.map((b) => (
                    <span key={b} className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-cyan-300 text-[10px]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block">MITRE ATT&CK Tactics:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {camp.tactics.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900 border border-purple-500/20 text-purple-300 text-[10px]">
                      <Terminal className="w-2.5 h-2.5 inline mr-1" />
                      {t.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-500 pt-1 text-[10px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Seen: {camp.firstSeen}
                </span>
                <span className="text-rose-400 font-bold">
                  {camp.activeDomainsCount} Domains • {camp.totalIocCount} IOCs
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

