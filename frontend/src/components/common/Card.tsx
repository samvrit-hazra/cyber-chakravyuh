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
      default: 'bg-[#0b152d]/80 border-cyan-500/15 shadow-[0_4px_20px_-2px_rgba(2,6,23,0.7)]',
      elevated: 'bg-[#0f1d3d]/90 border-cyan-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)]',
      interactive:
        'bg-[#0b152d]/80 border-cyan-500/15 hover:border-cyan-400/50 hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.18)] hover:-translate-y-0.5 cursor-pointer transition-all duration-300',
      threat:
        'bg-[#0b152d]/90 border-rose-500/35 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-rose-500',
      verified:
        'bg-[#0b152d]/90 border-emerald-500/35 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-emerald-500',
      glass:
        'bg-[#060d1f]/60 backdrop-blur-xl border-cyan-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border backdrop-blur-md text-slate-100 relative',
          variants[variant],
          glow && 'shadow-[0_0_20px_rgba(6,182,212,0.25)] border-cyan-400/40',
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
      className={cn('flex flex-col space-y-1.5 p-5 border-b border-white/[0.06]', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base font-semibold leading-none tracking-tight text-white flex items-center gap-2', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-slate-400 leading-normal', className)}
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
      className={cn('flex items-center justify-between p-5 pt-0 border-t border-white/[0.06] mt-4', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

