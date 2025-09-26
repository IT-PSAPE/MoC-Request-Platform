import { Dispatch, SetStateAction } from "react";

import RequestCard from "@/components/ui/RequestCard";
import ScrollArea from "@/components/ui/ScrollArea";
import { RequestItem, RequestStatus } from "@/types/request";

type Props = {
    items: RequestItem[];
    statuses: { key: RequestStatus; title: string }[];
    compare: (a: RequestItem, b: RequestItem) => number ;
    setActive: Dispatch<SetStateAction<RequestItem | null>>;
}

function KanbanBoard({ items, statuses, compare, setActive }: Props) {
    return (
        <ScrollArea className="max-w-full flex-1 min-h-0">
            <div className="flex gap-4 pb-2 pr-2 px-4 h-full">
                {statuses.map((col) => (
                    <div key={col.key} className="min-w-64 flex-1 h-full flex flex-col bg-foreground/2 rounded-md p-3">
                        <div className="text-sm font-medium mb-2">{col.title}</div>
                        <div className="space-y-2">
                            {items.filter((r) => r.status === col.key).sort(compare).map((r) => (
                                <RequestCard key={r.id} request={r} setActive={setActive} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

export default KanbanBoard;