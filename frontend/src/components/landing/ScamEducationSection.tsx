import { Globe, Lock, CornerDownRight, AlertTriangle } from 'lucide-react';

export function ScamEducationSection() {
  const traps = [
    {
      step: '01',
      title: 'The Lookalike Domain (Typosquatting)',
      subtitle: 'Subdomains and sneaky spelling tricks',
      icon: <Globe className="w-5 h-5 text-[#22D3EE]" />,
      description:
        'Attackers register deceptive variations like "paypal.com.account-update.net". To an untrained eye, "paypal.com" appears first, but the actual authoritative domain is "account-update.net". Foreign homoglyph characters (e.g. Cyrillic "а") are also used to mimic Latin letters.',
      example: 'Actual Host: account-update.net (NOT PayPal)',
      badge: 'Visual Deception',
    },
    {
      step: '02',
      title: 'The "Green Padlock" Fallacy',
      subtitle: 'Why HTTPS does NOT equal safe',
      icon: <Lock className="w-5 h-5 text-[#C47A52]" />,
      description:
        'A browser padlock only indicates that the connection is encrypted. Modern phishing campaigns obtain free automated SSL certificates via Let’s Encrypt in under 2 minutes. The certificate verifies the pipe, not the owner or intention.',
      example: 'Over 85% of active phishing portals serve valid HTTPS',
      badge: 'False Security',
    },
    {
      step: '03',
      title: 'Silent Multi-Hop Redirection',
      subtitle: 'Cloaking past automated security filters',
      icon: <CornerDownRight className="w-5 h-5 text-[#F59E0B]" />,
      description:
        'Attackers route through URL shorteners or compromised WordPress endpoints to evade gateway sandboxes. The visitor is bounced through 2 or 3 intermediate 301/302 redirects before arriving at the weaponized credential harvester.',
      example: 'bit.ly/3x8f → cdn-gate.top → malicious-phish.net/login',
      badge: 'Cloaking Vector',
    },
    {
      step: '04',
      title: 'Artificial Urgency & Fear Anchors',
      subtitle: 'Forcing panic before rational inspection',
      icon: <AlertTriangle className="w-5 h-5 text-[#EF4444]" />,
      description:
        '"Account suspended in 24 hours", "Unauthorized charge of $489 detected", "IRS final legal dispatch". Attackers create manufactured deadlines so victims rush to click without checking the browser address bar.',
      example: 'Pressure tactic: "Action required within 12 hours"',
      badge: 'Psychological Hook',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative border-t border-[#252D3A] bg-[#090B10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22D3EE] block">
            Security Literacy & Threat Mechanics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F1F5F9] tracking-tight">
            How Deceptive Links Actually Trap You
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
            Modern web threats use legitimate hosting providers, automated TLS certificates, and internationalized punycode domain hierarchies to deceive victims.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {traps.map((trap) => (
            <div
              key={trap.step}
              className="p-6 rounded-2xl bg-[#10141D] border border-[#252D3A] space-y-4 hover:border-[#3B465A] transition-all shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#151B26] border border-[#252D3A] flex items-center justify-center">
                  {trap.icon}
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#151B26] text-[#94A3B8] border border-[#252D3A]">
                  {trap.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-heading text-[#F1F5F9]">{trap.title}</h3>
                <p className="text-xs text-[#22D3EE] font-mono mt-0.5">{trap.subtitle}</p>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
                {trap.description}
              </p>

              <div className="p-3 rounded-xl bg-[#090B10] border border-[#252D3A] font-mono text-xs text-[#FCD34D]">
                ⚠️ {trap.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
