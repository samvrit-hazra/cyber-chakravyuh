import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can my computer or phone get compromised just by visiting a webpage?',
      a: 'Modern operating systems and browsers run web renderers in isolated process sandboxes. In the vast majority of scenarios, loading a webpage without interacting will not compromise your device, provided security updates are maintained. The danger lies in secondary vectors: submitting passwords into deceptive forms, downloading executable binaries or malicious browser extensions, or granting clipboard/camera permissions.',
    },
    {
      q: 'Why did the fake website have a padlock icon (HTTPS)?',
      a: 'A browser padlock only certifies that traffic is encrypted in transit between client and server. Anyone can obtain a free Domain Validation (DV) TLS certificate in under two minutes via automated certificate authorities. Over 85% of modern phishing websites utilize active HTTPS certificates specifically to project false legitimacy.',
    },
    {
      q: 'What is homoglyph spoofing and punycode?',
      a: 'Homoglyph attacks exploit the Internationalized Domain Name (IDN) standard by substituting Latin characters with visually identical glyphs from Cyrillic, Greek, or Hebrew alphabets. For example, Cyrillic "а" (Unicode U+0430) is rendered identically to Latin "a" (U+0061), but resolves via punycode to an entirely separate, adversary-controlled host. Our engine audits homoglyph discrepancies on every scan.',
    },
    {
      q: 'Do you store or log the links and message snippets I inspect?',
      a: 'No. Cyber Chakravyuh operates under a strict privacy-first model. URLs, parameters, and message content are evaluated ephemerally in volatile memory to calculate risk indicators. We never record submitted passwords, session tokens, or personally identifiable information (PII).',
    },
    {
      q: 'How does the platform distinguish between safe, suspicious, and inconclusive domains?',
      a: 'Our engine computes multi-factor telemetry across authoritative DNS records, WHOIS registration chronology, TLS certificate transparency logs, BGP routing ASN reputation, and lexical Shannon entropy. Crucially, a newly registered domain with zero threat records is classified as Inconclusive with explicit limitations, rather than falsely declaring it "100% Safe".',
    },
  ];

  return (
    <section id="faq" className="py-10 sm:py-12 relative border-t border-[#D9DED7] dark:border-[#304144] bg-[#F3F1E9] dark:bg-[#101A1D] transition-colors scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#EAECE6] dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[11px] font-mono text-[#A95636] dark:text-[#C47A52]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#182629] dark:text-[#E8E6DC] tracking-tight">
            Security Intelligence FAQ
          </h2>
          <p className="text-xs sm:text-sm text-[#647477] dark:text-[#A6B3AE] leading-relaxed font-sans">
            Technical clarity on URL safety, detection heuristics, and safe browsing practices.
          </p>
        </div>

        {/* Single Unified Contiguous Accordion Block */}
        <div className="rounded-xl border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] divide-y divide-[#D9DED7] dark:divide-[#304144] shadow-xs overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold font-heading transition-colors cursor-pointer ${
                    isOpen
                      ? 'text-[#A95636] dark:text-[#C47A52] bg-[#F3F1E9]/40 dark:bg-[#223336]/30'
                      : 'text-[#182629] dark:text-[#E8E6DC] hover:bg-[#F3F1E9]/60 dark:hover:bg-[#223336]/40 hover:text-[#A95636] dark:hover:text-[#C47A52]'
                  }`}
                >
                  <span className="leading-snug">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#A95636] dark:text-[#C47A52] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#647477] dark:text-[#A6B3AE] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#647477] dark:text-[#A6B3AE] leading-relaxed border-t border-[#D9DED7]/60 dark:border-[#304144]/60 bg-[#F3F1E9]/20 dark:bg-[#101A1D]/20 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
