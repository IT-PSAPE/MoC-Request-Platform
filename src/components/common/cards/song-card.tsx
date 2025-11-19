import { cn } from "@/lib/cn";
import Switch from "../switch";
import Button from "../button";
import Text from "../text";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../sheet/sheet";
import { useAdminContext } from "@/contexts/admin-context";

interface SongCardProps {
    song: Song;
}


export function SongCard({ song }: SongCardProps) {
    const { updateSong } = useAdminContext();

    const onToggleLyrics = (isActive: boolean) => {
        updateSong(song.id, 'lyrics', isActive);
    };

    const onToggleInstrumental = (isActive: boolean) => {
        updateSong(song.id, 'instrumental', isActive);
    };

    return (
        <div className={cn("border border-secondary rounded-lg shadow-md")}>
            <div className="flex flex-col p-4 ">
                <div className="">
                    <h3 className="font-semibold text-sm">{song.name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {song.id}</p>
                </div>
                <div className="space-y-1 mt-4" >
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={song.instrumental}
                            onCheckedChange={onToggleInstrumental}
                        />
                        <span className="text-xs text-muted-foreground">
                            Instrumental {song.instrumental ? "Available" : "Unavailable"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={song.lyrics}
                            onCheckedChange={onToggleLyrics}
                        />
                        <span className="text-xs text-muted-foreground">
                            Lyrics {song.lyrics ? "Available" : "Unavailable"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-3 border-t border-secondary">
                <Sheet>
                    <SheetTrigger>
                        <Button type="button" variant="secondary" className="w-full">Open details</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <Text style="title-h6">{song.name}</Text>
                        </SheetHeader>
                        <div className="flex-1">
                        </div>
                        <SheetFooter className="flex justify-end gap-3">
                            <SheetClose className="w-full">
                                <Button className="w-full" variant="secondary">Cancel</Button>
                            </SheetClose>
                            <Button className="w-full">Save Changes</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
