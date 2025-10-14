import { cn } from "@/lib/cn"

export function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input className={cn("w-full p-2.5 bg-[#FCFCFC] border border-secondary rounded-lg shadow-sm paragraph-sm", props.className)}  {...props} />
    )
}

export function TextArea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea className={cn("w-full p-2.5 bg-[#FCFCFC] border border-secondary rounded-lg shadow-sm resize-none min-h-28 paragraph-sm", props.className)} {...props} />
    )
}