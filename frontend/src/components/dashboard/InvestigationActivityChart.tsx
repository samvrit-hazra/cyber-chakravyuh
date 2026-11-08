import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../common/index.ts';
import { mockActivityTimeline } from '../../utils/dashboardMockData.ts';

export function InvestigationActivityChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const maxVal = Math.max(...mockActivityTimeline.map((d) => d.investigations));
  const height = 160;
  const width = 500;
  const paddingX = 30;
  const paddingY = 20;

  // Calculate SVG points
  const points = mockActivityTimeline.map((d, i) => {
    const x = paddingX + (i / (mockActivityTimeline.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.investigations / maxVal) * (height - 2 * paddingY);
    const yThreats = height - paddingY - (d.threatsDetected / maxVal) * (height - 2 * paddingY) * 3; // scaled for visibility
    return { x, y, yThreats, ...d };
  });

  // Polyline strings
  const polylineTotal = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaTotal = `${points[0].x},${height - paddingY} ${polylineTotal} ${points[points.length - 1].x},${height - paddingY}`;

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
        {/* Responsive SVG Area Chart */}
        <div className="w-full overflow-hidden relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-44 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="copperGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C47A52" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C47A52" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle grid lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-[#D9DED7] dark:text-[#304144]" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="currentColor" className="text-[#D9DED7] dark:text-[#304144]" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" className="text-[#D9DED7] dark:text-[#304144]" />

            {/* Total Investigations Area */}
            <polygon points={areaTotal} fill="url(#copperGradient)" />
            <polyline points={polylineTotal} fill="none" stroke="#C47A52" strokeWidth="2.5" />

            {/* Threat Intercept Line */}
            <polyline points={polylineThreats} fill="none" stroke="#E17B70" strokeWidth="2" strokeDasharray="4 2" />

            {/* Interactive Data Nodes */}
            {points.map((p, idx) => (
              <g key={p.time}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === idx ? 5 : 3.5}
                  fill="#C47A52"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <circle
                  cx={p.x}
                  cy={p.yThreats}
                  r={hoveredPoint === idx ? 4.5 : 3}
                  fill="#E17B70"
                  stroke="white"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Hover Readout Tooltip */}
          {hoveredPoint !== null && (
            <div className="absolute top-2 right-2 p-2.5 rounded-xl bg-white/95 dark:bg-[#19272A]/95 border border-[#D9DED7] dark:border-[#304144] text-xs font-mono shadow-xl backdrop-blur-md z-10 space-y-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE] block font-semibold">{points[hoveredPoint].time} UTC</span>
              <div className="text-[#A95636] dark:text-[#C47A52]">
                Investigations: <strong>{points[hoveredPoint].investigations}</strong>
              </div>
              <div className="text-[#B64B46] dark:text-[#E17B70]">
                Threats Intercepted: <strong>{points[hoveredPoint].threatsDetected}</strong>
              </div>
            </div>
          )}
        </div>

        {/* X-Axis Timestamps */}
        <div className="flex justify-between text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] px-3">
          {mockActivityTimeline.map((item) => (
            <span key={item.time}>{item.time}</span>
          ))}
        </div>

        <div className="pt-2 border-t border-[#D9DED7] dark:border-[#304144] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#647477] dark:text-[#A6B3AE]">Peak Volume: 560 investigations/hr at 15:00</span>
          <Badge variant="copper" size="sm">TELEMETRY STREAM: 60fps</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
