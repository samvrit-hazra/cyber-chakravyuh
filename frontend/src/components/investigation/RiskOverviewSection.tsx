import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle, Flame, Clock, Cpu, FileCheck } from 'lucide-react';
import type { RiskClassification, UrlInvestigationResult } from '../../types/investigation.ts';

interface RiskOverviewSectionProps {
  result: UrlInvestigationResult;
}

export function RiskOverviewSection({ result }: RiskOverviewSectionProps) {
  const {
    riskClassification,
    riskScore,
    confidenceScore,
    evidenceCoverage,
    timestamp,
    durationMs,
    isDemoState,
    dataSourceLabel,
  } = result;

  // Visual styling mapped strictly to the 5 requested categories
  const getClassificationMeta = (classification: RiskClassification) => {
    switch (classification) {
      case 'Confirmed Malicious':
        return {
          bg: 'bg-[#B64B46]/10 dark:bg-[#E17B70]/15 border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]',
          accent: 'text-[#B64B46] dark:text-[#E17B70]',
          meterGradient: 'from-rose-500 via-red-600 to-rose-700',
          icon: Flame,
          badgeColor: 'border-[#B64B46]/40 bg-[#B64B46]/10 dark:bg-[#E17B70]/20 text-[#B64B46] dark:text-[#E17B70]',
          description:
            'Critical Threat: Verified malicious entity matching known phishing, credential harvesting, or malware distribution campaigns.',
        };
      case 'High Risk':
        return {
          bg: 'bg-[#A87532]/10 dark:bg-[#D7AA61]/15 border-[#A87532]/30 dark:border-[#D7AA61]/40 text-[#A87532] dark:text-[#D7AA61]',
          accent: 'text-[#A87532] dark:text-[#D7AA61]',
          meterGradient: 'from-amber-400 via-orange-500 to-red-500',
          icon: ShieldAlert,
          badgeColor: 'border-[#A87532]/40 bg-[#A87532]/10 dark:bg-[#D7AA61]/20 text-[#A87532] dark:text-[#D7AA61]',
          description:
            'High Threat: Multiple severe anomalies detected including homoglyphs, brand typosquatting, or high-risk redirect patterns.',
        };
      case 'Suspicious':
        return {
          bg: 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 border-[#A95636]/30 dark:border-[#C47A52]/40 text-[#A95636] dark:text-[#C47A52]',
          accent: 'text-[#A95636] dark:text-[#C47A52]',
          meterGradient: 'from-[#A95636] via-[#79A99C] to-indigo-600',
          icon: AlertTriangle,
          badgeColor: 'border-[#A95636]/40 bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52]',
          description:
            'Suspicious: Anomalous characteristics observed such as abnormal entropy, young domain registration, or obscured origin.',
        };
      case 'Low Risk':
        return {
          bg: 'bg-[#36745F]/10 dark:bg-[#79B69A]/15 border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A]',
          accent: 'text-[#36745F] dark:text-[#79B69A]',
          meterGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
          icon: ShieldCheck,
          badgeColor: 'border-[#36745F]/40 bg-[#36745F]/10 dark:bg-[#79B69A]/20 text-[#36745F] dark:text-[#79B69A]',
          description:
            'Low Risk: Validated legitimate entity with long domain standing, authoritative DNSSEC, clean reputation, and consistent TLS identity.',
        };
      case 'Inconclusive':
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-400/30 text-slate-500',
          accent: 'text-slate-500',
          meterGradient: 'from-slate-400 via-slate-500 to-slate-600',
          icon: HelpCircle,
          badgeColor: 'border-slate-400/40 bg-slate-500/10 text-slate-500',
          description:
            'Inconclusive Assessment: Insufficient telemetry available to confirm safety or hostility. Standard zero-trust precautions apply.',
        };
    }
  };

  const meta = getClassificationMeta(riskClassification);
  const IconComponent = meta.icon;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm dark:shadow-2xl relative overflow-hidden">
      {/* Header and Classification Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
              SECTION 1 • THREAT EVALUATION OVERVIEW
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-300">
                DEMO TELEMETRY ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-3">
            <span>Risk Classification:</span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-xl text-base md:text-lg font-mono font-bold border ${meta.badgeColor}`}
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              {riskClassification}
            </span>
          </h3>
          <p className="text-xs md:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-2xl font-sans pt-1">
            {meta.description}
          </p>
        </div>

        {/* Timestamps & Engine Latency */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-[#647477] dark:text-[#A6B3AE] bg-[#EAECE6] dark:bg-[#223336] p-3 rounded-xl border border-[#D9DED7] dark:border-[#304144]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Timestamp:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Compute Duration:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{durationMs} ms</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Engine:</span>
            <span className="text-[#A95636] dark:text-[#C47A52]">{dataSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* Visual Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Risk Score Gauge (0-100) */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Composite Threat Score
            </span>
            <span className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">SCALE: 0-100</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl md:text-5xl font-mono font-black ${meta.accent}`}>
              {riskScore}
            </span>
            <span className="text-sm font-mono text-[#647477] dark:text-[#A6B3AE] font-medium">/ 100</span>
          </div>

          {/* Styled progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[#D9DED7] dark:bg-[#293A3C] overflow-hidden p-0.5 border border-[#D9DED7] dark:border-[#304144]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.meterGradient} transition-all duration-700`}
                style={{ width: `${Math.max(4, riskScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE]">
              <span>0 (Safe)</span>
              <span>50 (Suspicious)</span>
              <span>100 (Hostile)</span>
            </div>
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Analytical Confidence
            </span>
            <FileCheck className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-mono font-black text-[#A95636] dark:text-[#C47A52]">
              {confidenceScore}%
            </span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Certainty Factor</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[#D9DED7] dark:bg-[#293A3C] overflow-hidden p-0.5 border border-[#D9DED7] dark:border-[#304144]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A95636] to-[#C47A52] transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
              {confidenceScore >= 80
                ? 'High signal consistency across multi-engine telemetry.'
                : 'Limited external cross-references; increased uncertainty.'}
            </p>
          </div>
        </div>

        {/* Evidence Coverage Gauge */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Evidence Coverage
            </span>
            <span className="text-[11px] font-mono text-[#A95636] dark:text-[#C47A52]">6 VECTORS</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-mono font-black text-[#A95636] dark:text-[#C47A52]">
              {evidenceCoverage}%
            </span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Corroborated</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[#D9DED7] dark:bg-[#293A3C] overflow-hidden p-0.5 border border-[#D9DED7] dark:border-[#304144]">
              <div
                className="h-full rounded-full bg-[#A95636] dark:bg-[#C47A52] transition-all duration-700"
                style={{ width: `${evidenceCoverage}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
              {evidenceCoverage >= 75
                ? 'Comprehensive telemetry: WHOIS, DNS, TLS, Feeds & Content.'
                : 'Sparse telemetry: Target host may be unindexed or cloaked.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
