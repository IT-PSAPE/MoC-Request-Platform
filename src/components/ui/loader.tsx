import { cn } from "@/lib/cn";

type LoaderProps = {
  label?: string;
  className?: string;
};

export default function Loader({ label = "Loading", className }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8", className)}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
      {label ? <span className="text-sm text-foreground/70">{label}...</span> : null}
    </div>
  );
}
