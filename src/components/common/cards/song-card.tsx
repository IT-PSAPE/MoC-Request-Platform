import { cn } from "@/lib/cn";
import Switch from "../switch";
import Button from "../button";
import { useAdminContext } from "@/contexts/admin-context";

interface SongCardProps {
    song: Song;
    onClick?: (song: Song) => void;
}

export function SongCard({ song, onClick }: SongCardProps) {
    const { updateSong } = useAdminContext();

    const onToggleLyrics = (isActive: boolean) => {
        updateSong(song.id, 'lyrics', isActive);
    };

    const onToggleInstrumental = (isActive: boolean) => {
        updateSong(song.id, 'instrumental', isActive);
    };

    return (
        <div className={cn("border border-secondary rounded-lg bg-primary")}>
            <div className="flex flex-col p-4 ">
                <div className="">
                    <h3 className="font-semibold text-sm">{song.name}</h3>
                    <p className="text-xs text-tertiary">ID: {song.id}</p>
                </div>
                <div className="space-y-1 mt-4" >
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={song.instrumental}
                            onCheckedChange={onToggleInstrumental}
                        />
                        <span className="text-xs text-tertiary">
                            Instrumental {song.instrumental ? "Available" : "Unavailable"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={song.lyrics}
                            onCheckedChange={onToggleLyrics}
                        />
                        <span className="text-xs text-tertiary">
                            Lyrics {song.lyrics ? "Available" : "Unavailable"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-3 border-t border-secondary">
                <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => onClick?.(song)}
                >
                    Open details
                </Button>
            </div>
        </div>
    );
}
