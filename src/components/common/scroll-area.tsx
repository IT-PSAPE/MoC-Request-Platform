"use client";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export default function ScrollArea({
  children,
  className,
  thumbColor = "bg-foreground/50",
  hoverDurationMs = 800,
}: {
  children: ReactNode;
  className?: string;
  thumbColor?: string; // Tailwind classes
  hoverDurationMs?: number;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [showH, setShowH] = useState(false);
  const [showV, setShowV] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);

  // (metrics removed; was unused)

  const [thumbH, setThumbH] = useState({ width: 0, left: 0 });
  const [thumbV, setThumbV] = useState({ height: 0, top: 0 });
  const dragKind = useRef<null | "h" | "v">(null);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), hoverDurationMs);
  }, [hoverDurationMs]);

  const showNow = useCallback(() => {
    setVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
  }, []);

  const updateThumbs = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const cw = el.clientWidth;
    const sw = el.scrollWidth;
    const ch = el.clientHeight;
    const sh = el.scrollHeight;
    const sl = el.scrollLeft;
    const st = el.scrollTop;

    // Horizontal
    const overH = sw > cw + 1; // tolerance
    setShowH(overH);
    if (overH) {
      const ratio = cw / sw;
      const width = Math.max(20, Math.round(cw * ratio));
      const left = Math.round((sl / (sw - cw)) * (cw - width)) || 0;
      setThumbH({ width, left });
    } else {
      setThumbH({ width: 0, left: 0 });
    }

    // Vertical
    const overV = sh > ch + 1;
    setShowV(overV);
    if (overV) {
      const ratioV = ch / sh;
      const height = Math.max(20, Math.round(ch * ratioV));
      const top = Math.round((st / (sh - ch)) * (ch - height)) || 0;
      setThumbV({ height, top });
    } else {
      setThumbV({ height: 0, top: 0 });
    }
  }, []);

  // Drag support for custom thumbs
  const endDrag = useCallback(() => {
    dragKind.current = null;
    scheduleHide();
  }, [scheduleHide]);

  const onGlobalMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = viewportRef.current;
      if (!el || !dragKind.current) return;
      showNow();
      const rect = el.getBoundingClientRect();
      if (dragKind.current === "h") {
        const trackW = el.clientWidth;
        const tW = thumbH.width;
        const maxThumbPos = Math.max(0, trackW - tW);
        let pos = clientX - rect.left - tW / 2;
        pos = Math.max(0, Math.min(maxThumbPos, pos));
        const maxScroll = el.scrollWidth - trackW;
        el.scrollLeft = maxScroll <= 0 ? 0 : (pos / (maxThumbPos || 1)) * maxScroll;
      } else if (dragKind.current === "v") {
        const trackH = el.clientHeight;
        const tH = thumbV.height;
        const maxThumbPos = Math.max(0, trackH - tH);
        let pos = clientY - rect.top - tH / 2;
        pos = Math.max(0, Math.min(maxThumbPos, pos));
        const maxScroll = el.scrollHeight - trackH;
        el.scrollTop = maxScroll <= 0 ? 0 : (pos / (maxThumbPos || 1)) * maxScroll;
      }
      updateThumbs();
    },
    [showNow, thumbH.width, thumbV.height, updateThumbs]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => onGlobalMove(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onGlobalMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => endDrag();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [endDrag, onGlobalMove]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => {
      showNow();
      updateThumbs();
      scheduleHide();
    };
    const onEnter = () => {
      showNow();
    };
    const onLeave = () => {
      scheduleHide();
    };
    const onResize = () => updateThumbs();

    el.addEventListener("scroll", onScroll);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    // Initial
    updateThumbs();
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [scheduleHide, showNow, updateThumbs]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewportRef}
        className={cn(
          // Make it scrollable in both axes
          "overflow-auto h-full",
          // Hide native scrollbars (Firefox + IE/Edge legacy)
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          // Create a stacking context for absolute thumbs
          "relative"
        )}
        // Hide native WebKit scrollbars
      >
        {/* WebKit: hide scrollbar by styling pseudo-elements via a nested stylesheet */}
        <style jsx>{`
          div::-webkit-scrollbar { width: 0; height: 0; }
        `}</style>
        {children}
      </div>

      {/* Horizontal thumb */}
      {showH && (
        <div
          className={cn(
            "pointer-events-none absolute left-0 right-0 bottom-1 flex justify-start",
            "transition-opacity duration-200",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            className={cn("h-1.5 rounded-full cursor-grab pointer-events-auto", thumbColor)}
            style={{ width: thumbH.width, marginLeft: thumbH.left }}
            onMouseDown={(e) => {
              e.preventDefault();
              showNow();
              dragKind.current = "h";
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              showNow();
              dragKind.current = "h";
              if (e.touches.length > 0) onGlobalMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
          />
        </div>
      )}

      {/* Vertical thumb */}
      {showV && (
        <div
          className={cn(
            "pointer-events-none absolute top-0 bottom-0 right-1 flex items-start",
            "transition-opacity duration-200",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            className={cn("w-1.5 rounded-full cursor-grab pointer-events-auto", thumbColor)}
            style={{ height: thumbV.height, marginTop: thumbV.top }}
            onMouseDown={(e) => {
              e.preventDefault();
              showNow();
              dragKind.current = "v";
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              showNow();
              dragKind.current = "v";
              if (e.touches.length > 0) onGlobalMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
          />
        </div>
      )}
    </div>
  );
}
