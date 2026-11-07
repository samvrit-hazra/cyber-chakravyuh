import type { FeatureDetail } from '../components/landing/FeatureDetailModal.tsx';

export const featuresData: FeatureDetail[] = [
  {
    id: 'url-analysis',
    title: 'Intelligent URL Analysis',
    category: 'Heuristic & Lexical Ingress Inspection',
    description:
      'Performs deep lexical, entropy, and structural analysis of target URLs. Inspects suspicious TLDs, punycode/IDN homograph spoofs, multi-hop redirect chains, and obfuscated payloads before user arrival.',
    highlights: [
      'Punycode & Cyrillic homoglyph spoof detection',
      'Multi-hop HTTP 301/302 redirect tracking to final payload',
      'Dynamic Shannon entropy calculation for randomized domains',
      'Adversarial IP reputation and WHOIS age correlation',
    ],
    architectureLayer: 'Layer 1: Perimeter (Saptarishi)',
    technicalSpecs: [
      { label: 'Latency', value: '< 28ms' },
      { label: 'Entropy Scan', value: '0.00 - 8.00 bits' },
      { label: 'Homograph Precision', value: '99.9%' },
    ],
  },
  {
    id: 'tls-intelligence',
    title: 'TLS Certificate Intelligence',
    category: 'Cryptographic Attestation & PKI Analysis',
    description:
      'Audits the target host’s cryptographic certificate chain. Uncovers Let’s Encrypt ephemeral abuse, issuer mismatches, untrusted self-signed root anchors, expired revocation status via CRL/OCSP, and suspicious cipher suites.',
    highlights: [
      'Automated Certificate Transparency (CT) log matching',
      'Issuer CA trust score and expiration chronology audit',
      'Subject Alternative Name (SAN) domain clustering',
      'Weak cipher suites & protocol downgrade (SSLv3/TLS 1.0) detection',
    ],
    architectureLayer: 'Layer 5: Application Shield',
    technicalSpecs: [
      { label: 'Protocols', value: 'TLS 1.2 / 1.3' },
      { label: 'CT Ingestion', value: 'Real-time' },
      { label: 'CRL/OCSP Check', value: 'Sub-second' },
    ],
  },
  {
    id: 'ai-scam-detection',
    title: 'AI-Powered Scam Detection',
    category: 'Cognitive Behavioral NLP & Vision Heuristics',
    description:
      'Employs multimodal AI models to analyze page layout, brand impersonation vectors, urgent social engineering language, and unauthorized credential login prompts mimicking legitimate institutions.',
    highlights: [
      'Zero-shot visual layout similarity scoring against banking portals',
      'Urgency and coercion sentiment analysis in DOM copy',
      'Fake login form and credential harvesting detector',
      'Obfuscated JavaScript script extractor and AST sandboxing',
    ],
    architectureLayer: 'Layer 7: Cognitive Core',
    technicalSpecs: [
      { label: 'Model', value: 'Multimodal Vision+NLP' },
      { label: 'Brand Corpus', value: '10,000+ top targets' },
      { label: 'False Positive', value: '< 0.05%' },
    ],
  },
  {
    id: 'threat-correlation',
    title: 'Threat Correlation',
    category: 'Multi-Vector Graph Intelligence',
    description:
      'Correlates observed indicators against global threat feeds, adversary infrastructure clusters, ASN subnet neighbors, and historical phishing campaign fingerprints using unified graph telemetry.',
    highlights: [
      'Subnet neighborhood and co-located malicious host mapping',
      'Threat actor campaign fingerprint clustering (MITRE ATT&CK)',
      'Cross-vector pivot across passive DNS, IP, and nameservers',
      'Automated indicator scoring with confidence intervals',
    ],
    architectureLayer: 'Layer 2: Network (Vyuha Gateway)',
    technicalSpecs: [
      { label: 'Graph Engine', value: 'Neo4j / NetworkX' },
      { label: 'IOC Matching', value: 'Sub-millisecond' },
      { label: 'Graph Depth', value: '5 hops' },
    ],
  },
  {
    id: 'website-security-assessment',
    title: 'Website Security Assessment',
    category: 'Posture Evaluation & Content Security Audit',
    description:
      'Evaluates critical security header posture, including Content-Security-Policy (CSP), HSTS, X-Frame-Options, DNSSEC validation, and vulnerable third-party library dependencies.',
    highlights: [
      'Full CSP, HSTS, Permissions-Policy, and CORS validation',
      'DNSSEC cryptographic chain verification (RRSIG/DS)',
      'Vulnerable client-side JavaScript CVE scanner',
      'Passive cookie attribute analysis (Secure, HttpOnly, SameSite)',
    ],
    architectureLayer: 'Layer 4: Endpoint Intel',
    technicalSpecs: [
      { label: 'Headers Audited', value: '18 critical' },
      { label: 'DNSSEC Proof', value: 'Root to Leaf' },
      { label: 'Grading Scale', value: 'A+ to F' },
    ],
  },
  {
    id: 'decentralized-intel',
    title: 'Decentralized Threat Intelligence',
    category: 'Immutable Trust Attestation & Federated Telemetry',
    description:
      'Distributes cryptographically signed threat hashes across a federated mesh. Ensures no single point of failure or censorship, enabling independent report verification without reliance on centralized authorities.',
    highlights: [
      'Immutable threat hash publication with timestamped proofs',
      'Federated privacy-preserving threat telemetry sharing',
      'Zero-knowledge attestation of security audits',
      'Tamper-proof verifiable audit trails for incident response',
    ],
    architectureLayer: 'Layer 6: Data Vault',
    technicalSpecs: [
      { label: 'Hashing', value: 'SHA-256 / Ed25519' },
      { label: 'Attestation', value: 'Cryptographic Merkle' },
      { label: 'Integrity', value: '100% Immutable' },
    ],
  },
];

