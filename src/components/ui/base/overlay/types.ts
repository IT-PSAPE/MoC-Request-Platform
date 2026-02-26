import { Dispatch, RefObject, SetStateAction } from "react";

export type OverlayContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  close: () => void;
  toggle: () => void;
  contentId: string;
  triggerId: string;
  anchorRef: RefObject<HTMLElement | null>;
};

export type OverlayProviderProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

export type OverlayBackdropProps = {
  variant: "blur" | "transparent";
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export type OverlayPortalProps = {
  children: React.ReactNode;
  container?: HTMLElement;
};

export type UseOverlayBehaviorOptions = {
  open: boolean;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  lockBodyScroll?: boolean;
  contentRef: RefObject<HTMLElement | null>;
  anchorRef?: RefObject<HTMLElement | null>;
};
