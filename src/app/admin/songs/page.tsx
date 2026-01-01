"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState, Text } from "@/components/ui";
import { Header } from "@/components/ui/layout/header";

import { SongCard } from "@/feature/songs/components/song-card";
import { GridContainer } from "@/components/ui/layout/grid-container";
import AdminSongDetailsSheet from "@/feature/songs/components/admin-songs-details-sheet";
import { useSongsContext } from "@/feature/songs/components/songs-context";

export default function SongContent() {
    const { songs } = useSongsContext();
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const selectedSong = useMemo(() => {
        if (!selectedSongId) return null;
        return songs.find((song) => song.id === selectedSongId) ?? null;
    }, [songs, selectedSongId]);

    const handleSongClick = (song: Song) => {
        setSelectedSongId(song.id);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedSongId(null);
    };

    useEffect(() => {
        if (!selectedSong && isSheetOpen) {
            setIsSheetOpen(false);
            setSelectedSongId(null);
        }
    }, [selectedSong, isSheetOpen]);

    return (
        <>
            <Header>
                <Text style="title-h4">Songs</Text>
                <Text style="paragraph-md">Manage the catalog of approved songs and whether lyrics or instrumentals are available.</Text>
            </Header>

            <GridContainer isEmpty={songs.length === 0}>
                {songs.length === 0 ? (
                    <EmptyState title="No information" message="No songs available" />
                ) : songs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        onClick={handleSongClick}
                    />
                ))}
            </GridContainer>

            <AdminSongDetailsSheet
                song={selectedSong}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
            />
        </>
    );
}
