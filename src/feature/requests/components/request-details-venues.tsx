'use client';

import { EmptyState, Text } from "@/components/ui/common";
import { type RequestDetailsBaseProps } from "../request.utils";

export default function RequestDetailsVenues({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">Available Venues</Text>
      {request.venue && request.venue.length > 0 ? (
        <div className="space-y-1">
          {request.venue.map((venue: RequestedVenue, index) => (
            <div key={venue.venue?.id || index} className="p-2 bg-secondary rounded-md">
              <Text style="paragraph-sm">{venue.venue?.name || `Venue ${index + 1}`}</Text>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No venues available"
          message="No venues have been selected for this request."
        />
      )}
    </section>
  );
}
