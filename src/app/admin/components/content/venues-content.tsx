import { cn } from "@/lib/cn";

import { VenueCard } from "@/components/common/cards/venue-card";
import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "../../components/header";

import { useAdminContext } from "@/contexts/admin-context";
import { GridContainer } from "@/components/common/grid-container";

export default function VenueContent() {
    const { venues } = useAdminContext();

    return (
        <>
            <Header>
                <Text style="title-h4">Venues</Text>
                <Text style="paragraph-md">Keep venue readiness up to date so request owners know where events can take place.</Text>
            </Header>
            <GridContainer isEmpty={venues.length === 0}>
                {venues.length === 0 ? (
                    <EmptyState message="No venues available" />
                ) : venues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                ))}
            </GridContainer>
        </>
    );
}
