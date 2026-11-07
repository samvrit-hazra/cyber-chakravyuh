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
            <span className="text-[11px] font-mono text-slate-400">
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
            'w-full min-h-[90px] p-3 rounded-lg bg-[#0b152d]/80 text-slate-100 placeholder-slate-500',
            'border border-cyan-500/20 backdrop-blur-md transition-all duration-200',
            'focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)]',
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
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

