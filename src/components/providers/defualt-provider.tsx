'use client';

import { createContext, useContext, useState } from "react";

type DefualtContextType = {
    statuses: Status[];
    priorities: Priority[];
    types: RequestType[];
    setStatuses: (statuses: Status[]) => void;
    setPriorities: (priorities: Priority[]) => void;
    setTypes: (types: RequestType[]) => void;
};

export const DefualtContext = createContext<DefualtContextType | null>(null);

export function DefualtContextProvider({ children }: { children: React.ReactNode }) {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [types, setTypes] = useState<RequestType[]>([]);

    const context = {
        statuses,
        priorities,
        types,
        setStatuses,
        setPriorities,
        setTypes,
    };

    return (
        <DefualtContext.Provider value={context}>
            {children}
        </DefualtContext.Provider>
    );
}

export function useDefualtContext() {
    const context = useContext(DefualtContext);

    if (!context) throw new Error("useDefualtContext must be used within a DefualtContextProvider");

    return context;
}