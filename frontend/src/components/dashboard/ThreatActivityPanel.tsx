import { useState, useEffect } from 'react';
import { Radio, Globe, Tag, Clock, ArrowRight, ShieldAlert, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../common/index.ts';
import { ThreatApiService } from '../../services/threatApi.ts';

interface ThreatActivityPanelProps {
  onInvestigateDomain?: (domain: string) => void;
}

interface ThreatIndicatorItem {
  ioc: string;
  ioc_type: string;
  threat_type: string;
  malware_family?: string;
  confidence: number;
  source: string;
  source_id?: string;
  defense_layer: string;
  ingested_at: string;
  tags: string[];
}

export function ThreatActivityPanel({ onInvestigateDomain }: ThreatActivityPanelProps) {
  const [items, setItems] = useState<ThreatIndicatorItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = ['all', 'phishing', 'c2', 'botnet', 'credential_harvesting'];

  const loadStream = (category?: string, search?: string) => {
    setIsLoading(true);
    ThreatApiService.getThreatStream({
      limit: 50,
      category: category && category !== 'all' ? category : undefined,
      search: search?.trim() ? search.trim() : undefined,
    })
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.error('Error loading threat stream:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadStream(filterCategory, searchQuery);
  }, [filterCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStream(filterCategory, searchQuery);
  };

  return (
    <Card variant="default" className="p-5 flex flex-col justify-between">
      <CardHeader className="p-0 pb-4 border-b border-[#D9DED7] dark:border-[#304144]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-[#182629] dark:text-[#E8E6DC]">Live Adversary Threat Activity</CardTitle>
              <Badge variant="cyan" size="sm">
                IOC STREAM
              </Badge>
            </div>
            <CardDescription className="text-xs text-[#647477] dark:text-[#A6B3AE]">
              Correlated suspicious domains, reported threat campaigns, and category indicators from live threat feeds
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52] shrink-0 animate-pulse" />
            <span className="text-[#647477] dark:text-[#A6B3AE]">
              {items.length} Synchronized IOCs
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          {/* Category Pill Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors whitespace-nowrap cursor-pointer uppercase font-bold ${
                  filterCategory === cat
                    ? 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52] border border-[#A95636] dark:border-[#C47A52]'
                    : 'bg-[#EAECE6] dark:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
                }`}
              >
                {cat === 'all' ? 'All Feeds' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by IOC or malware..."
              className="w-full pl-8 pr-3 py-1 rounded-md bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[11px] font-mono text-[#182629] dark:text-[#E8E6DC] focus:outline-hidden focus:border-[#A95636]"
            />
            <Search className="w-3.5 h-3.5 text-[#647477] dark:text-[#A6B3AE] absolute left-2.5 top-2" />
          </form>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs animate-pulse">
            Querying local threat intelligence store & live feeds...
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-[#647477] dark:text-[#A6B3AE] font-mono text-xs">
            No adversary threat activity matching filters logged in stream.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const isHighConfidence = item.confidence >= 90;

              return (
                <div
                  key={`${item.source}-${item.ioc}-${idx}`}
                  className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] transition-all flex flex-col justify-between space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#B64B46] dark:text-[#E17B70] flex items-center gap-1 break-all">
                          <Globe className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52] shrink-0" />
                          <span className="truncate max-w-[260px] sm:max-w-[320px]">{item.ioc}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="text-[#A95636] dark:text-[#C47A52] font-semibold flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#A95636] dark:text-[#C47A52]" />
                          {item.malware_family || item.threat_type}
                        </span>
                        <span className="text-[#647477] dark:text-[#A6B3AE]">•</span>
                        <span className="text-[#356D68] dark:text-[#79A99C] font-semibold">{item.source}</span>
                      </div>
                    </div>

                    <Badge variant={isHighConfidence ? 'rose' : 'amber'} size="sm">
                      {item.confidence}% CONF
                    </Badge>
                  </div>

                  {/* Defense Ring & Ingestion Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#D9DED7]/50 dark:border-[#304144]/60 text-[10px] font-mono">
                    <span className="text-[#647477] dark:text-[#A6B3AE] flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-[#356D68] dark:text-[#79A99C]" />
                      {item.defense_layer}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[#647477] dark:text-[#A6B3AE] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.ingested_at ? new Date(item.ingested_at).toLocaleTimeString() : 'Live'}
                      </span>

                      {onInvestigateDomain && (
                        <button
                          type="button"
                          onClick={() => onInvestigateDomain(item.ioc)}
                          className="inline-flex items-center gap-1 text-[#A95636] dark:text-[#C47A52] font-bold hover:underline"
                        >
                          <span>Deep Scan</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
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
