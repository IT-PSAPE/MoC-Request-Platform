import { cn } from "@/lib/cn"
import { SheetContextProvider, useSheetContext } from "./sheet-provider"
import { IconButton } from "../button";
import Icon from "../icon";

type SheetProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function Sheet({ children, open, onOpenChange }: SheetProps) {
    return (
        <SheetContextProvider open={open} onOpenChange={onOpenChange}>{children}</SheetContextProvider>
    )
}

function SheetTrigger({ children, className }: { children: React.ReactNode, className?: string }) {
    const { setOpen } = useSheetContext();

    return (
        <div onClick={() => setOpen(true)} className={cn("cursor-pointer", className)} >{children}</div>
    )
}

function SheetClose({ children, className }: { children: React.ReactNode, className?: string }) {
    const { setOpen } = useSheetContext();

    return (
        <div onClick={() => setOpen(false)} className={cn("cursor-pointer", className)} >{children}</div>
    )
}

function SheetContent({ children }: { children: React.ReactNode }) {
    const { open, setOpen } = useSheetContext();

    if (!open) return null;

    function handleBarrieClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();

        if (event.target === event.currentTarget) {
            setOpen(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-linear-to-b from-black/20 to-black/40 backdrop-blur-xs p-2" onClick={handleBarrieClick}>
            <div className="w-full max-w-sm h-full flex flex-col ml-auto bg-primary rounded-xl">
                {children}
            </div>
        </div>
    )
}

function SheetHeader({ children, className }: { children: React.ReactNode, className?: string }) {
    const { setOpen } = useSheetContext();

    return (
        <div className={cn('px-4 py-5 border-b border-secondary flex gap-2', className)}>
            <div className="flex-1">
                {children}
            </div>
            <div>
                <IconButton onClick={() => setOpen(false)} size="sm" variant="ghost"><Icon name="line:close"/></IconButton>
            </div>
        </div>
    )
}

function SheetFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn('px-4 py-5 border-t border-secondary', className)}>{children}</div>
    )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter }
