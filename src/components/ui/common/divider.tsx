import { cn } from "@/shared/cn";

export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn(className)} >
      <div className="border-b border-dashed border-secondary w-full" ></div>
    </div>
  );
}
