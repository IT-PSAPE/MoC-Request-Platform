'use client';

import { EquipmentTable, SongTable, VenueTable } from "@/lib/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type TabItem = 'venues' | 'songs' | 'equipment' | 'dashboard';

type AdminContextType = {
    equipment: Equipment[];
    songs: Song[];
    venues: Venue[];
    updateVenue: (venueId: string, available: boolean) => void;
    updateSong: (venueId: string, type: 'instrumental' | 'lyrics', available: boolean) => void;
    tab: TabItem;
    setTab: (tab: TabItem) => void;
};

export const AdminContext = createContext<AdminContextType | null>(null);

export function AdminContextProvider({ children, supabase }: { children: React.ReactNode, supabase: SupabaseClient }) {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    // const [requests, setRequests] = useState<Request[]>([]);
    const [tab, setTab] = useState<TabItem>('dashboard');

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [equipmentResult, songsResult, venuesResult] = await Promise.all([
                    EquipmentTable.select(supabase),
                    SongTable.select(supabase),
                    VenueTable.select(supabase),
                ]);

                if (!isMounted) return;

                if (equipmentResult.error) {
                    console.error("Failed to load statuses", equipmentResult.error);
                } else {
                    setEquipment((equipmentResult.data ?? []) as Equipment[]);
                }

                if (songsResult.error) {
                    console.error("Failed to load priorities", songsResult.error);
                } else {
                    setSongs((songsResult.data ?? []) as Song[]);
                }

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

        return () => {
            isMounted = false;
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

    const updateSong = async (songID: string, type: 'instrumental' | 'lyrics', available: boolean) => {
        console.log("Updating song", songID, type, available);
        const { error } = await SongTable.update(supabase, songID, { [type]: available });

        if (error) {
            console.error("Failed to update venue", error);
            return;
        }

        setSongs((prevSongs) =>
            prevSongs.map((song) =>
                song.id === songID ? { ...song, [type]: available } : song
            )
        );
    }

    const context = {
        equipment,
        songs,
        venues,
        tab,
        updateVenue,
        updateSong,
        setTab,
    };

    return (
        <AdminContext.Provider value={context}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);

    if (!context) throw new Error("useAdminContext must be used within a AdminContextProvider");

    return context;
}