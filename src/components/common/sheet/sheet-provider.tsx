'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type SheetContextType = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const SheetContext = createContext<SheetContextType | null>(null);

export function SheetContextProvider({ children }: { children: React.ReactNode}) {
    const [open, setOpen] = useState(false);

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
