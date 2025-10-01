import { Dispatch, SetStateAction } from "react";

import EmptyState from "@/components/ui/EmptyState";
import Sheet from "@/components/ui/Sheet";
import AddNote from "./add-notes";
import Select from "@/components/ui/Select";
import { useDefaultContext } from "@/components/providers/default-provider";

type Props = {
    active: FetchRequest | null;
    setActive: Dispatch<SetStateAction<FetchRequest | null>>;
    updateStatus: (id: string, status: Status) => void;
    refreshActive: () => void;
    setEquipmentChecked: (requestId: string, equipmentId: string, checked: boolean) => void;
    setSongChecked: (requestId: string, songId: string, checked: boolean) => void;
    addNote: (id: string, note: string) => void;
}

function DetailsSheet({ active, setActive, updateStatus, refreshActive, setSongChecked, setEquipmentChecked, addNote }: Props) {
  const defualtContext = useDefaultContext();
  
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
                        <Select
                            value={active.status.id}
                            onChange={(e) => {
                                const s = defualtContext.statuses.find((s) => s.id === e.target.value);
                                if (!s) return;
                                updateStatus(active.id, s);
                                refreshActive();
                            }}
                        >
                            {defualtContext.statuses.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </Select>
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

                    {/* Request Items (checklists) */}
                    <div>
                        <h3 className="text-base font-semibold mb-3">Request Items</h3>
                        {!(active.equipment && active.equipment.length) && !(active.song && active.song.length) ? (
                            <EmptyState title="No request items" message="No equipment or songs were specified." />
                        ) : (
                            <>
                                {active.equipment && active.equipment.length > 0 && (
                                    <div>
                                        <div className="text-xs text-foreground/60 mb-1">Equipment</div>
                                        <ul className="space-y-1">
                                            {active.equipment.map((e) => {
                                                return (
                                                    <li key={`${e.request_id}-${e.equipment_id}`} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={e.approved}
                                                            onChange={(ev) => {
                                                                setEquipmentChecked(active.id, e.equipment_id, ev.target.checked);
                                                            }}
                                                        />
                                                        <span>{e.equipment.name}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                                {active.song && active.song.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs text-foreground/60 mb-1">Songs</div>
                                        <ul className="space-y-1">
                                            {active.song.map((s) => {
                                                // const checked = !!active.songChecklist?.[s.id];
                                                return (
                                                    <li key={`${s.request_id}-${s.song_id}`} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={s.song.instrumental || s.song.lyrics}
                                                            onChange={(ev) => {
                                                                setSongChecked(active.id, s.song_id, ev.target.checked);
                                                            }}
                                                        />
                                                        <span>{s.song.name}</span>
                                                    </li>
                                                );
                                            })}
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
                        {!(active.venue && active.venue.length) ? (
                            <EmptyState title="No proceedings" message="No venues specified." />
                        ) : (
                            <>
                                {active.venue && active.venue.length > 0 && (
                                    <div>
                                        <ol className="list-decimal pl-5">
                                            {active.flow.map((st, idx) => (
                                                <li key={idx}>
                                                    <span className="font-medium capitalize">{st}</span>
                                                    {/* {st.label ? `: ${st.label}` : ""}
                                                    {st.type === "song" && st.songId
                                                        ? (() => {
                                                            const song = (active.selectedSongs || []).find((s) => s.id === st.songId);
                                                            return song ? ` — ${song.title}` : "";
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
                                                    <a href={a.url} download={a.name} className="underline">
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

                    {/* Internal Notes */}
                    <div>
                        <h3 className="text-base font-semibold mb-3">Internal Notes</h3>
                        {active.note.length === 0 ? (
                            <EmptyState title="No notes yet" message="Add a note for internal collaboration." />
                        ) : (
                            <ul className="space-y-3">
                                {active.note.map((n) => (
                                    <li key={n.id} className="text-sm">
                                        <div className="text-foreground/60">{new Date(n.created).toLocaleString()}</div>
                                        <div className="mt-0.5">{n.note}</div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-3">
                            <AddNote onAdd={(msg) => addNote(active.id, msg)} />
                        </div>
                    </div>
                </div>
            )}
        </Sheet>
    )
}

export default DetailsSheet;