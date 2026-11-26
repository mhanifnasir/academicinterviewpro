"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className,
}: SwitchProps) {
  return (
    <label className={cn("inline-flex items-center cursor-pointer select-none gap-3", className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            "block h-6 w-11 rounded-full transition-colors",
            checked ? "bg-[#315BEA]" : "bg-slate-300 dark:bg-slate-700",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div
          className={cn(
            "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
    </label>
  );
}
