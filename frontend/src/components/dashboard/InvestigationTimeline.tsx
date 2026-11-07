import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '../common/index.ts';
import { mockInvestigations } from '../../utils/dashboardMockData.ts';
import type { InvestigationRecord } from '../../types/dashboard.ts';

interface InvestigationTimelineProps {
  onSelectRecord?: (record: InvestigationRecord) => void;
}

export function InvestigationTimeline({ onSelectRecord }: InvestigationTimelineProps) {
  const recentEvents = mockInvestigations.slice(0, 5);

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-white">Recent Investigation Timeline</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Live sequential stream of analyzed targets and heuristic determinations
            </CardDescription>
          </div>
          <Badge variant="cyan" size="sm" hasDot pulseDot>
            LIVE STREAM
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/50 before:via-purple-500/40 before:to-emerald-500/50">
          {recentEvents.map((event) => {
            const isCritical = event.riskLevel === 'critical';
            const isHigh = event.riskLevel === 'high';

            return (
              <div key={event.id} className="relative group">
                {/* Node dot on line */}
                <div
                  className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-[#070d1e] transition-all group-hover:scale-125 ${
                    isCritical
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : isHigh
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                      : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  }`}
                />

                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {event.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.timestamp.split(' ')[1]}
                      </span>
                      <Badge
                        variant={isCritical ? 'rose' : isHigh ? 'amber' : 'emerald'}
                        size="sm"
                        className="text-[9px] py-0 px-1.5"
                      >
                        {event.riskLevel.toUpperCase()} ({event.riskScore})
                      </Badge>
                    </div>

                    <p className="text-xs font-mono text-slate-200 truncate max-w-sm">
                      {event.url}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">
                      {event.details}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {onSelectRecord && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => onSelectRecord(event)}
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                        className="text-[11px]"
                      >
                        Inspect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
