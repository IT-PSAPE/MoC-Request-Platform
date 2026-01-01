import { ReactNode } from "react";

export type PopoverContextValue = {
  isOpen: boolean;
  openPopover: () => void;
  closePopover: () => void;
  togglePopover: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
};

export type PopoverPosition = "bottom-left" | "bottom-right" | "bottom-center";

export type PopoverProviderProps = {
  children: ReactNode;
  defaultOpen?: boolean;
}

export type PopoverProps = {
  children: ReactNode;
}

export type PopoverTriggerProps = {
  children: ReactNode;
  className?: string;
}

export type PopoverContentProps = {
  children: ReactNode;
  className?: string;
  position?: PopoverPosition;
  maxWidth?: string;
  maxHeight?: string;
}

export type PopoverHeaderProps = {
  children: ReactNode;
  className?: string;
}

export type PopoverBodyProps = {
  children: ReactNode;
  className?: string;
}

export type PopoverFooterProps = {
  children: ReactNode;
  className?: string;
}

export type PopoverBarrierProps = {
  className?: string;
}

export type PopoverGroupProps = {
  fieldName: string;
  children: React.ReactNode;
};