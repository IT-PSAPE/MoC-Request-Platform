import { cn } from "@/lib/cn";

import { VenueCard } from "@/components/ui/cards/venue-card";
import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../../components/header";

import { useAdminContext } from "../../admin-provider";

export default function VenueContent() {
    const { venues, updateVenue } = useAdminContext();

    const isEmpty = venues.length === 0;

    return (
        <>
            <Header>
                <Text style="title">Venues</Text>
                <Text style="body">All venues MoC will need to be aware of when  requests come in</Text>
            </Header>
            <div className={cn("grid gap-4 p-6", isEmpty ? "grid-cols-1" : "grid-cols-3")}>
                {venues.length === 0 ? (
                    <EmptyState message="No venues available" />
                ) : venues.map((venue) => (
                    <VenueCard
                        key={venue.id}
                        venueName={venue.name}
                        venueId={venue.id}
                        available={venue.available}
                        onToggleActive={(isActive) => {
                            updateVenue(venue.id, isActive);
                        }}
                    />
                ))}
            </div>
        </>
    );
}