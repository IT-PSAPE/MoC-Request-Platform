"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDefaultContext } from "@/components/providers/default-provider";
import RequestService from "../requests/request-service";
import { RequestEquipmentTable, RequestSongTable } from "@/lib/database";

export function useAdminController() {
  const defaultContext = useDefaultContext();
  const service = RequestService;

  // start as `null` so consumers can tell "not yet checked" vs false
  const [items, setItems] = useState<FetchRequest[]>([]);
  const [active, setActive] = useState<FetchRequest | null>(null);

  // Load
  useEffect(() => {
    const req = service.list(defaultContext.supabase)
    
    req.then((res) => setItems(res));
  }, [service, defaultContext.supabase]);

  const refreshItems = useCallback(() => {
    const req = service.list(defaultContext.supabase)
    
    req.then((res) => setItems(res));
  }, [service, defaultContext.supabase]);

  const refreshActive = useCallback(async () => {
    if (active) setActive(await service.get(defaultContext.supabase, active.id));
  }, [active, defaultContext.supabase, service]);

  const updateStatus = useCallback((id: string, status: Status) => {
    const req = service.updateStatus(defaultContext.supabase, id, status)
    
    req.then(() => refreshItems());
  }, [refreshItems, defaultContext.supabase, service]);

  const addNote = useCallback(async (id: string, note: string) => {
    const req = service.addNote(defaultContext.supabase, id, note)
    
    req.then(() => { refreshItems(); refreshActive(); });
  }, [refreshItems, refreshActive, defaultContext.supabase, service]);

  const setEquipmentChecked = useCallback((requestId: string, equipmentId: string, checked: boolean) => {
    const req = RequestEquipmentTable.update(defaultContext.supabase, requestId, equipmentId, { approved: checked })
    
    req.then(() => { refreshItems(); refreshActive(); });
  }, [defaultContext.supabase, refreshActive, refreshItems]);

  const setSongChecked = useCallback((requestId: string, songId: string, checked: boolean) => {
    const req = RequestSongTable.update(defaultContext.supabase, requestId, songId, { available: checked })
    
    req.then(() => { refreshItems(); refreshActive(); });
  }, [defaultContext.supabase, refreshActive, refreshItems]);

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
