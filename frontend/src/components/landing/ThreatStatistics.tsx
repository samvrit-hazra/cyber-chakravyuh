import { Search, AlertTriangle, FileText, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Card, Badge } from '../common/index.ts';

export function ThreatStatistics() {
  const stats = [
    {
      id: 'url-investigations',
      label: 'URL Investigations',
      value: '1,420,890+',
      trend: '+18.4% this week',
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      color: 'cyan',
      description: 'URLs, hostnames, and IP ingress points analyzed across synthetic multi-vector datasets.',
      fillPercent: 88,
    },
    {
      id: 'threat-indicators',
      label: 'Threat Indicators',
      value: '58,340+',
      trend: '+12.6% active IOCs',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      color: 'amber',
      description: 'Dynamic indicators of compromise correlated via behavioral heuristics and pattern matching.',
      fillPercent: 64,
    },
    {
      id: 'security-reports',
      label: 'Security Reports',
      value: '112,650+',
      trend: '+24.1% generated',
      icon: <FileText className="w-5 h-5 text-[#C47A52]" />,
      color: 'copper',
      description: 'Cryptographically signed audit logs and explainable AI risk assessments produced.',
      fillPercent: 78,
    },
    {
      id: 'verified-threat-records',
      label: 'Verified Threat Records',
      value: '42,910+',
      trend: '99.8% precision',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'emerald',
      description: 'Ground-truth confirmed phishing sites, credential harvesters, and malicious payloads.',
      fillPercent: 94,
    },
  ];

  return (
    <section id="threat-intelligence" className="py-20 relative border-y border-[#D9DED7] dark:border-[#304144] bg-[#F3F1E9] dark:bg-[#101A1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header with Demo/Illustrative Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                SYSTEM TELEMETRY
              </Badge>
              <Badge variant="neutral" size="sm" className="border-amber-500/40 text-amber-300 bg-amber-500/10">
                ILLUSTRATIVE / DEMO METRICS
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182629] dark:text-[#E8E6DC]">
              Global Threat Activity & Telemetry
            </h2>
            <p className="text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl leading-relaxed">
              Real-time monitoring across simulated adversarial networks, synthetic benchmark sets, and heuristic AI detection clusters.
            </p>
          </div>

          {/* Illustrative Notice Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-xs text-[#647477] dark:text-[#A6B3AE] font-mono">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Illustrative benchmark values for evaluation</span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.id}
              variant="interactive"
              className="p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#A95636] dark:text-[#C47A52]">
                  {stat.icon}
                </div>
                <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stat.trend}
                </span>
              </div>

              <div>
                <p className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#182629] dark:text-[#E8E6DC] tracking-tight mt-1">
                  {stat.value}
                </p>
              </div>

              {/* Mini fill bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-[#A95636] rounded-full"
                  style={{ width: `${stat.fillPercent}%` }}
                />
              </div>

              <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-relaxed font-light">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="text-center p-3 rounded-xl bg-[#030712]/70 border border-white/5 max-w-2xl mx-auto">
          <p className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
            <strong className="text-slate-300">Notice of Illustrative Data:</strong> Numbers above represent simulated testing corpora and benchmark telemetry. No invented production metrics are represented.
          </p>
        </div>
      </div>
    </section>
  );
}

