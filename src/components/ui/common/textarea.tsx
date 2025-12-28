import { cn } from "@/shared/cn";

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea className={cn("w-full p-2.5 bg-primary border border-primary rounded-lg shadow-sm resize-y min-h-28 paragraph-sm", className)} {...props} />
    )
}