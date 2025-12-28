'use client';

import { cn } from "@/shared/cn";
import { Icon } from "./icon";

type SelectOptionItemProps = {
  children: React.ReactNode;
  isSelected?: boolean;
  isHighlighted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  className?: string;
};

export function SelectOptionItem({
  children,
  isSelected = false,
  isHighlighted = false,
  disabled = false,
  onClick,
  onMouseEnter,
  className,
}: SelectOptionItemProps) {
  return (
    <div
      onClick={() => !disabled && onClick?.()}
      onMouseEnter={() => !disabled && onMouseEnter?.()}
      className={cn(
        "px-2.5 py-1.5 cursor-pointer paragraph-sm rounded-md",
        "transition-colors duration-100",
        isHighlighted && !isSelected && "bg-secondary",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:bg-secondary",
        className
      )}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 break-words">{children}</span>
        {isSelected && <Icon.check size={16} className="text-brand-solid shrink-0" />}
      </div>
    </div>
  );
}

type SelectOptionContainerProps = {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
};

export function SelectOptionContainer({
  children,
  maxHeight = 200,
  className,
}: SelectOptionContainerProps) {
  return (
    <div
      className={cn("p-1 overflow-y-auto", className)}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {children}
    </div>
  );
}
