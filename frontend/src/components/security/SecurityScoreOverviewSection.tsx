import { Shield, Clock, ExternalLink } from 'lucide-react';
import type { WebsiteSecurityAssessmentResult, CategoryScore } from '../../types/websiteSecurity.ts';

interface SecurityScoreOverviewSectionProps {
  result: WebsiteSecurityAssessmentResult;
}

export function SecurityScoreOverviewSection({ result }: SecurityScoreOverviewSectionProps) {
  const {
    securityScore,
    securityGrade,
    summaryVerdict,
    targetUrl,
    canonicalHost,
    assessedAt,
    categoryScores,
    isDemoState,
    dataSourceLabel,
  } = result;

  const getGradeMeta = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return {
          textColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          gradient: 'from-emerald-500 to-teal-400',
        };
      case 'B':
        return {
          textColor: 'text-cyan-400',
          badgeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
          gradient: 'from-cyan-500 to-blue-400',
        };
      case 'C':
        return {
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          gradient: 'from-amber-500 to-yellow-400',
        };
      case 'D':
      case 'F':
      default:
        return {
          textColor: 'text-rose-400',
          badgeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          gradient: 'from-rose-500 to-red-600',
        };
    }
  };

  const getStatusBadge = (status: CategoryScore['status']) => {
    switch (status) {
      case 'Optimal':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'Adequate':
        return 'bg-blue-500/15 border-blue-500/30 text-blue-300';
      case 'Deficient':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'Hazardous':
      default:
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
    }
  };

  const meta = getGradeMeta(securityGrade);

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header: Score, Grade & Verdict */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              WEBSITE SECURITY SCORECARD & POSTURE BENCHMARK
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                PASSIVE TELEMETRY ACTIVE
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-mono text-white flex flex-wrap items-center gap-3">
            <span>Overall Posture Grade:</span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-xl text-base md:text-lg font-mono font-bold border ${meta.badgeBg}`}
            >
              <Shield className="w-5 h-5 shrink-0" />
              Grade {securityGrade} ({securityScore} / 100)
            </span>
          </h3>

          <p className="text-xs md:text-sm text-slate-300 max-w-3xl font-sans pt-1 leading-relaxed">
            {summaryVerdict}
          </p>
        </div>

        {/* Operational Metadata */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Assessed:</span>
            <span className="text-slate-200 font-semibold">{assessedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Host:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[180px]" title={canonicalHost}>
              {canonicalHost}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Engine:</span>
            <span className="text-emerald-300/80">{dataSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* Composite Score Meter */}
      <div className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            Composite Security Hygiene Metric: <span className={meta.textColor}>{securityScore} / 100</span>
          </span>
          <span className="text-[11px] text-slate-500">Target: {targetUrl}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-700`}
            style={{ width: `${Math.max(4, securityScore)}%` }}
          />
        </div>
      </div>

      {/* 7 Assessment Categories Grid */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider">
            Seven Core Hygiene Categories Breakdown
          </h4>
          <span className="text-[11px] text-slate-500">7 Domains Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryScores.map((cat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#060b17] border border-white/5 space-y-2 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 truncate pr-2" title={cat.category}>
                  {cat.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                    cat.status
                  )}`}
                >
                  {cat.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Score: {cat.score}%</span>
                  <span>{cat.issueCount > 0 ? `${cat.issueCount} Issues` : `${cat.passedCount} Passed`}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.score > 80
                        ? 'bg-emerald-400'
                        : cat.score > 50
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

