import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockRiskClassification } from '../../utils/dashboardMockData.ts';

export function RiskClassificationChart() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const total = mockRiskClassification.reduce((sum, item) => sum + item.count, 0);

  // Calculate SVG donut segments
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Pure functional calculation of rotation offsets
  const segmentsWithRotation = useMemo(() => {
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
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-[#D9DED7] dark:stroke-[#304144]"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Segment arcs */}
            {segmentsWithRotation.map((seg, idx) => {
              const isHighlighted = activeSegment === idx;

              return (
                <circle
                  key={seg.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={isHighlighted ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={seg.dashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform={`rotate(${seg.rotation} ${size / 2} ${size / 2})`}
                  onMouseEnter={() => setActiveSegment(idx)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHighlighted ? `drop-shadow(0 0 8px ${seg.color})` : 'none',
                    opacity: activeSegment === null || activeSegment === idx ? 1 : 0.4,
                  }}
                />
              );
            })}
          </svg>

          {/* Central Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold font-mono text-[#182629] dark:text-[#E8E6DC] tracking-tight">
              {activeSegment !== null
                ? `${mockRiskClassification[activeSegment].percentage}%`
                : `${mockRiskClassification[0].percentage}%`}
            </span>
            <span className="text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE] uppercase tracking-wider">
              {activeSegment !== null
                ? mockRiskClassification[activeSegment].label.split(' ')[0]
                : 'Verified Low'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1 w-full">
          {mockRiskClassification.map((seg, idx) => {
            const isHighlighted = activeSegment === idx;
            return (
              <div
                key={seg.label}
                onMouseEnter={() => setActiveSegment(idx)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-[#EAECE6] dark:bg-[#293A3C] border border-[#D9DED7] dark:border-[#304144]'
                    : 'hover:bg-[#EAECE6]/60 dark:hover:bg-[#223336]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className={isHighlighted ? 'text-[#182629] dark:text-[#E8E6DC] font-semibold' : 'text-[#647477] dark:text-[#A6B3AE]'}>
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-[#647477] dark:text-[#A6B3AE] font-normal">{seg.count}</span>
                  <span style={{ color: seg.color }}>{seg.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
