import { useDefualtContext } from "@/components/providers/defualt-provider";
import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";
import ScrollArea from "@/components/ui/ScrollArea";
import { Dispatch, SetStateAction } from "react";

type Props = {
    grouped: Record<number, FetchRequest[]>;
    updateStatus: (id: string, status: Status) => void;
    setActive: Dispatch<SetStateAction<FetchRequest | null>>;
}

function KanbanBoard({ grouped, updateStatus, setActive }: Props) {
    const defualts = useDefualtContext();

    return (
        <ScrollArea className="max-w-full flex-1 min-h-0">
            <div className="flex gap-4 pb-2 pr-2 px-4 h-full">
                {defualts.statuses.map((status) => (
                    <div key={status.id} className="min-w-64 flex-1 h-full flex flex-col bg-foreground/2 rounded-md p-3">
                        {(() => {
                            const list = grouped[status.value];
                            return (
                                <div className="mb-2">
                                    <div className="text-sm font-medium">{status.name}</div>
                                    <div className="text-xs text-foreground/60">{list.length}Requests</div>
                                </div>
                            );
                        })()}
                        <div
                            className="flex-1 space-y-2"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const id = e.dataTransfer.getData("text/plain");
                                updateStatus(id, status);
                            }}
                        >
                            {
                                grouped[status.value].length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    grouped[status.value].map((r) => (
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