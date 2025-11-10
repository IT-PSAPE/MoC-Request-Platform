import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-24 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30",
        className
      )}
      {...props}
    />
  );
});

export default Textarea;
