import { cn } from "@/lib/cn";
import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "../../components/header";
import { useAdminContext } from "@/contexts/admin-context";
import { EquipmentCard } from "@/components/common/cards/equipment-card";
import { GridContainer } from "@/components/common/grid-container";

export default function EquipmentContent() {
    const { equipment } = useAdminContext();

    return (
        <>
            <Header>
                <Text style="title-h4">Equipment</Text>
                <Text style="paragraph-md">Adjust availability for each resource before assigning it to a request.</Text>
            </Header>
            <GridContainer isEmpty={equipment.length === 0}>
                {equipment.length === 0 ? (
                    <EmptyState message="No equipment tracked yet." />
                ) : equipment.map((equipment) => (
                    <EquipmentCard key={equipment.id} equipment={equipment} />
                ))}
            </GridContainer>
        </>
    );
}
