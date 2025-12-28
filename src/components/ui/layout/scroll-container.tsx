import { cn } from "@/shared/cn";

export function ScrollContainer({ children, className }: { children: React.ReactNode, className: string }) {
    return (
        <>
            <style jsx>{`.scrollable-content::-webkit-scrollbar { display: none; }`}</style>
            <div
                className={cn("overflow-y-auto scrollable-content whitespace-pre-wrap", className)}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {children}
            </div>
        </>
    )
}