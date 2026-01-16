import { InputHTMLAttributes } from "react";
import { cn } from "@/shared/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, ...props }: Props) {
    return (
        <input className={cn("w-full p-2.5 bg-primary border border-primary rounded-lg shadow-sm paragraph-sm focus:ring-3 focus:ring-foreground-brand-primary/15 focus:border-foreground-brand-primary", className)}  {...props} />
    )
}