"use client";
import { useState, useEffect } from "react";
// Card not used here anymore
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { RequestItem, RequestStatus } from "@/types/request";
import Sheet from "@/components/ui/Sheet";
import ScrollArea from "@/components/ui/ScrollArea";
import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";
import { useAdminController } from "@/features/admin/useAdminController";
import { useRouter } from "next/navigation";
import { EquipmentStore } from "@/lib/equipmentStore";
import AddNote from "./components/add-notes";
import KanbanBoard from "./components/kanban-board";
import EquipmentCatalogPanel from "./components/equipment-catalog-panel";

const columns: { key: RequestStatus; title: string }[] = [
  { key: "not_started", title: "Not Started" },
  { key: "pending", title: "Pending" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
  { key: "dropped", title: "Dropped" },
];

export default function AdminPage() {
  const {
    authed,
    items,
    active,
    setActive,
    updateStatus,
    addNote,
    setEquipmentChecked,
    setSongChecked,
    refreshActive,
  } = useAdminController();

  const router = useRouter();

  // Sidebar tab state
  const [tab, setTab] = useState<"requests" | "equipment">("requests");

  useEffect(() => {
    if (authed === false) {
      // redirect to dedicated login page, preserving return location
      router.push(`/login?next=${encodeURIComponent("/admin")}`);
    }
  }, [authed, router]);

  if (authed === null) {
    // auth check pending — avoid rendering and avoid redirecting
    return <div className="py-8">Loading...</div>;
  }

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // RENDER FUNCTION
  // ──────────────────────────────────────────────────────────────────────────────────────────────────


  function DetailsSheet() {
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
                value={active.status}
                onChange={(e) => {
                  const s = e.target.value as RequestStatus;
                  updateStatus(active.id, s);
                  refreshActive();
                }}
              >
                {columns.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.title}
                  </option>
                ))}
              </Select>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-xs text-foreground/60">Priority</div>
                  <div className="font-medium capitalize">{active.priority}</div>
                </div>
                {active.kind && (
                  <div>
                    <div className="text-xs text-foreground/60">Type</div>
                    <div className="font-medium capitalize">{active.kind.replace(/_/g, " ")}</div>
                  </div>
                )}
                {active.dueAt && (
                  <div>
                    <div className="text-xs text-foreground/60">Due</div>
                    <div className="font-medium">{new Date(active.dueAt).toLocaleString()}</div>
                  </div>
                )}
              </div>
              <div className="border-b border-foreground/15 mt-4" />
            </div>

            {/* 5W + 1H */}
            <div>
              <h3 className="text-base font-semibold mb-3">5W + 1H</h3>
              {!(active.who || active.what || active.when || active.where || active.why || active.how || active.additionalInfo) ? (
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
                  {active.additionalInfo && (
                    <div>
                      <div className="text-xs text-foreground/60">Additional</div>
                      <div>{active.additionalInfo}</div>
                    </div>
                  )}
                </>
              )}
              <div className="border-b border-foreground/15 mt-4" />
            </div>

            {/* Request Items (checklists) */}
            <div>
              <h3 className="text-base font-semibold mb-3">Request Items</h3>
              {!(active.selectedEquipment && active.selectedEquipment.length) && !(active.selectedSongs && active.selectedSongs.length) ? (
                <EmptyState title="No request items" message="No equipment or songs were specified." />
              ) : (
                <>
                  {active.selectedEquipment && active.selectedEquipment.length > 0 && (
                    <div>
                      <div className="text-xs text-foreground/60 mb-1">Equipment</div>
                      <ul className="space-y-1">
                        {active.selectedEquipment.map((e) => {
                          const checked = !!active.equipmentChecklist?.[e.id];
                          return (
                            <li key={e.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(ev) => {
                                  setEquipmentChecked(active.id, e.id, ev.target.checked);
                                }}
                              />
                              <span>{e.name}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {active.selectedSongs && active.selectedSongs.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-foreground/60 mb-1">Songs</div>
                      <ul className="space-y-1">
                        {active.selectedSongs.map((s) => {
                          const checked = !!active.songChecklist?.[s.id];
                          return (
                            <li key={s.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(ev) => {
                                  setSongChecked(active.id, s.id, ev.target.checked);
                                }}
                              />
                              <span>{s.title}{s.artist ? ` — ${s.artist}` : ""}</span>
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
              {!(active.eventFlow && active.eventFlow.length) && !(active.attachments && active.attachments.length) ? (
                <EmptyState title="No proceedings" message="No event flow steps or files attached." />
              ) : (
                <>
                  {active.eventFlow && active.eventFlow.length > 0 && (
                    <div>
                      <ol className="list-decimal pl-5">
                        {active.eventFlow.map((st, idx) => (
                          <li key={idx}>
                            <span className="font-medium capitalize">{st.type}</span>
                            {st.label ? `: ${st.label}` : ""}
                            {st.type === "song" && st.songId
                              ? (() => {
                                const song = (active.selectedSongs || []).find((s) => s.id === st.songId);
                                return song ? ` — ${song.title}` : "";
                              })()
                              : ""}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {active.attachments.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer">Attachments ({active.attachments.length})</summary>
                      <ul className="list-disc pl-5 mt-1">
                        {active.attachments.map((a) => (
                          <li key={a.id}>
                            <a href={a.dataUrl} download={a.name} className="underline">
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
              {active.notes.length === 0 ? (
                <EmptyState title="No notes yet" message="Add a note for internal collaboration." />
              ) : (
                <ul className="space-y-3">
                  {active.notes.map((n) => (
                    <li key={n.id} className="text-sm">
                      <div className="text-foreground/60">{new Date(n.createdAt).toLocaleString()}</div>
                      <div className="mt-0.5">{n.message}</div>
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

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // FINAL RENDER
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-8 flex flex-1 min-h-0">
      {/* Sidebar */}
      <aside className="w-48 shrink-0 pl-4">
        <div className="text-2xl font-semibold mb-4">Admin</div>
        <div className="space-y-2 text-sm">
          <button
            className={`w-full text-left rounded-md px-2 py-1 ${tab === "requests" ? "bg-foreground/10" : "hover:bg-foreground/5"}`}
            onClick={() => setTab("requests")}
          >
            Requests
          </button>
          <button
            className={`w-full text-left rounded-md px-2 py-1 ${tab === "equipment" ? "bg-foreground/10" : "hover:bg-foreground/5"}`}
            onClick={() => setTab("equipment")}
          >
            Equipment
          </button>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 flex flex-col min-w-0">
        {tab === "requests" ? (
          <>
            <div className="w-full px-4 text-2xl font-semibold mb-4">Requests</div>
            <KanbanBoard
              items={items}
              statuses={columns}
              updateStatus={updateStatus}
              setActive={setActive}
            />
          </>
        ) : (
          <>
            <div className="w-full px-4 text-2xl font-semibold mb-4">Equipment Catalog</div>
            <EquipmentCatalogPanel
              items={items}
              setActive={setActive}
            />
          </>
        )}

        {/* Details sheet stays available for both tabs */}
        <DetailsSheet />
      </section>
    </div>
  );

}