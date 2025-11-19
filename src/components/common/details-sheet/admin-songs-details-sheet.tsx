import { useAdminContext } from "@/contexts/admin-context";
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "../sheet/sheet";
import Text from "../text";
import Divider from "../divider";
import Badge from "../badge";
import Switch from "../switch";
import Button from "../button";

interface AdminSongDetailsSheetProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSongDetailsSheet({ song, isOpen, onClose }: AdminSongDetailsSheetProps) {
  const { updateSong } = useAdminContext();

  if (!song) return null;

  const handleToggleLyrics = (hasLyrics: boolean) => {
    updateSong(song.id, 'lyrics', hasLyrics);
  };

  const handleToggleInstrumental = (hasInstrumental: boolean) => {
    updateSong(song.id, 'instrumental', hasInstrumental);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <Text style="title-h5">{song.name}</Text>
          <Text style="paragraph-sm" className="text-muted-foreground">
            Song Details & Settings
          </Text>
        </SheetHeader>
        
        <div className="flex-1 space-y-6 py-6 px-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <Text style="title-h6">Basic Information</Text>
            <div className="space-y-2">
              <div>
                <Text style="paragraph-sm" className="text-muted-foreground">Song Name</Text>
                <Text style="paragraph-md">{song.name}</Text>
              </div>
              <div>
                <Text style="paragraph-sm" className="text-muted-foreground">Song ID</Text>
                <Text style="paragraph-sm" className="font-mono">{song.id}</Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* Availability Section */}
          <div className="space-y-4">
            <Text style="title-h6">Availability</Text>
            
            {/* Instrumental Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Text style="paragraph-md">Instrumental version</Text>
                  <Badge color={song.instrumental ? "green" : "gray"}>
                    {song.instrumental ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <Text style="paragraph-sm" className="text-muted-foreground">
                  {song.instrumental ? "Instrumental version is available for requests" : "Instrumental version is not available"}
                </Text>
              </div>
              <Switch
                checked={song.instrumental}
                onCheckedChange={handleToggleInstrumental}
              />
            </div>

            {/* Lyrics Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Text style="paragraph-md">Lyrics version</Text>
                  <Badge color={song.lyrics ? "green" : "gray"}>
                    {song.lyrics ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <Text style="paragraph-sm" className="text-muted-foreground">
                  {song.lyrics ? "Lyrics version is available for requests" : "Lyrics version is not available"}
                </Text>
              </div>
              <Switch
                checked={song.lyrics}
                onCheckedChange={handleToggleLyrics}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}