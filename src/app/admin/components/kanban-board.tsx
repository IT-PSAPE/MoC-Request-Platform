import RequestCard from "@/components/ui/RequestCard";
import ScrollArea from "@/components/ui/ScrollArea";
import { columns } from "@/features/requests/defualts";
import { RequestItem, RequestStatus } from "@/types/request";
import { Dispatch, SetStateAction } from "react";

type Props = {
    items: RequestItem[];
    updateStatus: (id: string, status: RequestStatus) => void;
    setActive: Dispatch<SetStateAction<RequestItem | null>>;
}

function KanbanBoard({ items, updateStatus, setActive }: Props) {
    return (
        <ScrollArea className="max-w-full flex-1 min-h-0">
            <div className="flex gap-4 pb-2 pr-2 px-4 h-full">
                {columns.map((col) => (
                    <div key={col.key} className="min-w-64 flex-1 h-full flex flex-col bg-foreground/2 rounded-md p-3">
                        {(() => {
                            const list = items.filter((r) => r.status === col.key);
                            return (
                                <div className="mb-2">
                                    <div className="text-sm font-medium">{col.title}</div>
                                    <div className="text-xs text-foreground/60">{list.length} Requests</div>
                                </div>
                            );
                        })()}
                        <div
                            className="flex-1 space-y-2"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const id = e.dataTransfer.getData("text/plain");
                                updateStatus(id, col.key);
                            }}
                        >
                            {items.filter((r) => r.status === col.key).map((r) => (
                                <div key={r.id} className="cursor-move" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", r.id)}>
                                    <RequestCard request={r} setActive={setActive} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

export default KanbanBoard;