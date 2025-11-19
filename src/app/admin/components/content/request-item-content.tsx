import { cn } from "@/lib/cn";
import Text from "@/components/common/text";
import EmptyState from "@/components/common/empty-state";
import Header from "../header";
import { useAdminContext } from "@/contexts/admin-context";
import { RequestItemCard } from "@/components/common/cards/request-item-card";
import { GridContainer } from "@/components/common/grid-container";

export default function RequestItemContent() {
    const { items } = useAdminContext();

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
                    <RequestItemCard key={item.id} item={item} />
                ))}
            </GridContainer>
        </>
    );
}
