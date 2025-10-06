import { cn } from "@/lib/cn";
import Switch from "../Switch";

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
        <div className={cn("flex flex-col p-4 border border-secondary rounded-lg shadow-md")}>
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
    );
}
