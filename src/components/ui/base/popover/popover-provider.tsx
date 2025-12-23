import { createContext, useContext, useRef, useState } from "react";
import { PopoverContextValue, PopoverProviderProps } from "./types";

const PopoverContext = createContext<PopoverContextValue | undefined>(undefined);

export function usePopoverContext() {
    const context = useContext(PopoverContext);
    if (!context) {
        throw new Error("Popover components must be used within PopoverProvider");
    }
    return context;
}

export function PopoverProvider({ children, defaultOpen = false }: PopoverProviderProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const anchorRef = useRef<HTMLElement>(null);

    const openPopover = () => setIsOpen(true);
    const closePopover = () => setIsOpen(false);
    const togglePopover = () => setIsOpen(prev => !prev);

    const value: PopoverContextValue = {
        isOpen,
        openPopover,
        closePopover,
        togglePopover,
        anchorRef,
    };

    return (
        <PopoverContext.Provider value={value}>
            {children}
        </PopoverContext.Provider>
    );
}
