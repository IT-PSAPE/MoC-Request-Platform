import { cn } from "@/lib/cn";
import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "../../components/header";
import { useAdminContext } from "@/contexts/admin-context";
import { EquipmentCard } from "@/components/common/cards/equipment-card";

export default function EquipmentContent() {
    const { equipment, updateEquipment } = useAdminContext();

    const isEmpty = equipment.length === 0;

    return (
        <>
            <Header>
                <Text style="title-h4">Equipment</Text>
                <Text style="paragraph-md">Supporting Text</Text>
            </Header>
            <div className={cn("grid gap-4 p-6", isEmpty ? "grid-cols-1" : "grid-cols-3")}>
                {isEmpty ? (
                    <EmptyState message="No songs available" />
                ) : equipment.map((equipment) => (
                    <EquipmentCard
                        key={equipment.id}
                        equipment={equipment}
                        update={(change) => {
                            const clamped = Math.max(0, Math.min(isFinite(equipment.quantity) ? equipment.quantity : 9999, change));

                            if (clamped === equipment.available || (clamped === equipment.available && clamped !== equipment.quantity)) return

                            updateEquipment(equipment.id, clamped);
                        }}
                    />
                ))}
            </div>
        </>
    );
}

