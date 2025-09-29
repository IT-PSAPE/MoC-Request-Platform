"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDefualtContext } from "@/components/providers/defualt-provider";
import RequestService from "../requests/request-service";

export function useAdminController() {
  const defualtContext = useDefualtContext();
  const service = RequestService;

  // start as `null` so consumers can tell "not yet checked" vs false
  const [items, setItems] = useState<FetchRequest[]>([]);
  const [active, setActive] = useState<FetchRequest | null>(null);

  // Load
  useEffect(() => {
    service.list(defualtContext.supabase).then((res) => setItems(res));
  }, []);

  const refreshItems = useCallback(() => {
    service.list(defualtContext.supabase).then((res) => setItems(res));
  }, []);

  const refreshActive = useCallback(async () => {
    if (active) setActive(await service.get(defualtContext.supabase, active.id));
  }, [active]);

  const updateStatus = useCallback((id: string, status: Status) => {
    service.updateStatus(defualtContext.supabase, id, status).then(() => refreshItems());
  }, [refreshItems]);

  const addNote = useCallback(async (id: string, note: string) => {
    service.addNote(defualtContext.supabase, id, note).then(() => { refreshItems(); refreshActive(); });
  }, [refreshItems, refreshActive]);

  const setEquipmentChecked = useCallback((requestId: string, equipmentId: string, checked: boolean) => {

  }, []);

  const setSongChecked = useCallback((requestId: string, songId: string, checked: boolean) => {

  }, []);

  const grouped = useMemo(() => {
    const g: Record<number, FetchRequest[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    items.forEach((request) => g[request.status.value].push(request));

    return g;
  }, [items]);

  return {
    // state
    items,
    active,

    // setters
    setActive,

    // actions
    updateStatus,
    addNote,
    setEquipmentChecked,
    setSongChecked,

    // helpers
    refreshItems,
    refreshActive,
    grouped,
  } as const;
}
