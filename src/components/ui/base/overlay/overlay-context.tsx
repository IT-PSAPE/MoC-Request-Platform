'use client';

import { createContext, Dispatch, SetStateAction, useContext, useId, useRef, useState } from "react";
import type { OverlayContextType, OverlayProviderProps } from "./types";

const OverlayContext = createContext<OverlayContextType | null>(null);

export function OverlayProvider({ children, open: controlledOpen, onOpenChange, defaultOpen = false }: OverlayProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const id = useId();
  const contentId = `overlay-content-${id}`;
  const triggerId = `overlay-trigger-${id}`;
  const anchorRef = useRef<HTMLElement>(null);

  const setOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    const nextValue = typeof value === "function" ? value(open) : value;
    if (isControlled) {
      onOpenChange?.(nextValue);
    } else {
      setUncontrolledOpen(nextValue);
    }
  };

  const close = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  const context: OverlayContextType = {
    open,
    setOpen,
    close,
    toggle,
    contentId,
    triggerId,
    anchorRef,
  };

  return (
    <OverlayContext.Provider value={context}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlayContext() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("Overlay components must be used within an OverlayProvider");
  }
  return context;
}
