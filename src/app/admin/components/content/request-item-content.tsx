import { useEffect, useMemo, useState } from "react";

import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "../header";

import { useAdminContext } from "@/contexts/admin-context";
import { RequestItemCard } from "@/components/common/cards/request-item-card";
import { GridContainer } from "@/components/common/grid-container";
import AdminRequestItemDetailsSheet from "@/components/admin/details-sheet/admin-request-item-details-sheet";


export default function RequestItemContent() {
    const { items } = useAdminContext();
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

    const isEmpty = items.length === 0;

    return (
        <>
            <Header>
                <Text style="title-h4">Request Items</Text>
                <Text style="paragraph-md">Curate the predefined items teams can attach to their submissions.</Text>
            </Header>
            <GridContainer>
                {isEmpty ? (
                    <EmptyState message="No request items available yet." />
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
