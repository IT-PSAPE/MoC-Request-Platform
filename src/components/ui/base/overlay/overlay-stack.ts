'use client';

import { useEffect, useId, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';

// ── Module-level overlay stack registry ─────────────────────
let stack: string[] = [];
let snapshot = 0;
const subscribers = new Set<() => void>();

function notify() {
  snapshot++;
  for (const fn of subscribers) fn();
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => { subscribers.delete(callback); };
}

function getSnapshot() { return snapshot; }
function getServerSnapshot() { return 0; }

function push(id: string) {
  if (!stack.includes(id)) {
    stack.push(id);
    notify();
  }
}

function remove(id: string) {
  const idx = stack.indexOf(id);
  if (idx !== -1) {
    stack.splice(idx, 1);
    notify();
  }
}

// ── Visual constants ────────────────────────────────────────
const SCALE_STEP = 0.06;
const TRANSLATE_Y_PX = -16;
const SPRING_CURVE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const DURATION = '0.35s';

/**
 * Registers an overlay in a global stack and returns inline styles
 * for the Apple-style stacked sheet effect.
 *
 * When a child overlay opens, every parent overlay receives a
 * scale-down + translateY transform so its top edge peeks out as
 * a visible "lip". The transition uses an Apple-like spring curve.
 *
 * Apply the returned `stackStyles` to the overlay's positioning
 * wrapper (the `fixed inset-0` div), NOT the content card — this
 * keeps entry animations on the card unaffected.
 */
export function useOverlayStack(open: boolean) {
  const id = useId();
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!open) return;
    push(id);
    return () => remove(id);
  }, [id, open]);

  const idx = stack.indexOf(id);
  const depth = (open && idx !== -1) ? (stack.length - 1 - idx) : 0;

  const stackStyles: CSSProperties = {
    transformOrigin: 'top center',
    transition: `transform ${DURATION} ${SPRING_CURVE}`,
    ...(depth > 0 && {
      transform: `scale(${1 - depth * SCALE_STEP}) translateY(${depth * TRANSLATE_Y_PX}px)`,
    }),
  };

  return { depth, stackStyles };
}
