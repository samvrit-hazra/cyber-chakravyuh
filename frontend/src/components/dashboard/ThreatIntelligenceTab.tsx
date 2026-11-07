import { AlertTriangle } from 'lucide-react';
import { Card, Badge } from '../common/index.ts';
import {
  ThreatRelationshipGraph,
  CampaignsListSection,
  MaliciousDomainsSection,
  RepeatedIndicatorsSection,
  ImpersonationPatternsSection,
  ThreatReportHistorySection,
} from '../threatIntel/index.ts';

interface ThreatIntelligenceTabProps {
  onInvestigateDomain?: (domain: string) => void;
  onSelectReportHash?: (hash: string) => void;
}

export function ThreatIntelligenceTab({
  onInvestigateDomain,
  onSelectReportHash,
}: ThreatIntelligenceTabProps) {
  return (
    <div className="space-y-6">
      {/* Module A Header */}
      <Card variant="glass" className="p-6 border-rose-500/30 bg-[#070d1e]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              GLOBAL THREAT INTELLIGENCE & CORROBORATED NEXUS (MODULE A)
            </h3>
            <p className="text-xs text-slate-400">
              Active phishing campaigns, hostile domain fleets, repeated indicator fingerprints, and evidentiary relationship graphs.
            </p>
          </div>
          <Badge variant="rose" size="sm" hasDot pulseDot>
            IOC STREAM LIVE
          </Badge>
        </div>
      </Card>

      {/* Relationship Graph connecting Domains ↔ URLs ↔ Campaigns ↔ Incidents */}
      <ThreatRelationshipGraph />

      {/* Active Phishing Campaigns */}
      <CampaignsListSection />

      {/* Reported Malicious Domains & Related URLs */}
      <MaliciousDomainsSection onInvestigateDomain={onInvestigateDomain} />

      {/* Repeated Infrastructure Indicators (Shared IPs, Bulletproof ASNs) */}
      <RepeatedIndicatorsSection />

      {/* Impersonation Patterns Taxonomy */}
      <ImpersonationPatternsSection />

      {/* Threat Report History */}
      <ThreatReportHistorySection onSelectReportHash={onSelectReportHash} />
    </div>
  );
}
