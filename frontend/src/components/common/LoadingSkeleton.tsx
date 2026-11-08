import React from 'react';
import { cn } from '../../utils/cn.ts';

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function LoadingSkeleton({
  variant = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}: LoadingSkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-lg',
    card: 'rounded-xl h-36 w-full p-4',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7]/40 dark:border-[#304144]/40',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-[#A95636]/10 dark:before:via-[#C47A52]/10 before:to-transparent',
        variantStyles[variant],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="rectangular" width="40%" height={18} />
        <LoadingSkeleton variant="circular" width={24} height={24} />
      </div>
      <LoadingSkeleton variant="text" width="90%" height={12} />
      <LoadingSkeleton variant="text" width="60%" height={12} />
      <div className="pt-2 flex items-center justify-between">
        <LoadingSkeleton variant="rectangular" width="30%" height={26} />
        <LoadingSkeleton variant="rectangular" width="20%" height={26} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-[#D9DED7] dark:border-[#304144] bg-white dark:bg-[#19272A] p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <LoadingSkeleton variant="rectangular" width="25%" height={16} />
        <LoadingSkeleton variant="rectangular" width="15%" height={16} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <LoadingSkeleton variant="circular" width={20} height={20} />
          <LoadingSkeleton variant="text" width="30%" height={14} />
          <LoadingSkeleton variant="text" width="20%" height={14} />
          <LoadingSkeleton variant="text" width="35%" height={14} />
        </div>
      ))}
    </div>
  );
}

