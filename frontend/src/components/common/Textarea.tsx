import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showCount?: boolean;
  isMonospace?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      showCount = false,
      isMonospace = false,
      maxLength,
      value,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const count = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-medium text-slate-300 tracking-wide uppercase"
            >
              {label}
              {props.required && <span className="ml-1 text-cyan-400">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE]">
              {count} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            'w-full min-h-[90px] p-3 rounded-lg bg-white dark:bg-[#101A1D] text-[#182629] dark:text-[#E8E6DC] placeholder-[#647477] dark:placeholder-[#A6B3AE]',
            'border border-[#D9DED7] dark:border-[#304144] transition-all duration-200 shadow-xs',
            'focus:outline-none focus:border-[#A95636] dark:focus:border-[#C47A52]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            errorMessage && 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/40 focus:shadow-[0_0_12px_rgba(244,63,94,0.25)]',
            isMonospace && 'font-mono text-xs leading-relaxed',
            className
          )}
          {...props}
        />

        {errorMessage ? (
          <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-1">
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

Textarea.displayName = 'Textarea';

