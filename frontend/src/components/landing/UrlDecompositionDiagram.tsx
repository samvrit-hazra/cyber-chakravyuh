import { useState, useMemo } from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const freqs: Record<string, number> = {};
  for (const char of str) {
    freqs[char] = (freqs[char] || 0) + 1;
  }
  let ent = 0;
  for (const char in freqs) {
    const p = freqs[char] / str.length;
    ent -= p * Math.log2(p);
  }
  return Number(ent.toFixed(2));
}

function parseUriComponents(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let urlWithScheme = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    urlWithScheme = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(urlWithScheme);
    const hostParts = parsed.hostname.split('.');
    let rootDomain = parsed.hostname;
    let subdomain = '';

    if (hostParts.length > 2) {
      rootDomain = hostParts.slice(-2).join('.');
      subdomain = hostParts.slice(0, -2).join('.') + '.';
    }

    const scheme = parsed.protocol + '//';
    const pathAndQuery = (parsed.pathname || '/') + parsed.search + parsed.hash;
    const entropy = calculateShannonEntropy(parsed.hostname);

    return {
      raw: trimmed,
      scheme,
      subdomain,
      rootDomain,
      path: pathAndQuery,
      entropy: `${entropy} Bits`,
      hostnameLength: parsed.hostname.length,
      pathDepth: parsed.pathname.split('/').filter(Boolean).length,
    };
  } catch {
    return null;
  }
}

export function UrlDecompositionDiagram() {
  const [inputUrl, setInputUrl] = useState<string>('https://cyber-chakravyuh.internal/audit/inspect');

  const decomposed = useMemo(() => {
    return parseUriComponents(inputUrl);
  }, [inputUrl]);

  return (
    <div className="w-full bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] rounded-md shadow-sm overflow-hidden text-left">
      {/* Schematic Header Bar */}
      <div className="px-4 py-3 bg-[#EAECE6] dark:bg-[#223336] border-b border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider text-[#647477] dark:text-[#A6B3AE] uppercase">
          <Layers className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
          <span>RFC 3986 Lexical Decomposition Schematic</span>
        </div>

        <div className="text-[10px] font-mono text-[#356D68] dark:text-[#79A99C] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Live String Parser</span>
        </div>
      </div>

      {/* Interactive Input Bar */}
      <div className="px-4 py-2.5 bg-[#F3F1E9] dark:bg-[#101A1D] border-b border-[#D9DED7] dark:border-[#304144] flex items-center gap-2">
        <span className="text-[11px] font-mono font-bold text-[#647477] dark:text-[#A6B3AE] shrink-0">
          Target URI:
        </span>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste or type any target URI (e.g., https://your-domain.com/login)..."
          className="flex-1 bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] rounded px-2.5 py-1 text-xs font-mono text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE] outline-none focus:border-[#A95636] dark:focus:border-[#C47A52]"
        />
      </div>

      {/* Main Forensic Anatomy */}
      <div className="p-5 sm:p-6 space-y-6">
        {decomposed ? (
          <>
            {/* Visual String Breakdown */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-medium text-[#647477] dark:text-[#A6B3AE] flex items-center justify-between">
                <span>Target URI Syntax Decomposition</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#356D68]/10 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/30">
                  Calculated Entropy: {decomposed.entropy}
                </span>
              </div>

              {/* Color-Coded URI Segment Blocks */}
              <div className="p-3.5 bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] rounded text-xs sm:text-sm font-mono break-all flex flex-wrap items-center gap-0.5 leading-relaxed">
                {/* 1. Scheme */}
                <span
                  className="text-[#647477] dark:text-[#A6B3AE] bg-white dark:bg-[#19272A] px-1.5 py-0.5 rounded border border-[#D9DED7] dark:border-[#304144]"
                  title="Scheme: Transport Protocol"
                >
                  {decomposed.scheme}
                </span>

                {/* 2. Subdomains */}
                {decomposed.subdomain && (
                  <span
                    className="text-[#356D68] dark:text-[#79A99C] bg-[#356D68]/10 dark:bg-[#79A99C]/15 px-1.5 py-0.5 rounded border border-[#356D68]/20 dark:border-[#79A99C]/30"
                    title="Subdomain Hierarchy Depth"
                  >
                    {decomposed.subdomain}
                  </span>
                )}

                {/* 3. Root Domain */}
                <span
                  className="text-[#A95636] dark:text-[#C47A52] bg-[#A95636]/10 dark:bg-[#C47A52]/15 px-1.5 py-0.5 rounded font-bold border border-[#A95636]/30 dark:border-[#C47A52]/30"
                  title="Authoritative Root Domain: True Registrar Ingress"
                >
                  {decomposed.rootDomain}
                </span>

                {/* 4. Path Payload */}
                <span
                  className="text-[#647477] dark:text-[#A6B3AE] px-1 py-0.5"
                  title="Resource Path & Query Arguments"
                >
                  {decomposed.path}
                </span>
              </div>

              {/* Segment Key Legend */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-mono text-[#647477] dark:text-[#A6B3AE]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-[#647477]" /> Scheme
                </span>
                {decomposed.subdomain && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-[#356D68] dark:bg-[#79A99C]" /> Subdomain Hierarchy
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-[#A95636] dark:bg-[#C47A52]" /> Root Domain Authority
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-[#D9DED7] dark:bg-[#304144]" /> Resource Endpoint & Arguments
                </span>
              </div>
            </div>

            {/* 3 Technical Signal Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
                <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">Shannon Entropy</span>
                <div className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate">{decomposed.entropy}</div>
                <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-sans">
                  Quantifies lexical randomness across the domain character distribution.
                </p>
              </div>

              <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
                <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">Hostname Length</span>
                <div className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate">
                  {decomposed.hostnameLength} Characters
                </div>
                <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-sans">
                  Long nested subdomains often indicate credential harvesting spoof lures.
                </p>
              </div>

              <div className="p-3 bg-[#EAECE6]/50 dark:bg-[#223336]/40 border border-[#D9DED7] dark:border-[#304144] rounded space-y-1">
                <span className="text-[10px] uppercase text-[#647477] dark:text-[#A6B3AE]">Path Depth</span>
                <div className="font-bold text-[#182629] dark:text-[#E8E6DC] truncate">
                  {decomposed.pathDepth} Segment{decomposed.pathDepth === 1 ? '' : 's'}
                </div>
                <p className="text-[10px] text-[#647477] dark:text-[#A6B3AE] font-sans">
                  Endpoint depth reveals routing hierarchy and payload masquerading.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
            Enter a valid target URI above to inspect RFC 3986 lexical decomposition in real-time.
          </div>
        )}
      </div>
    </div>
  );
}
