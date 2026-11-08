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
          textColor: 'text-[#36745F] dark:text-[#79B69A]',
          badgeBg: 'bg-[#36745F]/10 border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]',
          gradient: 'from-[#36745F] to-[#79B69A]',
        };
      case 'B':
        return {
          textColor: 'text-[#356D68] dark:text-[#79A99C]',
          badgeBg: 'bg-[#356D68]/10 border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]',
          gradient: 'from-[#356D68] to-[#79A99C]',
        };
      case 'C':
        return {
          textColor: 'text-[#A87532] dark:text-[#D7AA61]',
          badgeBg: 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]',
          gradient: 'from-[#A87532] to-[#D7AA61]',
        };
      case 'D':
      case 'F':
      default:
        return {
          textColor: 'text-[#B64B46] dark:text-[#E17B70]',
          badgeBg: 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]',
          gradient: 'from-[#B64B46] to-[#E17B70]',
        };
    }
  };

  const getStatusBadge = (status: CategoryScore['status']) => {
    switch (status) {
      case 'Optimal':
        return 'bg-[#36745F]/10 border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]';
      case 'Adequate':
        return 'bg-[#356D68]/10 border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]';
      case 'Deficient':
        return 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]';
      case 'Hazardous':
      default:
        return 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]';
    }
  };

  const meta = getGradeMeta(securityGrade);

  return (
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs relative overflow-hidden">
      {/* Header: Score, Grade & Verdict */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
              WEBSITE SECURITY SCORECARD & POSTURE BENCHMARK
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#356D68]/10 border border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]">
                PASSIVE TELEMETRY ACTIVE
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex flex-wrap items-center gap-3">
            <span>Overall Posture Grade:</span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded text-base md:text-lg font-mono font-bold border ${meta.badgeBg}`}
            >
              <Shield className="w-5 h-5 shrink-0" />
              Grade {securityGrade} ({securityScore} / 100)
            </span>
          </h3>

          <p className="text-xs md:text-sm text-[#647477] dark:text-[#A6B3AE] max-w-3xl font-sans pt-1 leading-relaxed">
            {summaryVerdict}
          </p>
        </div>

        {/* Operational Metadata */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-[#647477] dark:text-[#A6B3AE] bg-[#EAECE6] dark:bg-[#223336] p-3 rounded border border-[#D9DED7] dark:border-[#304144]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Assessed:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{assessedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Target Host:</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold truncate max-w-[180px]" title={canonicalHost}>
              {canonicalHost}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#647477] dark:text-[#A6B3AE]">
            <span>Engine:</span>
            <span className="text-[#356D68] dark:text-[#79A99C]">{dataSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* Composite Score Meter */}
      <div className="p-4 rounded bg-[#EAECE6]/50 dark:bg-[#223336]/60 border border-[#D9DED7] dark:border-[#304144] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
            Composite Security Hygiene Metric: <span className={meta.textColor}>{securityScore} / 100</span>
          </span>
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">Target: {targetUrl}</span>
        </div>
        <div className="w-full h-3 rounded bg-[#D9DED7] dark:bg-[#101A1D] overflow-hidden p-0.5 border border-[#D9DED7] dark:border-[#304144]">
          <div
            className={`h-full rounded bg-gradient-to-r ${meta.gradient} transition-all duration-700`}
            style={{ width: `${Math.max(4, securityScore)}%` }}
          />
        </div>
      </div>

      {/* 7 Assessment Categories Grid */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider">
            Seven Core Hygiene Categories Breakdown
          </h4>
          <span className="text-[11px] text-[#647477] dark:text-[#A6B3AE]">7 Domains Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryScores.map((cat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 hover:border-[#356D68]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate pr-2" title={cat.category}>
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
                <div className="flex justify-between text-[11px] text-[#647477] dark:text-[#A6B3AE]">
                  <span>Score: {cat.score}%</span>
                  <span>{cat.issueCount > 0 ? `${cat.issueCount} Issues` : `${cat.passedCount} Passed`}</span>
                </div>
                <div className="w-full h-1.5 rounded bg-[#EAECE6] dark:bg-[#223336] overflow-hidden">
                  <div
                    className={`h-full rounded ${
                      cat.score > 80
                        ? 'bg-[#36745F] dark:bg-[#79B69A]'
                        : cat.score > 50
                        ? 'bg-[#A87532] dark:bg-[#D7AA61]'
                        : 'bg-[#B64B46] dark:bg-[#E17B70]'
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
