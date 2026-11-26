import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "outline" | "success";
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-[#101B36]/30",
        compact ? "p-6" : "p-10 sm:p-12",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 text-[#315BEA] dark:text-blue-400 mb-4">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>

      <h3 className="text-base font-bold text-[#101B36] dark:text-white max-w-sm">
        {title}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            action.href ? (
              <a href={action.href}>
                <Button
                  size={compact ? "sm" : "default"}
                  variant={action.variant || "default"}
                  className="font-semibold text-xs sm:text-sm shadow-xs"
                >
                  {action.label}
                </Button>
              </a>
            ) : (
              <Button
                size={compact ? "sm" : "default"}
                variant={action.variant || "default"}
                onClick={action.onClick}
                className="font-semibold text-xs sm:text-sm shadow-xs"
              >
                {action.label}
              </Button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <a href={secondaryAction.href}>
                <Button
                  size={compact ? "sm" : "default"}
                  variant="ghost"
                  className="font-semibold text-xs sm:text-sm"
                >
                  {secondaryAction.label}
                </Button>
              </a>
            ) : (
              <Button
                size={compact ? "sm" : "default"}
                variant="ghost"
                onClick={secondaryAction.onClick}
                className="font-semibold text-xs sm:text-sm"
              >
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
