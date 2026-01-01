'use client';

import { SongTable } from "@/shared/database";
import { createContext, useContext, useEffect, useState } from "react";
import { useDefaultContext } from "@/components/contexts/defaults-context";


type SongsContextType = {
    songs: Song[];
    updateSong: (venueId: string, type: 'instrumental' | 'lyrics', available: boolean) => void;
};

const SongsContext = createContext<SongsContextType | null>(null);

export function useSongsContext() {
    const context = useContext(SongsContext);

    if (!context) throw new Error("useSongsContext must be used within a SongsContextProvider");

    return context;
}

export function SongsContextProvider({ children }: { children: React.ReactNode }) {
    const { supabase } = useDefaultContext();

    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const songsResult = await SongTable.select(supabase);

                if (!isMounted) return;

                if (songsResult.error) {
                    console.error("Failed to load priorities", songsResult.error);
                } else {
                    setSongs((songsResult.data ?? []) as Song[]);
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

    const context = {
        songs,
        updateSong,
    };

    return (
        <SongsContext.Provider value={context}>
            {children}
        </SongsContext.Provider>
    );
}
