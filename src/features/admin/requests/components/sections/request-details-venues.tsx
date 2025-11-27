'use client';

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import { type RequestDetailsBaseProps } from "../shared/request-details-utils";

export default function RequestDetailsVenues({ request }: RequestDetailsBaseProps) {
  return (
    <section>
      <Text style="label-md" className="mb-3">Available Venues</Text>
      {request.venue && request.venue.length > 0 ? (
        <div className="space-y-2">
          {request.venue.map((venue: RequestedVenue, index) => (
            <div key={venue.venue?.id || index} className="p-3 bg-secondary rounded-md">
              <Text style="paragraph-sm">{venue.venue?.name || `Venue ${index + 1}`}</Text>
              {venue.venue?.description && (
                <Text style="paragraph-xs" className="text-tertiary mt-1">
                  {venue.venue.description}
                </Text>
              )}
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
