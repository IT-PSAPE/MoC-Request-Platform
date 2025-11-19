import { cn } from "@/lib/cn";

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "../../components/header";

import { useAdminContext } from "@/contexts/admin-context";
import { SongCard } from "@/components/common/cards/song-card";
import { GridContainer } from "@/components/common/grid-container";

export default function SongContent() {
    const { songs } = useAdminContext();

    return (
        <>
            <Header>
                <Text style="title-h4">Songs</Text>
                <Text style="paragraph-md">Manage the catalog of approved songs and whether lyrics or instrumentals are available.</Text>
            </Header>
            <GridContainer isEmpty={songs.length === 0}>
                {songs.length === 0 ? (
                    <EmptyState message="No songs available" />
                ) : songs.map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </GridContainer>
        </>
    );
}
