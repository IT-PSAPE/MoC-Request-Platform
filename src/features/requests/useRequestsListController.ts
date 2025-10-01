"use client";
import { useDefaultContext } from "@/components/providers/default-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import RequestService from "./request-service";

export type SortKey = "createdAt" | "dueAt" | "priority";
export type SortRule = { key: SortKey; dir: "asc" | "desc"; enabled: boolean };

const DEFAULT_SORT_RULES: ReadonlyArray<SortRule> = [
  { key: "createdAt", dir: "desc", enabled: true },
  { key: "dueAt", dir: "asc", enabled: false },
  { key: "priority", dir: "desc", enabled: false },
] as const;

export function useRequestsListController() {
  const defaultContext = useDefaultContext();
  const service = RequestService;

  // Data
  const [requests, setRequests] = useState<FetchRequest[]>([]);

  // Search
  const [query, setQuery] = useState("");

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [typeFilter, setTypeFilter] = useState<RequestType | null>(null);
  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");

  // Sort
  const [sortRules, setSortRules] = useState<SortRule[]>([...DEFAULT_SORT_RULES]);

  // UI sheets
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [active, setActive] = useState<FetchRequest | null>(null);

  // Load
  useEffect(() => {
    service.list(defaultContext.supabase).then((res) => setRequests(res));
  }, []);

  // Derived: filtered
  const filtered = useMemo(() => {
    const ql = query.trim().toLowerCase();
    const startMs = dueStart ? new Date(dueStart).getTime() : null;
    const endMs = dueEnd ? new Date(dueEnd).getTime() : null;

    return requests.filter((request) => {
      const equipmentNames = (request.equipment || []).map((e) => e.equipment.name).join(" ");

      const songText = (request.song || []).map((s) => `${s.song.name}`).join(" ");

      const haystack = [
        request.id,
        request.who,
        request.what,
        request.where,
        request.why,
        request.how,
        request.info ?? "",
        request.priority,
        request.status,
        request.type ?? "",
        request.created_at,
        request.due ?? "",
        equipmentNames,
        songText,
      ].join(" ").toLowerCase();

      const matchQ = ql ? haystack.includes(ql) : true;

      const matchPriority = priorityFilter
        ? request.priority?.id === priorityFilter.id
        : true;
      const matchKind = typeFilter
        ? request.type?.id === typeFilter.id
        : true;
      const dueMs = request.due ? new Date(request.due).getTime() : null;
      const matchDueStart = startMs !== null ? (dueMs !== null && dueMs >= startMs) : true;
      const matchDueEnd = endMs !== null ? (dueMs !== null && dueMs <= endMs) : true;

      return matchQ && matchPriority && matchKind && matchDueStart && matchDueEnd;
    });
  }, [requests, query, priorityFilter, typeFilter, dueStart, dueEnd]);

  // Derived: grouped
  const grouped = useMemo(() => {
    const g: Record<number, FetchRequest[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    filtered.forEach((request) => g[request.status.value].push(request));

    return g;
  }, [filtered]);

  // Derived: comparator
  const compare = useCallback((a: FetchRequest, b: FetchRequest) => {
    for (const rule of sortRules) {
      if (!rule.enabled) continue;
      let av = 0, bv = 0;
      if (rule.key === "createdAt") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      } else if (rule.key === "dueAt") {
        av = a.due ? new Date(a.due).getTime() : 0;
        bv = b.due ? new Date(b.due).getTime() : 0;
      } else if (rule.key === "priority") {
        av = a.priority.value;
        bv = b.priority.value;
      }
      const diff = av - bv;
      if (diff !== 0) return rule.dir === "asc" ? diff : -diff;
    }
    return 0;
  }, [sortRules]);

  // Reset helpers
  const resetFilters = useCallback(() => {
    setPriorityFilter(null);
    setTypeFilter(null);
    setDueStart("");
    setDueEnd("");
  }, []);

  const resetSorts = useCallback(() => setSortRules([...(DEFAULT_SORT_RULES as SortRule[])]), []);

  // Status order for UI

  return {
    // data
    grouped,

    // selection
    active,
    setActive,

    // query
    query,
    setQuery,

    // filters
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
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
  } as const;
}
