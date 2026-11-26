"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [currentValue, setCurrentValue] = React.useState(defaultValue || "");

  const activeValue = value !== undefined ? value : currentValue;
  const handleValueChange = (val: string) => {
    if (value === undefined) setCurrentValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider
      value={{ value: activeValue, onValueChange: handleValueChange }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-start rounded-xl bg-slate-100 p-1 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 gap-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be within Tabs");

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-[#101B36] shadow-sm font-semibold dark:bg-[#101B36] dark:text-white"
          : "hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be within Tabs");

  if (context.value !== value) return null;

  return (
    <div
      className={cn(
        "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2",
        className
      )}
    >
      {children}
    </div>
  );
}
