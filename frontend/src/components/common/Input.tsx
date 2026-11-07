import React, { forwardRef, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isClearable?: boolean;
  onClear?: () => void;
  sizeVariant?: 'sm' | 'md' | 'lg';
  isMonospace?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      isClearable = false,
      onClear,
      sizeVariant = 'md',
      isMonospace = false,
      disabled,
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [internalVal, setInternalVal] = useState(value || '');
    const isControlled = value !== undefined;
    const currentVal = isControlled ? value : internalVal;

    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const handleClear = () => {
      if (!isControlled) {
        setInternalVal('');
      }
      onClear?.();
    };

    const sizeStyles = {
      sm: 'h-8 px-2.5 text-xs rounded',
      md: 'h-9 px-3 text-xs sm:text-sm rounded-md',
      lg: 'h-11 px-4 text-sm sm:text-base rounded-md',
    };

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#182629] dark:text-[#E8E6DC] tracking-wide uppercase font-mono"
          >
            {label}
            {props.required && <span className="ml-1 text-[#A95636] dark:text-[#C47A52]">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-[#647477] dark:text-[#A6B3AE] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            value={currentVal}
            disabled={disabled}
            onChange={(e) => {
              if (!isControlled) setInternalVal(e.target.value);
              onChange?.(e);
            }}
            className={cn(
              'w-full bg-[#EAECE6]/50 dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE]/60',
              'border border-[#D9DED7] dark:border-[#304144] transition-all duration-200',
              'focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52] focus:ring-1 focus:ring-[#A95636]/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errorMessage &&
                'border-[#B64B46] dark:border-[#E17B70] focus:border-[#B64B46] dark:focus:border-[#E17B70] focus:ring-[#B64B46]/20',
              leftIcon && 'pl-9',
              (rightIcon || (isClearable && currentVal)) && 'pr-9',
              isMonospace && 'font-mono tracking-tight',
              sizeStyles[sizeVariant],
              className
            )}
            {...props}
          />

          <div className="absolute right-2.5 flex items-center gap-1.5 text-[#647477] dark:text-[#A6B3AE]">
            {isClearable && currentVal && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:text-[#182629] dark:hover:text-[#E8E6DC] transition-colors rounded hover:bg-[#D9DED7] dark:hover:bg-[#223336]"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {rightIcon && <div className="flex items-center justify-center">{rightIcon}</div>}
          </div>
        </div>

        {errorMessage ? (
          <p className="flex items-center gap-1.5 text-xs text-[#B64B46] dark:text-[#E17B70] font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-[#647477] dark:text-[#A6B3AE] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
