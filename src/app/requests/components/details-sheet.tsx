import { Dispatch, SetStateAction } from "react";

import EmptyState from "@/components/ui/EmptyState";
import Sheet from "@/components/ui/Sheet";
import Badge from "@/components/ui/Badge";
import { statusColor } from "@/features/requests/defualts";

type Props = {
    active: FetchRequest | null;
    setActive: Dispatch<SetStateAction<FetchRequest | null>>;
}

function DetailsSheet({ active, setActive }: Props) {
    return (
        <Sheet
            open={!!active}
            onOpenChange={(v) => !v && setActive(null)}
            title={active ? `Details • ${active.who}` : "Details"}
            width={440}
        >
            {active && (
                <div className="space-y-6 text-sm">
                    {/* Overview */}
                    <div>
                        <h3 className="text-base font-semibold mb-3">Overview</h3>
                        <div className="text-xs text-foreground/60">Status</div>
                        <Badge color={statusColor[active.status.value]}>{active.status.name}</Badge>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <div className="text-xs text-foreground/60">Priority</div>
                                <div className="font-medium capitalize">{active.priority.name}</div>
                            </div>
                            {active.type && (
                                <div>
                                    <div className="text-xs text-foreground/60">Type</div>
                                    <div className="font-medium capitalize">{active.type.name}</div>
                                </div>
                            )}
                            {active.due && (
                                <div>
                                    <div className="text-xs text-foreground/60">Due</div>
                                    <div className="font-medium">{new Date(active.due).toLocaleString()}</div>
                                </div>
                            )}
                        </div>
                        <div className="border-b border-foreground/15 mt-4" />
                    </div>
                    {/* 5W + 1H */}
                    <div>
                        <h3 className="text-base font-semibold mb-3">5W + 1H</h3>
                        {!(active.who || active.what || active.when || active.where || active.why || active.how || active.info) ? (
                            <EmptyState title="No basic details" message="Who, What, When, Where, Why, or How not provided." />
                        ) : (
                            <>
                                <div>
                                    <div className="text-xs text-foreground/60">Who</div>
                                    <div className="font-medium">{active.who}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-foreground/60">What</div>
                                    <div>{active.what}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-foreground/60">When</div>
                                    <div>{active.when}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-foreground/60">Where</div>
                                    <div>{active.where}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-foreground/60">Why</div>
                                    <div>{active.why}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-foreground/60">How</div>
                                    <div>{active.how}</div>
                                </div>
                                {active.info && (
                                    <div>
                                        <div className="text-xs text-foreground/60">Additional</div>
                                        <div>{active.info}</div>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="border-b border-foreground/15 mt-4" />
                    </div>
                    {/* Request Items */}
                    <div>
                        <h3 className="text-base font-semibold mb-3">Request Items</h3>
                        {!(active.equipment && active.equipment.length) && !(active.song && active.song.length) ? (
                            <EmptyState title="No request items" message="No equipment or songs were specified." />
                        ) : (
                            <>
                                {active.equipment && active.equipment.length > 0 && (
                                    <div>
                                        <div className="text-xs text-foreground/60">Equipment</div>
                                        <ul className="list-disc pl-5">
                                            {active.equipment.map((e) => (
                                                <li key={e.equipment.id}>{e.equipment.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {active.song && active.song.length > 0 && (
                                    <div className="mt-2">
                                        <div className="text-xs text-foreground/60">Songs</div>
                                        <ul className="list-disc pl-5">
                                            {active.song.map((s) => (
                                                <li key={s.song.id}>{s.song.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="border-b border-foreground/15 mt-4" />
                    </div>
                    {/* Proceedings: Event Flow + Files */}
                    <div>
                        <h3 className="text-base font-semibold mb-3">Proceedings</h3>
                        {!(active.flow && active.flow.length) && !(active.attachment && active.attachment.length) ? (
                            <EmptyState title="No proceedings" message="No event flow steps or files attached." />
                        ) : (
                            <>
                                {active.flow && active.flow.length > 0 && (
                                    <div>
                                        <ol className="list-decimal pl-5">
                                            {active.flow.map((st, idx) => (
                                                <li key={idx}>
                                                    <span className="font-medium capitalize">{st}</span>
                                                    {/* {st.label ? `: ${st.label}` : ""}
                                                    {st.type === "song" && st.songId
                                                        ? (() => {
                                                            const song = (active.song || []).find((s) => s.id === st.songId);
                                                            return song ? ` — ${song.name}` : "";
                                                        })()
                                                        : ""} */}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                                {active.attachment.length > 0 && (
                                    <details className="mt-3">
                                        <summary className="cursor-pointer">Attachments ({active.attachment.length})</summary>
                                        <ul className="list-disc pl-5 mt-1">
                                            {active.attachment.map((a) => (
                                                <li key={a.id}>
                                                    <a href={a.storage} download={a.name} className="underline">
                                                        {a.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                )}
                            </>
                        )}
                        <div className="border-b border-foreground/15 mt-4" />
                    </div>
                </div>
            )}
        </Sheet>
    )
}

export default DetailsSheet;