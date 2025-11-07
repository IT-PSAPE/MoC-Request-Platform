import { cn } from "@/lib/cn"

function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-col rounded-lg bg-primary border border-secondary shadow-sm", className)} {...props}>
            {children}
        </div>
    )
}

function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-4", className)} {...props}>
            {children}
        </div>
    )
}

function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("px-4 py-3 border-t border-secondary", className)} {...props}>
            {children}
        </div>
    )
}

export { Card, CardContent, CardFooter }