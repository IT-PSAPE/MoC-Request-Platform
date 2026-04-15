'use client';

import { useEffect, useId, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';

// ── Module-level overlay stack registry ─────────────────────
type StackEntry = {
  id: string;
  modal: boolean;
};

let stack: StackEntry[] = [];
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

function push(entry: StackEntry) {
  if (!stack.some(e => e.id === entry.id)) {
    stack.push(entry);
    notify();
  }
}

function remove(id: string) {
  const idx = stack.findIndex(e => e.id === id);
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
 * Registers an overlay in a global stack and returns depth info
 * plus inline styles for Apple-style stacked sheet behavior.
 *
 * @param open  — Whether this overlay is currently open.
 * @param modal — `true` for Dialog/Sheet (causes parent visual push-back).
 *                `false` for Popover (registers for coordination only,
 *                so parent overlays disable outside-click / escape while
 *                this overlay is open, but no visual push-back).
 *
 * The returned `depth` counts ALL overlays above this one (modal + non-modal).
 * Use `depth === 0` to gate `closeOnOutsideClick` / `closeOnEscape` so that
 * only the topmost overlay responds to dismissal gestures.
 *
 * The returned `stackStyles` only factor in modal overlays above, so a
 * Popover opening inside a Sheet won't cause the Sheet to scale down.
 */
export function useOverlayStack(open: boolean, modal = true) {
  const id = useId();
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!open) return;
    push({ id, modal });
    return () => remove(id);
  }, [id, open, modal]);

  const idx = stack.findIndex(e => e.id === id);
  const overlaysAbove = (open && idx !== -1) ? stack.slice(idx + 1) : [];

  // Any overlay above — for behavioral decisions (outside-click, escape)
  const depth = overlaysAbove.length;

  // Only modal overlays above — for visual push-back
  const modalDepth = overlaysAbove.filter(e => e.modal).length;

  const stackStyles: CSSProperties = {
    transformOrigin: 'top center',
    transition: `transform ${DURATION} ${SPRING_CURVE}`,
    ...(modalDepth > 0 && {
      transform: `scale(${1 - modalDepth * SCALE_STEP}) translateY(${modalDepth * TRANSLATE_Y_PX}px)`,
    }),
  };

  return { depth, stackStyles };
}
