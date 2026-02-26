'use client';

import { useRef } from "react";
import type { MouseEvent } from "react";
import { Text } from "@/components/ui/common/text";
import { cn } from "@/shared/cn";
import { OverlayProvider, useOverlayContext, OverlayBackdrop, OverlayPortal, useOverlayBehavior, Z_INDEX } from "../overlay";
import type { PopoverProps, PopoverTriggerProps, PopoverContentProps, PopoverHeaderProps, PopoverBodyProps, PopoverFooterProps, PopoverGroupProps } from "./types";

function PopoverRoot({ children, className, open, onOpenChange, defaultOpen }: PopoverProps) {
  return (
    <OverlayProvider open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <div className={cn("relative inline-block w-full", className)}>{children}</div>
    </OverlayProvider>
  );
}

function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const { toggle, anchorRef } = useOverlayContext();

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    toggle();
  };

  return (
    <div
      ref={anchorRef as React.RefObject<HTMLDivElement>}
      onClick={handleClick}
      className={cn("inline-block", className)}
    >
      {children}
    </div>
  );
}

function PopoverContent({
  children,
  className,
  position = "bottom-left",
  maxWidth = "320px",
  maxHeight = "300px",
}: PopoverContentProps) {
  const { open, close, anchorRef, contentId } = useOverlayContext();
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useOverlayBehavior({
    open,
    onClose: close,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    lockBodyScroll: false,
    contentRef: desktopRef,
    anchorRef,
  });

  if (!open) return null;

  const positionClasses = {
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  return (
    <>
      {/* Desktop: invisible barrier + absolute dropdown */}
      <OverlayBackdrop
        variant="transparent"
        onClick={close}
        className="mobile:hidden"
        style={{ zIndex: Z_INDEX.POPOVER_BARRIER }}
      />
      <div
        ref={desktopRef}
        id={contentId}
        className={cn(
          "absolute bg-primary border border-secondary rounded-lg shadow-lg min-w-[280px]",
          "animate-[overlay-pop-in_0.15s_ease-out]",
          "mobile:hidden",
          positionClasses[position],
          className,
        )}
        style={{ zIndex: Z_INDEX.POPOVER_CONTENT, maxWidth, maxHeight }}
      >
        {children}
      </div>

      {/* Mobile: bottom-sheet drawer via portal */}
      <OverlayPortal>
        <div className="hidden mobile:block">
          <OverlayBackdrop
            variant="blur"
            onClick={close}
            style={{ zIndex: Z_INDEX.SHEET_BACKDROP }}
          />
          <div
            className="fixed bottom-0 left-0 right-0 animate-[overlay-slide-in-bottom_0.25s_ease-out]"
            style={{ zIndex: Z_INDEX.SHEET_CONTENT }}
          >
            <div
              ref={mobileRef}
              className={cn(
                "bg-primary rounded-t-xl border-t border-secondary shadow-lg max-h-[70vh] overflow-y-auto",
                className,
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </OverlayPortal>
    </>
  );
}

function PopoverHeader({ children, className }: PopoverHeaderProps) {
  return (
    <div className={cn("px-4 py-3 border-b border-secondary", className)}>
      {children}
    </div>
  );
}

function PopoverBody({ children, className }: PopoverBodyProps) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}

function PopoverFooter({ children, className }: PopoverFooterProps) {
  return (
    <div className={cn("p-2 border-t border-secondary flex gap-2 justify-end", className)}>
      {children}
    </div>
  );
}

function PopoverGroup({ fieldName, children }: PopoverGroupProps) {
  return (
    <div className="space-y-2">
      <Text style="label-xs" className="text-tertiary">{fieldName}</Text>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Body: PopoverBody,
  Footer: PopoverFooter,
  Group: PopoverGroup,
  useContext: useOverlayContext,
};

export { Popover };
