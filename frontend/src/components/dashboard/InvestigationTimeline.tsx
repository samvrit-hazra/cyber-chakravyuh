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
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Recent Investigation Timeline</CardTitle>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Live sequential stream of analyzed targets and heuristic determinations
            </CardDescription>
          </div>
          <Badge variant="copper" size="sm" hasDot pulseDot>
            LIVE STREAM
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4">
        {recentEvents.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
            No recent investigations logged. Initiated scans will populate this timeline.
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#A95636]/50 before:via-[#C47A52]/40 before:to-[#36745F]/50">
            {recentEvents.map((event) => {
              const isCritical = event.riskLevel === 'critical';
              const isHigh = event.riskLevel === 'high';

              return (
                <div key={event.id} className="relative group">
                  {/* Node dot on line */}
                  <div
                    className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#19272A] transition-all group-hover:scale-125 ${
                      isCritical
                        ? 'bg-[#B64B46] dark:bg-[#E17B70] shadow-sm'
                        : isHigh
                        ? 'bg-[#A87532] dark:bg-[#D7AA61] shadow-sm'
                        : 'bg-[#36745F] dark:bg-[#79B69A] shadow-sm'
                    }`}
                  />

                  <div className="p-3 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#A95636] dark:text-[#C47A52]">
                          {event.id}
                        </span>
                        <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-mono flex items-center gap-1">
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

                      <p className="text-xs font-mono text-[#182629] dark:text-[#E8E6DC] truncate max-w-sm">
                        {event.url}
                      </p>
                      <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] truncate max-w-md">
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
        )}
      </CardContent>
    </Card>
  );
}
