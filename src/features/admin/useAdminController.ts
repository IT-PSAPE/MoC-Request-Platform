"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Auth } from "@/features/auth/auth";
import { RequestService } from "@/features/requests/service";
import type { RequestItem, RequestStatus } from "@/types/request";

export function useAdminController() {
  // start as `null` so consumers can tell "not yet checked" vs false
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [active, setActive] = useState<RequestItem | null>(null);

  // Initialize auth state
  useEffect(() => {
    setAuthed(Auth.isAuthed());
  }, []);

  // Load requests when authed changes
  useEffect(() => {
    if (authed) {
      setItems(RequestService.list());
    }
  }, [authed]);

  const refreshItems = useCallback(() => {
    setItems(RequestService.list());
  }, []);

  const refreshActive = useCallback(() => {
    setActive((prev) => (prev ? { ...RequestService.get(prev.id)! } : prev));
  }, []);

  const login = useCallback((password: string) => {
    const ok = Auth.login(password);
    if (ok) setAuthed(true);
    else alert("Invalid password (hint: 'admin' for demo)");
  }, []);

  const updateStatus = useCallback((id: string, status: RequestStatus) => {
    RequestService.updateStatus(id, status);
    refreshItems();
  }, [refreshItems]);

  const addNote = useCallback((id: string, message: string) => {
    RequestService.addNote(id, message);
    refreshItems();
    setActive((prev) => (prev && prev.id === id ? { ...RequestService.get(id)! } : prev));
  }, [refreshItems]);

  const setEquipmentChecked = useCallback((requestId: string, equipmentId: string, checked: boolean) => {
    const current = RequestService.get(requestId);
    const next = { ...(current?.equipmentChecklist || {}) };
    next[equipmentId] = checked;
    RequestService.updateEquipmentChecklist(requestId, next);
    setActive({ ...RequestService.get(requestId)! });
  }, []);

  const setSongChecked = useCallback((requestId: string, songId: string, checked: boolean) => {
    const current = RequestService.get(requestId);
    const next = { ...(current?.songChecklist || {}) };
    next[songId] = checked;
    RequestService.updateSongChecklist(requestId, next);
    setActive({ ...RequestService.get(requestId)! });
  }, []);

  const grouped = useMemo(() => {
    const g: Record<RequestStatus, RequestItem[]> = {
      not_started: [],
      pending: [],
      in_progress: [],
      completed: [],
      dropped: [],
    };
    items.forEach((i) => g[i.status].push(i));
    return g;
  }, [items]);

  return {
    // state
    authed,
    items,
    active,

    // setters
    setActive,

    // actions
    login,
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
