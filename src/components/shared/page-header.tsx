import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800 mb-6",
        className
      )}
    >
      {/* Breadcrumbs Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-[#315BEA] dark:hover:text-blue-400 transition-colors"
          >
            <Home className="h-3 w-3" />
            <span className="sr-only sm:not-sr-only font-medium">Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="font-medium hover:text-[#315BEA] dark:hover:text-blue-400 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#101B36] dark:text-slate-200">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101B36] dark:text-white">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 flex-wrap shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
