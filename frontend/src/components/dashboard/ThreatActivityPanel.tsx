import { useState } from 'react';
import { Radio, Globe, Tag, Clock, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../common/index.ts';
import { mockThreatActivities } from '../../utils/dashboardMockData.ts';

interface ThreatActivityPanelProps {
  onInvestigateDomain?: (domain: string) => void;
}

export function ThreatActivityPanel({ onInvestigateDomain }: ThreatActivityPanelProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Credential Harvester', 'Web3 Drainer', 'Identity Impersonation', 'Malware C2 Stager', 'Banking Phish', 'Office365 Harvester'];

  const filteredItems = mockThreatActivities.filter((item) => {
    return filterCategory === 'all' || item.category === filterCategory;
  });

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-white">Live Adversary Threat Activity</CardTitle>
              <Badge variant="rose" size="sm" hasDot pulseDot>
                ACTIVE IOCS
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Correlated suspicious domains, reported threat campaigns, and category indicators
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="text-slate-400">Saptarishi Honey-Mesh Stream</span>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All Activity' : cat}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const isCritical = item.riskLevel === 'critical';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-cyan-400" />
                        {item.domain}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="text-purple-300 font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3 text-purple-400" />
                        {item.campaign}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{item.category}</span>
                    </div>
                  </div>

                  <Badge variant={isCritical ? 'rose' : 'amber'} size="sm">
                    {item.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                {/* Threat Indicators List */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {item.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/5"
                    >
                      {ind}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.timestamp}
                  </span>

                  {onInvestigateDomain && (
                    <button
                      type="button"
                      onClick={() => onInvestigateDomain(`https://${item.domain}`)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer group-hover:translate-x-0.5"
                    >
                      <span>Deep Scan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
