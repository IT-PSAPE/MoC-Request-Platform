import { cn } from "@/lib/cn";

import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../../components/header";

import { useAdminContext } from "../../admin-provider";
import { SongCard } from "@/components/ui/cards/song-card";

export default function SongContent() {
    const { songs, updateSong } = useAdminContext();

    const isEmpty = songs.length === 0;

    return (
        <>
            <Header>
                <Text style="title-h4">Songs</Text>
                <Text style="paragraph-md">All venues MoC will need to be aware of when  requests come in</Text>
            </Header>
            <div className={cn("grid gap-4 p-6", isEmpty ? "grid-cols-1" : "grid-cols-3")}>
                {isEmpty ? (
                    <EmptyState message="No songs available" />
                ) : songs.map((song) => (
                    <SongCard
                        key={song.id}
                        songTitle={song.name}
                        songId={song.id}
                        instrumental={song.instrumental}
                        lyrics={song.lyrics}
                        onToggleLyrics={(isActive) => updateSong(song.id, 'lyrics', isActive)}
                        onToggleInstrumental={(isActive) => updateSong(song.id, 'instrumental', isActive)}
                    />
                ))}
            </div>
        </>
    );
}