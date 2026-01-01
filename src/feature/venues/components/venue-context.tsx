'use client';

import { VenueTable } from "@/shared/database";
import { createContext, useContext, useEffect, useState } from "react";
import { useDefaultContext } from "@/components/contexts/defaults-context";

type VenuesContextType = {
    venues: Venue[];
    updateVenue: (venueId: string, available: boolean) => void;
};

const VenuesContext = createContext<VenuesContextType | null>(null);

export function useVenuesContext() {
    const context = useContext(VenuesContext);

    if (!context) throw new Error("useVenuesContext must be used within a VenuesContextProvider");

    return context;
}

export function VenuesContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase } = useDefaultContext();

    const [venues, setVenues] = useState<Venue[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const venuesResult = await VenueTable.select(supabase);

                if (venuesResult.error) {
                    console.error("Failed to load request types", venuesResult.error);
                } else {
                    setVenues((venuesResult.data ?? []) as Venue[]);
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

    const updateVenue = async (venueId: string, available: boolean) => {
        const { error } = await VenueTable.update(supabase, venueId, { available });

        if (error) {
            console.error("Failed to update venue", error);
            return;
        }

        setVenues((prevVenues) =>
            prevVenues.map((venue) =>
                venue.id === venueId ? { ...venue, available } : venue
            )
        );
    }

    const context = {
        venues,
        updateVenue,
    };

    return (
        <VenuesContext.Provider value={context}>
            {children}
        </VenuesContext.Provider>
    );
}