import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80",
        className
      )}
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#101B36]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-2.5 h-2 w-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#101B36]">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#101B36] overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="py-3.5 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={cn(
                  "h-4",
                  c === 0 ? "w-1/3" : c === cols - 1 ? "w-16" : "w-1/5"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}
