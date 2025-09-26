"use client";
import { useRequestsListController } from "@/features/requests/useRequestsListController";
import FilterForm from "./components/filter-form";
import KanbanBoard from "./components/kanban-board";
import DetailsSheet from "./components/details-sheet";
import FilterSheet from "./components/filter-sheet";
import SortSheet from "./components/sort-sheet";
import { statusColor } from "./types";



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
  // FINAL RENDER
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-8 flex flex-col flex-1 min-h-0">
      <h1 className="w-full max-w-7xl mx-auto px-4 text-2xl font-semibold mb-4">All Requests</h1>
      {/* Filter Form */}
      <FilterForm
        query={q}
        setQuery={setQ}
        setFilterOpen={setFilterOpen}
        setSortOpen={setSortOpen} />

      {/* Kanban Board */}
      <KanbanBoard
        items={items}
        statuses={orderedStatuses}
        compare={compare}
        setActive={setActive} />

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
      <SortSheet
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        sortRules={sortRules}
        setSortRules={setSortRules}
        resetSorts={resetSorts}
      />

      {/* Details Sheet */}
      <DetailsSheet
        active={active}
        setActive={setActive}
        statusColor={statusColor} />
    </div>
  );
}
