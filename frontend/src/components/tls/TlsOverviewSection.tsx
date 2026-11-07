import {
  Lock,
  Calendar,
  Key,
  Layers,
  Award,
  Globe,
  Radio,
} from 'lucide-react';
import type { TlsInvestigationResult } from '../../types/tls.ts';

interface TlsOverviewSectionProps {
  result: TlsInvestigationResult;
}

export function TlsOverviewSection({ result }: TlsOverviewSectionProps) {
  const {
    certificateStatus,
    trustGrade,
    trustScore,
    targetDomain,
    protocolVersion,
    cipherSuite,
    isPfsSupported,
    subject,
    issuer,
    validFrom,
    validTo,
    daysRemaining,
    isExpired,
    subjectAltNames,
    isHostnameMatched,
    signatureAlgorithm,
    publicKeyInfo,
    ocspStapling,
    isDemoState,
    dataSourceLabel,
  } = result;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Valid & Trusted':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
      case 'Expired Certificate':
      case 'Revoked Certificate':
      case 'Untrusted / Self-Signed':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-300';
      case 'Hostname Mismatch':
      case 'Weak Cryptography':
      default:
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-400';
      case 'B':
        return 'text-cyan-400';
      case 'C':
        return 'text-amber-400';
      case 'D':
      case 'F':
      default:
        return 'text-rose-400';
    }
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Top Header: Certificate Status & Grade */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              X.509 CERTIFICATE TELEMETRY & TRUST IDENTITY
            </span>
            {isDemoState && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                PKI TELEMETRY ACTIVE
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-mono text-white flex flex-wrap items-center gap-3">
            <span>Status:</span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-xl text-base md:text-lg font-mono font-bold border ${getStatusBadgeStyle(
                certificateStatus
              )}`}
            >
              <Lock className="w-5 h-5 shrink-0" />
              {certificateStatus}
            </span>
          </h3>

          <p className="text-xs text-slate-400 font-mono pt-1">
            Auditing target: <span className="text-cyan-300 font-bold">{targetDomain}:443</span> • Source: {dataSourceLabel}
          </p>
        </div>

        {/* Grade Card */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">PKI Trust Grade</span>
            <span className={`text-3xl font-black ${getGradeColor(trustGrade)}`}>
              {trustGrade}
            </span>
          </div>

          <div className="border-l border-white/10 pl-3">
            <span className="text-[10px] text-slate-500 block uppercase">Trust Score</span>
            <span className="text-xl font-bold text-slate-200">{trustScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Grid: Subject vs Issuer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Subject (End-Entity / Website) */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Certificate Subject (End-Entity)
          </h4>

          <div className="space-y-2 text-slate-200">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px] block">Common Name (CN):</span>
              <span className="text-cyan-300 font-bold break-all">{subject.commonName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block">Organization (O):</span>
                <span className="text-slate-200 truncate block">{subject.organization || 'None (Domain Validated)'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block">Country (C):</span>
                <span className="text-slate-200">{subject.country || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issuer (Certificate Authority) */}
        <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            Issuing Certificate Authority (CA)
          </h4>

          <div className="space-y-2 text-slate-200">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px] block">Common Name (CN):</span>
              <span className="text-purple-300 font-bold break-all">{issuer.commonName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block">CA Organization:</span>
                <span className="text-slate-200 truncate block">{issuer.organization || 'Public Web CA'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block">Serial Number:</span>
                <span className="text-slate-300 truncate block">{issuer.serialNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validity Dates & Countdown */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
        <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Validity Lifespan & Expiration Countdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Not Before (Valid From)</span>
            <span className="text-slate-200 font-semibold">{validFrom}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Not After (Expiry Date)</span>
            <span className={isExpired ? 'text-rose-400 font-bold' : 'text-slate-200 font-semibold'}>
              {validTo}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Remaining Time Window</span>
            <span
              className={`text-sm font-bold ${
                isExpired
                  ? 'text-rose-400'
                  : daysRemaining < 14
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {isExpired ? `EXPIRED (${Math.abs(daysRemaining)} days ago)` : `${daysRemaining} Days Left`}
            </span>
          </div>
        </div>
      </div>

      {/* Subject Alternative Names (SANs) */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Subject Alternative Names (SANs - {subjectAltNames.length})
          </h4>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isHostnameMatched
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}
          >
            {isHostnameMatched ? 'HOSTNAME MATCH VERIFIED' : 'SAN HOSTNAME MISMATCH'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {subjectAltNames.map((san, index) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded bg-slate-900 border border-white/5 text-cyan-200 text-xs font-mono"
            >
              DNS: {san}
            </span>
          ))}
        </div>
      </div>

      {/* Cryptographic Profile & Public Key Info */}
      <div className="rounded-xl bg-[#060b17] border border-white/5 p-4 space-y-3 font-mono text-xs">
        <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-400" />
          Cryptographic Ciphers & Public Key Architecture
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Protocol Version</span>
            <span className="text-cyan-300 font-bold">{protocolVersion}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Signature Algorithm</span>
            <span className="text-slate-200 truncate block" title={signatureAlgorithm}>
              {signatureAlgorithm}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Public Key</span>
            <span className="text-purple-300 font-bold">
              {publicKeyInfo.algorithm} {publicKeyInfo.keySizeBits} bits {publicKeyInfo.curve ? `(${publicKeyInfo.curve})` : ''}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px] block">Forward Secrecy (PFS)</span>
            <span className={isPfsSupported ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {isPfsSupported ? 'Supported (PFS Active)' : 'Not Supported'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="text-slate-400">
            Negotiated Cipher Suite: <strong className="text-slate-200">{cipherSuite}</strong>
          </span>
          <span className="text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            OCSP Status: <strong className="text-emerald-400">{ocspStapling.status}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
