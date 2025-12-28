'use client';

import { useDefaultContext } from "@/components/contexts/defaults-context";
import { createContext, useContext, useEffect, useState } from "react";
import { RequestTable } from "@/shared/database";

type PublicRequestContextType = {
    requests: FetchRequest[]
};

const PublicRequestContext = createContext<PublicRequestContextType | null>(null);

export function usePublicRequestContext() {
    const context = useContext(PublicRequestContext);

    if (!context) throw new Error("usePublicRequestContext must be used within a PublicRequestContextProvider");

    return context;
}

export function PublicRequestContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase } = useDefaultContext();

    const [requests, setRequests] = useState<FetchRequest[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [requestsResults] = await Promise.all([
                    RequestTable.list(supabase),
                ]);

                if (isMounted) {
                    setRequests((requestsResults ?? []) as FetchRequest[]);
                }

            } catch (error) {
                if (!isMounted) return;
                console.error("Unexpected error loading defaults", error);
            }
        };

        void loadDefaults();

        // TEMPORARILY ADDED: Refetch data when window gains focus to ensure fresh data
        const handleFocus = () => {
            void loadDefaults();
        };
        
        window.addEventListener('focus', handleFocus);

        return () => {
            isMounted = false;
            window.removeEventListener('focus', handleFocus);
        };
    }, [supabase]);

    const context = {
        requests
    };

    return (
        <PublicRequestContext.Provider value={context}>
            {children}
        </PublicRequestContext.Provider>
    );
}