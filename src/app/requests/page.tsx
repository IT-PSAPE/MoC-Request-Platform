"use client";

import { useRequestsListController } from "@/features/requests/useRequestsListController";

import FilterForm from "./components/filter-form";
import KanbanBoard from "./components/kanban-board";
import DetailsSheet from "./components/details-sheet";
import FilterSheet from "./components/filter-sheet";
import SortSheet from "./components/sort-sheet";

export default function RequestsPage() {
  const controller = useRequestsListController();

  return (
    <div className="py-8 flex flex-col flex-1 min-h-0">
      <h1 className="w-full max-w-7xl mx-auto px-4 text-2xl font-semibold mb-4">All Requests</h1>
      {/* Filter Form */}
      <FilterForm
        query={controller.q}
        setQuery={controller.setQ}
        setFilterOpen={controller.setFilterOpen}
        setSortOpen={controller.setSortOpen} />

      {/* Kanban Board */}
      <KanbanBoard
        items={controller.items}
        statuses={controller.orderedStatuses}
        compare={controller.compare}
        setActive={controller.setActive} />

      {/* Filter Sheet */}
      <FilterSheet
        filterOpen={controller.filterOpen}
        setFilterOpen={controller.setFilterOpen}
        priorityFilter={controller.priorityFilter}
        setPriorityFilter={controller.setPriorityFilter}
        kindFilter={controller.kindFilter}
        setKindFilter={controller.setKindFilter}
        dueStart={controller.dueStart}
        setDueStart={controller.setDueStart}
        dueEnd={controller.dueEnd}
        setDueEnd={controller.setDueEnd}
        resetFilters={controller.resetFilters}
      />

      {/* Sort Sheet */}
      <SortSheet
        sortOpen={controller.sortOpen}
        setSortOpen={controller.setSortOpen}
        sortRules={controller.sortRules}
        setSortRules={controller.setSortRules}
        resetSorts={controller.resetSorts}
      />

      {/* Details Sheet */}
      <DetailsSheet
        active={controller.active}
        setActive={controller.setActive} />
    </div>
  );
}
