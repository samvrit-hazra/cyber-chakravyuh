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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white dark:bg-[#19272A] text-[#182629] dark:text-[#E8E6DC] shadow-2xl border transition-all transform animate-in zoom-in-95 duration-200 overflow-hidden',
          isThreatAlert
            ? 'border-[#B64B46]/40 dark:border-[#E17B70]/40'
            : 'border-[#D9DED7] dark:border-[#304144]',
          sizeClasses[size]
        )}
      >
        {/* Top Indicator Stripe */}
        <div
          className={cn(
            'h-1 w-full',
            isThreatAlert
              ? 'bg-[#B64B46] dark:bg-[#E17B70]'
              : 'bg-[#A95636] dark:bg-[#C47A52]'
          )}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#D9DED7] dark:border-[#304144]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isThreatAlert && <ShieldAlert className="w-5 h-5 text-[#B64B46] dark:text-[#E17B70] shrink-0" />}
              <h2 className="text-lg font-bold font-heading text-[#182629] dark:text-[#E8E6DC]">{title}</h2>
            </div>
            {subtitle && <p className="text-xs text-[#647477] dark:text-[#A6B3AE]">{subtitle}</p>}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-white hover:bg-[#EAECE6] dark:hover:bg-[#293A3C] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 text-sm text-[#182629] dark:text-[#E8E6DC] max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 bg-[#F3F1E9] dark:bg-[#101A1D] border-t border-[#D9DED7] dark:border-[#304144]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
