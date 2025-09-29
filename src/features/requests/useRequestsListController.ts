"use client";
import { useDefualtContext } from "@/components/providers/defualt-provider";
import { useCallback, useEffect, useMemo, useState } from "react";

export type SortKey = "createdAt" | "dueAt" | "priority";
export type SortRule = { key: SortKey; dir: "asc" | "desc"; enabled: boolean };

const DEFAULT_SORT_RULES: ReadonlyArray<SortRule> = [
  { key: "createdAt", dir: "desc", enabled: true },
  { key: "dueAt", dir: "asc", enabled: false },
  { key: "priority", dir: "desc", enabled: false },
] as const;

export function useRequestsListController() {
  // Data
  const [requests, setRequests] = useState<FetchRequest[]>([]);

  // Search
  const [query, setQuery] = useState("");

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [kindFilter, setKindFilter] = useState<RequestType | null>(null);
  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");

  // Sort
  const [sortRules, setSortRules] = useState<SortRule[]>([...DEFAULT_SORT_RULES]);

  // UI sheets
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [active, setActive] = useState<FetchRequest | null>(null);

  const defualtContext = useDefualtContext();

  // Load
  useEffect(() => {
    const data = defualtContext.supabase.from("request").select(
      ` id,
        who,
        what,
        when,
        where,
        why,
        how,
        info,
        due,
        flow,
        created_at,
        priority(*),
        status(*),
        type(*),
        attachment(*),
        note(*),
        equipment:request_equipment(equipment(*)),
        song:request_song(song(*)),
        venue:request_venue(venue(*))
      `);

    data.then((res) => {
      if (res.error) {
        console.error("Failed to load requests", res.error);
      } else {
        setRequests(res.data);
      }
    });

  }, []);

  // Derived: filtered
  const filtered = useMemo(() => {
    const ql = query.trim().toLowerCase();
    const startMs = dueStart ? new Date(dueStart).getTime() : null;
    const endMs = dueEnd ? new Date(dueEnd).getTime() : null;

    return requests.filter((request) => {
      const equipmentNames = (request.equipment || []).map((e) => e.name).join(" ");

      const songText = (request.song || []).map((s) => `${s.name}`).join(" ");

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

      const matchPriority = priorityFilter === null ? true : request.priority === priorityFilter;
      const matchKind = kindFilter === null ? true : (request.type ?? "") === kindFilter;
      const dueMs = request.due ? new Date(request.due).getTime() : null;
      const matchDueStart = startMs !== null ? (dueMs !== null && dueMs >= startMs) : true;
      const matchDueEnd = endMs !== null ? (dueMs !== null && dueMs <= endMs) : true;

      return matchQ && matchPriority && matchKind && matchDueStart && matchDueEnd;
    });
  }, [requests, query, priorityFilter, kindFilter, dueStart, dueEnd]);

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
    setKindFilter(null);
    setDueStart("");
    setDueEnd("");
  }, []);
  const resetSorts = useCallback(() => setSortRules([...(DEFAULT_SORT_RULES as SortRule[])]), []);

  // Status order for UI
  const orderedStatuses: Status[] = [
    { id: "not_started", name: "Not Started", value: 0 },
    { id: "pending", name: "Pending", value: 1 },
    { id: "in_progress", name: "In Progress", value: 2 },
    { id: "completed", name: "Completed", value: 3 },
    { id: "dropped", name: "Dropped", value: 4 },
  ];

  return {
    // data
    requests,
    filtered,
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
    typeFilter: kindFilter,
    setTypeFilter: setKindFilter,
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
