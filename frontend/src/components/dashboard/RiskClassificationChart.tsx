import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockRiskClassification } from '../../utils/dashboardMockData.ts';

export function RiskClassificationChart() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const total = (mockRiskClassification || []).reduce((sum, item) => sum + item.count, 0);

  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segmentsWithRotation = useMemo(() => {
    if (!mockRiskClassification || mockRiskClassification.length === 0) return [];
    return mockRiskClassification.map((seg, idx) => {
      const priorSum = mockRiskClassification.slice(0, idx).reduce((s, item) => s + item.percentage, 0);
      const rotation = (priorSum / 100) * 360;
      const dashoffset = circumference - (seg.percentage / 100) * circumference;
      return { ...seg, rotation, dashoffset };
    });
  }, [circumference]);

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Risk Classification Breakdown</CardTitle>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Distribution of categorized security findings
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-[#36745F] dark:text-[#79B69A] font-semibold">
            {total} Audited
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {total === 0 ? (
          <div className="w-full py-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs">
            0 categorized findings. Run an investigation to generate risk telemetry.
          </div>
        ) : (
          <>
            <div className="relative flex items-center justify-center shrink-0">
              <svg width={size} height={size} className="transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-[#EAECE6] dark:text-[#101A1D]"
                />
                {segmentsWithRotation.map((seg, idx) => (
                  <circle
                    key={seg.level}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={activeSegment === idx ? strokeWidth + 3 : strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={seg.dashoffset}
                    style={{
                      transformOrigin: 'center',
                      transform: `rotate(${seg.rotation}deg)`,
                      transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                      opacity: activeSegment === null || activeSegment === idx ? 1 : 0.6,
                    }}
                    onMouseEnter={() => setActiveSegment(idx)}
                    onMouseLeave={() => setActiveSegment(null)}
                    className="cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            <div className="w-full space-y-2 font-mono text-xs">
              {mockRiskClassification.map((item, idx) => (
                <div
                  key={item.level}
                  onMouseEnter={() => setActiveSegment(idx)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    activeSegment === idx ? 'bg-[#EAECE6] dark:bg-[#223336]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#182629] dark:text-[#E8E6DC]">{item.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#647477] dark:text-[#A6B3AE]">{item.count}</span>
                    <span className="font-bold text-[#182629] dark:text-[#E8E6DC]">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
