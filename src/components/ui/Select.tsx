import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
