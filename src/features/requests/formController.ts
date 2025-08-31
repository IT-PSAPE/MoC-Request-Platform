"use client";
import { useMemo, useState, FormEvent } from "react";
import { Attachment, EventFlowStep, RequestItem, RequestKind, SongItem, EquipmentItem, RequestPriority } from "@/types/request";
import { RequestService } from "@/features/requests/service";
import { deadlineRequirementDays } from "@/features/requests/utils";
import { getRandomUUID } from "@/lib/randomuuid";

export function useRequestFormController() {
  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [maxStepReached, setMaxStepReached] = useState<1 | 2 | 3>(1);

  // Core fields (Step 1)
  const [who, setWho] = useState("");
  const [what, setWhat] = useState("");
  const [whenTxt, setWhenTxt] = useState("");
  const [whereTxt, setWhereTxt] = useState("");
  const [why, setWhy] = useState("");
  const [how, setHow] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [priority, setPriority] = useState<RequestPriority>("medium");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Step 2: kind, dueAt, selections
  const [kind, setKind] = useState<RequestKind | "">("");
  const [dueAt, setDueAt] = useState<string>(""); // ISO via datetime-local
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SongItem[]>([]);

  // Step 3: event flow
  const [eventFlow, setEventFlow] = useState<EventFlowStep[]>([]);

  const [submitted, setSubmitted] = useState<string | null>(null);

  const deadlineWarning = useMemo(() => {
    if (!kind || !dueAt) return null as string | null;
    const days = deadlineRequirementDays(kind);
    if (days === 0) return null;
    const now = new Date();
    const due = new Date(dueAt);
    const diffMs = due.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return "Due date is in the past.";
    if (diffDays < days) {
      return `Heads up: ${String(kind).replace(/_/g, " ")} should be requested at least ${days} day(s) in advance.`;
    }
    return null;
  }, [kind, dueAt]);

  function toggleEquipment(ei: { id: string; name: string; available: boolean }) {
    if (!ei.available) return;
    setSelectedEquipment((prev) => {
      const exists = prev.some((x) => x.id === ei.id);
      return exists ? prev.filter((x) => x.id !== ei.id) : [...prev, { id: ei.id, name: ei.name }];
    });
  }

  function toggleSong(si: { id: string; title: string; artist?: string; available: boolean }) {
    if (!si.available) return;
    setSelectedSongs((prev) => {
      const exists = prev.some((x) => x.id === si.id);
      return exists ? prev.filter((x) => x.id !== si.id) : [...prev, { id: si.id, title: si.title, artist: si.artist }];
    });
  }

  function addFlowStep(type: "segment" | "song") {
    const stepObj: EventFlowStep = {
      id: getRandomUUID(),
      order: eventFlow.length + 1,
      type,
      label: type === "segment" ? `Segment ${eventFlow.length + 1}` : `Song ${eventFlow.length + 1}`,
    };
    setEventFlow((prev) => [...prev, stepObj]);
  }

  function updateFlowLabel(id: string, label: string) {
    setEventFlow((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));
  }

  function updateFlowSong(id: string, songId: string) {
    setEventFlow((prev) => prev.map((s) => (s.id === id ? { ...s, songId } : s)));
  }

  function removeFlowStep(id: string) {
    setEventFlow((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
  }

  function validateStep1(): boolean {
    return !!(who && what && whenTxt && whereTxt && why && how);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep1()) {
      alert("Please complete all 5W1H fields.");
      setStep(1);
      return;
    }
    const input: Omit<RequestItem, "id" | "createdAt" | "updatedAt"> = {
      who,
      what,
      when: whenTxt,
      where: whereTxt,
      why,
      how,
      additionalInfo,
      priority,
      attachments,
      status: "not_started",
      notes: [],
      kind: kind || undefined,
      dueAt: dueAt || undefined,
      selectedEquipment: selectedEquipment.length ? selectedEquipment : undefined,
      selectedSongs: selectedSongs.length ? selectedSongs : undefined,
      eventFlow: eventFlow.length ? eventFlow : undefined,
    };
    const created = RequestService.create(input);
    setSubmitted(created.id);
  }

  function resetForm() {
    setSubmitted(null);
    setStep(1);
    setMaxStepReached(1);
    setWho("");
    setWhat("");
    setWhenTxt("");
    setWhereTxt("");
    setWhy("");
    setHow("");
    setAdditionalInfo("");
    setPriority("medium");
    setAttachments([]);
    setKind("");
    setDueAt("");
    setSelectedEquipment([]);
    setSelectedSongs([]);
    setEventFlow([]);
  }

  return {
    // step control
    step,
    setStep,
    maxStepReached,
    setMaxStepReached,

    // core fields
    who,
    setWho,
    what,
    setWhat,
    whenTxt,
    setWhenTxt,
    whereTxt,
    setWhereTxt,
    why,
    setWhy,
    how,
    setHow,
    additionalInfo,
    setAdditionalInfo,
    priority,
    setPriority,
    attachments,
    setAttachments,

    // type and scheduling
    kind,
    setKind,
    dueAt,
    setDueAt,

    // selections
    selectedEquipment,
    setSelectedEquipment,
    toggleEquipment,
    selectedSongs,
    setSelectedSongs,
    toggleSong,

    // flow
    eventFlow,
    addFlowStep,
    updateFlowLabel,
    updateFlowSong,
    removeFlowStep,

    // helpers
    deadlineWarning,
    validateStep1,
    onSubmit,
    resetForm,

    // submission
    submitted,
    setSubmitted,
  } as const;
}
