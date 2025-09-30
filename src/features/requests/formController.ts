"use client";
import { useMemo, useState, FormEvent } from "react";
import { deadlineRequirementDays } from "@/features/utils";

export function useRequestFormController() {
  // Step state
  const [step, setStep] = useState<FormSteps>(1);
  const [maxStepReached, setMaxStepReached] = useState<FormSteps>(1);

  // Core fields (Step 1)
  const [who, setWho] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [why, setWhy] = useState("");
  const [how, setHow] = useState("");
  const [info, setInfo] = useState("");
  
  // Step 2: kind, dueAt, selections
  const [type, setType] = useState<RequestType | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [due, setDue] = useState<string>(""); // ISO via datetime-local
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Step 3: event flow
  const [eventFlow, setEventFlow] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState<string | null>(null);

  const deadlineWarning = useMemo(() => {
    if (!type || !due) return null as string | null;
    const days = deadlineRequirementDays(type);
    if (days === 0) return null;
    const now = new Date();
    const dueDate = new Date(due);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return "Due date is in the past.";
    if (diffDays < days) {
      return `Heads up: ${String(type).replace(/_/g, " ")} should be requested at least ${days} day(s) in advance.`;
    }
    return null;
  }, [type, due]);

  // 

  function toggleEquipment(ei: { id: string; name: string; available: boolean; quantity?: number }) {
    if (!ei.available) return;
    setSelectedEquipment((prev) => {
      const exists = prev.some((x) => x.id === ei.id);
      // Default requested quantity is 1 when adding
      return exists ? prev.filter((x) => x.id !== ei.id) : [...prev, { id: ei.id, name: ei.name, quantity: 1 }];
    });
  }

  function setEquipmentQuantity(equipmentId: string, quantity: number) {
    setSelectedEquipment((prev) =>
      prev.map((x) => (x.id === equipmentId ? { ...x, quantity: Math.max(1, Math.floor(quantity || 1)) } : x))
    );
  }

  function toggleSong(si: { id: string; title: string; artist?: string; available: boolean }) {
    // 
  }

  function addFlowStep(type: "segment" | "song") {
    // 
  }

  function validateStep1(): boolean {
    return !!(who && what && when && where && why && how);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep1()) {
      alert("Please complete all 5W1H fields.");
      setStep(1);
      return;
    }

    const input: FormRequest = {
      who,
      what,
      when,
      where,
      why,
      how,
      info,
      priority,
      attachments,
      status: "not_started",
      notes: [],
      kind: type || undefined,
      dueAt: due || undefined,
      selectedEquipment: selectedEquipment.length
        ? selectedEquipment.map((e) => ({ ...e, quantity: e.quantity && e.quantity > 0 ? Math.floor(e.quantity) : 1 }))
        : undefined,
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
    setWhen("");
    setWhere("");
    setWhy("");
    setHow("");
    setInfo("");
    setPriority(null);
    setAttachments([]);
    setType(null);
    setDue("");
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
    whenTxt: when,
    setWhenTxt: setWhen,
    whereTxt: where,
    setWhereTxt: setWhere,
    why,
    setWhy,
    how,
    setHow,
    additionalInfo: info,
    setAdditionalInfo: setInfo,
    priority,
    setPriority,
    attachments,
    setAttachments,

    // type and scheduling
    type,
    setType,
    due,
    setDue,

    // selections
    selectedEquipment,
    setSelectedEquipment,
    toggleEquipment,
    setEquipmentQuantity,
    selectedSongs,
    setSelectedSongs,
    toggleSong,

    // flow
    eventFlow,
    addFlowStep,

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
