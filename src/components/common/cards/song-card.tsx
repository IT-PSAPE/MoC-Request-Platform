import { cn } from "@/lib/cn";
import Switch from "../switch";
import Button from "../button";
import Text from "../text";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../sheet/sheet";

interface VenueCardProps {
    songTitle: string;
    songId: string;
    instrumental: boolean;
    lyrics: boolean;
    onToggleInstrumental: (available: boolean) => void;
    onToggleLyrics: (available: boolean) => void;
}


export function SongCard({
    songTitle,
    songId: songId,
    instrumental,
    lyrics,
    onToggleInstrumental,
    onToggleLyrics,
}: VenueCardProps) {
    return (
        <div className={cn("border border-secondary rounded-lg shadow-md")}>
            <div className="flex flex-col p-4 ">
                <div className="">
                    <h3 className="font-semibold text-sm">{songTitle}</h3>
                    <p className="text-xs text-muted-foreground">ID: {songId}</p>
                </div>
                <div className="space-y-1 mt-4" >
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={instrumental}
                            onCheckedChange={onToggleInstrumental}
                        />
                        <span className="text-xs text-muted-foreground">
                            Instrumental {instrumental ? "Available" : "Unavailable"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={lyrics}
                            onCheckedChange={onToggleLyrics}
                        />
                        <span className="text-xs text-muted-foreground">
                            Lyrics {lyrics ? "Available" : "Unavailable"}
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
                            <Text style="title-h6">{songTitle}</Text>
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
