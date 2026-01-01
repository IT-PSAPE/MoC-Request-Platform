import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input className={cn("w-full p-2.5 bg-primary border border-primary rounded-lg shadow-sm paragraph-sm", className)}  {...props} />
    )
}