"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDefualtContext } from "@/components/providers/defualt-provider";

export function useAdminController() {
  const defualtContext = useDefualtContext();

  // start as `null` so consumers can tell "not yet checked" vs false
  const [items, setItems] = useState<FetchRequest[]>([]);
  const [active, setActive] = useState<FetchRequest | null>(null);

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

        console.log(requests);

        setItems(requests);
      }
    });

  }, []);

  const refreshItems = useCallback(() => {
    // setItems(RequestService.list());
  }, []);

  const refreshActive = useCallback(() => {
    // setActive((prev) => (prev ? { ...RequestService.get(prev.id)! } : prev));
  }, []);

  const updateStatus = useCallback((id: string, status: Status) => {
    // RequestService.updateStatus(id, status);
    refreshItems();
  }, [refreshItems]);

  const addNote = useCallback((id: string, message: string) => {
    // RequestService.addNote(id, message);
    refreshItems();
    // setActive((prev) => (prev && prev.id === id ? { ...RequestService.get(id)! } : prev));
  }, [refreshItems]);

  const setEquipmentChecked = useCallback((requestId: string, equipmentId: string, checked: boolean) => {
    // const current = RequestService.get(requestId);
    // const prev = !!current?.equipmentChecklist?.[equipmentId];
    // const next = { ...(current?.equipmentChecklist || {}) };
    // next[equipmentId] = checked;
    // RequestService.updateEquipmentChecklist(requestId, next);
    // Determine requested quantity for this equipment in the request
    // const reqQty = (() => {
    //   const item = current?.selectedEquipment?.find((e) => e.id === equipmentId);
    //   const q = item && typeof item.quantity === "number" ? Math.max(1, Math.floor(item.quantity)) : 1;
    //   return q;
    // })();
    // // Apply inventory adjustment only on change
    // if (checked !== prev) {
    //   if (checked) EquipmentStore.adjustQuantity(equipmentId, -reqQty);
    //   else EquipmentStore.adjustQuantity(equipmentId, +reqQty);
    // }
    // setActive({ ...RequestService.get(requestId)! });
  }, []);

  const setSongChecked = useCallback((requestId: string, songId: string, checked: boolean) => {
    // const current = RequestService.get(requestId);
    // const next = { ...(current?.songChecklist || {}) };
    // next[songId] = checked;
    // RequestService.updateSongChecklist(requestId, next);
    // setActive({ ...RequestService.get(requestId)! });
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
