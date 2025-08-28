import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Divider({
  title,
  className,
  right,
}: {
  title: ReactNode;
  className?: string;
  right?: ReactNode;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 border-b border-foreground/15 pb-2", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {right && <div className="text-sm text-foreground/70">{right}</div>}
    </div>
  );
}
