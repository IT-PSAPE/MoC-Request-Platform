"use client";

import { useEffect, useMemo, useState } from "react";

import { Text } from "@/components/ui/common/text";
import { EmptyState } from "@/components/ui/common/empty-state";
import { Header } from "@/components/ui/layout/header";

import { RequestItemCard } from "@/components/ui/block/request-item-card";
import { GridContainer } from "@/components/ui/layout/grid-container";
import AdminRequestItemDetailsSheet from "@/feature/items/components/admin-request-item-details-sheet";
import { useItemsContext } from "@/feature/items/components/items-context";

export default function RequestItemContent() {
    const { items } = useItemsContext();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const selectedItem = useMemo(() => {
        if (!selectedItemId) return null;
        return items.find((item) => item.id === selectedItemId) ?? null;
    }, [items, selectedItemId]);

    const handleItemClick = (item: RequestItem) => {
        setSelectedItemId(item.id);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedItemId(null);
    };

    useEffect(() => {
        if (!selectedItem && isSheetOpen) {
            setIsSheetOpen(false);
            setSelectedItemId(null);
        }
    }, [selectedItem, isSheetOpen]);

    return (
        <>
            <Header>
                <Text style="title-h4">Request Items</Text>
                <Text style="paragraph-md">Curate the predefined items teams can attach to their submissions.</Text>
            </Header>

            <GridContainer isEmpty={items.length === 0}>
                {items.length === 0 ? (
                    <EmptyState title="No information" message="No request items available yet." />
                ) : items.map((item) => (
                    <RequestItemCard
                        key={item.id}
                        item={item}
                        onClick={handleItemClick}
                    />
                ))}
            </GridContainer>

            <AdminRequestItemDetailsSheet
                item={selectedItem}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
            />
        </>
    );
}
