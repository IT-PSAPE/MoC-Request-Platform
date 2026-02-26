'use client';

import { cn } from "@/shared/cn";
import type { OverlayBackdropProps } from "./types";

const variantClasses: Record<OverlayBackdropProps["variant"], string> = {
  blur: "bg-linear-to-b from-black/20 to-black/40 backdrop-blur-xs animate-[overlay-fade-in_0.2s_ease-out]",
  transparent: "",
};

export function OverlayBackdrop({ variant, onClick, className, style }: OverlayBackdropProps) {
  return (
    <div
      className={cn("fixed inset-0", variantClasses[variant], className)}
      onClick={onClick}
      style={style}
      aria-hidden="true"
    />
  );
}
