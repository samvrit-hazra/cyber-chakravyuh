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
          pill: 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]',
          border: 'border-l-[#B64B46] dark:border-l-[#E17B70]',
          icon: Flame,
        };
      case 'high':
        return {
          pill: 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]',
          border: 'border-l-[#A87532] dark:border-l-[#D7AA61]',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          pill: 'bg-[#A95636]/10 border-[#A95636]/30 text-[#A95636] dark:text-[#C47A52]',
          border: 'border-l-[#A95636] dark:border-l-[#C47A52]',
          icon: AlertTriangle,
        };
      case 'low':
      case 'info':
      default:
        return {
          pill: 'bg-[#356D68]/10 border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]',
          border: 'border-l-[#356D68] dark:border-l-[#79A99C]',
          icon: Info,
        };
    }
  };

  return (
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
            SECURITY FINDINGS & CRYPTOGRAPHIC RISKS
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-[#B64B46] dark:text-[#E17B70]" />
            <span>PKI Vulnerability & Compliance Audit</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">
              ({findings.length} Findings)
            </span>
          </h3>
        </div>

        {/* Filter Controls: All / Compromised Trust / Configuration Problem */}
        <div className="flex items-center gap-1 bg-[#EAECE6] dark:bg-[#223336] p-1 rounded border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              filter === 'all'
                ? 'bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-xs'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            All Findings ({findings.length})
          </button>
          <button
            onClick={() => setFilter('compromised')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              filter === 'compromised'
                ? 'bg-[#B64B46]/10 border border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70] font-bold'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Compromised Trust ({findings.filter((f) => f.isCompromisedTrust).length})
          </button>
          <button
            onClick={() => setFilter('configuration')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              filter === 'configuration'
                ? 'bg-[#A87532]/10 border border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61] font-bold'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Configuration Errors ({findings.filter((f) => !f.isCompromisedTrust).length})
          </button>
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="p-8 text-center rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
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
                className={`p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] border-l-4 ${meta.border} space-y-2.5 hover:bg-[#EAECE6]/60 dark:hover:bg-[#223336]/60 transition-colors font-mono text-xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${meta.pill}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {finding.severity}
                    </span>
                    <span className="font-bold text-sm text-[#182629] dark:text-[#E8E6DC]">{finding.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded border font-semibold ${
                        finding.isCompromisedTrust
                          ? 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]'
                          : 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]'
                      }`}
                    >
                      {finding.isCompromisedTrust ? 'COMPROMISED TRUST' : 'CONFIGURATION ISSUE'}
                    </span>
                    <span className="text-[#647477] dark:text-[#A6B3AE]">[{finding.category}]</span>
                  </div>
                </div>

                <p className="text-xs font-sans text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                  {finding.description}
                </p>

                <div className="bg-white dark:bg-[#19272A] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144] text-[11px] text-[#182629] dark:text-[#E8E6DC] break-all select-all">
                  Technical Telemetry: {finding.technicalDetails}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Transparency (CT) Records */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
            Certificate Transparency (CT) Audit Logs ({certificateTransparency.length})
          </h4>
          <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE]">RFC 6962 Compliance</span>
        </div>

        {certificateTransparency.length === 0 ? (
          <p className="text-xs text-[#647477] dark:text-[#A6B3AE] py-2">
            No public Certificate Transparency SCT stamps embedded in server handshake.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certificateTransparency.map((ct, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#356D68] dark:text-[#79A99C]">{ct.logOperator}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#36745F]/10 text-[#36745F] dark:text-[#79B69A] border border-[#36745F]/30">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    {ct.inclusionProofStatus}
                  </span>
                </div>
                <div className="text-[11px] text-[#647477] dark:text-[#A6B3AE] break-all">
                  Log ID: <span className="text-[#182629] dark:text-[#E8E6DC]">{ct.logId}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#647477] dark:text-[#A6B3AE]">
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
