import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockActivityTimeline } from '../../utils/dashboardMockData.ts';

export function InvestigationActivityChart() {
  if (!mockActivityTimeline || mockActivityTimeline.length === 0) {
    return (
      <Card variant="default" className="p-5 flex flex-col justify-between">
        <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Investigation Activity (24-Hour Telemetry)</CardTitle>
              <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
                Total URL scans vs. confirmed threat vectors intercepted
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#A95636] dark:text-[#C47A52]">
                <span className="w-2 h-2 rounded-full bg-[#A95636] dark:bg-[#C47A52]" /> Total Scans
              </span>
              <span className="flex items-center gap-1.5 text-[#B64B46] dark:text-[#E17B70]">
                <span className="w-2 h-2 rounded-full bg-[#B64B46] dark:bg-[#E17B70]" /> Threats Blocked
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-8 pb-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs">
          No telemetry recorded in the last 24 hours. Run an investigation to plot live activity.
        </CardContent>
      </Card>
    );
  }

  const maxVal = Math.max(...mockActivityTimeline.map((d: any) => d.investigations || d.scans || 1));
  const height = 160;
  const width = 500;
  const paddingX = 30;
  const paddingY = 20;

  const points = mockActivityTimeline.map((d: any, i) => {
    const x = paddingX + (i / (mockActivityTimeline.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.investigations || d.scans || 0) / maxVal) * (height - 2 * paddingY);
    const yThreats = height - paddingY - ((d.threatsDetected || d.threats || 0) / maxVal) * (height - 2 * paddingY) * 3;
    return { x, y, yThreats, ...d };
  });

  const polylineTotal = points.map((p) => `${p.x},${p.y}`).join(' ');
  const polylineThreats = points.map((p) => `${p.x},${p.yThreats}`).join(' ');

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Investigation Activity (24-Hour Telemetry)</CardTitle>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Total URL scans vs. confirmed threat vectors intercepted
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#A95636] dark:text-[#C47A52]">
              <span className="w-2 h-2 rounded-full bg-[#A95636] dark:bg-[#C47A52]" /> Total Scans
            </span>
            <span className="flex items-center gap-1.5 text-[#B64B46] dark:text-[#E17B70]">
              <span className="w-2 h-2 rounded-full bg-[#B64B46] dark:bg-[#E17B70]" /> Threats Blocked
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 space-y-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <polyline fill="none" stroke="#A95636" strokeWidth="2" points={polylineTotal} />
          <polyline fill="none" stroke="#B64B46" strokeWidth="2" strokeDasharray="4 4" points={polylineThreats} />
        </svg>
      </CardContent>
    </Card>
  );
}
