import { Dispatch, SetStateAction } from "react";

import EmptyState from "@/components/ui/EmptyState";
import ScrollArea from "@/components/ui/ScrollArea";
import { EquipmentStore } from "@/lib/equipmentStore";
import { RequestItem } from "@/types/request";

type Props = {
    items: RequestItem[];
    setActive: Dispatch<SetStateAction<RequestItem | null>>
}

function EquipmentCatalogPanel({items, setActive}: Props) {
    // Compute equipment with active requests and quantities
    const equipment = EquipmentStore.list();
    const activeReqs = items.filter((r) => r.status === "pending" || r.status === "in_progress");
    const byEquipment: Record<string, { request: RequestItem; quantity: number }[]> = {};
    activeReqs.forEach((r) => {
        (r.selectedEquipment || []).forEach((e) => {
            const qty = typeof e.quantity === "number" ? Math.max(1, Math.floor(e.quantity)) : 1;
            if (!byEquipment[e.id]) byEquipment[e.id] = [];
            byEquipment[e.id].push({ request: r, quantity: qty });
        });
    });

    return (
        <ScrollArea className="max-w-full flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-3">
                {equipment.map((eq) => {
                    const usedBy = byEquipment[eq.id] || [];
                    return (
                        <div key={eq.id} className="rounded-md border border-foreground/15 p-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">{eq.name}</div>
                                <div className="text-xs text-foreground/60">Left: {eq.quantity}</div>
                            </div>
                            <div className="text-xs text-foreground/60 mt-0.5">ID: {eq.id}</div>
                            {usedBy.length === 0 ? (
                                <div className="mt-3">
                                    <EmptyState title="No active usage" message="No pending/in-progress requests are using this." />
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <div className="text-xs text-foreground/60 mb-1">In Requests ({usedBy.length})</div>
                                    <ul className="space-y-1">
                                        {usedBy.map(({ request, quantity }) => (
                                            <li key={request.id} className="flex items-center justify-between gap-2">
                                                <button
                                                    className="underline text-left truncate"
                                                    title={`Open details for ${request.who}`}
                                                    onClick={() => setActive(request)}
                                                >
                                                    {request.who}
                                                </button>
                                                <span className="text-xs text-foreground/60">x{quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}


export default EquipmentCatalogPanel;