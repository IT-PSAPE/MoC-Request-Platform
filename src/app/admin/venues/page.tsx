"use client";

import { useEffect, useMemo, useState } from "react";

import { VenueCard } from "@/components/common/cards/venue-card";
import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "@/components/common/header";

import { useAdminContext } from "@/contexts/admin-context";
import { GridContainer } from "@/components/common/grid-container";
import AdminVenueDetailsSheet from "@/components/admin/details-sheet/admin-venue-details-sheet";

export default function VenueContent() {
    const { venues } = useAdminContext();
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    const selectedVenue = useMemo(() => {
        if (!selectedVenueId) return null;
        return venues.find((venue) => venue.id === selectedVenueId) ?? null;
    }, [venues, selectedVenueId]);

    const handleVenueClick = (venue: Venue) => {
        setSelectedVenueId(venue.id);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedVenueId(null);
    };

    useEffect(() => {
        if (!selectedVenue && isSheetOpen) {
            setIsSheetOpen(false);
            setSelectedVenueId(null);
        }
    }, [selectedVenue, isSheetOpen]);

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
                    <VenueCard 
                        key={venue.id} 
                        venue={venue}
                        onClick={handleVenueClick}
                    />
                ))}
            </GridContainer>

            <AdminVenueDetailsSheet
                venue={selectedVenue}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
            />
        </>
    );
}
