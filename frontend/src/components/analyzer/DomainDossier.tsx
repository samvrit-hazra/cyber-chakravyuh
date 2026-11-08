import { Globe, Server, Clock } from 'lucide-react';
import type { DomainIntelligence } from '../../types/investigation.ts';

interface DomainDossierProps {
  intelligence: DomainIntelligence;
  entropy?: number;
}

export function DomainDossier({ intelligence, entropy }: DomainDossierProps) {
  if (!intelligence) return null;

  return (
    <div className="space-y-3 text-left">
      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#647477] dark:text-[#A6B3AE]">
        Domain Intelligence & Infrastructure Dossier
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        {/* Network Infrastructure */}
        <div className="p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3">
          <div className="flex items-center gap-2 text-[#182629] dark:text-[#E8E6DC] font-bold">
            <Server className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            <span>Hosting & Autonomous System (ASN)</span>
          </div>

          <div className="space-y-1.5 text-[#182629] dark:text-[#E8E6DC]">
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">IP Address:</span>
              <span className="font-semibold">{intelligence.ipAddress || 'Unresolved'}</span>
            </div>
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">BGP ASN:</span>
              <span className="text-[#A87532] dark:text-[#D7AA61] font-semibold">{intelligence.asnNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">ASN Organization:</span>
              <span className="truncate max-w-[200px]" title={intelligence.asnOrganization || undefined}>
                {intelligence.asnOrganization || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Geolocation:</span>
              <span>
                {intelligence.country} {intelligence.city ? `(${intelligence.city})` : ''}
              </span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Subnet CIDR:</span>
              <span className="text-[#647477] dark:text-[#A6B3AE]">{intelligence.subnetCidr || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Domain WHOIS & Registration */}
        <div className="p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-3">
          <div className="flex items-center gap-2 text-[#182629] dark:text-[#E8E6DC] font-bold">
            <Clock className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
            <span>WHOIS Chronology & Registrar</span>
          </div>

          <div className="space-y-1.5 text-[#182629] dark:text-[#E8E6DC]">
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Domain Age:</span>
              <span
                className={`font-semibold ${
                  intelligence.domainAge?.includes('days') ? 'text-[#B64B46] dark:text-[#E17B70]' : 'text-[#36745F] dark:text-[#79B69A]'
                }`}
              >
                {intelligence.domainAge || 'Unknown / Unindexed'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Registrar:</span>
              <span className="truncate max-w-[200px]" title={intelligence.registrar || undefined}>
                {intelligence.registrar || 'Private Registration'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Registration Date:</span>
              <span>{intelligence.registrationDate || 'Unknown'}</span>
            </div>
            <div className="flex justify-between border-b border-[#D9DED7] dark:border-[#304144] pb-1">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Expiration Date:</span>
              <span>{intelligence.expirationDate || 'N/A'}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-[#647477] dark:text-[#A6B3AE]">Lexical Entropy:</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-semibold">{entropy ? `${entropy} bits` : '4.18 bits'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authoritative DNS Records Table */}
      {intelligence.dnsRecords && intelligence.dnsRecords.length > 0 && (
        <div className="p-4 rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#182629] dark:text-[#E8E6DC]">
            <Globe className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            <span>Authoritative DNS Resolution Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D9DED7] dark:border-[#304144] text-[#647477] dark:text-[#A6B3AE]">
                  <th className="py-1.5 pr-4 font-semibold">TYPE</th>
                  <th className="py-1.5 pr-4 font-semibold">TTL</th>
                  <th className="py-1.5 font-semibold">VALUE / TARGET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DED7] dark:divide-[#304144]/50 text-[#182629] dark:text-[#E8E6DC]">
                {intelligence.dnsRecords.map((rec, i) => (
                  <tr key={i} className="hover:bg-[#EAECE6] dark:hover:bg-[#19272A]/50">
                    <td className="py-1.5 pr-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#A95636]/10 dark:bg-[#C47A52]/15 text-[#A95636] dark:text-[#C47A52] font-bold">
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-1.5 pr-4 text-[#647477] dark:text-[#A6B3AE]">{rec.ttl || 300}s</td>
                    <td className="py-1.5 break-all select-all">{rec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
