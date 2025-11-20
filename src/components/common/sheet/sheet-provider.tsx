'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { SheetContextProviderProps, SheetContextType } from "./types";


export const SheetContext = createContext<SheetContextType | null>(null);


export function SheetContextProvider({ children, open: controlledOpen, onOpenChange }: SheetContextProviderProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        if (isControlled) {
            const nextValue = typeof value === "function" ? value(open) : value;
            onOpenChange?.(nextValue);
            return;
        }

        setUncontrolledOpen(value);
    };

    const context: SheetContextType = { open, setOpen };

    return (
        <SheetContext.Provider value={context}>
            {children}
        </SheetContext.Provider>
    );
}

export function useSheetContext() {
    const context = useContext(SheetContext);

    if (!context) throw new Error("useSheetContext must be used within a SheetContextProvider");

    return context;
}
