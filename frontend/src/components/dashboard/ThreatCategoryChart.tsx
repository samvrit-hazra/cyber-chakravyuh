import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/index.ts';
import { mockCategoryDistribution } from '../../utils/dashboardMockData.ts';

export function ThreatCategoryChart() {
  const hasData = mockCategoryDistribution && mockCategoryDistribution.length > 0;

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Threat Category Distribution</CardTitle>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Taxonomy of detected attacks by adversarial vector
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-[#A95636] dark:text-[#C47A52] font-semibold">
            {mockCategoryDistribution.length} Active Categories
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 space-y-3.5">
        {!hasData ? (
          <div className="py-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs">
            No categorized threat incidents recorded in database.
          </div>
        ) : (
          mockCategoryDistribution.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#182629] dark:text-[#E8E6DC] font-medium">{item.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#647477] dark:text-[#A6B3AE]">{item.count} detections</span>
                  <span className="font-bold" style={{ color: item.color }}>
                    {item.percent}%
                  </span>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-[#EAECE6] dark:bg-[#101A1D] overflow-hidden border border-[#D9DED7] dark:border-[#304144]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
