import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  homeHref?: string;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  homeHref = "/dashboard",
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-rose-200 bg-rose-50/60 text-center dark:border-rose-900/60 dark:bg-rose-950/20",
        compact ? "p-5" : "p-8 sm:p-10",
        className
      )}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 mb-3.5">
        <AlertCircle className="h-5 w-5" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-rose-950 dark:text-rose-200">
        {title}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-rose-700 dark:text-rose-300 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            size="sm"
            onClick={onRetry}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
        )}
        {homeHref && (
          <a href={homeHref}>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-200 bg-white hover:bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
