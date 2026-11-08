import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { ThreatApiService } from '../../services/threatApi.ts';

interface ThreatDistributionChartProps {
  defenseMesh?: Array<{ layer: string; name: string; count: number; percentage: number }>;
}

export function ThreatDistributionChart({ defenseMesh: initialMesh }: ThreatDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [defenseMesh, setDefenseMesh] = useState<
    Array<{ layer: string; name: string; count: number; percentage: number }>
  >(initialMesh || []);

  useEffect(() => {
    if (initialMesh && initialMesh.length > 0) {
      setDefenseMesh(initialMesh);
      return;
    }

    let mounted = true;
    ThreatApiService.getThreatDistribution()
      .then((data) => {
        if (mounted && data.defense_mesh) {
          setDefenseMesh(data.defense_mesh);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [initialMesh]);

  const hasData = defenseMesh && defenseMesh.length > 0;
  const maxCount = hasData ? Math.max(...defenseMesh.map((d) => d.count), 1) : 1;

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
            {defenseMesh.map((item, idx) => {
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
                      className={`transition-colors truncate max-w-[220px] ${
                        isHovered ? 'text-[#A95636] dark:text-[#C47A52] font-semibold' : 'text-[#182629] dark:text-[#E8E6DC]'
                      }`}
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#647477] dark:text-[#A6B3AE] font-mono">{item.count} detections</span>
                      <span className="text-[#356D68] dark:text-[#79A99C] font-mono font-bold w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#EAECE6] dark:bg-[#101A1D] overflow-hidden border border-[#D9DED7] dark:border-[#304144]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHovered
                          ? 'bg-[#A95636] dark:bg-[#C47A52]'
                          : 'bg-[#356D68] dark:bg-[#79A99C]'
                      }`}
                      style={{
                        width: `${Math.max(5, (item.count / maxCount) * 100)}%`,
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
