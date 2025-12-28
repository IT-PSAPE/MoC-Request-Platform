"use client";
import { cn } from "@/shared/cn";

export type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export function Switch({ checked, onCheckedChange, id, disabled, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      id={id}
      onClick={() => !disabled && onCheckedChange(!checked)}
      {...rest}
      className="h-5 w-8 flex items-center justify-center"
    >
      <div className={cn(
        "relative inline-flex h-4 w-7 items-center rounded-full transition-colors flex-shrink-0 ",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked ? "bg-brand-solid" : "bg-quaternary",
      )}>
        <span
          className={cn(
            "inline-flex items-center justify-center h-3 w-3 transform rounded-full bg-primary transition-transform ",
            checked ? "translate-x-3.5" : "translate-x-0.5"
          )}
        >
          <span className={cn(
            "h-1 w-1 rounded-full",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            checked ? "bg-brand-solid" : "bg-quaternary",
          )}></span>
        </span>
      </div>
    </button>
  );
}
