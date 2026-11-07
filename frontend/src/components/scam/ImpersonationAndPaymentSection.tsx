import { UserCheck, CreditCard, ShieldAlert, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface ImpersonationAndPaymentSectionProps {
  impersonation: ScamAnalysisResult['impersonation'];
  paymentIndicators: ScamAnalysisResult['paymentIndicators'];
}

export function ImpersonationAndPaymentSection({
  impersonation,
  paymentIndicators,
}: ImpersonationAndPaymentSectionProps) {
  const { isImpersonationDetected, impersonatedEntity, entityType, channelDiscrepancy, similarityPercent } =
    impersonation;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Section 4: Impersonation Detection */}
      <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
              SECTION 4 • IMPERSONATION DETECTION
            </span>
            <h3 className="text-base md:text-lg font-bold font-mono text-white flex items-center gap-2 mt-0.5">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <span>Institutional & Identity Mimicry</span>
            </h3>
          </div>

          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              isImpersonationDetected
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isImpersonationDetected ? 'IMPERSONATION DETECTED' : 'NO SPOOFING DETECTED'}
          </span>
        </div>

        {isImpersonationDetected ? (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Claimed / Spoofed:</span>
                <span className="text-rose-300 font-bold text-sm">{impersonatedEntity}</span>
              </div>
              {entityType && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Entity Category:</span>
                  <span className="text-slate-200">{entityType}</span>
                </div>
              )}
              {similarityPercent && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Linguistic Resemblance:</span>
                  <span className="text-amber-400 font-bold">{similarityPercent}% Match</span>
                </div>
              )}
            </div>

            {/* Channel Discrepancy Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase tracking-wider font-semibold">Channel Inconsistency Signal:</span>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed pt-1">
                {channelDiscrepancy}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#060b17] border border-white/5 font-mono text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No protected brand logos, corporate VIP names, or government agency marks identified.</span>
          </div>
        )}
      </div>

      {/* Section 5: Payment Request Indicators */}
      <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
              SECTION 5 • PAYMENT & TRANSACTION RAILS
            </span>
            <h3 className="text-base md:text-lg font-bold font-mono text-white flex items-center gap-2 mt-0.5">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Financial Demands & Fund Routing</span>
            </h3>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {paymentIndicators.length} Rails Detected
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {paymentIndicators.map((payment, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border space-y-2 ${
                payment.riskLevel === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : payment.riskLevel === 'high'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-[#060b17] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 flex items-center gap-1.5 text-sm">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  {payment.method === 'None' ? 'No Financial Demands' : `Method: ${payment.method}`}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    payment.riskLevel === 'critical'
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : payment.riskLevel === 'high'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {payment.riskLevel === 'none' ? 'CLEAN' : `${payment.riskLevel} Risk`}
                </span>
              </div>

              <p className="text-slate-300 font-sans text-xs">{payment.details}</p>

              {payment.evidenceSnippet && (
                <div className="bg-black/50 p-2 rounded border border-white/5 text-[11px] text-amber-300 break-all select-all">
                  Snippet: "{payment.evidenceSnippet}"
                </div>
              )}
            </div>
          ))}

          {paymentIndicators.some((p) => p.riskLevel === 'critical') && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Warning: Irreversible payment rails (gift cards, crypto, direct cards) are definitive fraud indicators.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

