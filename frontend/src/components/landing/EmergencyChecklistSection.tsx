import { AlertOctagon, ShieldCheck } from 'lucide-react';

export function EmergencyChecklistSection() {
  const steps = [
    {
      num: '1',
      title: 'Close the Tab Immediately',
      instruction:
        'Do not click anything else on the page, do not click "cancel" or "unsubscribe" buttons inside the suspicious page, and terminate all browser tabs opened from that origin.',
    },
    {
      num: '2',
      title: 'Rotate Credentials Instantly',
      instruction:
        'Navigate directly to the REAL official portal (e.g. manually type "paypal.com" into your address bar, do not use the email link). Change your password and select "Sign out of all other sessions".',
    },
    {
      num: '3',
      title: 'Enforce App-Based 2FA',
      instruction:
        'Activate 2FA using a TOTP authenticator app (like 1Password, Bitwarden, or Google Authenticator). Avoid SMS 2FA where possible to protect against SIM-swap intercepts.',
    },
    {
      num: '4',
      title: 'Freeze Compromised Cards',
      instruction:
        'Immediately open your card issuer’s official app to freeze the card, or call the telephone number printed on the physical back of your debit/credit card.',
    },
    {
      num: '5',
      title: 'Run a Local Antivirus Scan',
      instruction:
        'If any payload or browser extension was prompted or downloaded, execute a full system scan via Windows Defender or Malwarebytes to detect background spyware.',
    },
  ];

  return (
    <section id="emergency" className="py-10 sm:py-12 relative border-t border-[#D9DED7] dark:border-[#304144] bg-[#F3F1E9] dark:bg-[#101A1D] transition-colors scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-5 sm:p-6 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DED7] dark:border-[#304144] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-md bg-[#B64B46]/10 dark:bg-[#E17B70]/15 border border-[#B64B46]/25 dark:border-[#E17B70]/35 text-[#B64B46] dark:text-[#E17B70]">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B64B46] dark:text-[#E17B70] block">
                  Incident Response Playbook
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">
                  Already Clicked A Suspicious Link?
                </h3>
              </div>
            </div>
            <span className="text-xs text-[#647477] dark:text-[#A6B3AE] font-mono">
              Execute these 5 containment steps immediately:
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 hover:border-[#A95636] dark:hover:border-[#C47A52] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#A95636]/10 dark:bg-[#C47A52]/20 text-[#A95636] dark:text-[#C47A52] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {step.num}
                  </span>
                  <h4 className="text-xs font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-relaxed pl-8 font-sans">
                  {step.instruction}
                </p>
              </div>
            ))}

            {/* Final reassurance box */}
            <div className="p-4 rounded-md bg-[#36745F]/10 dark:bg-[#79B69A]/10 border border-[#36745F]/30 dark:border-[#79B69A]/30 flex flex-col justify-center space-y-1.5">
              <div className="flex items-center gap-2 text-[#36745F] dark:text-[#79B69A] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Containment Confirmed</span>
              </div>
              <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                Taking proactive containment actions within 15 minutes neutralizes over 92% of automated phishing exploitation attempts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
