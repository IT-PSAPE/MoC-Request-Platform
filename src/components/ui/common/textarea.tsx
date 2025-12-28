import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/cn";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-24 rounded-md border border-primary bg-primary px-3 py-2 placeholder:text-tertiary",
        className
      )}
      {...props}
    />
  );
});

export default Textarea;
