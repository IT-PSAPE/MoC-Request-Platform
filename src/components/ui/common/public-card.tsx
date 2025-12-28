import { cn } from "@/shared/cn"

export function PublicCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-col rounded-lg bg-primary border border-secondary", className)} {...props}>
            {children}
        </div>
    )
}

export function PublicCardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-4", className)} {...props}>
            {children}
        </div>
    )
}

export function PublicCardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("px-4 py-3 border-t border-secondary bg-primary", className)} {...props}>
            {children}
        </div>
    )
}