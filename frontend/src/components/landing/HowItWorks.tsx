import { useState } from 'react';
import { Send, Search, Cpu, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge, Card } from '../common/index.ts';

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      step: '01',
      title: 'Submit',
      subtitle: 'Target URL or Asset Ingress',
      icon: <Send className="w-5 h-5 text-cyan-400" />,
      description:
        'User or automated agent submits a suspicious URL, host, or payload link via the web command console or API webhook.',
      details: [
        'Sanitizes input & extracts canonical domain',
        'Validates protocol format (HTTP/HTTPS/IP)',
        'Assigns unique cryptographic investigation ID',
      ],
      timeframe: '0ms - Ingress',
    },
    {
      step: '02',
      title: 'Investigate',
      subtitle: 'Passive Telemetry Gathering',
      icon: <Search className="w-5 h-5 text-purple-400" />,
      description:
        'Passive telemetry scanners query global DNS records, WHOIS registration chronology, IP ASN routing, and TLS certificate transparency logs.',
      details: [
        'Queries authoritative nameservers & DNSSEC',
        'Inspects domain registration age & registrar trust',
        'Traces reverse IP hosting density & ASN geolocation',
      ],
      timeframe: '12ms - Telemetry',
    },
    {
      step: '03',
      title: 'Analyse',
      subtitle: 'Multimodal Heuristic Deep-Dive',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      description:
        'Cognitive AI engines parse page source, DOM structure, script behavioral ASTs, and visual screenshot cues to detect brand impersonation.',
      details: [
        'Executes sandboxed DOM rendering in isolated node',
        'Performs computer vision visual spoofing comparison',
        'Calculates lexical entropy & homograph homoglyphs',
      ],
      timeframe: '24ms - Cognitive',
    },
    {
      step: '04',
      title: 'Assess Risk',
      subtitle: '7-Layer Chakravyuha Scoring',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      description:
        'Aggregates findings across all 7 Chakravyuha defense rings into a normalized Threat Score (0–100) with confidence intervals and MITRE ATT&CK mapping.',
      details: [
        'Correlates multi-factor threat vectors',
        'Computes confidence score (0-100%)',
        'Maps tactics to MITRE ATT&CK framework',
      ],
      timeframe: '36ms - Synthesis',
    },
    {
      step: '05',
      title: 'Report & Verify',
      subtitle: 'Attested Forensic Intelligence',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description:
        'Generates an explainable security report, cryptographically signs the record hash, and provides clear mitigation recommendations for the user.',
      details: [
        'Publishes immutable Ed25519 signed report',
        'Provides actionable safe browsing guidance',
        'Optionally broadcasts threat hash to mesh',
      ],
      timeframe: '48ms - Attestation',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative border-t border-white/[0.06] bg-[#070d1e]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="purple" size="md">
            WORKFLOW PIPELINE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How Cyber Chakravyuha Operates
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From initial URL submission to immutable report attestation in under 50 milliseconds.
          </p>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:block relative">
          {/* Continuous Glowing Cyber Connecting Line */}
          <div className="absolute top-1/2 left-10 right-10 -translate-y-8 h-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/40 to-emerald-500/30 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {stages.map((stage, idx) => {
              const isSelected = activeStage === idx;
              return (
                <div
                  key={stage.step}
                  onClick={() => setActiveStage(idx)}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  {/* Step Node */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-4 border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-110'
                        : 'bg-[#0b152d] border-white/10 group-hover:border-cyan-500/40 group-hover:scale-105'
                    }`}
                  >
                    {stage.icon}
                  </div>

                  {/* Stage Header */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 block">
                      STAGE {stage.step}
                    </span>
                    <h3
                      className={`text-sm font-bold transition-colors ${
                        isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Card (Desktop Highlight) */}
        <div className="hidden lg:block">
          <Card variant="glass" className="p-6 border-cyan-500/30 bg-[#0b152d]/90 shadow-[0_8px_35px_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-4 space-y-3 border-r border-white/10 pr-6">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">
                    STAGE {stages[activeStage].step}
                  </Badge>
                  <span className="text-xs font-mono text-emerald-400">
                    {stages[activeStage].timeframe}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  {stages[activeStage].title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {stages[activeStage].description}
                </p>
              </div>

              <div className="col-span-8 space-y-3">
                <h5 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Internal Process Pipeline
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  {stages[activeStage].details.map((detail, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-900/80 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Mobile / Tablet Vertical Timeline */}
        <div className="lg:hidden relative space-y-6 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/50 before:via-purple-500/40 before:to-emerald-500/50">
          {stages.map((stage) => (
            <div key={stage.step} className="relative flex items-start gap-4 pl-2">
              {/* Step Icon Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#0b152d] border border-cyan-500/40 flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                {stage.icon}
              </div>

              {/* Step Card Content */}
              <Card variant="default" className="flex-1 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      STAGE {stage.step}
                    </span>
                    <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">{stage.timeframe}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{stage.description}</p>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  {stage.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

