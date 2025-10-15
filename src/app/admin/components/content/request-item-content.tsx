import { cn } from "@/lib/cn";
import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import Header from "../header";
import { useAdminContext } from "../../admin-provider";
import { RequestItemCard } from "@/components/ui/cards/request-item-card";

export default function RequestItemContent() {
    const { items } = useAdminContext();

    const isEmpty = items.length === 0;

    return (
        <>
            <Header>
                <Text style="title-h4">Request Items</Text>
                <Text style="paragraph-md">Supporting Text</Text>
            </Header>
            <div className={cn("grid gap-4 p-6", isEmpty ? "grid-cols-1" : "grid-cols-3")}>
                {isEmpty ? (
                    <EmptyState message="No songs available" />
                ) : items.map((item) => (
                    <RequestItemCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </>
    );
}

