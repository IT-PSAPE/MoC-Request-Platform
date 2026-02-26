'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { OverlayPortalProps } from "./types";

export function OverlayPortal({ children, container }: OverlayPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}
