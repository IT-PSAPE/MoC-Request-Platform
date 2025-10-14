import { cn } from "@/lib/cn"

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("flex flex-col rounded-lg bg-primary border border-secondary shadow-sm", className)}>
            {children}
        </div>
    )
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("p-4", className)}>
            {children}
        </div>
    )
}

function CardFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("px-4 py-3 border-t border-secondary", className)}>
            {children}
        </div>
    )
}

export { Card, CardContent, CardFooter }