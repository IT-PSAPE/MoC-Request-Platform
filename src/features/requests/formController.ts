"use client";
import { useMemo, useState, FormEvent } from "react";
import { deadlineRequirementDays } from "@/features/utils";
import RequestService from "@/features/requests/request-service";
import { useDefualtContext } from "@/components/providers/defualt-provider";

export function useRequestFormController() {
  const service = RequestService;
  const { supabase, statuses} = useDefualtContext();

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
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>([]);
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

  function toggleEquipment(eq: Equipment) {
    setSelectedEquipment((prev) => {
      if (prev.find((x) => x.id === eq.id)) {
        return prev.filter((x) => x.id !== eq.id);
      } else {
        return [...prev, { ...eq, quantity: 1 }];
      }
    })
  }

  function setEquipmentQuantity(equipmentId: string, quantity: number) {
    setSelectedEquipment((prev) =>
      prev.map((x) => (x.id === equipmentId ? { ...x, quantity: Math.max(1, Math.floor(quantity || 1)) } : x))
    );
  }

  function toggleSong(song: Song) {
    setSelectedSongs((prev) => {
      if (prev.find((x) => x.id === song.id)) {
        return prev.filter((x) => x.id !== song.id);
      } else {
        return [...prev, song];
      }
    })
  }

  function toggleVenue(venue: Venue) {
    setSelectedVenues((prev) => {
      if (prev.find((x) => x.id === venue.id)) {
        return prev.filter((x) => x.id !== venue.id);
      } else {
        return [...prev, venue];
      }
    })
  }

  function addFlowStep(type: "segment" | "song") {
    setEventFlow((prev) => [...prev, type === "segment" ? "New Segment" : "New Song"]);
  }

  function removeFlowStep(index: number) {
    setEventFlow((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFlowLabel(index: number, label: string) {
    setEventFlow((prev) => prev.map((x, i) => (i === index ? label : x)));
  }

  function validateStep1(): boolean {
    return !!(who && what && when && where && why && how);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep1()) {
      alert("Please complete all 5W1H fields.");
      setStep(1);
      return;
    }

    const request: BaseRequest = {
      who: who,
      what: what,
      when: when,
      where: where,
      why: why,
      how: how,
      info: info,
      due: due,
      priority: priority?.id || '',
      status: statuses.find(s => s.value === 0)?.id || '',
      type: type?.id || '',
      flow: [],
    };

    const requestEquipment: RequestEquipment[] = selectedEquipment.map((eq) => ({
      request_id: "",
      equipment_id: eq.id,
      quantity: eq.quantity || 1,
      approved: false,
    }));
    
    const requestSongs: RequestSong[] = selectedSongs.map((s) => ({
      request_id: '',
      song_id: s.id,
    }));
    
    const requestVenues: RequestVenue[] = selectedVenues.map((v) => ({
      request_id: '',
      venue_id: v.id,
    })); // Not implemented yet

    const created = await service.create({
      supabase,
      request,
      attachments,
      equipment: requestEquipment,
      songs: requestSongs,
      venues: requestVenues,
    });

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
    setSelectedVenues([]);
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
    selectedVenues,
    setSelectedVenues,
    toggleVenue,

    // flow
    eventFlow,
    addFlowStep,
    removeFlowStep,
    updateFlowLabel,

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
