import { Shield, Lock, FileSearch } from 'lucide-react';
import { URLAnalyzer } from '../analyzer/URLAnalyzer.tsx';
import { UrlDecompositionDiagram } from './UrlDecompositionDiagram.tsx';

interface HeroSectionProps {
  initialUrl?: string;
  onStartInvestigation: (url?: string) => void;
  onExplorePlatform?: () => void;
  onOpenHistory?: () => void;
}

export function HeroSection({
  initialUrl,
  onStartInvestigation,
  onOpenHistory,
}: HeroSectionProps) {
  return (
    <section id="analyzer" className="relative pt-20 sm:pt-22 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Asymmetric Editorial Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-5 text-left">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#EAECE6] dark:bg-[#223336] text-[11px] font-mono font-bold tracking-widest uppercase text-[#356D68] dark:text-[#79A99C] border border-[#D9DED7] dark:border-[#304144]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A95636] dark:bg-[#C47A52]" />
              <span>LINK INTELLIGENCE & THREAT FORENSICS</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-heading text-[#182629] dark:text-[#E8E6DC] leading-[1.08]">
              Know where <br className="hidden sm:block" />
              a link{' '}
              <span className="text-[#A95636] dark:text-[#C47A52]">
                leads.
              </span>
            </h1>

            {/* Supporting Explanation */}
            <p className="text-base sm:text-lg text-[#647477] dark:text-[#A6B3AE] leading-relaxed max-w-xl font-sans">
              Investigate suspicious URLs, understand their destinations, and identify the evidence behind potential threats before interacting with deceptive web infrastructure.
            </p>

            {/* Trust Signal Micro-Badges */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
              <div className="flex items-center gap-1.5">
                <FileSearch className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />
                <span>Deterministic Heuristics</span>
              </div>
              <span className="text-[#D9DED7] dark:text-[#304144]">/</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
                <span>Zero Data Retention</span>
              </div>
              <span className="text-[#D9DED7] dark:text-[#304144]">/</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#36745F] dark:text-[#79B69A]" />
                <span>RFC 3986 Standards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live URL Decomposition Diagram (Replaces decorative 3D globe) */}
          <div className="lg:col-span-6 w-full">
            <UrlDecompositionDiagram />
          </div>
        </div>

        {/* Central Dominant URL Analyzer Tool */}
        <div className="pt-2">
          <URLAnalyzer
            initialUrl={initialUrl}
            onOpenAnalystConsole={onStartInvestigation}
            onOpenHistory={onOpenHistory}
          />
        </div>
      </div>
    </section>
  );
}
