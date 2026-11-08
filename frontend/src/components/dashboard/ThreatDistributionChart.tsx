import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockLayerDistribution } from '../../utils/dashboardMockData.ts';

export function ThreatDistributionChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hasData = mockLayerDistribution && mockLayerDistribution.length > 0;
  const maxCount = hasData ? Math.max(...mockLayerDistribution.map((d) => d.count), 1) : 1;

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
        {!hasData ? (
          <div className="py-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs">
            No layer breaches or anomalous traffic recorded across defense rings.
          </div>
        ) : (
          <div className="space-y-3">
            {mockLayerDistribution.map((item, idx) => {
              const isHovered = hoveredIndex === idx;

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
                      <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#EAECE6] dark:bg-[#101A1D] overflow-hidden border border-[#D9DED7] dark:border-[#304144]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
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
