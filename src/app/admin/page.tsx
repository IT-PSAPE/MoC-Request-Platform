"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { RequestItem, RequestStatus } from "@/types/request";
import Sheet from "@/components/ui/Sheet";
import ScrollArea from "@/components/ui/ScrollArea";
import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";
import { useAdminController } from "@/features/admin/useAdminController";

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
    login,
    updateStatus,
    addNote,
    setEquipmentChecked,
    setSongChecked,
    refreshActive,
  } = useAdminController();

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card title="Admin Login">
          <LoginForm onLogin={login} />
        </Card>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // RENDER FUNCTION
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  function KanbanBoard({ items, statuses }: { items: RequestItem[]; statuses: { key: RequestStatus; title: string }[] }) {
    return (
      <ScrollArea className="max-w-full flex-1 min-h-0">
        <div className="flex gap-4 pb-2 pr-2 px-4 h-full">
          {statuses.map((col) => (
            <div key={col.key} className="min-w-64 flex-1 h-full flex flex-col">
              <div className="text-sm font-medium mb-2">{col.title}</div>
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
    <div className="py-8 flex flex-col flex-1 min-h-0">
      <h1 className="w-full max-w-7xl mx-auto px-4 text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Kanban area fills remaining space */}
      <KanbanBoard items={items} statuses={columns} />

      {/* Details sheet */}
      <DetailsSheet />
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(password);
      }}
      className="space-y-3"
    >
      <p className="text-sm text-foreground/70">Demo-only authentication. Use password: <code>admin</code>.</p>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm focus:outline-none"
      />
      <Button type="submit">Login</Button>
    </form>
  );
}

function AddNote({ onAdd }: { onAdd: (message: string) => void }) {
  const [message, setMessage] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onAdd(message.trim());
        setMessage("");
      }}
      className="space-y-2"
    >
      <Textarea
        placeholder="Add a note for the team..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" variant="secondary" className="w-full">
        Add Note
      </Button>
    </form>
  );
}
