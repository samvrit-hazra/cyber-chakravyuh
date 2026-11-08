import React from 'react';
import { cn } from '../../utils/cn.ts';

export type BadgeVariant = 'copper' | 'spruce' | 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  hasDot?: boolean;
  pulseDot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'copper',
  size = 'md',
  hasDot = false,
  pulseDot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const variants: Record<
    BadgeVariant,
    { bg: string; text: string; border: string; dot: string }
  > = {
    copper: {
      bg: 'bg-[#A95636]/10 dark:bg-[#C47A52]/15',
      text: 'text-[#A95636] dark:text-[#C47A52]',
      border: 'border-[#A95636]/25 dark:border-[#C47A52]/30',
      dot: 'bg-[#A95636] dark:bg-[#C47A52]',
    },
    spruce: {
      bg: 'bg-[#356D68]/10 dark:bg-[#79A99C]/15',
      text: 'text-[#356D68] dark:text-[#79A99C]',
      border: 'border-[#356D68]/25 dark:border-[#79A99C]/30',
      dot: 'bg-[#356D68] dark:bg-[#79A99C]',
    },
    cyan: {
      bg: 'bg-[#356D68]/10 dark:bg-[#79A99C]/15',
      text: 'text-[#356D68] dark:text-[#79A99C]',
      border: 'border-[#356D68]/25 dark:border-[#79A99C]/30',
      dot: 'bg-[#356D68] dark:bg-[#79A99C]',
    },
    purple: {
      bg: 'bg-[#A95636]/10 dark:bg-[#C47A52]/15',
      text: 'text-[#A95636] dark:text-[#C47A52]',
      border: 'border-[#A95636]/25 dark:border-[#C47A52]/30',
      dot: 'bg-[#A95636] dark:bg-[#C47A52]',
    },
    emerald: {
      bg: 'bg-[#36745F]/10 dark:bg-[#79B69A]/15',
      text: 'text-[#36745F] dark:text-[#79B69A]',
      border: 'border-[#36745F]/25 dark:border-[#79B69A]/30',
      dot: 'bg-[#36745F] dark:bg-[#79B69A]',
    },
    rose: {
      bg: 'bg-[#B64B46]/10 dark:bg-[#E17B70]/15',
      text: 'text-[#B64B46] dark:text-[#E17B70]',
      border: 'border-[#B64B46]/25 dark:border-[#E17B70]/30',
      dot: 'bg-[#B64B46] dark:bg-[#E17B70]',
    },
    amber: {
      bg: 'bg-[#A87532]/10 dark:bg-[#D7AA61]/15',
      text: 'text-[#A87532] dark:text-[#D7AA61]',
      border: 'border-[#A87532]/25 dark:border-[#D7AA61]/30',
      dot: 'bg-[#A87532] dark:bg-[#D7AA61]',
    },
    neutral: {
      bg: 'bg-[#647477]/10 dark:bg-[#A6B3AE]/15',
      text: 'text-[#647477] dark:text-[#A6B3AE]',
      border: 'border-[#D9DED7] dark:border-[#304144]',
      dot: 'bg-[#647477] dark:bg-[#A6B3AE]',
    },
  };

  const sizes: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-sans',
  };

  const current = variants[variant] || variants.copper;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium border uppercase tracking-wide transition-colors',
        current.bg,
        current.text,
        current.border,
        sizes[size],
        className
      )}
      {...props}
    >
      {hasDot && (
        <span className="relative flex h-1.5 w-1.5 mr-0.5">
          {pulseDot && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                current.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', current.dot)} />
        </span>
      )}

      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
