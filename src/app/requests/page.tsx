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
import FilterSheet from "./components/filter-sheet";

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
      <FilterSheet
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        kindFilter={kindFilter}
        setKindFilter={setKindFilter}
        dueStart={dueStart}
        setDueStart={setDueStart}
        dueEnd={dueEnd}
        setDueEnd={setDueEnd}
        resetFilters={resetFilters}
      />

      {/* Sort Sheet */}
      <SortSheet />

      {/* Details Sheet */}
      <DetailsSheet active={active} setActive={setActive} statusColor={statusColor} />
    </div>
  );
}
