import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Modal, Button, Badge } from '../common/index.ts';

export interface FeatureDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  architectureLayer: string;
  technicalSpecs: { label: string; value: string }[];
}

interface FeatureDetailModalProps {
  feature: FeatureDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onStartInvestigation?: () => void;
}

export function FeatureDetailModal({
  feature,
  isOpen,
  onClose,
  onStartInvestigation,
}: FeatureDetailModalProps) {
  if (!feature) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={feature.title}
      subtitle={feature.category}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Badge variant="cyan" size="sm">
            {feature.architectureLayer}
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {onStartInvestigation && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onStartInvestigation();
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch Live Tool
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-[#182629] dark:text-[#E8E6DC]">
        <p className="text-sm leading-relaxed text-slate-300 bg-[#F3F1E9] dark:bg-[#101A1D] p-4 rounded-xl border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC]">
          {feature.description}
        </p>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#356D68] dark:text-[#79A99C] font-semibold mb-3">
            Core Analytical Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {feature.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#A95636] dark:text-[#C47A52] font-semibold mb-3">
            Technical Specification Matrix
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {feature.technicalSpecs.map((spec, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">{spec.label}</span>
                <span className="text-xs font-semibold text-cyan-300 mt-0.5 block truncate">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

