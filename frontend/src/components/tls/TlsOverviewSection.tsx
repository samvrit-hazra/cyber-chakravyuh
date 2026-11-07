import {
  Globe,
  Award,
  Calendar,
  Layers,
  Key,
  Lock,
  Radio,
} from 'lucide-react';
import type { TlsInvestigationResult } from '../../types/tls.ts';

interface TlsOverviewSectionProps {
  result: TlsInvestigationResult;
}

export function TlsOverviewSection({ result }: TlsOverviewSectionProps) {
  const {
    targetDomain,
    certificateStatus,
    trustScore,
    trustGrade,
    subject,
    issuer,
    validFrom,
    validTo,
    daysRemaining,
    isExpired,
    subjectAltNames,
    isHostnameMatched,
    publicKeyInfo,
    signatureAlgorithm,
    isPfsSupported,
    protocolVersion,
    cipherSuite,
    ocspStapling,
    isDemoState,
    dataSourceLabel,
  } = result;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Valid & Trusted':
        return 'bg-[#36745F]/10 border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]';
      case 'Expired Certificate':
      case 'Revoked Certificate':
      case 'Untrusted / Self-Signed':
        return 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]';
      case 'Hostname Mismatch':
      case 'Weak Cryptography':
      default:
        return 'bg-[#A87532]/10 border-[#A87532]/30 text-[#A87532] dark:text-[#D7AA61]';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-[#36745F] dark:text-[#79B69A]';
    if (grade.startsWith('B')) return 'text-[#356D68] dark:text-[#79A99C]';
    if (grade.startsWith('C')) return 'text-[#A87532] dark:text-[#D7AA61]';
    return 'text-[#B64B46] dark:text-[#E17B70]';
  };

  return (
    <div className="rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-xs">
      {/* Top Header: Certificate Status & Grade */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#356D68] dark:text-[#79A99C] font-bold">
              X.509 CERTIFICATE TELEMETRY & TRUST IDENTITY
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#356D68]/10 border border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]">
                PKI TELEMETRY ACTIVE
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex flex-wrap items-center gap-3">
            <span>Status:</span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded text-base md:text-lg font-mono font-bold border ${getStatusBadgeStyle(
                certificateStatus
              )}`}
            >
              <Lock className="w-5 h-5 shrink-0" />
              {certificateStatus}
            </span>
          </h3>

          <p className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono pt-1">
            Auditing target: <span className="text-[#A95636] dark:text-[#C47A52] font-bold">{targetDomain}:443</span> • Source: {dataSourceLabel}
          </p>
        </div>

        {/* Grade Card */}
        <div className="flex items-center gap-4 bg-[#EAECE6] dark:bg-[#223336] p-3 rounded border border-[#D9DED7] dark:border-[#304144] font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] block uppercase">PKI Trust Grade</span>
            <span className={`text-3xl font-black ${getGradeColor(trustGrade)}`}>
              {trustGrade}
            </span>
          </div>

          <div className="border-l border-[#D9DED7] dark:border-[#304144] pl-3">
            <span className="text-[10px] text-[#647477] dark:text-[#A6B3AE] block uppercase">Trust Score</span>
            <span className="text-xl font-bold text-[#182629] dark:text-[#E8E6DC]">{trustScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Grid: Subject vs Issuer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Subject (End-Entity / Website) */}
        <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
            Certificate Subject (End-Entity)
          </h4>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Common Name (CN):</span>
              <span className="text-[#356D68] dark:text-[#79A99C] font-bold break-all">{subject.commonName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
                <span className="text-[#647477] dark:text-[#A6B3AE] block">Organization (O):</span>
                <span className="text-[#182629] dark:text-[#E8E6DC] truncate block">{subject.organization || 'None (Domain Validated)'}</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
                <span className="text-[#647477] dark:text-[#A6B3AE] block">Country (C):</span>
                <span className="text-[#182629] dark:text-[#E8E6DC]">{subject.country || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issuer (Certificate Authority) */}
        <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
            Issuing Certificate Authority (CA)
          </h4>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
              <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Common Name (CN):</span>
              <span className="text-[#A95636] dark:text-[#C47A52] font-bold break-all">{issuer.commonName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
                <span className="text-[#647477] dark:text-[#A6B3AE] block">CA Organization:</span>
                <span className="text-[#182629] dark:text-[#E8E6DC] truncate block">{issuer.organization || 'Public Web CA'}</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144]">
                <span className="text-[#647477] dark:text-[#A6B3AE] block">Serial Number:</span>
                <span className="text-[#647477] dark:text-[#A6B3AE] truncate block">{issuer.serialNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validity Dates & Countdown */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
        <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
          Validity Lifespan & Expiration Countdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Not Before (Valid From)</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] font-semibold">{validFrom}</span>
          </div>

          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Not After (Expiry Date)</span>
            <span className={isExpired ? 'text-[#B64B46] dark:text-[#E17B70] font-bold' : 'text-[#182629] dark:text-[#E8E6DC] font-semibold'}>
              {validTo}
            </span>
          </div>

          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Remaining Time Window</span>
            <span
              className={`text-sm font-bold ${
                isExpired
                  ? 'text-[#B64B46] dark:text-[#E17B70]'
                  : daysRemaining < 14
                  ? 'text-[#A87532] dark:text-[#D7AA61]'
                  : 'text-[#36745F] dark:text-[#79B69A]'
              }`}
            >
              {isExpired ? `EXPIRED (${Math.abs(daysRemaining)} days ago)` : `${daysRemaining} Days Left`}
            </span>
          </div>
        </div>
      </div>

      {/* Subject Alternative Names (SANs) */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
            Subject Alternative Names (SANs - {subjectAltNames.length})
          </h4>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isHostnameMatched
                ? 'bg-[#36745F]/10 border-[#36745F]/30 text-[#36745F] dark:text-[#79B69A]'
                : 'bg-[#B64B46]/10 border-[#B64B46]/30 text-[#B64B46] dark:text-[#E17B70]'
            }`}
          >
            {isHostnameMatched ? 'HOSTNAME MATCH VERIFIED' : 'SAN HOSTNAME MISMATCH'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {subjectAltNames.map((san: string, index: number) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs font-mono"
            >
              DNS: {san}
            </span>
          ))}
        </div>
      </div>

      {/* Cryptographic Profile & Public Key Info */}
      <div className="rounded bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] p-4 space-y-3 font-mono text-xs">
        <h4 className="font-bold text-[#182629] dark:text-[#E8E6DC] uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
          Cryptographic Ciphers & Public Key Architecture
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Protocol Version</span>
            <span className="text-[#356D68] dark:text-[#79A99C] font-bold">{protocolVersion}</span>
          </div>

          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Signature Algorithm</span>
            <span className="text-[#182629] dark:text-[#E8E6DC] truncate block" title={signatureAlgorithm}>
              {signatureAlgorithm}
            </span>
          </div>

          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Public Key</span>
            <span className="text-[#A95636] dark:text-[#C47A52] font-bold">
              {publicKeyInfo.algorithm} {publicKeyInfo.keySizeBits} bits {publicKeyInfo.curve ? `(${publicKeyInfo.curve})` : ''}
            </span>
          </div>

          <div className="p-3 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] space-y-1">
            <span className="text-[#647477] dark:text-[#A6B3AE] text-[11px] block">Forward Secrecy (PFS)</span>
            <span className={isPfsSupported ? 'text-[#36745F] dark:text-[#79B69A] font-bold' : 'text-[#A87532] dark:text-[#D7AA61] font-bold'}>
              {isPfsSupported ? 'Supported (PFS Active)' : 'Not Supported'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="text-[#647477] dark:text-[#A6B3AE]">
            Negotiated Cipher Suite: <strong className="text-[#182629] dark:text-[#E8E6DC]">{cipherSuite}</strong>
          </span>
          <span className="text-[#647477] dark:text-[#A6B3AE] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
            OCSP Status: <strong className="text-[#36745F] dark:text-[#79B69A]">{ocspStapling.status}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
