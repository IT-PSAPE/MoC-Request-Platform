'use client';

import { useEffect } from "react";
import type { UseOverlayBehaviorOptions } from "./types";

let scrollLockCount = 0;

export function useOverlayBehavior({
  open,
  onClose,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  lockBodyScroll = true,
  contentRef,
  anchorRef,
}: UseOverlayBehaviorOptions) {

  // Escape key handler
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Click outside handler
  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (contentRef.current && contentRef.current.contains(target)) return;
      if (anchorRef?.current && anchorRef.current.contains(target)) return;

      onClose();
    };

    // Defer to avoid closing on the same click that opened
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleMouseDown);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open, closeOnOutsideClick, onClose, contentRef, anchorRef]);

  // Body scroll lock
  useEffect(() => {
    if (!open || !lockBodyScroll) return;

    scrollLockCount++;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      scrollLockCount--;
      if (scrollLockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [open, lockBodyScroll]);
}
