'use client';

import { useRef } from "react";
import { cn } from "@/shared/cn";
import { IconButton } from "@/components/ui/common/button";
import { Icon } from "@/components/ui/common/icon";
import { OverlayProvider, useOverlayContext, OverlayBackdrop, OverlayPortal, useOverlayBehavior, Z_INDEX } from "../overlay";
import type { DialogProps, DialogContentProps, DialogHeaderProps, DialogBodyProps, DialogFooterProps, DialogCloseProps, DialogTriggerProps } from "./types";

function DialogRoot({ children, open, onOpenChange, defaultOpen }: DialogProps) {
  return (
    <OverlayProvider open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {children}
    </OverlayProvider>
  );
}

function DialogTrigger({ children, className }: DialogTriggerProps) {
  const { setOpen } = useOverlayContext();

  return (
    <div onClick={() => setOpen(true)} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}

function DialogContent({ children, className }: DialogContentProps) {
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
      <OverlayBackdrop variant="blur" onClick={close} style={{ zIndex: Z_INDEX.DIALOG_BACKDROP }} />
      <div
        className="fixed inset-0 flex items-center justify-center p-4 mobile:items-end mobile:p-0"
        style={{ zIndex: Z_INDEX.DIALOG_CONTENT }}
      >
        <div
          ref={contentRef}
          id={contentId}
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-[448px] bg-primary rounded-xl border border-secondary shadow-lg",
            "animate-[overlay-scale-in_0.2s_ease-out]",
            "mobile:max-w-full mobile:rounded-b-none mobile:animate-[overlay-slide-in-bottom_0.25s_ease-out]",
            className
          )}
        >
          {children}
        </div>
      </div>
    </OverlayPortal>
  );
}

function DialogHeader({ children, className }: DialogHeaderProps) {
  const { close } = useOverlayContext();

  return (
    <div className={cn("flex items-start justify-between px-5 py-4 border-b border-secondary", className)}>
      <div className="flex-1">{children}</div>
      <IconButton size="sm" variant="ghost" onClick={close}>
        <Icon.close />
      </IconButton>
    </div>
  );
}

function DialogBody({ children, className }: DialogBodyProps) {
  return (
    <div className={cn("px-5 py-6", className)}>
      {children}
    </div>
  );
}

function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 px-5 py-4 border-t border-secondary", className)}>
      {children}
    </div>
  );
}

function DialogClose({ children, className }: DialogCloseProps) {
  const { close } = useOverlayContext();

  return (
    <div onClick={close} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}

const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
  useContext: useOverlayContext,
};

export { Dialog };
