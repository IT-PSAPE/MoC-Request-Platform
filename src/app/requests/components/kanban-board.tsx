import { Dispatch, SetStateAction, useEffect, useState } from "react";

import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";
import ScrollArea from "@/components/ui/ScrollArea";
import { useDefaultContext } from "@/components/providers/default-provider";

type Props = {
    compare: (a: FetchRequest, b: FetchRequest) => number;
    setActive: Dispatch<SetStateAction<FetchRequest | null>>;
    grouped: Record<number, FetchRequest[]>;
}

function KanbanBoard({ compare, setActive, grouped }: Props) {
    const defaults = useDefaultContext();
    const [activeStatus, setActiveStatus] = useState<number | null>(() => defaults.statuses[0]?.value ?? null);

    useEffect(() => {
        if (!defaults.statuses.length) {
            setActiveStatus(null);
            return;
        }

        const hasActive = defaults.statuses.some((status) => status.value === activeStatus);
        if (!hasActive) {
            setActiveStatus(defaults.statuses[0].value);
        }
    }, [defaults.statuses, activeStatus]);

    const activeColumn = activeStatus === null
        ? undefined
        : defaults.statuses.find((status) => status.value === activeStatus);
    const activeRequests = activeStatus === null
        ? []
        : (grouped[activeStatus] ?? []);

    return (
        <ScrollArea className="max-w-full flex-1 min-h-0">
            <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
                <div className="overflow-x-auto -mx-4 px-4">
                    <div className="flex gap-2 pb-1">
                        {defaults.statuses.map((status) => {
                            const isActive = status.value === activeStatus;
                            return (
                                <button
                                    key={status.id}
                                    type="button"
                                    onClick={() => setActiveStatus(status.value)}
                                    className={[
                                        "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        "border",
                                        isActive
                                            ? "border-foreground/40 bg-foreground text-background"
                                            : "border-foreground/20 bg-background text-foreground/80 hover:bg-foreground/10"
                                    ].join(" ")}
                                >
                                    {status.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-foreground/2 rounded-md p-3">
                    <div className="text-sm font-medium mb-2">
                        {activeColumn?.name ?? ""}
                    </div>
                    <div className="space-y-2">
                        {activeRequests.length === 0 ? (
                            <EmptyState />
                        ) : (
                            [...activeRequests].sort(compare).map((r) => (
                                <RequestCard key={r.id} request={r} setActive={setActive} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden md:flex gap-4 pb-2 pr-2 px-4 h-full">
                {defaults.statuses.map((col) => {
                    const columnRequests = grouped[col.value] ?? [];
                    return (
                        <div key={col.id} className="min-w-64 flex-1 h-full flex flex-col bg-foreground/2 rounded-md p-3">
                            <div className="text-sm font-medium mb-2">{col.name}</div>
                            <div className="space-y-2">
                                {columnRequests.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    [...columnRequests].sort(compare).map((r) => (
                                        <RequestCard key={r.id} request={r} setActive={setActive} />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    )
}

export default KanbanBoard;