import { ShieldAlert, ShieldCheck, AlertTriangle, Flame, HelpCircle, Clock, FileText, CheckCircle2 } from 'lucide-react';
import type { ScamAnalysisResult, ScamRiskClassification } from '../../types/scam.ts';

interface ScamRiskOverviewSectionProps {
  result: ScamAnalysisResult;
}

export function ScamRiskOverviewSection({ result }: ScamRiskOverviewSectionProps) {
  const {
    riskClassification,
    riskScore,
    confidenceScore,
    scamCategory,
    analyzedAt,
    contentLength,
    isDemoState,
    dataSourceLabel,
  } = result;

  const getClassificationMeta = (classification: ScamRiskClassification) => {
    switch (classification) {
      case 'Confirmed Scam / Fraud':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          accent: 'text-rose-400',
          meterGradient: 'from-rose-500 via-red-600 to-rose-700',
          icon: Flame,
          badgeColor: 'border-rose-500/60 bg-rose-950/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
          description:
            'Critical Scam Vector: Verified deceptive intent incorporating fraudulent payment requests, credential harvesting, or scareware extortion.',
        };
      case 'High Risk / Likely Deceptive':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          accent: 'text-amber-400',
          meterGradient: 'from-amber-400 via-orange-500 to-red-500',
          icon: ShieldAlert,
          badgeColor: 'border-amber-500/60 bg-amber-950/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]',
          description:
            'High Threat: Multiple social engineering cues detected including executive impersonation, abnormal compensation, or communication isolation.',
        };
      case 'Suspicious':
        return {
          bg: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
          accent: 'text-purple-400',
          meterGradient: 'from-purple-500 via-violet-600 to-indigo-600',
          icon: AlertTriangle,
          badgeColor: 'border-purple-500/60 bg-purple-950/80 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]',
          description:
            'Suspicious: Anomalous psychological or lexical patterns observed. Further verification through independent channels required.',
        };
      case 'Low Risk / Likely Legitimate':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          accent: 'text-emerald-400',
          meterGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
          icon: ShieldCheck,
          badgeColor: 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
          description:
            'Low Risk: Legitimate communication pattern. Urgency is technically substantiated and contains no deceptive coercive triggers.',
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
            'Inconclusive Evaluation: Text lacks sufficient linguistic or technical indicators. Under zero-trust rules, do not assume safety without verification.',
        };
    }
  };

  const meta = getClassificationMeta(riskClassification);
  const IconComponent = meta.icon;

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-purple-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Classification Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
              SECTION 1 • SCAM RISK & THREAT CLASSIFICATION
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 border border-purple-500/30 text-purple-300">
                COGNITIVE TELEMETRY ACTIVE
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

        {/* Operational Metadata */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Analyzed At:</span>
            <span className="text-slate-200 font-semibold">{analyzedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Payload Size:</span>
            <span className="text-slate-200 font-semibold">{contentLength} characters</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Model:</span>
            <span className="text-purple-300/80">{dataSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Threat Score Gauge */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Scam Likelihood Score
            </span>
            <span className="text-[11px] font-mono text-slate-500">0 - 100 SCALE</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl md:text-5xl font-mono font-black ${meta.accent}`}>
              {riskScore}
            </span>
            <span className="text-sm font-mono text-slate-400 font-medium">/ 100</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.meterGradient} transition-all duration-700`}
                style={{ width: `${Math.max(4, riskScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 (Legitimate)</span>
              <span>50 (Suspicious)</span>
              <span>100 (Hostile Scam)</span>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Cognitive Confidence
            </span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-mono font-black text-purple-400">
              {confidenceScore}%
            </span>
            <span className="text-xs font-mono text-slate-400">Model Certainty</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Based on linguistic syntax parsing, entity extraction & manipulation markers.
            </p>
          </div>
        </div>

        {/* Threat Category */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Identified Threat Category
            </span>
            <span className="text-[10px] font-mono text-cyan-400">TAXONOMY</span>
          </div>

          <div className="space-y-1">
            <span className="text-lg md:text-xl font-mono font-bold text-slate-100 block">
              {scamCategory}
            </span>
            <p className="text-xs font-sans text-slate-400">
              Matched against MITRE ATT&CK & anti-phishing deception patterns.
            </p>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-[11px] font-mono text-slate-300">
            Vector Classification ID: <span className="text-purple-300 font-bold">{result.analysisId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

