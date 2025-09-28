"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import { RequestKind } from "@/types/request";
import { getEquipmentCatalog, songsCatalog } from "@/features/requests/catalog";
import { useRequestFormController } from "@/features/requests/formController";
import StepIndicator from "./components/step-indicator";
import SuccessScreen from "./components/success-screen";
import QuestionForm from "./components/question-form";
import { RequestPriority } from "@/types/request";
import DetailsForm from "./components/details-form";

const priorities: { value: RequestPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export default function SubmitPage() {
  const {
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
    selectedSongs,
    toggleEquipment,
    setEquipmentQuantity,
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
  } = useRequestFormController();

  

  function FormStepThree() {
    return (
      <>
        <Card>
          <Divider title="Event Flow (optional)" />
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => addFlowStep("segment")}>Add Segment</Button>
              <Button type="button" variant="secondary" onClick={() => addFlowStep("song")}>Add Song</Button>
            </div>
            <div className="space-y-2">
              {eventFlow.map((s) => (
                <div key={s.id} className="rounded-md border border-foreground/20 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-foreground/60">Step {s.order} • {s.type}</div>
                    <button
                      type="button"
                      className="text-xs text-red-500"
                      onClick={() => removeFlowStep(s.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                    <div className="sm:col-span-2 text-xs text-foreground/60">Label</div>
                    <div className="sm:col-span-3">
                      <Input value={s.label} onChange={(e) => updateFlowLabel(s.id, e.target.value)} />
                    </div>
                  </div>
                  {s.type === "song" && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="sm:col-span-2 text-xs text-foreground/60">Song</div>
                      <div className="sm:col-span-3">
                        <Select value={s.songId || ""} onChange={(e) => updateFlowSong(s.id, e.target.value)}>
                          <option value="">Select a song...</option>
                          {songsCatalog.filter((x) => x.available).map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.title} {x.artist ? `• ${x.artist}` : ""}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button type="submit">Submit Request</Button>
        </div>
      </>
    )
  }

  return (
    <div className="mx-auto max-w-7xl w-full py-8 px-4">
      <h1 className="text-2xl font-semibold mb-2">Submit a Request</h1>
      <p className="text-sm text-foreground/80 mb-6">Follow the steps to complete your request.</p>

      {/* Step indicator (clickable for visited steps) */}
      <div className="flex items-center gap-2 mb-6">
        <StepIndicator step={step} maxStepReached={maxStepReached} setStep={setStep} />
        <div className="ml-2 text-xs text-foreground/60">Step {step} of 3</div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {step === 1 && <QuestionForm who={who} setWho={setWho} what={what} setWhat={setWhat} whenTxt={whenTxt} setWhenTxt={setWhenTxt} whereTxt={whereTxt} setWhereTxt={setWhereTxt} why={why} setWhy={setWhy} how={how} setHow={setHow} additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo} priority={priority} setPriority={setPriority} attachments={attachments} setAttachments={setAttachments} validateStep1={validateStep1} resetForm={resetForm} setStep={setStep} setMaxStepReached={setMaxStepReached} priorities={priorities} />}

        {step === 2 && <DetailsForm kind={kind} setKind={setKind} dueAt={dueAt} setDueAt={setDueAt} deadlineWarning={deadlineWarning} setStep={setStep} setMaxStepReached={setMaxStepReached} selectedEquipment={selectedEquipment} selectedSongs={selectedSongs} toggleEquipment={toggleEquipment} setEquipmentQuantity={setEquipmentQuantity} toggleSong={toggleSong} />}

        {step === 3 && <FormStepThree />}
      </form>

      {/* Success screen */}
      {submitted && <SuccessScreen submitted={submitted} resetForm={resetForm} />}
    </div>
  );
}
