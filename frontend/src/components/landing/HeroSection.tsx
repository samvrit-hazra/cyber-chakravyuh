import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Button, Badge, Card } from '../common/index.ts';

interface HeroSectionProps {
  onStartInvestigation: (url?: string) => void;
  onExplorePlatform: () => void;
}

export function HeroSection({ onStartInvestigation, onExplorePlatform }: HeroSectionProps) {
  const [quickUrl, setQuickUrl] = useState('https://security-verify.paypal.account-update.phish-alert.net/login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInvestigation(quickUrl);
  };

  return (
    <section id="home" className="relative min-h-[90vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background radial glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Value Prop, CTA Buttons, and Live Search Bar */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-[#0b152d]/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Badge variant="cyan" size="sm" hasDot pulseDot>
                CYBER CHAKRAVYUHA v2.4
              </Badge>
              <span className="text-xs text-slate-300 font-mono">Next-Gen Threat Engine</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Navigate the Threat.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent block mt-1">
                Verify the Trust.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              An intelligent cybersecurity platform that investigates suspicious URLs, detects phishing attempts, analyses digital trust vulnerabilities and helps users make safer decisions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onStartInvestigation(quickUrl)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-[0_0_25px_rgba(6,182,212,0.5)] px-6"
              >
                Start Investigation
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={onExplorePlatform}
                rightIcon={<ExternalLink className="w-4 h-4" />}
                className="px-6"
              >
                Explore Platform
              </Button>
            </div>

            {/* Quick URL Deep Scan Input Preview */}
            <div className="pt-4 max-w-xl mx-auto lg:mx-0">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center rounded-xl bg-[#070d1e]/90 border border-cyan-500/30 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                <div className="pl-3 pr-2 text-slate-400">
                  <Search className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  placeholder="Paste suspicious URL, IP address, or domain to investigate..."
                  className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="shrink-0 text-xs font-semibold py-1.5 px-3"
                >
                  Analyze
                </Button>
              </form>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" /> Real-time heuristic AI inspection
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Zero-Trust Verified
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Futuristic Animated Cybersecurity Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Chakravyuha Concentric Radar Visualization */}
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center select-none">
              {/* Outer Layer 1 (Saptarishi Perimeter) */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute -inset-2 rounded-full border border-dashed border-cyan-400/20 animate-[spin_60s_linear_infinite_reverse]" />

              {/* Layer 2 (Network Vyuha) */}
              <div className="absolute inset-8 rounded-full border border-purple-500/25 animate-[spin_30s_linear_infinite]" />

              {/* Layer 3 (Identity Shield) */}
              <div className="absolute inset-16 rounded-full border border-dashed border-cyan-500/30" />

              {/* Layer 4 (Cognitive Radar Sweep) */}
              <div className="absolute inset-24 rounded-full border border-emerald-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent animate-radar-sweep origin-center" />
              </div>

              {/* Core Security Inspection Floating Card */}
              <Card
                variant="glass"
                className="relative z-20 w-[90%] sm:w-[320px] p-4 space-y-3 shadow-[0_12px_45px_rgba(0,0,0,0.85)] border-cyan-400/40 bg-[#070d1e]/90"
              >
                {/* Header with live radar indicator */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-rose-400">
                      LIVE THREAT INTERCEPT
                    </span>
                  </div>
                  <Badge variant="rose" size="sm">CRITICAL (92/100)</Badge>
                </div>

                {/* Inspecting URL target */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>TARGET ASSET:</span>
                    <span className="text-cyan-400">Layer 1: Perimeter</span>
                  </div>
                  <p className="text-xs text-rose-300 font-semibold truncate">
                    paypal.account-verify.phish-alert.net
                  </p>
                </div>

                {/* Heuristic Breakdown mini tags */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded bg-slate-900/80 border border-white/5">
                    <span className="text-slate-400 block">TLS ATTRIBUTION:</span>
                    <span className="text-amber-400 font-bold">Domain Spoof</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-white/5">
                    <span className="text-slate-400 block">AI CONFIDENCE:</span>
                    <span className="text-emerald-400 font-bold">99.4% Match</span>
                  </div>
                </div>

                {/* Action button inside card */}
                <div className="pt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Saptarishi Guard</span>
                  </div>
                  <Button
                    size="xs"
                    variant="danger"
                    onClick={() => onStartInvestigation(quickUrl)}
                    leftIcon={<ShieldAlert className="w-3 h-3" />}
                  >
                    View Forensic Report
                  </Button>
                </div>
              </Card>

              {/* Orbiting Satellite Node 1 (Verified Trust) */}
              <div className="absolute top-2 right-4 z-30 p-2.5 rounded-xl bg-[#0b152d]/95 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md hidden sm:flex items-center gap-2 animate-bounce">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-400 block">mTLS INTEGRITY</span>
                  <span className="text-xs font-bold text-emerald-400">VERIFIED SAFE</span>
                </div>
              </div>

              {/* Orbiting Satellite Node 2 (Decentralized Mesh) */}
              <div className="absolute bottom-2 left-2 z-30 p-2.5 rounded-xl bg-[#0b152d]/95 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md hidden sm:flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-400 block">CHAKRAVYUHA MESH</span>
                  <span className="text-xs font-bold text-cyan-400">7 DEFENSE RINGS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

