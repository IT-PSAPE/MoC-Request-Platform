'use client';

import Text from "@/components/ui/common/text";
import EmptyState from "@/components/ui/common/empty-state";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetailsSongs({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">Songs</Text>
      {request.song && request.song.length > 0 ? (
        <div className="space-y-1">
          {request.song.map((song: RequestedSong, index) => (
            <div key={song.song?.id || index} className="p-2 bg-secondary rounded-md flex flex-col gap-1">
              <Text style="paragraph-sm">{song.song?.name || `Song ${index + 1}`}</Text>
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
