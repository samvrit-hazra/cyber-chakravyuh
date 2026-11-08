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
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] cursor-pointer relative font-sans';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[#A95636] hover:bg-[#8F472C] dark:bg-[#C47A52] dark:hover:bg-[#B06A44] text-white shadow-sm',
      secondary:
        'bg-[#EAECE6] hover:bg-[#D9DED7] dark:bg-[#223336] dark:hover:bg-[#293A3C] text-[#182629] dark:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]',
      outline:
        'bg-transparent hover:bg-[#EAECE6] dark:hover:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]',
      ghost:
        'bg-transparent hover:bg-[#EAECE6] dark:hover:bg-[#223336] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]',
      danger:
        'bg-[#B64B46]/10 hover:bg-[#B64B46]/20 dark:bg-[#E17B70]/15 dark:hover:bg-[#E17B70]/25 text-[#B64B46] dark:text-[#E17B70] border border-[#B64B46]/30 dark:border-[#E17B70]/40',
      success:
        'bg-[#36745F]/10 hover:bg-[#36745F]/20 dark:bg-[#79B69A]/15 dark:hover:bg-[#79B69A]/25 text-[#36745F] dark:text-[#79B69A] border border-[#36745F]/30 dark:border-[#79B69A]/40',
    };

    const sizes: Record<ButtonSize, string> = {
      xs: 'h-7 px-2.5 text-xs rounded gap-1.5',
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-9 px-4 text-xs sm:text-sm rounded-md gap-2',
      lg: 'h-11 px-5 text-sm sm:text-base rounded-md gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-md',
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
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
