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
          bg: 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300',
          accent: 'text-rose-600 dark:text-rose-400',
          meterGradient: 'from-rose-500 via-red-600 to-rose-700',
          icon: Flame,
          badgeColor: 'border-rose-500/40 bg-rose-500/10 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
          description:
            'Critical Scam Vector: Verified deceptive intent incorporating fraudulent payment requests, credential harvesting, or scareware extortion.',
        };
      case 'High Risk / Likely Deceptive':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300',
          accent: 'text-amber-600 dark:text-amber-400',
          meterGradient: 'from-amber-400 via-orange-500 to-red-500',
          icon: ShieldAlert,
          badgeColor: 'border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
          description:
            'High Threat: Multiple social engineering cues detected including executive impersonation, abnormal compensation, or communication isolation.',
        };
      case 'Suspicious':
        return {
          bg: 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52]',
          accent: 'text-[#A95636] dark:text-[#C47A52]',
          meterGradient: 'from-[#A95636] via-[#C47A52] to-[#356D68]',
          icon: AlertTriangle,
          badgeColor: 'border-[#A95636]/40 bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52]',
          description:
            'Suspicious: Anomalous psychological or lexical patterns observed. Further verification through independent channels required.',
        };
      case 'Low Risk / Likely Legitimate':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
          accent: 'text-emerald-600 dark:text-emerald-400',
          meterGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
          icon: ShieldCheck,
          badgeColor: 'border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
          description:
            'Low Risk: Legitimate communication pattern. Urgency is technically substantiated and contains no deceptive coercive triggers.',
        };
      case 'Inconclusive':
      default:
        return {
          bg: 'bg-slate-500/10 dark:bg-slate-800/40 border-slate-400/30 text-slate-700 dark:text-slate-300',
          accent: 'text-slate-600 dark:text-slate-400',
          meterGradient: 'from-slate-400 via-slate-500 to-slate-600',
          icon: HelpCircle,
          badgeColor: 'border-slate-400/40 bg-slate-500/10 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300',
          description:
            'Inconclusive Evaluation: Text lacks sufficient linguistic or technical indicators. Under zero-trust rules, do not assume safety without verification.',
        };
    }
  };

  const meta = getClassificationMeta(riskClassification);
  const IconComponent = meta.icon;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm relative overflow-hidden">
      {/* Top Header & Classification Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
              SECTION 1 • SCAM RISK & THREAT CLASSIFICATION
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/25 dark:border-[#C47A52]/30 text-[#A95636] dark:text-[#C47A52]">
                COGNITIVE TELEMETRY ACTIVE
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

        {/* Operational Metadata */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-[#647477] dark:text-[#A6B3AE] bg-[#F3F1E9] dark:bg-[#101A1D] p-3 rounded-xl border border-[#D9DED7] dark:border-[#304144]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Analyzed At:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{analyzedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Payload Size:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{contentLength} characters</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Model:</span>
            <span className="text-[#A95636] dark:text-[#C47A52] font-semibold">{dataSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Threat Score Gauge */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Scam Likelihood Score
            </span>
            <span className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">0 - 100 SCALE</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl md:text-5xl font-mono font-black ${meta.accent}`}>
              {riskScore}
            </span>
            <span className="text-sm font-mono text-[#647477] dark:text-[#A6B3AE] font-medium">/ 100</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[#EAECE6] dark:bg-[#223336] overflow-hidden p-0.5 border border-[#D9DED7] dark:border-[#304144]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.meterGradient} transition-all duration-700`}
                style={{ width: `${Math.max(4, riskScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE]">
              <span>0 (Legitimate)</span>
              <span>50 (Suspicious)</span>
              <span>100 (Hostile Scam)</span>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Cognitive Confidence
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-mono font-black text-[#A95636] dark:text-[#C47A52]">
              {confidenceScore}%
            </span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Model Certainty</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[#EAECE6] dark:bg-[#223336] overflow-hidden p-0.5 border border-[#D9DED7] dark:border-[#304144]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A95636] to-[#356D68] transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
              Based on linguistic syntax parsing, entity extraction & manipulation markers.
            </p>
          </div>
        </div>

        {/* Threat Category */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
              Identified Threat Category
            </span>
            <span className="text-[10px] font-mono text-[#356D68] dark:text-[#79A99C]">TAXONOMY</span>
          </div>

          <div className="space-y-1">
            <span className="text-lg md:text-xl font-mono font-bold text-[#182629] dark:text-[#E8E6DC] block">
              {scamCategory}
            </span>
            <p className="text-xs font-sans text-[#647477] dark:text-[#A6B3AE]">
              Matched against MITRE ATT&CK & anti-phishing deception patterns.
            </p>
          </div>

          <div className="p-2 rounded-lg bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] text-[11px] font-mono text-[#182629] dark:text-[#E8E6DC]">
            Vector Classification ID: <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{result.analysisId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
