import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { ThreatApiService } from '../../services/threatApi.ts';

interface ThreatCategoryChartProps {
  categories?: Array<{ category: string; count: number; percentage: number }>;
}

const CATEGORY_COLORS = [
  '#A95636', // Terracotta
  '#B64B46', // Rose Crimson
  '#356D68', // Deep Sage
  '#A87532', // Amber
  '#79A99C', // Soft Sage
  '#5B7E84', // Slate Teal
  '#8E6C88', // Muted Plum
];

export function ThreatCategoryChart({ categories: initialCategories }: ThreatCategoryChartProps) {
  const [categories, setCategories] = useState<Array<{ category: string; count: number; percentage: number }>>(
    initialCategories || []
  );

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
      return;
    }

    let mounted = true;
    ThreatApiService.getThreatDistribution()
      .then((data) => {
        if (mounted && data.threat_categories) {
          setCategories(data.threat_categories);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [initialCategories]);

  const hasData = categories && categories.length > 0;

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Threat Category Distribution</CardTitle>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Taxonomy of detected attacks by adversarial vector from live feeds
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-[#A95636] dark:text-[#C47A52] font-semibold">
            {categories.length} Active Categories
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 space-y-3.5">
        {!hasData ? (
          <div className="py-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs">
            No categorized threat incidents recorded in database.
          </div>
        ) : (
          categories.map((item, idx) => {
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

            return (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#647477] dark:text-[#A6B3AE]">{item.count} indicators</span>
                    <span className="font-bold" style={{ color }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#EAECE6] dark:bg-[#101A1D] overflow-hidden border border-[#D9DED7] dark:border-[#304144]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
