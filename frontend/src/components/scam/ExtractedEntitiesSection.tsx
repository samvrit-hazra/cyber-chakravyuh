import { useState } from 'react';
import { Globe, Mail, Phone, Layers, ShieldAlert, Check, Copy } from 'lucide-react';
import type { ScamAnalysisResult } from '../../types/scam.ts';

interface ExtractedEntitiesSectionProps {
  extractedUrls: ScamAnalysisResult['extractedUrls'];
  extractedEmails: ScamAnalysisResult['extractedEmails'];
  extractedPhones: ScamAnalysisResult['extractedPhones'];
  suspiciousEntities: ScamAnalysisResult['suspiciousEntities'];
}

export function ExtractedEntitiesSection({
  extractedUrls,
  extractedEmails,
  extractedPhones,
  suspiciousEntities,
}: ExtractedEntitiesSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'urls' | 'emails' | 'phones' | 'entities'>('all');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const totalCount =
    extractedUrls.length + extractedEmails.length + extractedPhones.length + suspiciousEntities.length;

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedValue(val);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
            SECTIONS 6-9 • TECHNICAL ARTIFACTS & ENTITY EXTRACTION
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
            <Layers className="w-5 h-5 text-[#A95636] dark:text-[#C47A52]" />
            <span>Parsed Ingress Telemetry</span>
            <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">({totalCount} Indicators)</span>
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#F3F1E9] dark:bg-[#101A1D] p-1 rounded-lg border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
          {(['all', 'urls', 'emails', 'phones', 'entities'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? totalCount
                : tab === 'urls'
                ? extractedUrls.length
                : tab === 'emails'
                ? extractedEmails.length
                : tab === 'phones'
                ? extractedPhones.length
                : suspiciousEntities.length;
            const label = tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-bold shadow-xs border border-[#D9DED7] dark:border-[#304144]'
                    : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] font-mono text-xs text-[#647477] dark:text-[#A6B3AE]">
          No external URLs, email inboxes, telephone routing numbers, or financial tokens parsed in this message.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 6: Extracted URLs */}
          {(activeTab === 'all' || activeTab === 'urls') &&
            extractedUrls.map((urlItem, idx) => (
              <div
                key={`url-${idx}`}
                className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 font-mono text-xs hover:border-[#A95636]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-[#356D68] dark:text-[#79A99C] text-sm">
                    <Globe className="w-4 h-4" /> Extracted URL
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      urlItem.riskRating === 'Hostile'
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                        : urlItem.riskRating === 'Suspicious'
                        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {urlItem.riskRating}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-[#19272A] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                  <span className="text-[#182629] dark:text-[#E8E6DC] break-all select-all font-mono">{urlItem.url}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(urlItem.url)}
                    className="ml-2 text-[#647477] dark:text-[#A6B3AE] hover:text-[#A95636] dark:hover:text-[#C47A52] shrink-0 cursor-pointer"
                  >
                    {copiedValue === urlItem.url ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex justify-between text-[11px] text-[#647477] dark:text-[#A6B3AE] pt-1">
                  <span>Host: <strong className="text-[#182629] dark:text-[#E8E6DC]">{urlItem.domain}</strong></span>
                  {urlItem.isShortened && <span className="text-amber-600 dark:text-amber-400 font-semibold">Shortened URL</span>}
                </div>
                {urlItem.notes && <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] italic">{urlItem.notes}</p>}
              </div>
            ))}

          {/* Section 7: Extracted Emails */}
          {(activeTab === 'all' || activeTab === 'emails') &&
            extractedEmails.map((emailItem, idx) => (
              <div
                key={`email-${idx}`}
                className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 font-mono text-xs hover:border-[#A95636]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-[#A95636] dark:text-[#C47A52] text-sm">
                    <Mail className="w-4 h-4" /> Extracted Email
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      emailItem.isLookalike
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                        : emailItem.isFreeProvider
                        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {emailItem.isLookalike ? 'Lookalike Domain' : emailItem.isFreeProvider ? 'Free Webmail' : 'Enterprise'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-[#19272A] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                  <span className="text-[#182629] dark:text-[#E8E6DC] break-all select-all">{emailItem.address}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(emailItem.address)}
                    className="ml-2 text-[#647477] dark:text-[#A6B3AE] hover:text-[#A95636] dark:hover:text-[#C47A52] shrink-0 cursor-pointer"
                  >
                    {copiedValue === emailItem.address ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {emailItem.notes && <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] italic">{emailItem.notes}</p>}
              </div>
            ))}

          {/* Section 8: Extracted Phone Numbers */}
          {(activeTab === 'all' || activeTab === 'phones') &&
            extractedPhones.map((phoneItem, idx) => (
              <div
                key={`phone-${idx}`}
                className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 font-mono text-xs hover:border-[#A95636]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 text-sm">
                    <Phone className="w-4 h-4" /> Extracted Phone Number
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      phoneItem.isTollFreeOrVoip
                        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-500/10 dark:bg-slate-800/30 border-slate-400/30 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {phoneItem.isTollFreeOrVoip ? 'Toll-Free / VoIP' : 'Direct'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-[#19272A] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                  <span className="text-[#182629] dark:text-[#E8E6DC] break-all select-all font-bold">{phoneItem.formatted}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(phoneItem.formatted)}
                    className="ml-2 text-[#647477] dark:text-[#A6B3AE] hover:text-[#A95636] dark:hover:text-[#C47A52] shrink-0 cursor-pointer"
                  >
                    {copiedValue === phoneItem.formatted ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {phoneItem.notes && <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] italic">{phoneItem.notes}</p>}
              </div>
            ))}

          {/* Section 9: Potentially Suspicious Entities */}
          {(activeTab === 'all' || activeTab === 'entities') &&
            suspiciousEntities.map((entity, idx) => (
              <div
                key={`entity-${idx}`}
                className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2 font-mono text-xs hover:border-[#A95636]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 text-sm">
                    <ShieldAlert className="w-4 h-4" /> {entity.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      entity.riskWeight === 'critical'
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-700 dark:text-rose-300'
                        : entity.riskWeight === 'high'
                        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'bg-[#356D68]/10 dark:bg-[#79A99C]/20 border-[#356D68]/30 text-[#356D68] dark:text-[#79A99C]'
                    }`}
                  >
                    {entity.riskWeight}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-[#19272A] p-2.5 rounded border border-[#D9DED7] dark:border-[#304144]">
                  <span className="text-[#182629] dark:text-[#E8E6DC] break-all select-all font-bold">{entity.name}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(entity.name)}
                    className="ml-2 text-[#647477] dark:text-[#A6B3AE] hover:text-rose-600 dark:hover:text-rose-400 shrink-0 cursor-pointer"
                  >
                    {copiedValue === entity.name ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] text-[#647477] dark:text-[#A6B3AE] font-sans">{entity.details}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
