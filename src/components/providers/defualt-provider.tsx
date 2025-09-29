'use client';

import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type DefualtContextType = {
    statuses: Status[];
    priorities: Priority[];
    types: RequestType[];
    setStatuses: (statuses: Status[]) => void;
    setPriorities: (priorities: Priority[]) => void;
    setTypes: (types: RequestType[]) => void;
    supabase: SupabaseClient;
};

export const DefualtContext = createContext<DefualtContextType | null>(null);

export function DefualtContextProvider({ children, supabase }: { children: React.ReactNode, supabase: SupabaseClient}) {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [types, setTypes] = useState<RequestType[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [statusResult, priorityResult, typeResult] = await Promise.all([
                    supabase.from("status").select("*"),
                    supabase.from("priority").select("*"),
                    supabase.from("request_type").select("*"),
                ]);

                if (!isMounted) return;

                if (statusResult.error) {
                    console.error("Failed to load statuses", statusResult.error);
                } else {
                    setStatuses((statusResult.data ?? []) as Status[]);
                }

                if (priorityResult.error) {
                    console.error("Failed to load priorities", priorityResult.error);
                } else {
                    setPriorities((priorityResult.data ?? []) as Priority[]);
                }

                if (typeResult.error) {
                    console.error("Failed to load request types", typeResult.error);
                } else {
                    setTypes((typeResult.data ?? []) as RequestType[]);
                }
            } catch (error) {
                if (!isMounted) return;
                console.error("Unexpected error loading defaults", error);
            }
        };

        void loadDefaults();

        return () => {
            isMounted = false;
        };
    }, [supabase]);

    const context = {
        statuses,
        priorities,
        types,
        setStatuses,
        setPriorities,
        setTypes,
        supabase,
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
