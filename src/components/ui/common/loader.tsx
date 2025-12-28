import { cn } from "@/shared/cn";

type LoaderProps = {
  label?: string;
  className?: string;
};

export function Loader({ label, className }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8", className)}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-brand" />
      {label ? <span className="text-sm text-tertiary">{label}...</span> : null}
    </div>
  );
}
