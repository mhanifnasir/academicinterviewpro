"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-[#101B36] dark:text-white max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h2 className="text-xl font-bold text-[#101B36] dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
