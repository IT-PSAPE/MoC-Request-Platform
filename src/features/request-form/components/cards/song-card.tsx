import Checkbox from "@/components/common/controls/checkbox";
import { Card, CardContent } from "@/components/common/cards/public-card";
import Divider from "@/components/common/divider";

import Text from "@/components/common/text";
import { useFormContext } from "@/components/contexts/form-context";


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
        <Card className="has-checked:border-brand cursor-pointer" onClick={handleCardClick}>
            <CardContent className="flex-1">
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
            </CardContent>
        </Card>
    )
}