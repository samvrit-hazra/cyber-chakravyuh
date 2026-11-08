import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockLayerDistribution } from '../../utils/dashboardMockData.ts';

export function ThreatDistributionChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxCount = Math.max(...mockLayerDistribution.map((d) => d.count));

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Threat Distribution by Defense Layer</CardTitle>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Correlated anomaly detections across 7 Chakravyuha perimeter rings
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-[#A95636] dark:text-[#C47A52] font-semibold hidden sm:inline-block">
            Layer 1–7 Mesh
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 space-y-4">
        {/* Responsive Horizontal Bar Chart */}
        <div className="space-y-3">
          {mockLayerDistribution.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const barWidthPercent = (item.count / maxCount) * 100;

            return (
              <div
                key={item.layer}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="space-y-1 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span
                    className={`transition-colors truncate max-w-[200px] ${
                      isHovered ? 'text-[#A95636] dark:text-[#C47A52] font-semibold' : 'text-[#182629] dark:text-[#E8E6DC]'
                    }`}
                  >
                    {item.layer}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#647477] dark:text-[#A6B3AE]">{item.count} hits</span>
                    <span
                      className="font-bold text-[11px]"
                      style={{ color: item.color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[#EAECE6] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${barWidthPercent}%`,
                      backgroundColor: item.color,
                      boxShadow: isHovered ? `0 0 10px ${item.color}` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-[#647477] dark:text-[#A6B3AE] font-mono border-t border-[#D9DED7] dark:border-[#304144]">
          <span>Continuous heuristics validation</span>
          <span className="text-[#36745F] dark:text-[#79B69A] font-semibold">100% telemetry synced</span>
        </div>
      </CardContent>
    </Card>
  );
}
