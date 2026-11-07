import React, { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  isThreatAlert?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  isThreatAlert = false,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Dimmed cyber backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-[#0b152d]/95 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border transition-all transform animate-in zoom-in-95 duration-200 overflow-hidden',
          isThreatAlert
            ? 'border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.25)]'
            : 'border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.15)]',
          sizeClasses[size]
        )}
      >
        {/* Top neon indicator stripe */}
        <div
          className={cn(
            'h-1 w-full',
            isThreatAlert
              ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500'
              : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500'
          )}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isThreatAlert && <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />}
              <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
            </div>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 text-sm text-slate-300 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 bg-[#070d1e]/90 border-t border-white/[0.08]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

