import { Dispatch, SetStateAction } from "react";

import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";
import ScrollArea from "@/components/ui/ScrollArea";
import { useDefualtContext } from "@/components/providers/defualt-provider";

type Props = {
    compare: (a: FetchRequest, b: FetchRequest) => number;
    setActive: Dispatch<SetStateAction<FetchRequest | null>>;
    grouped: Record<number, FetchRequest[]>;
}

function KanbanBoard({ compare, setActive, grouped }: Props) {
    const defualts = useDefualtContext();

    return (
        <ScrollArea className="max-w-full flex-1 min-h-0">
            <div className="flex gap-4 pb-2 pr-2 px-4 h-full">
                {defualts.statuses.map((col) => (
                    <div key={col.id} className="min-w-64 flex-1 h-full flex flex-col bg-foreground/2 rounded-md p-3">
                        <div className="text-sm font-medium mb-2">{col.name}</div>
                        <div className="space-y-2">
                            {
                                grouped[col.value].length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    grouped[col.value].sort(compare).map((r) => (
                                        <RequestCard key={r.id} request={r} setActive={setActive} />
                                    ))
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

export default KanbanBoard;