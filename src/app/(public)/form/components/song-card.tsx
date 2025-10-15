import Checkbox from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/public-card";
import Divider from "./divider";

import Text from "@/components/ui/text";
import Button from "@/components/ui/Button";


export default function SongCard({ song, checked }: { song: Song, checked: boolean }) {
    return (
        <Card className="has-checked:border-brand">
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
                <Button className="w-full" variant="secondary" >Add Song</Button>
            </CardFooter>
        </Card>
    )
}