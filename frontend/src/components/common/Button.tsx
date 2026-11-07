import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] cursor-pointer relative overflow-hidden';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_22px_rgba(6,182,212,0.55)] focus-visible:ring-cyan-400 border border-cyan-300/40',
      secondary:
        'bg-purple-600/90 hover:bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:shadow-[0_0_18px_rgba(168,85,247,0.5)] focus-visible:ring-purple-400 border border-purple-400/40',
      outline:
        'bg-slate-900/60 hover:bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/80 hover:text-cyan-300 focus-visible:ring-cyan-400 backdrop-blur-sm',
      ghost:
        'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus-visible:ring-slate-500',
      danger:
        'bg-rose-600/90 hover:bg-rose-500 text-white shadow-[0_0_14px_rgba(244,63,94,0.35)] hover:shadow-[0_0_20px_rgba(244,63,94,0.55)] focus-visible:ring-rose-400 border border-rose-400/40',
      success:
        'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.35)] hover:shadow-[0_0_20px_rgba(16,185,129,0.55)] focus-visible:ring-emerald-400 border border-emerald-400/40',
    };

    const sizes: Record<ButtonSize, string> = {
      xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-9 px-4 text-sm rounded-lg gap-2',
      lg: 'h-11 px-5 text-base rounded-lg gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            {size !== 'icon' && <span>Processing...</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

