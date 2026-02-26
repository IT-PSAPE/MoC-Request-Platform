export type DialogProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

export type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
};

export type DialogHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

export type DialogBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export type DialogFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export type DialogCloseProps = {
  children: React.ReactNode;
  className?: string;
};

export type DialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
};
