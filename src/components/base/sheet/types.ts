import { Dispatch, SetStateAction } from "react";

export type SheetContextType = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export type SheetContextProviderProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export type SheetProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}