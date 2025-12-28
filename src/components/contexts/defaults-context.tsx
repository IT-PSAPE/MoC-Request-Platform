'use client';

import { PriorityTable, RequestTypeTable, StatusTable } from "@/shared/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type DefaultContextType = {
    statuses: Status[];
    priorities: Priority[];
    types: RequestType[];
    listView: ListView;
    setListView: Dispatch<SetStateAction<ListView>>;
    setStatuses: Dispatch<SetStateAction<Status[]>>;
    setPriorities: Dispatch<SetStateAction<Priority[]>>;
    setTypes: Dispatch<SetStateAction<RequestType[]>>;
    supabase: SupabaseClient;
};

const DefaultContext = createContext<DefaultContextType | null>(null);

export function useDefaultContext() {
    const context = useContext(DefaultContext);

    if (!context) throw new Error("useDefaultContext must be used within a DefaultContextProvider");

    return context;
}

export function DefaultContextProvider({ children, supabase }: { children: React.ReactNode, supabase: SupabaseClient}) {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [types, setTypes] = useState<RequestType[]>([]);
    const [listView, setListView] = useState<ListView>("column");

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [statusResult, priorityResult, typeResult] = await Promise.all([
                    StatusTable.list(supabase),
                    PriorityTable.list(supabase),
                    RequestTypeTable.list(supabase),
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
        listView,
        setStatuses,
        setPriorities,
        setTypes,
        setListView,
        supabase,
    };

    return (
        <DefaultContext.Provider value={context}>
            {children}
        </DefaultContext.Provider>
    );
}
