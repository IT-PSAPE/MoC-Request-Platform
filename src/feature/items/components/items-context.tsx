'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { RequestItemTable } from "@/shared/database";
import { useDefaultContext } from "@/components/contexts/defaults-context";


type ItemsContextType = {
    items: RequestItem[];
};

const ItemsContext = createContext<ItemsContextType | null>(null);

export function useItemsContext() {
    const context = useContext(ItemsContext);

    if (!context) throw new Error("useItemsContext must be used within a ItemsContextProvider");

    return context;
}

export function ItemsContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase } = useDefaultContext();

    const [items, setItems] = useState<RequestItem[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const itemsResult = await RequestItemTable.select(supabase);

                if (!isMounted) return;

                if (itemsResult.error) {
                    console.error("Failed to load items", itemsResult.error);
                } else {
                    setItems((itemsResult.data ?? []) as RequestItem[]);
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
        items,
    };

    return (
        <ItemsContext.Provider value={context}>
            {children}
        </ItemsContext.Provider>
    );
}
