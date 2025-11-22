import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(
    { className, ...props },
    ref
) {
    return (
        <input
            ref={ref}
            className={cn(
                "w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-quaternary",
                className
            )}
            {...props}
        />
    );
});

export default Input;