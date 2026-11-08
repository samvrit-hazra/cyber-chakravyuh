import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.ts';

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'threat' | 'verified' | 'glass';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow = false, children, ...props }, ref) => {
    const variants: Record<CardVariant, string> = {
      default:
        'bg-white dark:bg-[#19272A] border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] shadow-sm',
      elevated:
        'bg-[#EAECE6]/50 dark:bg-[#223336] border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] shadow-sm',
      interactive:
        'bg-white dark:bg-[#19272A] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636] dark:hover:border-[#C47A52] text-[#182629] dark:text-[#E8E6DC] cursor-pointer transition-all duration-200',
      threat:
        'bg-white dark:bg-[#19272A] border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#182629] dark:text-[#E8E6DC] relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#B64B46] dark:before:bg-[#E17B70]',
      verified:
        'bg-white dark:bg-[#19272A] border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#182629] dark:text-[#E8E6DC] relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#36745F] dark:before:bg-[#79B69A]',
      glass:
        'bg-white/95 dark:bg-[#19272A]/95 backdrop-blur-md border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] shadow-sm',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border transition-colors relative',
          variants[variant],
          glow && 'border-[#A95636] dark:border-[#C47A52]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-5 border-b border-[#D9DED7] dark:border-[#304144]', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base font-semibold leading-none tracking-tight text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-[#647477] dark:text-[#A6B3AE] leading-normal', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-5 pt-0 border-t border-[#D9DED7] dark:border-[#304144] mt-4', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
