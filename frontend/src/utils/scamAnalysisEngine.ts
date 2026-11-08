import type {
  ScamAnalysisResult,
  ScamRiskClassification,
  ExtractedUrl,
  ExtractedEmail,
  ExtractedPhone,
  SuspiciousEntity,
} from '../types/scam.ts';

export interface ExampleScamPreset {
  id: string;
  categoryLabel: string;
  title: string;
  description: string;
  expectedClassification: ScamRiskClassification;
  sampleText: string;
}

export const SCAM_EXAMPLE_PRESETS: ExampleScamPreset[] = [];

/**
 * Extracts URLs, emails, phone numbers, and potential crypto/financial tokens from message text
 */
export function extractTechnicalEntities(text: string) {
  // URLs
  const urlMatches = text.match(/https?:\/\/[^\s"'<>]+/gi) || [];
  const extractedUrls: ExtractedUrl[] = Array.from(new Set(urlMatches)).map((u) => {
    try {
      const parsed = new URL(u);
      const isShort = ['bit.ly', 'tinyurl.com', 't.co', 'rb.gy', 'is.gd'].includes(parsed.hostname);
      const isSuspiciousHost =
        parsed.hostname.includes('resolver') ||
        parsed.hostname.includes('unlock') ||
        parsed.hostname.includes('online') ||
        parsed.hostname.includes('claim') ||
        parsed.hostname.endsWith('.xyz') ||
        parsed.hostname.endsWith('.top');
      return {
        url: u,
        domain: parsed.hostname,
        riskRating: isSuspiciousHost ? 'Hostile' : isShort ? 'Suspicious' : 'Clean',
        isShortened: isShort,
        notes: isSuspiciousHost
          ? 'Domain exhibits deceptive keywords typical of credential harvesting kits'
          : isShort
          ? 'Shortened URL obscures true routing destination'
          : 'Standard hostname formatting',
      };
    } catch {
      return {
        url: u,
        domain: u,
        riskRating: 'Suspicious',
        isShortened: false,
        notes: 'Malformed or unparseable URL string',
      };
    }
  });

  // Emails
  const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi) || [];
  const extractedEmails: ExtractedEmail[] = Array.from(new Set(emailMatches)).map((email) => {
    const domain = email.split('@')[1] || '';
    const isFree = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain.toLowerCase());
    const isLookalike = domain.includes('consultant') || domain.includes('executive') || domain.includes('vip');
    return {
      address: email,
      domain,
      isFreeProvider: isFree,
      isLookalike,
      notes: isLookalike
        ? 'Domain mimics executive authority or custom spoofing relay'
        : isFree
        ? 'Consumer free webmail provider used for institutional outreach'
        : 'Enterprise or custom domain',
    };
  });

  // Phone numbers
  const phoneMatches = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
  const extractedPhones: ExtractedPhone[] = Array.from(new Set(phoneMatches)).map((num) => {
    const clean = num.replace(/[^\d+]/g, '');
    const isTollFree = clean.includes('800') || clean.includes('888') || clean.includes('877') || clean.includes('866');
    return {
      number: num,
      formatted: num.trim(),
      isTollFreeOrVoip: isTollFree,
      notes: isTollFree
        ? 'Toll-free prefix frequently provisioned through untracked SIP VoIP relays'
        : 'Direct dialing format',
    };
  });

  // Suspicious Entities (Crypto wallets, Case numbers, etc.)
  const suspiciousEntities: SuspiciousEntity[] = [];

  // TRC20 / Tron address check (Starts with T, length 34)
  const tronMatches = text.match(/\bT[A-Za-z1-9]{33}\b/g);
  if (tronMatches) {
    tronMatches.forEach((addr) => {
      suspiciousEntities.push({
        name: addr,
        type: 'Cryptocurrency Wallet',
        details: 'TRON TRC-20 wallet address. Irreversible pseudonymous transaction rail.',
        riskWeight: 'critical',
      });
    });
  }

  // Bitcoin address check
  const btcMatches = text.match(/\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g);
  if (btcMatches) {
    btcMatches.forEach((addr) => {
      suspiciousEntities.push({
        name: addr,
        type: 'Cryptocurrency Wallet',
        details: 'Bitcoin on-chain address. High association with extortion or unregulated investment.',
        riskWeight: 'critical',
      });
    });
  }

  // Case references
  const caseMatches = text.match(/(?:case|reference|ref|code)[=:\s]+([a-zA-Z0-9-_]+)/gi);
  if (caseMatches) {
    caseMatches.forEach((m) => {
      suspiciousEntities.push({
        name: m.trim(),
        type: 'Case Reference',
        details: 'Fabricated institutional docket or tracking number engineered to simulate legitimacy.',
        riskWeight: 'medium',
      });
    });
  }

  return {
    extractedUrls,
    extractedEmails,
    extractedPhones,
    suspiciousEntities,
  };
}

/**
 * Analyzes a raw message or evaluates via API if online
 */
export async function performScamAnalysis(rawText: string): Promise<ScamAnalysisResult> {
  const trimmed = rawText.trim();
  const startTime = Date.now();

  // Try real API endpoint if server is available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const response = await fetch('http://localhost:5000/api/v1/analyze-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        isDemoState: false,
        dataSourceLabel: 'Chakravyuha Multi-Vector Cognitive API',
      };
    }
  } catch {
    // Graceful offline fallback to client-side heuristics engine
  }

  // Client-side heuristics engine
  return buildSyntheticScamAnalysis(trimmed, Date.now() - startTime);
}

function buildSyntheticScamAnalysis(text: string, _durationMs: number): ScamAnalysisResult {
  const lower = text.toLowerCase();
  const entities = extractTechnicalEntities(text);

  // Check matching presets or build dynamic heuristics
  const isChase = lower.includes('chase') || (lower.includes('bank') && lower.includes('alert'));
  const isCrypto = lower.includes('usdt') || lower.includes('crypto') || lower.includes('arbitrage') || lower.includes('guaranteed 450%');
  const isJob = lower.includes('resume') && (lower.includes('daily') || lower.includes('hr') || lower.includes('whatsapp'));
  const isGiftCard = lower.includes('gift card') || lower.includes('apple gift') || lower.includes('scratch the pin');
  const isTechSupport = lower.includes('trojan') || lower.includes('microsoft certified') || lower.includes('call microsoft');
  const isBenignDevops = lower.includes('production cluster') || lower.includes('grafana') || lower.includes('sre') || lower.includes('vpn');

  // PRESET 1: Chase Bank SMS Smishing
  if (isChase) {
    return {
      analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      contentLength: text.length,
      rawSnippet: text.slice(0, 140) + '...',
      riskClassification: 'Confirmed Scam / Fraud',
      riskScore: 96,
      confidenceScore: 98,
      scamCategory: 'Phishing & Credential Harvest',
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
      suspiciousLanguage: {
        flaggedKeywords: ['PERMANENTLY CANCELED', 'IMMEDIATELY', 'RESTRICTED', 'UNRECOGNIZED TRANSACTION'],
        syntaxNotes: ['High artificial urgency designed to bypass analytical thinking', 'Generic case parameter in URL'],
        sentimentTone: 'Threatening / Coercive Alarmism',
        deceptiveStyleScore: 94,
      },
      urgencyAndManipulation: {
        urgencyScore: 92,
        isUrgencyLegitimate: false,
        urgencyRationale: 'Arbitrary 2-hour deadline designed to induce panic and force hurried credential entry.',
        indicators: [
          {
            technique: 'Fear of Financial Loss',
            severity: 'critical',
            explanation: 'Fabricated $1,429.99 charge alerts provoke panic so victims click without inspecting the URL domain.',
            supportingSnippet: 'Unrecognized transaction of $1,429.99 attempted at Target NY.',
          },
          {
            technique: 'False Urgency Time Lock',
            severity: 'critical',
            explanation: 'Threatening permanent card cancellation creates artificial time pressure.',
            supportingSnippet: 'or your debit card will be permanently canceled within 2 hours.',
          },
        ],
      },
      impersonation: {
        isImpersonationDetected: true,
        impersonatedEntity: 'JPMorgan Chase & Co.',
        entityType: 'Financial Institution',
        channelDiscrepancy: 'Legitimate banks do not send unencrypted SMS directing clients to .online TLD domains.',
        similarityPercent: 96,
      },
      paymentIndicators: [
        {
          method: 'Direct Card Entry',
          riskLevel: 'critical',
          evidenceSnippet: 'verify your identity immediately at https://chase-security-resolver.online/unlock',
          details: 'Landing page attempts to harvest CVV, card expiration, and online banking passwords.',
        },
      ],
      extractedUrls: entities.extractedUrls.length > 0 ? entities.extractedUrls : [
        {
          url: 'https://chase-security-resolver.online/unlock?case=9412',
          domain: 'chase-security-resolver.online',
          riskRating: 'Hostile',
          isShortened: false,
          notes: 'Typosquatting brand name with suspicious .online TLD',
        },
      ],
      extractedEmails: entities.extractedEmails,
      extractedPhones: entities.extractedPhones,
      suspiciousEntities: [
        {
          name: 'Target NY ($1,429.99)',
          type: 'Organization',
          details: 'Fictitious merchant claim used as emotional trigger.',
          riskWeight: 'high',
        },
        {
          name: 'chase-security-resolver.online',
          type: 'Organization',
          details: 'Newly registered hostile credential interception host.',
          riskWeight: 'critical',
        },
      ],
      aiExplanation: {
        summaryRationale:
          'This message exhibits textbook smishing patterns: it pairs an alarming fraudulent transaction claim with an arbitrary 2-hour countdown, driving the recipient toward an unverified third-party domain.',
        supportingSnippets: [
          {
            quote: 'Your online banking access has been restricted to prevent loss.',
            context: 'Account state coercive hook',
            flaggedReason: 'Fabricated restriction to force immediate user engagement.',
            severity: 'critical',
          },
          {
            quote: 'https://chase-security-resolver.online/unlock?case=9412',
            context: 'Hostile URL ingress',
            flaggedReason: 'Non-authoritative domain spoofing Chase Bank.',
            severity: 'critical',
          },
        ],
        manipulationTechniques: [
          'Pretexting & Institutional Authority Bias',
          'Urgency-Induced Cognitive Tunneling',
          'Loss Aversion Reflex Exploitation',
        ],
        evidenceVsInterpretation: {
          hardEvidence: [
            'Target domain "chase-security-resolver.online" is not registered to JPMorgan Chase & Co.',
            'Transmission vector is an unauthenticated SMS rather than in-app push notification.',
            'Contains coercive 2-hour deadline for financial account suspension.',
          ],
          aiInterpretation: [
            'The attacker intends to route victim to a reverse-proxy phishing kit to intercept MFA tokens.',
            'The tone deliberately mimics standard risk mitigation disclaimers to disarm user skepticism.',
          ],
        },
      },
      recommendedPrecautions: [
        {
          id: 'PREC-01',
          priority: 'Immediate',
          instruction: 'Do NOT click the link or provide debit card credentials, PINs, or OTPs.',
          rationale: 'The link directs to an adversary-controlled credential harvester.',
        },
        {
          id: 'PREC-02',
          priority: 'Immediate',
          instruction: 'Verify account status exclusively via official Chase mobile app or the phone number on your physical card.',
          rationale: 'Out-of-band verification confirms that no actual charge was attempted.',
        },
        {
          id: 'PREC-03',
          priority: 'Important',
          instruction: 'Forward message to 7726 (SPAM) to notify telecom security feeds.',
          rationale: 'Helps carriers block the malicious sender address for other subscribers.',
        },
      ],
      securityDisclosureNotice:
        'Zero-Credential Rule: Legitimate institutions will NEVER ask for passwords, OTP security codes, or card PIN numbers via SMS or unsolicited email.',
    };
  }

  // PRESET 2: Crypto High-Yield Investment
  if (isCrypto) {
    return {
      analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      contentLength: text.length,
      rawSnippet: text.slice(0, 140) + '...',
      riskClassification: 'Confirmed Scam / Fraud',
      riskScore: 94,
      confidenceScore: 96,
      scamCategory: 'Financial & Crypto Investment',
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
      suspiciousLanguage: {
        flaggedKeywords: ['GUARANTEED 450% RETURNS', 'ZERO RISK', 'LIMITED SLOTS', 'SEND FUNDS DIRECTLY'],
        syntaxNotes: ['Absurd mathematical promises ("guaranteed 450% weekly")', 'Urgency via artificial scarcity ("10 slots today only")'],
        sentimentTone: 'Hyperbolic Greed / Exaggerated Exclusivity',
        deceptiveStyleScore: 96,
      },
      urgencyAndManipulation: {
        urgencyScore: 84,
        isUrgencyLegitimate: false,
        urgencyRationale: 'Artificial scarcity trick: claims only 10 slots remain to prevent victims from conducting due diligence.',
        indicators: [
          {
            technique: 'Greed Lure & False Certainty',
            severity: 'critical',
            explanation: 'Guarantees 450% returns with zero risk, a financial impossibility in legitimate economics.',
            supportingSnippet: 'delivers guaranteed 450% weekly returns with zero risk.',
          },
          {
            technique: 'Artificial Scarcity Pressure',
            severity: 'high',
            explanation: 'Induces FOMO (fear of missing out) by limiting entry to first 10 participants.',
            supportingSnippet: 'Limited slots available for first 10 participants today only!',
          },
        ],
      },
      impersonation: {
        isImpersonationDetected: true,
        impersonatedEntity: 'Binance & Uniswap Liquidity Protocol',
        entityType: 'Financial Platform',
        channelDiscrepancy: 'Deceitful association with reputable decentralized and centralized exchanges.',
        similarityPercent: 88,
      },
      paymentIndicators: [
        {
          method: 'Cryptocurrency',
          riskLevel: 'critical',
          evidenceSnippet: 'TQr6Z8pLkM9vNx4w1kQe7yRs3bT9vNx4w',
          details: 'Direct transfer to unhosted TRON TRC-20 wallet. Transactions are irreversible and unrecoverable.',
        },
      ],
      extractedUrls: entities.extractedUrls,
      extractedEmails: entities.extractedEmails,
      extractedPhones: entities.extractedPhones,
      suspiciousEntities: [
        {
          name: 'TQr6Z8pLkM9vNx4w1kQe7yRs3bT9vNx4w',
          type: 'Cryptocurrency Wallet',
          details: 'Tron TRC-20 wallet flagged in multiple cryptocurrency fraud reports.',
          riskWeight: 'critical',
        },
        {
          name: '@VIP_Quantum_Admin',
          type: 'Person / Alias',
          details: 'Anonymous Telegram handle operating without regulatory licensing.',
          riskWeight: 'high',
        },
      ],
      aiExplanation: {
        summaryRationale:
          'Classic Ponzi / advance-fee investment fraud. Promises absurd risk-free yields and requires upfront cryptocurrency transfers to an unhosted wallet address with contact redirected to Telegram.',
        supportingSnippets: [
          {
            quote: 'guaranteed 450% weekly returns with zero risk',
            context: 'Core financial claim',
            flaggedReason: 'Mathematically impossible yield and deceptive zero-risk claim.',
            severity: 'critical',
          },
          {
            quote: 'Send funds directly to our automated liquidity pool wallet: TQr...',
            context: 'Irreversible payment call',
            flaggedReason: 'Direct unhosted wallet transfer without smart contract escrow.',
            severity: 'critical',
          },
        ],
        manipulationTechniques: [
          'Greed Exploitation & Financial Hyperbole',
          'Social Proof Fabrication (Referencing Binance / Uniswap)',
          'Artificial Scarcity & FOMO Generation',
        ],
        evidenceVsInterpretation: {
          hardEvidence: [
            'Direct wallet transfer to an unhosted TRC-20 address.',
            'No registered corporate identity, regulatory filing with SEC/FINRA, or custodian license.',
            'Communication routed through anonymous Telegram handles.',
          ],
          aiInterpretation: [
            'Once initial 500 USDT is transferred, the operator will likely invent fake withdrawal fees to extract further payments.',
            'The trading bot narrative is an artificial pretext to conceal fund theft.',
          ],
        },
      },
      recommendedPrecautions: [
        {
          id: 'PREC-01',
          priority: 'Immediate',
          instruction: 'NEVER send cryptocurrency or connect Web3 wallets to unverified third parties.',
          rationale: 'Blockchain transactions cannot be reversed, canceled, or refunded.',
        },
        {
          id: 'PREC-02',
          priority: 'Immediate',
          instruction: 'Block the Telegram contact and report the account for financial fraud.',
          rationale: 'Prevents further automated harassment and follow-up lures.',
        },
      ],
      securityDisclosureNotice:
        'Zero-Trust Rule: Any offer guaranteeing fixed high returns with "zero risk" is by definition fraudulent.',
    };
  }

  // PRESET 3: Remote Job Offer / Task Scam
  if (isJob) {
    return {
      analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      contentLength: text.length,
      rawSnippet: text.slice(0, 140) + '...',
      riskClassification: 'High Risk / Likely Deceptive',
      riskScore: 82,
      confidenceScore: 92,
      scamCategory: 'Employment & Task Scam',
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
      suspiciousLanguage: {
        flaggedKeywords: ['NO PRIOR EXPERIENCE', '$250 - $600 PER DAY', '45-60 MINUTES DAILY', 'WHATSAPP'],
        syntaxNotes: ['Disproportionate compensation for trivial work', 'Unsolicited outreach claiming to have reviewed a resume'],
        sentimentTone: 'Flattering / Enticing Lure',
        deceptiveStyleScore: 86,
      },
      urgencyAndManipulation: {
        urgencyScore: 68,
        isUrgencyLegitimate: false,
        urgencyRationale: 'Urges immediate contact on encrypted chat to isolate the candidate before they research the firm.',
        indicators: [
          {
            technique: 'Effortless Wealth Lure',
            severity: 'high',
            explanation: 'Offering up to $600/day for 45 minutes of rating products is a hallmark of task-based employment fraud.',
            supportingSnippet: 'spend 45-60 minutes daily rating e-commerce products and earn $250 - $600 per day',
          },
          {
            technique: 'Communication Channel Migration',
            severity: 'high',
            explanation: 'Shifting victims from professional networks to unmonitored WhatsApp channels.',
            supportingSnippet: 'Contact our recruitment coordinator immediately on WhatsApp',
          },
        ],
      },
      impersonation: {
        isImpersonationDetected: true,
        impersonatedEntity: 'Global Talents HR / LinkedIn Recruiter',
        entityType: 'Corporate Executive',
        channelDiscrepancy: 'Legitimate recruitment agencies do not conduct hiring exclusively via personal WhatsApp numbers.',
        similarityPercent: 82,
      },
      paymentIndicators: [
        {
          method: 'P2P (Zelle/Venmo/CashApp)',
          riskLevel: 'high',
          evidenceSnippet: 'earn $250 - $600 per day deposited to your wallet',
          details: 'Later stages will demand "recharge" deposits to unlock withheld task commission tiers.',
        },
      ],
      extractedUrls: entities.extractedUrls,
      extractedEmails: entities.extractedEmails,
      extractedPhones: entities.extractedPhones,
      suspiciousEntities: [
        {
          name: 'Sarah (Global Talents HR)',
          type: 'Person / Alias',
          details: 'Synthetic recruiter persona used across multiple WhatsApp smishing campaigns.',
          riskWeight: 'high',
        },
      ],
      aiExplanation: {
        summaryRationale:
          'Highly characteristic task scam / fake employment scheme. Unsolicited outreach offers exorbitant compensation for negligible daily effort, funneled immediately into private WhatsApp messaging.',
        supportingSnippets: [
          {
            quote: 'reviewed your resume on LinkedIn and are pleased to offer you...',
            context: 'Cold outreach opening',
            flaggedReason: 'Generic template dispatched in bulk to random telephone numbers.',
            severity: 'medium',
          },
          {
            quote: 'earn $250 - $600 per day... No prior experience necessary.',
            context: 'Compensation promise',
            flaggedReason: 'Pay rate is completely decoupled from realistic market rates.',
            severity: 'critical',
          },
        ],
        manipulationTechniques: [
          'Unearned Compliment & Professional Validation',
          'Isolation on Unmonitored Messaging Channels',
          'Sunk Cost Fallacy Primer (Task Deposit Trap)',
        ],
        evidenceVsInterpretation: {
          hardEvidence: [
            'Sender uses personal WhatsApp number rather than corporate domain email.',
            'No specific job duties, company registration number, or formal interview process.',
          ],
          aiInterpretation: [
            'Victims who respond are assigned fake rating tasks and subsequently asked to deposit money to "reset negative balances".',
            'Name "Global Talents HR" is an untraceable generic front.',
          ],
        },
      },
      recommendedPrecautions: [
        {
          id: 'PREC-01',
          priority: 'Immediate',
          instruction: 'Do not message the WhatsApp number or share personal resume / identity documents.',
          rationale: 'Submitting identity info leads to identity theft or targeted re-phishing.',
        },
        {
          id: 'PREC-02',
          priority: 'Important',
          instruction: 'Search the company name directly on LinkedIn and cross-reference active recruiter directories.',
          rationale: 'Verifies whether the alleged recruiter is authentic.',
        },
      ],
      securityDisclosureNotice:
        'Employment Rule: Legitimate employers will NEVER ask candidates to pay for training, equipment deposits, or task unlocking.',
    };
  }

  // PRESET 4: CEO Wire / Apple Gift Card Request (BEC)
  if (isGiftCard) {
    return {
      analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      contentLength: text.length,
      rawSnippet: text.slice(0, 140) + '...',
      riskClassification: 'High Risk / Likely Deceptive',
      riskScore: 88,
      confidenceScore: 94,
      scamCategory: 'Executive Impersonation (CEO Fraud)',
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
      suspiciousLanguage: {
        flaggedKeywords: ['APPLE GIFT CARDS', 'SCRATCH THE PINS', 'CANNOT TAKE PHONE CALLS', 'STRICT CONFIDENTIALITY'],
        syntaxNotes: ['Manufactured unavailability to prevent verbal verification', 'Demand for untraceable gift card PINs'],
        sentimentTone: 'Authoritative / Confidential Urgency',
        deceptiveStyleScore: 90,
      },
      urgencyAndManipulation: {
        urgencyScore: 86,
        isUrgencyLegitimate: false,
        urgencyRationale: 'Constructs an unannounced board meeting pretext to justify why the victim cannot verify by phone.',
        indicators: [
          {
            technique: 'Authority Impersonation & Secrecy',
            severity: 'critical',
            explanation: 'Uses CEO authority and enforces confidentiality to discourage peer consultation.',
            supportingSnippet: 'Treat this with strict confidentiality. I will sign off on your expense reimbursement voucher',
          },
          {
            technique: 'Communication Lockout Pretext',
            severity: 'high',
            explanation: 'Claims to be locked in a meeting to prevent the victim from making a quick phone call.',
            supportingSnippet: 'locked in an unannounced board meeting with external counsel and cannot take phone calls.',
          },
        ],
      },
      impersonation: {
        isImpersonationDetected: true,
        impersonatedEntity: 'Corporate Chief Executive Officer',
        entityType: 'Corporate Executive',
        channelDiscrepancy: 'Sender replies from consultant-vip.net external lookalike domain rather than corporate email.',
        similarityPercent: 90,
      },
      paymentIndicators: [
        {
          method: 'Gift Cards',
          riskLevel: 'critical',
          evidenceSnippet: 'purchase 6 Apple Gift Cards ($100 each)... Scratch the pins on the back and email the photos',
          details: 'Gift cards are non-refundable, anonymous, and untraceable once redeemed by criminal syndicates.',
        },
      ],
      extractedUrls: entities.extractedUrls,
      extractedEmails: entities.extractedEmails.length > 0 ? entities.extractedEmails : [
        {
          address: 'ceo.board-executive@consultant-vip.net',
          domain: 'consultant-vip.net',
          isFreeProvider: false,
          isLookalike: true,
          notes: 'Lookalike domain registered externally to mimic executive staff',
        },
      ],
      extractedPhones: entities.extractedPhones,
      suspiciousEntities: [
        {
          name: 'Apple Gift Cards ($600 Total)',
          type: 'Financial Platform',
          details: 'Irreversible retail value vouchers routinely weaponized in Business Email Compromise (BEC).',
          riskWeight: 'critical',
        },
      ],
      aiExplanation: {
        summaryRationale:
          'Textbook Business Email Compromise (BEC). An attacker impersonating the company executive exploits organizational hierarchy, forbids voice verification under a meeting pretext, and requests gift cards.',
        supportingSnippets: [
          {
            quote: 'cannot take phone calls. I need you to purchase 6 Apple Gift Cards ($100 each)',
            context: 'Pretext and payment directive',
            flaggedReason: 'Gift cards are NEVER legitimate corporate procurement instruments.',
            severity: 'critical',
          },
          {
            quote: 'ceo.board-executive@consultant-vip.net',
            context: 'Reply-to routing',
            flaggedReason: 'External lookalike address designed to intercept out-of-channel responses.',
            severity: 'critical',
          },
        ],
        manipulationTechniques: [
          'Authority Coercion & Hierarchy Compliance',
          'Verification Preclusion ("Cannot take calls")',
          'Promise of Immediate Future Reimbursement',
        ],
        evidenceVsInterpretation: {
          hardEvidence: [
            'Sender email domain differs from internal company email infrastructure.',
            'Payment requested via retail gift card codes.',
            'Bypasses standard corporate accounts payable and procurement workflows.',
          ],
          aiInterpretation: [
            'Attacker researched executive names on LinkedIn or corporate public website to craft targeted spear-phishing.',
          ],
        },
      },
      recommendedPrecautions: [
        {
          id: 'PREC-01',
          priority: 'Immediate',
          instruction: 'Do NOT purchase gift cards or send photos of any serial codes or PINs.',
          rationale: 'Funds are drained within minutes of photos being transmitted.',
        },
        {
          id: 'PREC-02',
          priority: 'Immediate',
          instruction: 'Verify directly with the executive using their verified internal company telephone number or in-person.',
          rationale: 'Direct verbal verification immediately exposes executive impersonation.',
        },
        {
          id: 'PREC-03',
          priority: 'Important',
          instruction: 'Alert corporate IT Security / SOC to block the sender domain on corporate mail gateways.',
          rationale: 'Protects other co-workers who may have received the same lure.',
        },
      ],
      securityDisclosureNotice:
        'Procurement Rule: No legitimate corporation or government body will ever ask employees to settle bills using retail gift cards.',
    };
  }

  // PRESET 5: Tech Support Scareware
  if (isTechSupport) {
    return {
      analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      contentLength: text.length,
      rawSnippet: text.slice(0, 140) + '...',
      riskClassification: 'Confirmed Scam / Fraud',
      riskScore: 95,
      confidenceScore: 97,
      scamCategory: 'Tech Support & Extortion',
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
      suspiciousLanguage: {
        flaggedKeywords: ['TROJAN.SPYWARE', 'ACTIVELY BEING TRANSMITTED', 'DO NOT RESTART', 'MICROSOFT CERTIFIED ENGINEERS'],
        syntaxNotes: ['Intimidation tactics using fabricated malware names', 'Prohibiting computer restart to keep victim on hook'],
        sentimentTone: 'Extreme Alarmism & System Coercion',
        deceptiveStyleScore: 95,
      },
      urgencyAndManipulation: {
        urgencyScore: 94,
        isUrgencyLegitimate: false,
        urgencyRationale: 'Weaponizes fear of data loss to drive victim onto an inbound call center where remote desktop tools are deployed.',
        indicators: [
          {
            technique: 'Extortion via Scareware Alert',
            severity: 'critical',
            explanation: 'Falsely claims SSN and banking credentials are being leaked to create blind panic.',
            supportingSnippet: 'Your social security number, passwords, and banking sessions are actively being transmitted',
          },
          {
            technique: 'System Lockout Bluff',
            severity: 'high',
            explanation: 'Warns against restarting computer so user stays on the browser page.',
            supportingSnippet: 'Do not restart your computer or close this window or system files will be corrupted.',
          },
        ],
      },
      impersonation: {
        isImpersonationDetected: true,
        impersonatedEntity: 'Microsoft Windows Support',
        entityType: 'Tech Support',
        channelDiscrepancy: 'Microsoft Windows never displays unsolicited pop-ups containing toll-free phone numbers.',
        similarityPercent: 94,
      },
      paymentIndicators: [
        {
          method: 'Wire Transfer',
          riskLevel: 'high',
          evidenceSnippet: 'Call Microsoft Certified Network Engineers immediately at Toll-Free: 1-888-555-0199',
          details: 'Call center operators install remote control software (AnyDesk/TeamViewer) and demand wire fees.',
        },
      ],
      extractedUrls: entities.extractedUrls,
      extractedEmails: entities.extractedEmails,
      extractedPhones: entities.extractedPhones.length > 0 ? entities.extractedPhones : [
        {
          number: '1-888-555-0199',
          formatted: '1-888-555-0199',
          isTollFreeOrVoip: true,
          notes: 'Toll-free virtual number routing to overseas boiler room call center',
        },
      ],
      suspiciousEntities: [
        {
          name: 'MS-89104',
          type: 'Case Reference',
          details: 'Fabricated support code used by phone operators to look authentic.',
          riskWeight: 'medium',
        },
      ],
      aiExplanation: {
        summaryRationale:
          'Classic tech support scareware alert. Fabricates active malware infections and warns against rebooting to manipulate victims into calling an untraceable toll-free phone boiler room.',
        supportingSnippets: [
          {
            quote: 'Call Microsoft Certified Network Engineers immediately at Toll-Free: 1-888-555-0199',
            context: 'Call-to-action directive',
            flaggedReason: 'Operating system error screens never supply telephone support numbers.',
            severity: 'critical',
          },
        ],
        manipulationTechniques: [
          'Scareware & Technical Technophobia Exploitation',
          'Simulated Hostile Data Exfiltration',
          'Authority Masquerade (Microsoft Brand Abuse)',
        ],
        evidenceVsInterpretation: {
          hardEvidence: [
            'Web browser alerts cannot scan local operating system kernels or verify Trojan infections.',
            'Microsoft official policy explicitly states they never include telephone numbers in error prompts.',
          ],
          aiInterpretation: [
            'Goal of phone call is to coerce victim into downloading remote management software to lock computer or steal funds.',
          ],
        },
      },
      recommendedPrecautions: [
        {
          id: 'PREC-01',
          priority: 'Immediate',
          instruction: 'Do NOT call the telephone number or grant remote access to your computer.',
          rationale: 'Callers are fraudulent operators attempting to install ransomware or keyloggers.',
        },
        {
          id: 'PREC-02',
          priority: 'Immediate',
          instruction: 'Close the browser tab or terminate the browser process via Task Manager (Ctrl+Shift+Esc).',
          rationale: 'The alert is purely a browser web page with full-screen simulation, not a real OS infection.',
        },
      ],
      securityDisclosureNotice:
        'Tech Support Rule: Microsoft, Apple, and Google NEVER display pop-ups asking users to call a telephone number for malware removal.',
    };
  }

  // PRESET 6: Benign DevOps Server Incident Alert (CRITICAL REQUIREMENT: URGENCY ALONE != FRAUD)
  if (isBenignDevops) {
    return {
      analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      contentLength: text.length,
      rawSnippet: text.slice(0, 140) + '...',
      riskClassification: 'Low Risk / Likely Legitimate',
      riskScore: 12,
      confidenceScore: 95,
      scamCategory: 'Benign Communication',
      isDemoState: true,
      dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
      suspiciousLanguage: {
        flaggedKeywords: [],
        syntaxNotes: ['Technical DevOps incident alerting terminology', 'Clear corporate internal routing'],
        sentimentTone: 'Operational High-Priority Operational Broadcast',
        deceptiveStyleScore: 8,
      },
      urgencyAndManipulation: {
        urgencyScore: 82, // High urgency, BUT legitimate!
        isUrgencyLegitimate: true, // Crucial distinction!
        urgencyRationale:
          'High urgency is operationally warranted due to real-time production system resource spikes. No psychological coercion, personal financial demand, or credential harvesting is present.',
        indicators: [
          {
            technique: 'Operational Alerting (Legitimate)',
            severity: 'low',
            explanation: 'Urgent notification is justified by automated infrastructure telemetry thresholds.',
            supportingSnippet: '[P1 INCIDENT ALERT] Production Cluster us-east-4 CPU threshold exceeded 94%',
          },
        ],
      },
      impersonation: {
        isImpersonationDetected: false,
        channelDiscrepancy: 'Routes exclusively through internal company VPN and corporate Slack workspace.',
      },
      paymentIndicators: [
        {
          method: 'None',
          riskLevel: 'none',
          details: 'No financial transaction, voucher purchase, or payment request requested.',
        },
      ],
      extractedUrls: entities.extractedUrls.length > 0 ? entities.extractedUrls : [
        {
          url: 'https://monitoring.internal.acme-corp.com/d/cluster-health',
          domain: 'monitoring.internal.acme-corp.com',
          riskRating: 'Clean',
          isShortened: false,
          notes: 'Internal enterprise monitoring host protected behind VPN access gate',
        },
      ],
      extractedEmails: entities.extractedEmails,
      extractedPhones: entities.extractedPhones,
      suspiciousEntities: [
        {
          name: 'k8s-prd-09 (us-east-4)',
          type: 'Organization',
          details: 'Legitimate Kubernetes infrastructure node identifier.',
          riskWeight: 'low',
        },
      ],
      aiExplanation: {
        summaryRationale:
          'This message contains high urgency, but rigorous evaluation confirms it is an authentic operational incident dispatch. It contains no financial demands, explicitly enforces security ("Do not enter credentials on non-SSO endpoints"), and routes to corporate internal VPN.',
        supportingSnippets: [
          {
            quote: 'review the Grafana telemetry dashboard on corporate VPN',
            context: 'Access requirement',
            flaggedReason: 'Explicitly requires internal authentication perimeter.',
            severity: 'low',
          },
          {
            quote: 'Do not enter credentials on non-SSO endpoints.',
            context: 'Security hygiene advisory',
            flaggedReason: 'Proactively enforces zero-trust credential hygiene.',
            severity: 'low',
          },
        ],
        manipulationTechniques: [
          'None: Legitimate Operational Dispatch (Urgency is technically substantiated)',
        ],
        evidenceVsInterpretation: {
          hardEvidence: [
            'Zero financial requests or external unauthenticated routing.',
            'Directs to internal monitoring URL on verified corporate subnet.',
            'Contains standard incident response procedure metadata (#incident-8492).',
          ],
          aiInterpretation: [
            'The presence of urgent phrases ("P1 INCIDENT ALERT", "threshold exceeded") reflects standard incident response cadence, not malicious manipulation.',
          ],
        },
      },
      recommendedPrecautions: [
        {
          id: 'PREC-01',
          priority: 'Advisory',
          instruction: 'Proceed with normal on-call incident response verification protocols over company VPN.',
          rationale: 'Message is consistent with authentic operational automated dispatches.',
        },
        {
          id: 'PREC-02',
          priority: 'Advisory',
          instruction: 'Always adhere to the included advisory: only authenticate via company Single Sign-On (SSO).',
          rationale: 'Standard zero-trust defense in depth.',
        },
      ],
      securityDisclosureNotice:
        'Operational Rule: Urgent or persuasive language alone does not constitute fraud when technically substantiated and devoid of deceptive coercion.',
    };
  }

  // PRESET 7: Inconclusive / Generic Short Message
  return {
    analysisId: `SCAM-${Math.floor(100000 + Math.random() * 900000)}`,
    analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    contentLength: text.length,
    rawSnippet: text.slice(0, 140) + (text.length > 140 ? '...' : ''),
    riskClassification: 'Inconclusive',
    riskScore: 48,
    confidenceScore: 45,
    scamCategory: 'Uncategorized',
    isDemoState: true,
    dataSourceLabel: 'Chakravyuha NLP Cognitive Engine (Simulated Telemetry)',
    suspiciousLanguage: {
      flaggedKeywords: [],
      syntaxNotes: ['Insufficient context or technical indicators to formulate high-confidence determination'],
      sentimentTone: 'Informal / Neutral',
      deceptiveStyleScore: 40,
    },
    urgencyAndManipulation: {
      urgencyScore: 25,
      isUrgencyLegitimate: false,
      urgencyRationale: 'No overt urgency, threat, or manipulation cues detected in text sample.',
      indicators: [],
    },
    impersonation: {
      isImpersonationDetected: false,
      channelDiscrepancy: 'No institutional brand claims or authoritative entities referenced.',
    },
    paymentIndicators: [
      {
        method: 'None',
        riskLevel: 'none',
        details: 'No payment mechanisms or transaction routing detected.',
      },
    ],
    extractedUrls: entities.extractedUrls,
    extractedEmails: entities.extractedEmails,
    extractedPhones: entities.extractedPhones,
    suspiciousEntities: entities.suspiciousEntities,
    aiExplanation: {
      summaryRationale:
        'Insufficient telemetry in provided text to confirm malicious intent or verify authenticity. In accordance with zero-trust principles, an absence of explicit threat cues does not guarantee benign safety.',
      supportingSnippets: [],
      manipulationTechniques: ['None detected in current sample length'],
      evidenceVsInterpretation: {
        hardEvidence: [
          'No external URLs, suspicious telephone numbers, or payment requests extracted.',
          'Message length is short and contains non-specific conversational phrasing.',
        ],
        aiInterpretation: [
          'Could represent a benign casual note, or an opening conversational probe ("spear-phishing reconnaissance") before introducing a malicious hook.',
        ],
      },
    },
    recommendedPrecautions: [
      {
        id: 'PREC-01',
        priority: 'Important',
        instruction: 'Exercise standard caution if this was received unsolicited from an unknown sender.',
        rationale: 'Attackers frequently send harmless opening inquiries to verify phone number or inbox validity.',
      },
      {
        id: 'PREC-02',
        priority: 'Advisory',
        instruction: 'Verify sender identity via independent out-of-band communication before opening any subsequent attachments or links.',
        rationale: 'Prevents compromise if sender account was compromised.',
      },
    ],
    securityDisclosureNotice:
      'Zero-Trust Rule: Messages lacking definitive indicators are classified as Inconclusive rather than benignly safe.',
  };
}
