import {
  FileCheck2,
  Sparkles,
  Eye,
  ShieldAlert,
  Fingerprint,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Card, Badge } from '../common/index.ts';

export function TrustAndSecurity() {
  const pillars = [
    {
      id: 'evidence-based',
      title: 'Evidence-Based Threat Detection',
      icon: <FileCheck2 className="w-5 h-5 text-cyan-400" />,
      description:
        'Zero conjecture. Every flagged malicious verdict is corroborated by raw packet traces, cryptographic certificate records, ASN routing anomalies, and lexical forensic proof.',
      badge: 'VERIFIABLE PROOF',
      features: [
        'Deterministic indicator signatures',
        'Raw response payload checksums',
        'Direct link to threat actor infrastructure',
      ],
    },
    {
      id: 'explainable-ai',
      title: 'Explainable AI (XAI)',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      description:
        'No black boxes. Our neural classifiers articulate step-by-step risk rationale, feature weight attributions, and visual saliency maps highlighting exactly why an asset was classified as malicious.',
      badge: 'TRANSPARENT REASONING',
      features: [
        'SHAP & LIME feature attributions',
        'Clear natural language summaries',
        'Confidence score breakdowns per vector',
      ],
    },
    {
      id: 'transparent-reporting',
      title: 'Transparent Threat Reporting',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      description:
        'Comprehensive, accessible reporting tailored for both non-technical users and seasoned security operations analysts, detailing severity, MITRE techniques, and actionable next steps.',
      badge: 'ACTIONABLE INTELLIGENCE',
      features: [
        'MITRE ATT&CK tactic mapping',
        'Executive & technical dual views',
        'One-click remediation playbooks',
      ],
    },
    {
      id: 'privacy-first',
      title: 'Privacy-First Architecture',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      description:
        'We never store, inspect, or log private credentials, sensitive URL parameters, or personally identifiable data. Queries are stripped of auth tokens and processed in ephemeral RAM sandboxes.',
      badge: 'ZERO DATA EXPOSURE',
      features: [
        'Automatic token & PII redaction',
        'Ephemeral memory-only evaluation',
        'Strict zero-retention guarantee',
      ],
    },
    {
      id: 'independent-verification',
      title: 'Independent Report Verification',
      icon: <Fingerprint className="w-5 h-5 text-purple-400" />,
      description:
        'Every investigation report is assigned a cryptographic Ed25519 signature and Merkle root hash, allowing anyone to verify report authenticity without contacting our servers.',
      badge: 'TAMPER-PROOF AUDIT',
      features: [
        'Ed25519 cryptographic signatures',
        'Public Merkle proof verification',
        'Immutable timestamp ledger',
      ],
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="emerald" size="md" hasDot pulseDot>
            DIGITAL TRUST PILLARS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Trust & Security Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Cyber Chakravyuha is founded on the conviction that cybersecurity intelligence must be transparent, verifiable, and privacy-preserving.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <Card
              key={pillar.id}
              variant="interactive"
              className="p-6 space-y-4 bg-[#0b152d]/80 border-cyan-500/15 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <Badge variant="cyan" size="sm" className="text-[10px]">
                    {pillar.badge}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                {pillar.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* 6th Complementary Trust Attestation Card */}
          <Card
            variant="verified"
            className="p-6 space-y-4 bg-emerald-950/20 border-emerald-500/30 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <Badge variant="emerald" size="sm">CERTIFIED SAFE</Badge>
              </div>

              <h3 className="text-base font-bold text-emerald-300">
                Saptarishi Concentric Attestation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By nesting 7 distinct defense layers into a unified telemetry mesh, Cyber Chakravyuha guarantees that no single bypassed heuristic compromises total system integrity.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20 text-xs font-mono text-emerald-300">
              <span>ROOT TRUST ANCHOR: ACTIVE</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

