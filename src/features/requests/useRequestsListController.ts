"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { RequestItem, RequestKind, RequestPriority, RequestStatus } from "@/types/request";
import { RequestService } from "@/features/requests/service";

export type SortKey = "createdAt" | "dueAt" | "priority";
export type SortRule = { key: SortKey; dir: "asc" | "desc"; enabled: boolean };

const DEFAULT_SORT_RULES: ReadonlyArray<SortRule> = [
  { key: "createdAt", dir: "desc", enabled: true },
  { key: "dueAt", dir: "asc", enabled: false },
  { key: "priority", dir: "desc", enabled: false },
] as const;

const PRIORITY_ORDER: Readonly<Record<RequestPriority, number>> = { low: 0, medium: 1, high: 2, urgent: 3 } as const;

export function useRequestsListController() {
  // Data
  const [items, setItems] = useState<RequestItem[]>([]);

  // Search
  const [q, setQ] = useState("");

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<"all" | RequestPriority>("all");
  const [kindFilter, setKindFilter] = useState<"all" | RequestKind>("all");
  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");

  // Sort
  const [sortRules, setSortRules] = useState<SortRule[]>([...DEFAULT_SORT_RULES]);

  // UI sheets
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [active, setActive] = useState<RequestItem | null>(null);

  // Load
  useEffect(() => setItems(RequestService.list()), []);

  // Derived: filtered
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const startMs = dueStart ? new Date(dueStart).getTime() : null;
    const endMs = dueEnd ? new Date(dueEnd).getTime() : null;
    return items.filter((i) => {
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

      const matchPriority = priorityFilter === "all" ? true : i.priority === priorityFilter;
      const matchKind = kindFilter === "all" ? true : (i.kind ?? "") === kindFilter;
      const dueMs = i.dueAt ? new Date(i.dueAt).getTime() : null;
      const matchDueStart = startMs !== null ? (dueMs !== null && dueMs >= startMs) : true;
      const matchDueEnd = endMs !== null ? (dueMs !== null && dueMs <= endMs) : true;

      return matchQ && matchPriority && matchKind && matchDueStart && matchDueEnd;
    });
  }, [items, q, priorityFilter, kindFilter, dueStart, dueEnd]);

  // Derived: grouped
  const grouped = useMemo(() => {
    const g: Record<RequestStatus, RequestItem[]> = {
      not_started: [],
      pending: [],
      in_progress: [],
      completed: [],
      dropped: [],
    };
    filtered.forEach((i) => g[i.status].push(i));
    return g;
  }, [filtered]);

  // Derived: comparator
  const compare = useCallback((a: RequestItem, b: RequestItem) => {
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
        av = PRIORITY_ORDER[a.priority];
        bv = PRIORITY_ORDER[b.priority];
      }
      const diff = av - bv;
      if (diff !== 0) return rule.dir === "asc" ? diff : -diff;
    }
    return 0;
  }, [sortRules]);

  // Reset helpers
  const resetFilters = useCallback(() => {
    setPriorityFilter("all");
    setKindFilter("all");
    setDueStart("");
    setDueEnd("");
  }, []);
  const resetSorts = useCallback(() => setSortRules([...(DEFAULT_SORT_RULES as SortRule[])]), []);

  // Status order for UI
  const orderedStatuses: { key: RequestStatus; title: string }[] = [
    { key: "not_started", title: "Not Started" },
    { key: "pending", title: "Pending" },
    { key: "in_progress", title: "In Progress" },
    { key: "completed", title: "Completed" },
    { key: "dropped", title: "Dropped" },
  ];

  return {
    // data
    items,
    filtered,
    grouped,

    // selection
    active,
    setActive,

    // query
    q,
    setQ,

    // filters
    priorityFilter,
    setPriorityFilter,
    kindFilter,
    setKindFilter,
    dueStart,
    setDueStart,
    dueEnd,
    setDueEnd,
    resetFilters,

    // sort
    sortRules,
    setSortRules,
    resetSorts,
    compare,

    // UI sheets
    filterOpen,
    setFilterOpen,
    sortOpen,
    setSortOpen,

    // UI helpers
    orderedStatuses,
  } as const;
}
