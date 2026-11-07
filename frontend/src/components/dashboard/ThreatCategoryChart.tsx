import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockCategoryDistribution } from '../../utils/dashboardMockData.ts';

export function ThreatCategoryChart() {
  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-white">Threat Category Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Taxonomy of detected attacks by adversarial vector
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-purple-400 font-semibold">
            6 Vector Tiers
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2 space-y-3.5">
        {mockCategoryDistribution.map((item) => (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">{item.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{item.count} detections</span>
                <span className="font-bold" style={{ color: item.color }}>
                  {item.percent}%
                </span>
              </div>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Primary Threat Vector: Credential Phishing (36%)</span>
          <span className="text-emerald-400">Adversary Mitigation Rate: 98.4%</span>
        </div>
      </CardContent>
    </Card>
  );
}

