"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ScrollArea from "@/components/ui/ScrollArea";
import Divider from "@/components/ui/Divider";
import Sheet from "@/components/ui/Sheet";
import EmptyState from "@/components/ui/EmptyState";
import { RequestItem, RequestStatus, RequestPriority, RequestKind } from "@/types/request";
import { RequestStore } from "@/lib/store";
import RequestCard from "@/components/ui/RequestCard";
import Switch from "@/components/ui/Switch";

const statusColor: Record<RequestStatus, "gray" | "blue" | "yellow" | "green" | "red"> = {
  not_started: "gray",
  pending: "blue",
  in_progress: "yellow",
  completed: "green",
  dropped: "red",
};

export default function RequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [q, setQ] = useState("");
  // Filters & sorting
  const [priorityFilter, setPriorityFilter] = useState<"all" | RequestPriority>("all");
  const [kindFilter, setKindFilter] = useState<"all" | RequestKind>("all");
  const [dueStart, setDueStart] = useState(""); // ISO from input type=datetime-local
  const [dueEnd, setDueEnd] = useState("");
  // Compound sort rules
  type SortKey = "createdAt" | "dueAt" | "priority";
  type SortRule = { key: SortKey; dir: "asc" | "desc"; enabled: boolean };
  const [sortRules, setSortRules] = useState<SortRule[]>([
    { key: "createdAt", dir: "desc", enabled: true },
    { key: "dueAt", dir: "asc", enabled: false },
    { key: "priority", dir: "desc", enabled: false },
  ]);
  // Sheets
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [active, setActive] = useState<RequestItem | null>(null);

  // Reset handlers
  const resetFilters = () => {
    setPriorityFilter("all");
    setKindFilter("all");
    setDueStart("");
    setDueEnd("");
  };
  const defaultSortRules: SortRule[] = [
    { key: "createdAt", dir: "desc", enabled: true },
    { key: "dueAt", dir: "asc", enabled: false },
    { key: "priority", dir: "desc", enabled: false },
  ];
  const resetSorts = () => setSortRules(defaultSortRules);

  useEffect(() => setItems(RequestStore.list()), []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const startMs = dueStart ? new Date(dueStart).getTime() : null;
    const endMs = dueEnd ? new Date(dueEnd).getTime() : null;
    return items.filter((i) => {
      // Build a search haystack including ID and user-entered fields
      const equipmentNames = (i.selectedEquipment || []).map((e) => e.name).join(" ");
      const songText = (i.selectedSongs || []).map((s) => `${s.title} ${s.artist ?? ""}`).join(" ");
      const haystack = [
        i.id,
        i.who,
        i.what,
        i.where,
        i.why,
        i.how,
        i.additionalInfo ?? "",
        i.priority,
        i.status,
        i.kind ?? "",
        i.createdAt,
        i.updatedAt,
        i.dueAt ?? "",
        equipmentNames,
        songText,
      ]
        .join(" ")
        .toLowerCase();
      const matchQ = ql ? haystack.includes(ql) : true;

      // Priority filter
      const matchPriority = priorityFilter === "all" ? true : i.priority === priorityFilter;
      // Kind filter
      const matchKind = kindFilter === "all" ? true : (i.kind ?? "") === kindFilter;
      // Due date range filter (inclusive)
      const dueMs = i.dueAt ? new Date(i.dueAt).getTime() : null;
      const matchDueStart = startMs !== null ? (dueMs !== null && dueMs >= startMs) : true;
      const matchDueEnd = endMs !== null ? (dueMs !== null && dueMs <= endMs) : true;

      return matchQ && matchPriority && matchKind && matchDueStart && matchDueEnd;
    });
  }, [items, q, priorityFilter, kindFilter, dueStart, dueEnd]);

  const orderedStatuses: { key: RequestStatus; title: string }[] = [
    { key: "not_started", title: "Not Started" },
    { key: "pending", title: "Pending" },
    { key: "in_progress", title: "In Progress" },
    { key: "completed", title: "Completed" },
    { key: "dropped", title: "Dropped" },
  ];

  const grouped = useMemo(() => {
    const g: Record<RequestStatus, RequestItem[]> = {
      not_started: [],
      pending: [],
      in_progress: [],
      completed: [],
      dropped: [],
    } as any;
    filtered.forEach((i) => g[i.status].push(i));
    return g;
  }, [filtered]);

  // Sorting comparator (used for cards within each status column)
  const priorityOrder: Record<RequestPriority, number> = { low: 0, medium: 1, high: 2, urgent: 3 };
  const compare = (a: RequestItem, b: RequestItem) => {
    for (const rule of sortRules) {
      if (!rule.enabled) continue;
      let av = 0, bv = 0;
      if (rule.key === "createdAt") {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      } else if (rule.key === "dueAt") {
        av = a.dueAt ? new Date(a.dueAt).getTime() : 0;
        bv = b.dueAt ? new Date(b.dueAt).getTime() : 0;
      } else if (rule.key === "priority") {
        av = priorityOrder[a.priority];
        bv = priorityOrder[b.priority];
      }
      const diff = av - bv;
      if (diff !== 0) return rule.dir === "asc" ? diff : -diff;
    }
    return 0;
  };

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // RENDER FUNCTION
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  function FilterForm() {
    return (
      <form className="w-full max-w-7xl px-4 mx-auto flex items-center gap-3 mb-6">
        <Input
          placeholder="Search by ID, name, details..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mr-auto w-full max-w-sm"
        />
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setFilterOpen(true)}>Filter</Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setSortOpen(true)}>Sort</Button>
        </div>
      </form>
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
              <Badge color={statusColor[active.status]}>{active.status.replace(/_/g, " ")}</Badge>
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
            {/* Request Items */}
            <div>
              <h3 className="text-base font-semibold mb-3">Request Items</h3>
              {!(active.selectedEquipment && active.selectedEquipment.length) && !(active.selectedSongs && active.selectedSongs.length) ? (
                <EmptyState title="No request items" message="No equipment or songs were specified." />
              ) : (
                <>
                  {active.selectedEquipment && active.selectedEquipment.length > 0 && (
                    <div>
                      <div className="text-xs text-foreground/60">Equipment</div>
                      <ul className="list-disc pl-5">
                        {active.selectedEquipment.map((e) => (
                          <li key={e.id}>{e.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {active.selectedSongs && active.selectedSongs.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-foreground/60">Songs</div>
                      <ul className="list-disc pl-5">
                        {active.selectedSongs.map((s) => (
                          <li key={s.id}>{s.title}{s.artist ? ` — ${s.artist}` : ""}</li>
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
          </div>
        )}
      </Sheet>
    )
  }

  function FilterSheet() {
    return (
      <Sheet open={filterOpen} onOpenChange={setFilterOpen} title="Filters" width={420}>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-foreground/60 mb-1">Priority</div>
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div>
            <div className="text-xs text-foreground/60 mb-1">Type</div>
            <Select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="event">Event</option>
              <option value="video_editing">Video Editing</option>
              <option value="video_filming_editing">Video Filming + Editing</option>
              <option value="equipment">Equipment</option>
              <option value="design_flyer">Design: Flyer</option>
              <option value="design_special">Design: Special</option>
            </Select>
          </div>
          <div>
            <div className="text-xs text-foreground/60 mb-1">Date Range (Due)</div>
            <div className="flex gap-2">
              <Input type="datetime-local" value={dueStart} onChange={(e) => setDueStart(e.target.value)} />
              <Input type="datetime-local" value={dueEnd} onChange={(e) => setDueEnd(e.target.value)} />
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between gap-2">
            <Button type="button" size="sm" className="w-full" variant="secondary" onClick={resetFilters}>Reset Filters</Button>
            <Button type="button" size="sm" className="w-full" onClick={() => setFilterOpen(false)}>Apply Filters</Button>
          </div>
        </div>
      </Sheet>
    )
  }

  function SortSheet() {
    return (
      <Sheet open={sortOpen} onOpenChange={setSortOpen} title="Sort" width={420}>
        <div className="space-y-4 text-sm">
          {sortRules.map((rule, idx) => (
            <div key={rule.key} className="flex items-center justify-between gap-2">
              <div className="font-medium capitalize">{rule.key === "createdAt" ? "Created" : rule.key === "dueAt" ? "Due" : "Priority"}</div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(v) => setSortRules((rs) => rs.map((r, i) => i === idx ? { ...r, enabled: v } : r))}
                  aria-label={`Toggle ${rule.key} sort`}
                />
                <Select value={rule.dir} onChange={(e) => setSortRules((rs) => rs.map((r, i) => i === idx ? { ...r, dir: e.target.value as any } : r))}>
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </Select>
              </div>
            </div>
          ))}
          <div className="pt-2 flex items-center justify-between gap-2">
            <Button type="button" size="sm" className="w-full" variant="secondary" onClick={resetSorts}>Reset Sort</Button>
            <Button type="button" size="sm" className="w-full" onClick={() => setSortOpen(false)}>Apply Sort</Button>
          </div>
        </div>
      </Sheet>
    )
  }

  function KanbanBoard({ items, statuses }: { items: RequestItem[]; statuses: { key: RequestStatus; title: string }[] }) {
    return (
      <ScrollArea className="max-w-full flex-1 min-h-0">
        <div className="flex gap-4 pb-2 pr-2 px-4">
          {statuses.map((col) => (
            <div key={col.key} className="min-w-64 flex-1">
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

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // FINAL RENDER
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-8 flex flex-col flex-1 min-h-0">
      <h1 className="w-full max-w-7xl mx-auto px-4 text-2xl font-semibold mb-4">All Requests</h1>
      {/* Filter Form */}
      <FilterForm />

      {/* Kanban Board */}
      <KanbanBoard items={items} statuses={orderedStatuses} />

      {/* Filter Sheet */}
      <FilterSheet />

      {/* Sort Sheet */}
      <SortSheet />

      {/* Details Sheet */}
      <DetailsSheet />
    </div>
  );
}
