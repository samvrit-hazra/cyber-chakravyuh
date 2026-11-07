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
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          accent: 'text-rose-400',
          meterGradient: 'from-rose-500 via-red-600 to-rose-700',
          icon: Flame,
          badgeColor: 'border-rose-500/60 bg-rose-950/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
          description:
            'Critical Threat: Verified malicious entity matching known phishing, credential harvesting, or malware distribution campaigns.',
        };
      case 'High Risk':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          accent: 'text-amber-400',
          meterGradient: 'from-amber-400 via-orange-500 to-red-500',
          icon: ShieldAlert,
          badgeColor: 'border-amber-500/60 bg-amber-950/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]',
          description:
            'High Threat: Multiple severe anomalies detected including homoglyphs, brand typosquatting, or high-risk redirect patterns.',
        };
      case 'Suspicious':
        return {
          bg: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
          accent: 'text-purple-400',
          meterGradient: 'from-purple-500 via-violet-600 to-indigo-600',
          icon: AlertTriangle,
          badgeColor: 'border-purple-500/60 bg-purple-950/80 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]',
          description:
            'Suspicious: Anomalous characteristics observed such as abnormal entropy, young domain registration, or obscured origin.',
        };
      case 'Low Risk':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          accent: 'text-emerald-400',
          meterGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
          icon: ShieldCheck,
          badgeColor: 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
          description:
            'Low Risk: Validated legitimate entity with long domain standing, authoritative DNSSEC, clean reputation, and consistent TLS identity.',
        };
      case 'Inconclusive':
      default:
        return {
          bg: 'bg-slate-500/15 border-slate-500/40 text-slate-300',
          accent: 'text-slate-400',
          meterGradient: 'from-slate-400 via-slate-500 to-slate-600',
          icon: HelpCircle,
          badgeColor: 'border-slate-400/50 bg-slate-900/90 text-slate-300 shadow-[0_0_10px_rgba(148,163,184,0.2)]',
          description:
            'Inconclusive Assessment: Insufficient telemetry available to confirm safety or hostility. Standard zero-trust precautions apply.',
        };
    }
  };

  const meta = getClassificationMeta(riskClassification);
  const IconComponent = meta.icon;

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header and Classification Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              SECTION 1 • THREAT EVALUATION OVERVIEW
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300">
                DEMO TELEMETRY ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-3">
            <span>Risk Classification:</span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-xl text-base md:text-lg font-mono font-bold border ${meta.badgeColor}`}
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              {riskClassification}
            </span>
          </h3>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-sans pt-1">
            {meta.description}
          </p>
        </div>

        {/* Timestamps & Engine Latency */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Timestamp:</span>
            <span className="text-slate-200 font-semibold">{timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Compute Duration:</span>
            <span className="text-slate-200 font-semibold">{durationMs} ms</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Engine:</span>
            <span className="text-cyan-300/80">{dataSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* Visual Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Risk Score Gauge (0-100) */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Composite Threat Score
            </span>
            <span className="text-[11px] font-mono text-slate-500">SCALE: 0-100</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl md:text-5xl font-mono font-black ${meta.accent}`}>
              {riskScore}
            </span>
            <span className="text-sm font-mono text-slate-400 font-medium">/ 100</span>
          </div>

          {/* Styled progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.meterGradient} transition-all duration-700`}
                style={{ width: `${Math.max(4, riskScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 (Safe)</span>
              <span>50 (Suspicious)</span>
              <span>100 (Hostile)</span>
            </div>
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Analytical Confidence
            </span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-mono font-black text-cyan-400">
              {confidenceScore}%
            </span>
            <span className="text-xs font-mono text-slate-400">Certainty Factor</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              {confidenceScore >= 80
                ? 'High signal consistency across multi-engine telemetry.'
                : 'Limited external cross-references; increased uncertainty.'}
            </p>
          </div>
        </div>

        {/* Evidence Coverage Gauge */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Evidence Coverage
            </span>
            <span className="text-[11px] font-mono text-purple-400">6 VECTORS</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-mono font-black text-purple-400">
              {evidenceCoverage}%
            </span>
            <span className="text-xs font-mono text-slate-400">Corroborated</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${evidenceCoverage}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
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

