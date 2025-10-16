import { ReactNode } from "react";

import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";

type Column = { [key: string]: string }

type KanbanProps = {
    columns: Column[]
    data: FetchRequest[]
}

function KanbanBoard({ columns, data }: KanbanProps) {
    return (
        <div className="flex-1 flex gap-2 px-3 py-2">
            {columns.map((column) => {
                const columnKey = Object.keys(column)[0];
                const requestsForColumn = data.filter((request) => {
                    const statusId = request.status?.id;
                    if (statusId === undefined || statusId === null) return false;
                    return String(statusId) === columnKey;
                });

                return (
                    <KanbanColumn key={columnKey} >
                        <KanbanHeader column={column} count={requestsForColumn.length} />
                        <KanbanContent >
                            {requestsForColumn.map((request) => (
                                <RequestCard key={request.id} request={request} setActive={() => { }} />
                            ))}
                        </KanbanContent>
                    </KanbanColumn>
                );
            })}
        </div>
    )
}

function KanbanColumn({ children }: { children?: ReactNode }) {
    return (
        <div className="flex-1 flex flex-col bg-secondary rounded-md overflow-clip">
            {children}
        </div>
    )
}

function KanbanHeader({ column, count }: { column: Column; count: number }) {
    return (
        // <div className="px-5 py-4 sticky top-15 bg-secondary" >
        <div className="px-5 py-4" >
            <Text style="label-md" >{Object.values(column)[0]}</Text>
            <Text style="paragraph-sm" >{count} Requests</Text>
        </div>
    )
}

function KanbanContent({ children }: { children?: ReactNode }) {
    return (
        <div className="p-2 flex-1 flex flex-col bg-secondary rounded-md gap-2">
            {children ? children : <EmptyState />}
        </div>
    )
}

export { KanbanBoard }

export type { Column }