import { ReactNode } from "react";

export type PopoverPosition = "bottom-left" | "bottom-right" | "bottom-center";

export type PopoverProps = {
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

export type PopoverTriggerProps = {
  children: ReactNode;
  className?: string;
};

export type PopoverContentProps = {
  children: ReactNode;
  className?: string;
  position?: PopoverPosition;
  maxWidth?: string;
  maxHeight?: string;
};

export type PopoverHeaderProps = {
  children: ReactNode;
  className?: string;
};

export type PopoverBodyProps = {
  children: ReactNode;
  className?: string;
};

export type PopoverFooterProps = {
  children: ReactNode;
  className?: string;
};

export type PopoverGroupProps = {
  fieldName: string;
  children: React.ReactNode;
};
