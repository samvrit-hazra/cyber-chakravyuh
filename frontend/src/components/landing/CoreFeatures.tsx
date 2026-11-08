import {
  Globe,
  Lock,
  Brain,
  Network,
  ShieldCheck,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { Card, Button, Badge } from '../common/index.ts';
import type { FeatureDetail } from './FeatureDetailModal.tsx';
import { featuresData } from '../../utils/featuresData.ts';

interface CoreFeaturesProps {
  onLearnMore: (feature: FeatureDetail) => void;
}

export function CoreFeatures({ onLearnMore }: CoreFeaturesProps) {
  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'url-analysis':
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'tls-intelligence':
        return <Lock className="w-6 h-6 text-[#C47A52]" />;
      case 'ai-scam-detection':
        return <Brain className="w-6 h-6 text-rose-400" />;
      case 'threat-correlation':
        return <Network className="w-6 h-6 text-cyan-400" />;
      case 'website-security-assessment':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'decentralized-intel':
        return <Share2 className="w-6 h-6 text-[#C47A52]" />;
      default:
        return <Globe className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="cyan" size="md" hasDot pulseDot>
            CORE CAPABILITIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Six Pillars of Cyber Defense Intelligence
          </h2>
          <p className="text-sm sm:text-base text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
            Engineered to analyze suspicious URLs, detect sophisticated phishing campaigns, and verify digital trust with mathematical and heuristic certainty.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, idx) => (
            <Card
              key={feature.id}
              variant="interactive"
              className="p-6 flex flex-col justify-between group hover:border-[#A95636] dark:hover:border-[#C47A52] transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-center text-[#A95636] dark:text-[#C47A52] group-hover:scale-105 transition-all">
                    {getFeatureIcon(feature.id)}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A95636] dark:text-[#C47A52] font-semibold block">
                    {feature.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#182629] dark:text-[#E8E6DC] group-hover:text-[#A95636] dark:group-hover:text-[#C47A52] transition-colors">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-relaxed line-clamp-3">
                  {feature.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#D9DED7] dark:border-[#304144] mt-4 flex items-center justify-between">
                <Badge variant="neutral" size="sm" className="text-[10px]">
                  {feature.architectureLayer.split(':')[0]}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLearnMore(feature)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                  className="text-xs text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                >
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
