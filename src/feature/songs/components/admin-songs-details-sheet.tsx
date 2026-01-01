import { Sheet } from "@/components/ui/base/sheet";
import { Badge, Button, Switch, Divider, Text } from "@/components/ui/common";
import { useSongsContext } from "./songs-context";

interface AdminSongDetailsSheetProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSongDetailsSheet({ song, isOpen, onClose }: AdminSongDetailsSheetProps) {
  const { updateSong } = useSongsContext();

  if (!song) return null;

  const handleToggleLyrics = (hasLyrics: boolean) => {
    updateSong(song.id, 'lyrics', hasLyrics);
  };

  const handleToggleInstrumental = (hasInstrumental: boolean) => {
    updateSong(song.id, 'instrumental', hasInstrumental);
  };

  return (
    <Sheet.Provider open={isOpen} onOpenChange={onClose}>
      <Sheet.Content>
        <Sheet.Header />

        <div className="flex-1 space-y-6 py-6 px-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <Text style="title-h6">Basic Information</Text>
            <div className="space-y-2">
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Song Name</Text>
                <Text style="paragraph-md">{song.name}</Text>
              </div>
              <div>
                <Text style="paragraph-sm" className="text-tertiary">Song ID</Text>
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
                <Text style="paragraph-sm" className="text-tertiary">
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
                <Text style="paragraph-sm" className="text-tertiary">
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

        <Sheet.Footer>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Provider>
  );
}