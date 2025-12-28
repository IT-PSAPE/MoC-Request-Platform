import Checkbox from "@/components/ui/common/checkbox";
import { PublicCard, PublicCardContent } from "@/components/ui/common/public-card";
import { Divider } from "@/components/ui/common/divider";

import { Text } from "@/components/ui/common/text";
import { useFormContext } from "@/feature/form/components/form-context";


export default function SongCard({ song }: { song: Song }) {
    const { request, setRequest } = useFormContext();

    const checked = request.songs.some((s) => s.id === song.id);

    function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();

        setRequest((prev) => {
            return {
                ...prev,
                songs: checked ? prev.songs.filter((v) => v.id !== song.id) : [...prev.songs, song]
            }
        })
    }

    return (
        <PublicCard className="has-checked:border-brand cursor-pointer" onClick={handleCardClick}>
            <PublicCardContent className="flex-1">
                <div className="flex gap-2" >
                    <div className="py-1" >
                        <Checkbox checked={checked} />
                    </div>
                    <Text style="label-md">{song.name}</Text>
                </div>
                <div className="py-3">
                    <Divider />
                </div>
                <div className="line-clamp-3">
                    <Text style="paragraph-sm">Lyrics: <span className="text-quaternary">{song.lyrics ? "available" : "unavailable"}</span></Text>
                    <Text style="paragraph-sm">Instrumental: <span className="text-quaternary">{song.instrumental ? "available" : "unavailable"}</span></Text>
                </div>
            </PublicCardContent>
        </PublicCard>
    )
}