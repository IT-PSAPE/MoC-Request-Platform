"use client";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ScrollArea from "@/components/ui/ScrollArea";
import Sheet from "@/components/ui/Sheet";
import EmptyState from "@/components/ui/EmptyState";
import { RequestItem, RequestStatus } from "@/types/request";
import RequestCard from "@/components/ui/RequestCard";
import Switch from "@/components/ui/Switch";
import { useRequestsListController } from "@/features/requests/useRequestsListController";
import FilterForm from "./components/filter-form";
import KanbanBoard from "./components/kanban-board";
import DetailsSheet from "./components/details-sheet";

const statusColor: Record<RequestStatus, "gray" | "blue" | "yellow" | "green" | "red"> = {
  not_started: "gray",
  pending: "blue",
  in_progress: "yellow",
  completed: "green",
  dropped: "red",
};

export default function RequestsPage() {
  const {
    items,
    active,
    setActive,
    q,
    setQ,
    priorityFilter,
    setPriorityFilter,
    kindFilter,
    setKindFilter,
    dueStart,
    setDueStart,
    dueEnd,
    setDueEnd,
    resetFilters,
    sortRules,
    setSortRules,
    resetSorts,
    compare,
    filterOpen,
    setFilterOpen,
    sortOpen,
    setSortOpen,
    orderedStatuses,
  } = useRequestsListController();

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // RENDER FUNCTION
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  function FilterSheet() {
    return (
      <Sheet open={filterOpen} onOpenChange={setFilterOpen} title="Filters" width={420}>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-foreground/60 mb-1">Priority</div>
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}>
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div>
            <div className="text-xs text-foreground/60 mb-1">Type</div>
            <Select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as typeof kindFilter)}>
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
                <Select value={rule.dir} onChange={(e) => setSortRules((rs) => rs.map((r, i) => i === idx ? { ...r, dir: e.target.value as "asc" | "desc" } : r))}>
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

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // FINAL RENDER
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-8 flex flex-col flex-1 min-h-0">
      <h1 className="w-full max-w-7xl mx-auto px-4 text-2xl font-semibold mb-4">All Requests</h1>
      {/* Filter Form */}
      <FilterForm query={q} setQuery={setQ} setFilterOpen={setFilterOpen} setSortOpen={setSortOpen} />

      {/* Kanban Board */}
      <KanbanBoard items={items} statuses={orderedStatuses} compare={compare} setActive={setActive}  />

      {/* Filter Sheet */}
      <FilterSheet />

      {/* Sort Sheet */}
      <SortSheet />

      {/* Details Sheet */}
      <DetailsSheet active={active} setActive={setActive} statusColor={statusColor} />
    </div>
  );
}
