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
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
      case 'Questionable':
        return 'bg-purple-500/15 border-purple-500/40 text-purple-300';
      case 'Poor':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'Hostile':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-300';
      case 'Unknown':
      default:
        return 'bg-slate-500/15 border-slate-500/40 text-slate-300';
    }
  };

  const getDnssecBadge = (status: DomainIntelligence['dnssecStatus']) => {
    if (status === 'Signed') {
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    }
    if (status === 'Unsigned') {
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }
    return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SECTION 2 • DOMAIN & INFRASTRUCTURE INTELLIGENCE
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Target Host Identity:</span>
            <span className="text-cyan-300 font-mono underline decoration-cyan-500/40">{domain}</span>
          </h3>
        </div>

        {/* Reputation Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Reputation:</span>
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
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            WHOIS & Domain Registration Lifecycle
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Domain Age</span>
              <span className="text-slate-100 font-bold text-sm">
                {domainAge || 'Unavailable / Redacted'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Authorized Registrar</span>
              <span className="text-slate-100 font-bold text-sm truncate block" title={registrar || 'N/A'}>
                {registrar || 'Redacted for Privacy'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Creation Date</span>
              <span className="text-slate-200">
                {registrationDate ? new Date(registrationDate).toLocaleDateString() : 'Unknown'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Expiration Date</span>
              <span className="text-slate-200">
                {expirationDate ? new Date(expirationDate).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: IP, Routing & Autonomous System */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            IP Infrastructure & Routing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Resolved IP Address</span>
              <span className="text-cyan-300 font-bold text-sm">{ipAddress}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">CIDR Subnet</span>
              <span className="text-slate-200 font-bold">{subnetCidr}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">ASN / Network Provider</span>
              <span className="text-slate-200 truncate block" title={`${asnNumber} (${asnOrganization})`}>
                {asnNumber} • {asnOrganization}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 block text-[11px]">Geographic Jurisdiction</span>
              <span className="text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {city ? `${city}, ` : ''}{country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Records & DNSSEC Status */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Authoritative DNS Records & Cryptographic Integrity
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">DNSSEC:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono border font-semibold ${getDnssecBadge(dnssecStatus)}`}>
              <Shield className="w-3 h-3 inline mr-1" />
              {dnssecStatus}
            </span>
          </div>
        </div>

        {dnsRecords.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 py-2">No DNS records returned by authoritative name servers.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="py-2 px-3 font-semibold w-24">RECORD</th>
                  <th className="py-2 px-3 font-semibold">VALUE / TARGET</th>
                  <th className="py-2 px-3 font-semibold text-right w-20">TTL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dnsRecords.map((record, index) => (
                  <tr key={`${record.type}-${record.value}-${index}`} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px]">
                        {record.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-200 break-all select-all">{record.value}</td>
                    <td className="py-2 px-3 text-slate-400 text-right">{record.ttl ? `${record.ttl}s` : '300s'}</td>
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

