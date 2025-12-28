"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@/components/ui/common/text";
import { EmptyState } from "@/components/ui/common/empty-state";
import { Header } from "@/components/ui/layout/header";

import { useAdminContext } from "@/components/contexts/admin-context";
import { EquipmentCard } from "@/components/ui/common/equipment-card";
import { GridContainer } from "@/components/ui/layout/grid-container";
import AdminEquipmentDetailsSheet from "@/feature/equipment/components/admin-equipment-details-sheet";

export default function EquipmentContent() {
    const { equipment } = useAdminContext();
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const selectedEquipment = useMemo(() => {
        if (!selectedEquipmentId) return null;
        return equipment.find((item) => item.id === selectedEquipmentId) ?? null;
    }, [equipment, selectedEquipmentId]);

    const handleEquipmentClick = (equipment: Equipment) => {
        setSelectedEquipmentId(equipment.id);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedEquipmentId(null);
    };

    useEffect(() => {
        if (!selectedEquipment && isSheetOpen) {
            setIsSheetOpen(false);
            setSelectedEquipmentId(null);
        }
    }, [selectedEquipment, isSheetOpen]);

    return (
        <>
            <Header>
                <Text style="title-h4">Equipment</Text>
                <Text style="paragraph-md">Adjust availability for each resource before assigning it to a request.</Text>
            </Header>

            <GridContainer isEmpty={equipment.length === 0}>
                {equipment.length === 0 ? (
                    <EmptyState title="No information" message="No equipment tracked yet." />
                ) : equipment.map((item) => (
                    <EquipmentCard
                        key={item.id}
                        equipment={item}
                        onClick={handleEquipmentClick}
                    />
                ))}
            </GridContainer>

            <AdminEquipmentDetailsSheet
                equipment={selectedEquipment}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
            />
        </>
    );
}
