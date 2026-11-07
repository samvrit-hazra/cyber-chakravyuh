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
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            SECTIONS 6-9 • TECHNICAL ARTIFACTS & ENTITY EXTRACTION
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Parsed Ingress Telemetry</span>
            <span className="text-xs font-mono text-slate-400 font-normal">({totalCount} Indicators)</span>
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-white/5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'urls'
                ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            URLs ({extractedUrls.length})
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'emails'
                ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Emails ({extractedEmails.length})
          </button>
          <button
            onClick={() => setActiveTab('phones')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'phones'
                ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phones ({extractedPhones.length})
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'entities'
                ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entities ({suspiciousEntities.length})
          </button>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#060b17] border border-white/5 font-mono text-xs text-slate-400">
          No external URLs, email inboxes, telephone routing numbers, or financial tokens parsed in this message.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 6: Extracted URLs */}
          {(activeTab === 'all' || activeTab === 'urls') &&
            extractedUrls.map((urlItem, idx) => (
              <div
                key={`url-${idx}`}
                className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2 font-mono text-xs hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-cyan-400 text-sm">
                    <Globe className="w-4 h-4" /> Extracted URL
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      urlItem.riskRating === 'Hostile'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : urlItem.riskRating === 'Suspicious'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {urlItem.riskRating}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/50 p-2.5 rounded border border-white/5">
                  <span className="text-slate-200 break-all select-all">{urlItem.url}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(urlItem.url)}
                    className="ml-2 text-slate-400 hover:text-cyan-400 shrink-0 cursor-pointer"
                  >
                    {copiedValue === urlItem.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Host: <strong className="text-slate-200">{urlItem.domain}</strong></span>
                  {urlItem.isShortened && <span className="text-amber-400 font-semibold">Shortened URL</span>}
                </div>
                {urlItem.notes && <p className="text-[11px] text-slate-400 italic">{urlItem.notes}</p>}
              </div>
            ))}

          {/* Section 7: Extracted Emails */}
          {(activeTab === 'all' || activeTab === 'emails') &&
            extractedEmails.map((emailItem, idx) => (
              <div
                key={`email-${idx}`}
                className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2 font-mono text-xs hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-purple-400 text-sm">
                    <Mail className="w-4 h-4" /> Extracted Email
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      emailItem.isLookalike
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : emailItem.isFreeProvider
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {emailItem.isLookalike ? 'Lookalike Domain' : emailItem.isFreeProvider ? 'Free Webmail' : 'Enterprise'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/50 p-2.5 rounded border border-white/5">
                  <span className="text-slate-200 break-all select-all">{emailItem.address}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(emailItem.address)}
                    className="ml-2 text-slate-400 hover:text-purple-400 shrink-0 cursor-pointer"
                  >
                    {copiedValue === emailItem.address ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {emailItem.notes && <p className="text-[11px] text-slate-400 italic">{emailItem.notes}</p>}
              </div>
            ))}

          {/* Section 8: Extracted Phone Numbers */}
          {(activeTab === 'all' || activeTab === 'phones') &&
            extractedPhones.map((phoneItem, idx) => (
              <div
                key={`phone-${idx}`}
                className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2 font-mono text-xs hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400 text-sm">
                    <Phone className="w-4 h-4" /> Extracted Phone Number
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      phoneItem.isTollFreeOrVoip
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-500/20 border-slate-500/40 text-slate-300'
                    }`}
                  >
                    {phoneItem.isTollFreeOrVoip ? 'Toll-Free / VoIP' : 'Direct'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/50 p-2.5 rounded border border-white/5">
                  <span className="text-slate-200 break-all select-all font-bold">{phoneItem.formatted}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(phoneItem.formatted)}
                    className="ml-2 text-slate-400 hover:text-amber-400 shrink-0 cursor-pointer"
                  >
                    {copiedValue === phoneItem.formatted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {phoneItem.notes && <p className="text-[11px] text-slate-400 italic">{phoneItem.notes}</p>}
              </div>
            ))}

          {/* Section 9: Potentially Suspicious Entities */}
          {(activeTab === 'all' || activeTab === 'entities') &&
            suspiciousEntities.map((entity, idx) => (
              <div
                key={`entity-${idx}`}
                className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2 font-mono text-xs hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-rose-400 text-sm">
                    <ShieldAlert className="w-4 h-4" /> {entity.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      entity.riskWeight === 'critical'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : entity.riskWeight === 'high'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    }`}
                  >
                    {entity.riskWeight}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/50 p-2.5 rounded border border-white/5">
                  <span className="text-slate-200 break-all select-all font-bold">{entity.name}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(entity.name)}
                    className="ml-2 text-slate-400 hover:text-rose-400 shrink-0 cursor-pointer"
                  >
                    {copiedValue === entity.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 font-sans">{entity.details}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

