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

const priorities: { value: RequestPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export default function SubmitPage() {
  const equipmentCatalog = getEquipmentCatalog();
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

  function FormStepTwo() {
    return (
      <>
        <Card>
          <Divider title="Request Type & Due Date" />
          <div className="mt-4 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
              <div className="sm:col-span-2">
                <div className="text-sm font-medium">Type of Request</div>
                <div className="text-xs text-foreground/60">Select what you are requesting.</div>
              </div>
              <div className="sm:col-span-3">
                <Select value={kind} onChange={(e) => setKind(e.target.value as RequestKind | "")}>
                  <option value="">Select type...</option>
                  <option value="event">Event</option>
                  <option value="video_editing">Video Editing</option>
                  <option value="video_filming_editing">Video (Filming + Editing)</option>
                  <option value="equipment">Equipment</option>
                  <option value="design_flyer">Design (Flyer)</option>
                  <option value="design_special">Design (Special)</option>
                </Select>
              </div>
            </div>
            <div className="border-b border-foreground/10" />
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
              <div className="sm:col-span-2">
                <div className="text-sm font-medium">Due Date</div>
                <div className="text-xs text-foreground/60">We will warn on tight deadlines.</div>
              </div>
              <div className="sm:col-span-3 space-y-2">
                <Input
                  type="datetime-local"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
                {deadlineWarning && (
                  <div className="text-xs text-yellow-600">{deadlineWarning}</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <Divider title="Select Equipment (if applicable)" />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {equipmentCatalog.map((eq) => {
              const selected = selectedEquipment.find((x) => x.id === eq.id);
              const isSelected = !!selected;
              const left = typeof eq.quantity === "number" ? eq.quantity : 0;
              return (
                <div key={eq.id} className={`rounded-md border p-2 ${isSelected ? "border-foreground" : "border-foreground/20"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">{eq.name}</div>
                    <div className="text-xs text-foreground/60">Left: {left}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      disabled={!eq.available}
                      className={`rounded-md px-2 py-1 text-xs ${eq.available ? "bg-foreground/10 hover:bg-foreground/15" : "opacity-50 cursor-not-allowed bg-foreground/5"
                        }`}
                    >
                      {isSelected ? "Remove" : "Add"}
                    </button>
                    {isSelected && (
                      <>
                        <label className="text-xs text-foreground/60">Qty</label>
                        <input
                          type="number"
                          min={1}
                          max={Math.max(1, left)}
                          className="w-20 rounded-md border border-foreground/20 px-2 py-1 text-sm"
                          value={selected.quantity || 1}
                          onChange={(e) => {
                            const v = parseInt(e.target.value || "1", 10);
                            const clamped = Math.max(1, Math.min(isFinite(left) ? left : 9999, v));
                            setEquipmentQuantity(eq.id, clamped);
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <Divider title="Select Songs (if applicable)" />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {songsCatalog.map((s) => {
              const isSelected = selectedSongs.some((x) => x.id === s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSong(s)}
                  disabled={!s.available}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${isSelected ? "border-foreground" : "border-foreground/20"
                    } ${s.available ? "" : "opacity-50 cursor-not-allowed"}`}
                >
                  <span>
                    {s.title} {s.artist ? <span className="text-foreground/60">• {s.artist}</span> : null}
                  </span>
                  <span className="text-xs text-foreground/60">{s.available ? (isSelected ? "Selected" : "Available") : "Unavailable"}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              const next = 3 as const;
              setStep(next);
              setMaxStepReached((prev) => (prev < next ? next : prev));
            }}
          >
            Continue to Step 3
          </Button>
        </div>
      </>
    )
  }

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
        {step === 1 && QuestionForm({ who, setWho, what, setWhat, whenTxt, setWhenTxt, whereTxt, setWhereTxt, why, setWhy, how, setHow, additionalInfo, setAdditionalInfo, priority, setPriority, attachments, setAttachments, validateStep1, resetForm, setStep, setMaxStepReached, priorities })}

        {step === 2 && FormStepTwo()}

        {step === 3 && FormStepThree()}
      </form>

      {/* Success screen */}
      {submitted && <SuccessScreen submitted={submitted} resetForm={resetForm} />}
    </div>
  );
}
