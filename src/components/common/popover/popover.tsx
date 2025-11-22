import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import Text from "../text";
import { cn } from "@/lib/cn";
import { PopoverBarrierProps, PopoverBodyProps, PopoverContentProps, PopoverFooterProps, PopoverGroupProps, PopoverHeaderProps, PopoverProps, PopoverTriggerProps } from "./types";
import { usePopoverContext } from "./popover-provider";
import { PopoverProvider } from "./popover-provider";

function PopoverParent({ children }: PopoverProps) {
  return <div className="relative inline-block">{children}</div>;
}

function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const { togglePopover, anchorRef } = usePopoverContext();

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    togglePopover();
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
  maxWidth = "320px" 
}: PopoverContentProps) {
  const { isOpen, closePopover, anchorRef } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        closePopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closePopover, anchorRef]);

  if (!isOpen) return null;

  const positionClasses = {
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2", 
    "bottom-center": "top-full left-1/2 transform -translate-x-1/2 mt-2",
  };

  return (
    <>
      <PopoverBarrier />
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 bg-primary border border-secondary rounded-lg shadow-lg min-w-[280px]",
          positionClasses[position],
          className
        )}
        style={{ maxWidth }}
      >
        {children}
      </div>
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

function PopoverBarrier({ className }: PopoverBarrierProps) {
  const { closePopover } = usePopoverContext();

  return (
    <div
      className={cn("fixed inset-0 z-40", className)}
      onClick={closePopover}
    />
  );
}

function PopoverGroup({ fieldName, children }: PopoverGroupProps) {
  return (
    <div className="space-y-2">
      <Text style="label-xs" className="text-tertiary">{fieldName}</Text>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

const Popover ={
  Provider: PopoverProvider,
  useContext: usePopoverContext,
  Root: PopoverParent,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Body: PopoverBody,
  Footer: PopoverFooter,
  Barrier: PopoverBarrier,
  Group: PopoverGroup,
};

export { Popover };
