import { cn } from "@/shared/cn";

export function GridContainer({ children, isEmpty }: { children: React.ReactNode, isEmpty?: boolean }) {
    return (
        <div className={cn("w-full max-w-container mx-auto grid gap-2 py-6 px-margin mobile:flex mobile:flex-col", isEmpty ? "grid-cols-1" : "grid-cols-3")}>
            {children}
        </div>
    );
}