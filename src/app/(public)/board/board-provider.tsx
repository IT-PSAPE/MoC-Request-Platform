'use client';

import { useDefaultContext } from "@/components/providers/default-provider";
import { createContext, useContext, useEffect, useState } from "react";
import { list } from "./board-service";

type BoardSteps = 1 | 2 | 3;

type BoardContextType = {
    requests: FetchRequest[]
};

export const BoardContext = createContext<BoardContextType | null>(null);

export function BoardContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase } = useDefaultContext();

    const [requests, setRequests] = useState<FetchRequest[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [requestsResults] = await Promise.all([
                    list(supabase),
                ]);

                setRequests((requestsResults ?? []) as FetchRequest[]);

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
        requests
    };

    return (
        <BoardContext.Provider value={context}>
            {children}
        </BoardContext.Provider>
    );
}

export function useBoardContext() {
    const context = useContext(BoardContext);

    if (!context) throw new Error("useBoardContext must be used within a BoardContextProvider");

    return context;
}

export type { BoardSteps as BoardSteps }