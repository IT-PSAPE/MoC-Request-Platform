"use client";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/cn";

export default function Sheet({
  open,
  onOpenChange,
  title,
  children,
  width = 420,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div className={cn("fixed inset-0 z-40", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />
      {/* Panel */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full bg-background border-l border-foreground/15 shadow-xl flex flex-col",
          "transition-transform",
          "max-w-full",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width }}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-4 py-3 border-b border-foreground/10 flex items-center justify-between">
          <div className="text-sm font-medium">{title}</div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-foreground/70 hover:text-foreground text-sm"
            aria-label="Close"
          >
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
