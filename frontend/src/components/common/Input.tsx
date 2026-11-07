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
      sm: 'h-8 px-2.5 text-xs rounded-md',
      md: 'h-9 px-3 text-sm rounded-lg',
      lg: 'h-11 px-4 text-base rounded-lg',
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 tracking-wide uppercase"
          >
            {label}
            {props.required && <span className="ml-1 text-cyan-400">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
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
              'w-full bg-[#0b152d]/80 text-slate-100 placeholder-slate-500',
              'border border-cyan-500/20 backdrop-blur-md transition-all duration-200',
              'focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errorMessage && 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/40 focus:shadow-[0_0_12px_rgba(244,63,94,0.25)]',
              leftIcon && 'pl-9',
              (rightIcon || (isClearable && currentVal)) && 'pr-9',
              isMonospace && 'font-mono tracking-tight',
              sizeStyles[sizeVariant],
              className
            )}
            {...props}
          />

          <div className="absolute right-2.5 flex items-center gap-1.5 text-slate-400">
            {isClearable && currentVal && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:text-slate-200 transition-colors rounded hover:bg-slate-800/80"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {rightIcon && <div className="flex items-center justify-center">{rightIcon}</div>}
          </div>
        </div>

        {errorMessage ? (
          <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

