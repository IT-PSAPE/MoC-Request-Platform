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
  const [typeFilter, setTypeFilter] = useState<RequestType | null>(null);
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
        equipment:request_equipment(*, equipment(*)),
        song:request_song(*, song(*)),
        venue:request_venue(*, venue(*))
      `);

    data.then((res) => {
      if (res.error) {
        console.error("Failed to load requests", res.error);
      } else {

        const requests = res.data.map((request) => ({
          id: request.id as string,
          who: request.who as string,
          what: request.what as string,
          when: request.when as string,
          where: request.where as string,
          why: request.why as string,
          how: request.how as string,
          info: request.info as string,
          due: request.due as string,
          flow: request.flow as string[],
          created_at: request.created_at as string,
          // @ts-ignore
          priority: request.priority as Priority,
          // @ts-ignore
          status: request.status as Status,
          // @ts-ignore
          type: request.type as RequestType,
          attachment: request.attachment as Attachment[],
          note: request.note as Note[],
          equipment: request.equipment,
          song: request.song,
          venue: request.venue,
        }));

        // @ts-ignore
        setRequests(requests);
      }
    });

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

      const matchPriority = priorityFilter === null ? true : request.priority === priorityFilter;
      const matchKind = typeFilter === null ? true : (request.type ?? "") === typeFilter;
      const dueMs = request.due ? new Date(request.due).getTime() : null;
      const matchDueStart = startMs !== null ? (dueMs !== null && dueMs >= startMs) : true;
      const matchDueEnd = endMs !== null ? (dueMs !== null && dueMs <= endMs) : true;

      console.log("Request:", request);
      console.log("Match Q:", matchQ);
      console.log("Match Priority:", matchPriority);
      console.log("Match Kind:", matchKind);
      console.log("Match Due Start:", matchDueStart);
      console.log("Match Due End:", matchDueEnd);

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
