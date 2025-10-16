import Checkbox from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/public-card";
import Divider from "@/components/ui/divider";

import Text from "@/components/ui/text";
import Button from "@/components/ui/Button";
import { useFormContext } from "../form-provider";


export default function SongCard({ song }: { song: Song }) {
    const { request, setRequest } = useFormContext();

    const checked = request.songs.some((s) => s.id === song.id);

    function handleButtonClick() {
        console.log(song);

        setRequest((prev) => {
            return {
                ...prev,
                songs: checked ? prev.songs.filter((v) => v.id !== song.id) : [...prev.songs, song]
            }
        })
    }

    return (
        <Card className="has-checked:border-brand has-checked:outline-2 has-checked:outline-border-brand/20">
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
            <CardFooter>
                <Button className="w-full" variant="secondary" onClick={handleButtonClick} >{checked ? 'Remove' : 'Add'}  Song</Button>
            </CardFooter>
        </Card>
    )
}