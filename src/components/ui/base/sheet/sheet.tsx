'use client';

import { useRef } from "react";
import { cn } from "@/shared/cn";
import { IconButton } from "@/components/ui/common/button";
import { Icon } from "@/components/ui/common/icon";
import { OverlayProvider, useOverlayContext, OverlayBackdrop, OverlayPortal, useOverlayBehavior, Z_INDEX } from "../overlay";
import type { SheetProps, SheetContentProps, SheetHeaderProps, SheetFooterProps, SheetTriggerProps, SheetCloseProps } from "./types";

function SheetRoot({ children, open, onOpenChange, defaultOpen }: SheetProps) {
  return (
    <OverlayProvider open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {children}
    </OverlayProvider>
  );
}

function SheetTrigger({ children, className }: SheetTriggerProps) {
  const { setOpen } = useOverlayContext();

  return (
    <div onClick={() => setOpen(true)} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}

function SheetClose({ children, className }: SheetCloseProps) {
  const { close } = useOverlayContext();

  return (
    <div onClick={close} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}

function SheetContent({ children, className }: SheetContentProps) {
  const { open, close, contentId } = useOverlayContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useOverlayBehavior({
    open,
    onClose: close,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    lockBodyScroll: true,
    contentRef,
  });

  if (!open) return null;

  return (
    <OverlayPortal>
      <OverlayBackdrop variant="blur" onClick={close} style={{ zIndex: Z_INDEX.SHEET_BACKDROP }} />
      <div
        className="fixed inset-0 p-2 mobile:p-0"
        style={{ zIndex: Z_INDEX.SHEET_CONTENT }}
      >
        <div
          ref={contentRef}
          id={contentId}
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-[384px] h-full flex flex-col ml-auto bg-primary rounded-xl",
            "animate-[overlay-slide-in-right_0.25s_ease-out]",
            "mobile:max-w-full mobile:h-auto mobile:max-h-[85vh] mobile:ml-0",
            "mobile:fixed mobile:bottom-0 mobile:left-0 mobile:right-0",
            "mobile:rounded-b-none mobile:rounded-t-xl",
            "mobile:animate-[overlay-slide-in-bottom_0.25s_ease-out]",
            className
          )}
        >
          {children}
        </div>
      </div>
    </OverlayPortal>
  );
}

function SheetHeader({ children, className }: SheetHeaderProps) {
  const { close } = useOverlayContext();

  return (
    <div className={cn("px-3 py-2 border-b border-secondary flex gap-2", className)}>
      <div className="flex-1">
        {children}
      </div>
      <IconButton onClick={close} variant="ghost"><Icon.close size={20} /></IconButton>
    </div>
  );
}

function SheetFooter({ children, className }: SheetFooterProps) {
  return (
    <div className={cn("px-4 py-5 border-t border-secondary", className)}>{children}</div>
  );
}

const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Close: SheetClose,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  useContext: useOverlayContext,
};

export { Sheet };
