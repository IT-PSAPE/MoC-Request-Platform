'use client';

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetailsSongs({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">Songs</Text>
      {request.song && request.song.length > 0 ? (
        <div className="space-y-2">
          {request.song.map((song: RequestedSong, index) => (
            <div key={song.song?.id || index} className="p-3 bg-secondary rounded-md">
              <Text style="paragraph-sm">{song.song?.name || `Song ${index + 1}`}</Text>
              <div className="flex gap-2 mt-2">
                {song.song?.instrumental && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                    Instrumental
                  </span>
                )}
                {song.song?.lyrics && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs">
                    Lyrics
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No songs selected"
          message="No songs have been selected for this request."
        />
      )}
    </section>
  );
}
