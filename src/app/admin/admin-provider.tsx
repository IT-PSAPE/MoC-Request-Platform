'use client';

import { EquipmentTable, RequestItemTable, SongTable, VenueTable } from "@/lib/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { list, updateRequestStatus } from "./admin-service";

type TabItem = 'venues' | 'songs' | 'equipment' | 'dashboard' | 'request-items';

type AdminContextType = {
    requests: FetchRequest[]
    items: RequestItem[];
    equipment: Equipment[];
    songs: Song[];
    venues: Venue[];
    tab: TabItem;
    updateEquipment: (id: string, available: number) => void;
    updateVenue: (venueId: string, available: boolean) => void;
    updateSong: (venueId: string, type: 'instrumental' | 'lyrics', available: boolean) => void;
    updateRequestStatusOptimistic: (requestId: string, newStatusId: string) => Promise<void>;
    setTab: (tab: TabItem) => void;
};

export const AdminContext = createContext<AdminContextType | null>(null);

export function AdminContextProvider({ children, supabase }: { children: React.ReactNode, supabase: SupabaseClient }) {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [items, setItems] = useState<RequestItem[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [requests, setRequests] = useState<FetchRequest[]>([]);
    const [tab, setTab] = useState<TabItem>('dashboard');

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [equipmentResult, songsResult, venuesResult, itemsResult, requestsResults] = await Promise.all([
                    EquipmentTable.select(supabase),
                    SongTable.select(supabase),
                    VenueTable.select(supabase),
                    RequestItemTable.select(supabase),
                    list(supabase),
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

                if (itemsResult.error) {
                    console.error("Failed to load items", itemsResult.error);
                } else {
                    setItems((itemsResult.data ?? []) as RequestItem[]);
                }

                if (venuesResult.error) {
                    console.error("Failed to load request types", venuesResult.error);
                } else {
                    setVenues((venuesResult.data ?? []) as Venue[]);
                }

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

    const updateEquipment = async (id: string, available: number) => {
        const { error } = await EquipmentTable.update(supabase, id, { available });

        if (error) {
            console.error("Failed to update equipment", error);
            return;
        }

        setEquipment((prevEquipment) =>
            prevEquipment.map((eq) =>
                eq.id === id ? { ...eq, available } : eq
            )
        );
    }

    const updateRequestStatusOptimistic = async (requestId: string, newStatusId: string) => {
        // Find the status object for the new status ID
        const newStatus = (await supabase.from("status").select("*").eq("id", newStatusId).single()).data;
        
        if (!newStatus) {
            console.error("Status not found");
            return;
        }

        // Optimistically update the local state
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId ? { ...request, status: newStatus as Status } : request
            )
        );

        // Update the database
        const { error } = await updateRequestStatus(supabase, requestId, newStatusId);

        if (error) {
            console.error("Failed to update request status", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const context = {
        requests,
        items,
        equipment,
        songs,
        venues,
        tab,
        updateVenue,
        updateSong,
        updateRequestStatusOptimistic,
        setTab,
        updateEquipment,
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