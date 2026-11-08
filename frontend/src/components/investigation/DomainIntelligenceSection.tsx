import { Globe, Calendar, Server, MapPin, Shield, Layers, Award } from 'lucide-react';
import type { DomainIntelligence } from '../../types/investigation.ts';

interface DomainIntelligenceSectionProps {
  intelligence: DomainIntelligence;
}

export function DomainIntelligenceSection({ intelligence }: DomainIntelligenceSectionProps) {
  const {
    domain,
    domainAge,
    registrationDate,
    expirationDate,
    registrar,
    dnsRecords,
    dnssecStatus,
    ipAddress,
    asnNumber,
    asnOrganization,
    country,
    city,
    subnetCidr,
    reputationScore,
    reputationLabel,
  } = intelligence;

  const getReputationBadge = (label: DomainIntelligence['reputationLabel']) => {
    switch (label) {
      case 'Clean':
        return 'bg-[#36745F]/10 dark:bg-[#79B69A]/15 border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A]';
      case 'Questionable':
        return 'bg-[#A95636]/10 dark:bg-[#C47A52]/15 border-[#A95636]/30 dark:border-[#C47A52]/40 text-[#A95636] dark:text-[#C47A52]';
      case 'Poor':
        return 'bg-[#A87532]/10 dark:bg-[#D7AA61]/15 border-[#A87532]/30 dark:border-[#D7AA61]/40 text-[#A87532] dark:text-[#D7AA61]';
      case 'Hostile':
        return 'bg-[#B64B46]/10 dark:bg-[#E17B70]/15 border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70]';
      case 'Unknown':
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-500';
    }
  };

  const getDnssecBadge = (status: DomainIntelligence['dnssecStatus']) => {
    if (status === 'Signed') {
      return 'bg-[#36745F]/10 border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]';
    }
    if (status === 'Unsigned') {
      return 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]';
    }
    return 'bg-slate-500/10 border-slate-500/30 text-slate-500';
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm dark:shadow-2xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            SECTION 2 • DOMAIN & INFRASTRUCTURE INTELLIGENCE
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Globe className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Target Host Identity:</span>
            <span className="text-[#A95636] dark:text-[#C47A52] font-mono underline decoration-[#A95636]/40">{domain}</span>
          </h3>
        </div>

        {/* Reputation Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">Reputation:</span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${getReputationBadge(
              reputationLabel
            )}`}
          >
            <Award className="w-3.5 h-3.5" />
            {reputationLabel} ({reputationScore}/100)
          </span>
        </div>
      </div>

      {/* Grid: WHOIS & Registration + Network & Geolocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: WHOIS & Domain Lifecycle */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-4">
          <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            WHOIS & Domain Registration Lifecycle
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">Domain Age</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold text-sm">
                {domainAge || 'Unavailable / Redacted'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">Authorized Registrar</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold text-sm truncate block" title={registrar || 'N/A'}>
                {registrar || 'Redacted for Privacy'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">Creation Date</span>
              <span className="text-[#182629] dark:text-[#E8E6DC]">
                {registrationDate ? new Date(registrationDate).toLocaleDateString() : 'Unknown'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">Expiration Date</span>
              <span className="text-[#182629] dark:text-[#E8E6DC]">
                {expirationDate ? new Date(expirationDate).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: IP, Routing & Autonomous System */}
        <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-4">
          <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            IP Infrastructure & Routing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">Resolved IP Address</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-bold text-sm">{ipAddress}</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">CIDR Subnet</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] font-bold">{subnetCidr}</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">ASN / Network Provider</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] truncate block" title={`${asnNumber} (${asnOrganization})`}>
                {asnNumber} • {asnOrganization}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] block text-[11px]">Geographic Jurisdiction</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                {city ? `${city}, ` : ''}{country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Records & DNSSEC Status */}
      <div className="rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            Authoritative DNS Records & Cryptographic Integrity
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">DNSSEC:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono border font-semibold ${getDnssecBadge(dnssecStatus)}`}>
              <Shield className="w-3 h-3 inline mr-1" />
              {dnssecStatus}
            </span>
          </div>
        </div>

        {dnsRecords.length === 0 ? (
          <p className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] py-2">No DNS records returned by authoritative name servers.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE] text-[11px]">
                  <th className="py-2 px-3 font-semibold w-24">RECORD</th>
                  <th className="py-2 px-3 font-semibold">VALUE / TARGET</th>
                  <th className="py-2 px-3 font-semibold text-right w-20">TTL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DED7] dark:divide-[#304144]">
                {dnsRecords.map((record, index) => (
                  <tr key={`${record.type}-${record.value}-${index}`} className="hover:bg-[#EAECE6] dark:hover:bg-[#223336]">
                    <td className="py-2 px-3 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/30 dark:border-[#C47A52]/40 text-[#A95636] dark:text-[#C47A52] text-[11px]">
                        {record.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#182629] dark:text-[#E8E6DC] break-all select-all">{record.value}</td>
                    <td className="py-2 px-3 text-[#647477] dark:text-[#A6B3AE] text-right">{record.ttl ? `${record.ttl}s` : '300s'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
