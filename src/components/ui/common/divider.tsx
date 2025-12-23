import { cn } from "@/lib/cn";

export default function Divider({ className }: { className?: string }) {
  return (
    <div className={cn(className)} >
      <div className="border-b border-dashed border-secondary w-full" ></div>
    </div>
  );
}
