import { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Flame,
  FileCheck2,
} from 'lucide-react';
import type { TlsSecurityFinding, CertificateTransparencyRecord } from '../../types/tls.ts';

interface TlsSecurityFindingsSectionProps {
  findings: TlsSecurityFinding[];
  certificateTransparency: CertificateTransparencyRecord[];
}

export function TlsSecurityFindingsSection({
  findings,
  certificateTransparency,
}: TlsSecurityFindingsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'compromised' | 'configuration'>('all');

  const filteredFindings = findings.filter((f) => {
    if (filter === 'compromised') return f.isCompromisedTrust;
    if (filter === 'configuration') return !f.isCompromisedTrust;
    return true;
  });

  const getSeverityBadge = (severity: TlsSecurityFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          pill: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
          border: 'border-l-rose-500',
          icon: Flame,
        };
      case 'high':
        return {
          pill: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
          border: 'border-l-amber-500',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          pill: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
          border: 'border-l-purple-500',
          icon: AlertTriangle,
        };
      case 'low':
      case 'info':
      default:
        return {
          pill: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
          border: 'border-l-cyan-500',
          icon: Info,
        };
    }
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SECURITY FINDINGS & CRYPTOGRAPHIC RISKS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>PKI Vulnerability & Compliance Audit</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({findings.length} Findings)
            </span>
          </h3>
        </div>

        {/* Filter Controls: All / Compromised Trust / Configuration Problem */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-white/5 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Findings ({findings.length})
          </button>
          <button
            onClick={() => setFilter('compromised')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              filter === 'compromised'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compromised Trust ({findings.filter((f) => f.isCompromisedTrust).length})
          </button>
          <button
            onClick={() => setFilter('configuration')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              filter === 'configuration'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Configuration Errors ({findings.filter((f) => !f.isCompromisedTrust).length})
          </button>
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#060b17] border border-white/5 font-mono text-xs text-slate-400">
          No security anomalies or cryptographic errors matching current filter.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFindings.map((finding) => {
            const meta = getSeverityBadge(finding.severity);
            const Icon = meta.icon;

            return (
              <div
                key={finding.id}
                className={`p-4 rounded-xl bg-[#060b17] border border-white/5 border-l-4 ${meta.border} space-y-2.5 hover:bg-[#070e1e] transition-colors font-mono text-xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${meta.pill}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {finding.severity}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{finding.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded border font-semibold ${
                        finding.isCompromisedTrust
                          ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                          : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      {finding.isCompromisedTrust ? 'COMPROMISED TRUST' : 'CONFIGURATION ISSUE'}
                    </span>
                    <span className="text-slate-500">[{finding.category}]</span>
                  </div>
                </div>

                <p className="text-xs font-sans text-slate-300 leading-relaxed">
                  {finding.description}
                </p>

                <div className="bg-black/50 p-2.5 rounded border border-white/5 text-[11px] text-cyan-200/90 break-all select-all">
                  Technical Telemetry: {finding.technicalDetails}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Transparency (CT) Records */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            Certificate Transparency (CT) Audit Logs ({certificateTransparency.length})
          </h4>
          <span className="text-[10px] text-slate-500">RFC 6962 Compliance</span>
        </div>

        {certificateTransparency.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            No public Certificate Transparency SCT stamps embedded in server handshake.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certificateTransparency.map((ct, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">{ct.logOperator}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    {ct.inclusionProofStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 break-all">
                  Log ID: <span className="text-slate-300">{ct.logId}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Entry: {ct.entryType}</span>
                  <span>Recorded: {ct.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
