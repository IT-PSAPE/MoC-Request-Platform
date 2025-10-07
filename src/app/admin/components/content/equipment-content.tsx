import { cn } from "@/lib/cn";
import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../../components/header";
import { useAdminContext } from "../../admin-provider";
import { EquipmentCard } from "@/components/ui/cards/equipment-card";

export default function EquipmentContent() {
    const { equipment, updateEquipment } = useAdminContext();

    const isEmpty = equipment.length === 0;

    return (
        <>
            <Header>
                <Text style="title">Equipment</Text>
                <Text style="body">Supporting Text</Text>
            </Header>
            <div className={cn("grid gap-4 p-6", isEmpty ? "grid-cols-1" : "grid-cols-3")}>
                {isEmpty ? (
                    <EmptyState message="No songs available" />
                ) : equipment.map((equipment) => (
                    <EquipmentCard
                        key={equipment.id}
                        equipmentName={equipment.name}
                        id={equipment.id}
                        quantity={equipment.quantity}
                        available={equipment.available}
                        update={(change) => {
                            const clamped = Math.max(0, Math.min(isFinite(equipment.quantity) ? equipment.quantity : 9999, change));

                            if (clamped === equipment.quantity || clamped === equipment.available) return

                            updateEquipment(equipment.id, clamped);
                        }}
                    />
                ))}
            </div>
        </>
    );
}

