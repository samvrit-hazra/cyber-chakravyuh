import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import type { RiskClassification } from '../../types/investigation.ts';

interface RiskBadgeProps {
  classification: RiskClassification;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RiskBadge({ classification, size = 'md', showIcon = true }: RiskBadgeProps) {
  const getMeta = () => {
    switch (classification) {
      case 'Confirmed Malicious':
        return {
          bg: 'bg-[#B64B46]/10 dark:bg-[#E17B70]/12',
          border: 'border-[#B64B46]/30 dark:border-[#E17B70]/35',
          text: 'text-[#B64B46] dark:text-[#E17B70]',
          label: 'Confirmed Malicious',
          icon: <ShieldAlert className="shrink-0" />,
        };
      case 'High Risk':
        return {
          bg: 'bg-[#B64B46]/10 dark:bg-[#E17B70]/12',
          border: 'border-[#B64B46]/25 dark:border-[#E17B70]/30',
          text: 'text-[#B64B46] dark:text-[#E17B70]',
          label: 'High Threat Level',
          icon: <ShieldAlert className="shrink-0" />,
        };
      case 'Suspicious':
        return {
          bg: 'bg-[#A87532]/10 dark:bg-[#D7AA61]/12',
          border: 'border-[#A87532]/30 dark:border-[#D7AA61]/35',
          text: 'text-[#A87532] dark:text-[#D7AA61]',
          label: 'Suspicious Indicators',
          icon: <AlertTriangle className="shrink-0" />,
        };
      case 'Low Risk':
        return {
          bg: 'bg-[#36745F]/10 dark:bg-[#79B69A]/12',
          border: 'border-[#36745F]/30 dark:border-[#79B69A]/35',
          text: 'text-[#36745F] dark:text-[#79B69A]',
          label: 'Clean Indicators (No Threats Detected)',
          icon: <ShieldCheck className="shrink-0" />,
        };
      case 'Inconclusive':
      default:
        return {
          bg: 'bg-[#647477]/10 dark:bg-[#A6B3AE]/12',
          border: 'border-[#647477]/30 dark:border-[#A6B3AE]/35',
          text: 'text-[#647477] dark:text-[#A6B3AE]',
          label: 'Inconclusive / Unverified',
          icon: <HelpCircle className="shrink-0" />,
        };
    }
  };

  const meta = getMeta();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 [&_svg]:w-3 [&_svg]:h-3 font-mono font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5 font-mono font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 [&_svg]:w-4 [&_svg]:h-4 font-mono font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border tracking-wider uppercase transition-colors ${meta.bg} ${meta.border} ${meta.text} ${sizeClasses}`}
    >
      {showIcon && meta.icon}
      <span>{meta.label}</span>
    </span>
  );
}
